import { createAnnouncementRow, isAnnouncementType } from '$lib/server/admin-announcements'
import { requireAdminSupabase } from '$lib/server/admin-route'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')
const isIsoDate = (value: string | undefined) => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value))

const parseCsvLine = (line: string, delimiter: ',' | ';') => {
	const values: string[] = []
	let current = ''
	let inQuote = false
	for (let index = 0; index < line.length; index += 1) {
		const char = line[index]
		const nextChar = line[index + 1]
		if (char === '"') {
			if (inQuote && nextChar === '"') {
				current += '"'
				index += 1
			} else {
				inQuote = !inQuote
			}
			continue
		}
		if (char === delimiter && !inQuote) {
			values.push(current.trim())
			current = ''
			continue
		}
		current += char
	}
	values.push(current.trim())
	return values
}

const readCell = (row: string[], columnMap: Map<string, number>, key: string) => {
	const index = columnMap.get(key)
	if (index === undefined) return undefined
	return row[index]?.trim()
}

export const POST: RequestHandler = async ({ locals, params, request }) => {
	const auth = await requireAdminSupabase(locals)
	if (auth.state === 'unavailable') return json({ message: 'Supabase belum dikonfigurasi' }, { status: 503 })
	if (auth.state === 'unauthorized') return json({ message: 'Akses ditolak' }, { status: 401 })
	if (!isAnnouncementType(params.type)) return json({ message: 'Jenis pengumuman tidak ditemukan' }, { status: 404 })

	const formData = await request.formData()
	const file = formData.get('file')
	if (!(file instanceof File)) return json({ message: 'File CSV wajib dipilih' }, { status: 400 })

	const csvText = (await file.text()).trim()
	if (!csvText) return json({ message: 'File CSV kosong' }, { status: 400 })

	const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0)
	if (lines.length < 2) return json({ message: 'CSV minimal memiliki header dan 1 baris data' }, { status: 400 })

	const delimiter: ',' | ';' = lines[0].includes(';') ? ';' : ','
	const headers = parseCsvLine(lines[0], delimiter).map((header) => normalizeHeader(header))
	const columnMap = new Map<string, number>()
	for (const [index, key] of headers.entries()) {
		if (!columnMap.has(key)) columnMap.set(key, index)
	}

	let imported = 0
	let failed = 0
	const errors: string[] = []

	for (const [lineIndex, line] of lines.slice(1).entries()) {
		const row = parseCsvLine(line, delimiter)
		const tanggal = readCell(row, columnMap, 'tanggal')
		if (tanggal && !isIsoDate(tanggal)) {
			failed += 1
			errors.push(`Baris ${lineIndex + 2}: tanggal harus format YYYY-MM-DD`)
			continue
		}

		try {
			await createAnnouncementRow(auth.supabase, {
				type: params.type,
				instansi: readCell(row, columnMap, 'instansi') || null,
				kegiatan: readCell(row, columnMap, 'kegiatan') || null,
				noSk: readCell(row, columnMap, 'nosk') || readCell(row, columnMap, 'no_sk') || null,
				tanggal: tanggal || null
			})
			imported += 1
		} catch (error) {
			failed += 1
			errors.push(`Baris ${lineIndex + 2}: ${error instanceof Error ? error.message : 'gagal disimpan'}`)
		}
	}

	return json({ imported, failed, errors: errors.slice(0, 12) })
}

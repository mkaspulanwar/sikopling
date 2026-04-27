import { expect, test, type Page } from '@playwright/test'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE_URL = 'http://127.0.0.1:4173'
const SEEDED_ROWS_PER_LAYANAN = 12

type SupabaseRuntimeConfig = {
	projectUrl: string
	serviceRoleKey: string
}

type AdminTestContext = {
	supabase: SupabaseClient
	token: string
	email: string
	password: string
	userId: string
}

const parseDotEnvFile = (filePath: string) => {
	const env: Record<string, string> = {}
	const raw = readFileSync(filePath, 'utf8')
	for (const line of raw.split(/\r?\n/)) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		const equalIndex = trimmed.indexOf('=')
		if (equalIndex < 1) continue
		const key = trimmed.slice(0, equalIndex).trim()
		const value = trimmed.slice(equalIndex + 1).trim()
		if (!key) continue
		env[key] = value
	}
	return env
}

const readSupabaseRuntimeConfig = (): SupabaseRuntimeConfig | null => {
	const dotEnvPath = resolve(process.cwd(), '.env')
	const dotEnv = existsSync(dotEnvPath) ? parseDotEnvFile(dotEnvPath) : {}

	const rawUrl = process.env.PUBLIC_SUPABASE_URL ?? dotEnv.PUBLIC_SUPABASE_URL
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? dotEnv.SUPABASE_SERVICE_ROLE_KEY
	if (!rawUrl || !serviceRoleKey) return null

	const projectUrl = rawUrl.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/i, '')
	if (!projectUrl.startsWith('http')) return null

	return { projectUrl, serviceRoleKey }
}

const buildPengajuanRows = (layanan: 'dokling' | 'pertek', token: string) =>
	Array.from({ length: SEEDED_ROWS_PER_LAYANAN }, (_, index) => {
		const rowNumber = String(index + 1).padStart(2, '0')
		return {
			layanan,
			no_registrasi: `${token}-${layanan.toUpperCase()}-${rowNumber}`,
			instansi: `E2E ${token} ${layanan.toUpperCase()} ${rowNumber}`,
			kegiatan: `Kegiatan E2E ${token} ${rowNumber}`,
			jenis_dokumen: layanan === 'dokling' ? 'AMDAL' : 'UKL-UPL',
			posisi: 'Penyusun',
			status: 'Submit / Masuk',
			tanggal_masuk: '2026-04-01',
			tanggal_update: '2026-04-01'
		}
	})

const loginAsAdmin = async (page: Page, email: string, password: string, redirectTarget: string) => {
	await page.goto(`${BASE_URL}/login?redirectTo=${encodeURIComponent(redirectTarget)}`)
	await page.getByLabel('Email').fill(email)
	await page.locator('#password').fill(password)
	await Promise.all([
		page.waitForURL((url) => url.pathname.startsWith('/admin')),
		page.getByRole('button', { name: 'Masuk', exact: true }).click()
	])
}

const getVisibleTableHeaderCheckbox = (page: Page) =>
	page.locator('table:visible thead input[type="checkbox"]').first()

const getVisibleTableFirstRowCheckbox = (page: Page) =>
	page.locator('table:visible tbody input[type="checkbox"]').first()

const runtimeConfig = readSupabaseRuntimeConfig()
let adminTestContext: AdminTestContext | null = null

test.describe.serial('admin dokling/pertek table e2e', () => {
	test.skip(!runtimeConfig, 'Melewati test admin E2E karena konfigurasi Supabase tidak tersedia')

	test.beforeAll(async () => {
		if (!runtimeConfig) return

		const supabase = createClient(runtimeConfig.projectUrl, runtimeConfig.serviceRoleKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		})

		const token = `E2EADMIN${Date.now()}`
		const email = `${token.toLowerCase()}@example.com`
		const password = `Test!${Date.now()}A`

		const createUserResult = await supabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			app_metadata: { role: 'super_admin' },
			user_metadata: { role: 'super_admin' }
		})
		if (createUserResult.error || !createUserResult.data.user) {
			throw new Error(createUserResult.error?.message ?? 'Gagal membuat user admin untuk E2E')
		}

		const doklingRows = buildPengajuanRows('dokling', token)
		const pertekRows = buildPengajuanRows('pertek', token)
		const insertResult = await supabase.from('antrian_pengajuan').insert([...doklingRows, ...pertekRows])
		if (insertResult.error) {
			await supabase.auth.admin.deleteUser(createUserResult.data.user.id)
			throw new Error(insertResult.error.message)
		}

		adminTestContext = {
			supabase,
			token,
			email,
			password,
			userId: createUserResult.data.user.id
		}
	})

	test.afterAll(async () => {
		if (!adminTestContext) return

		await adminTestContext.supabase
			.from('antrian_pengajuan')
			.delete()
			.like('no_registrasi', `${adminTestContext.token}-%`)

		await adminTestContext.supabase.auth.admin.deleteUser(adminTestContext.userId)
		adminTestContext = null
	})

	test('dokling: rows per page + select all lintas halaman tetap konsisten', async ({ page }) => {
		if (!adminTestContext) throw new Error('Konteks admin E2E belum siap')

		const { token, email, password } = adminTestContext
		const startPath = `/admin/dokling?keyword=${encodeURIComponent(token)}&sortBy=created_at&sortOrder=asc&pageSize=10`
		await loginAsAdmin(page, email, password, startPath)

		await expect(page.getByRole('heading', { name: 'Data Antrian Dokumen Lingkungan' })).toBeVisible()

		const rowsPerPageButton = page.locator('#rows-per-page')
		await expect(rowsPerPageButton).toContainText('10')

		await rowsPerPageButton.click()
		await page.getByRole('option', { name: '5', exact: true }).click()
		await expect(page).toHaveURL(/pageSize=5/)
		await expect(rowsPerPageButton).toContainText('5')

		await page.reload()
		await expect(rowsPerPageButton).toContainText('5')

		await getVisibleTableHeaderCheckbox(page).check()
		await expect(page.getByText('12/12 terpilih', { exact: true })).toBeVisible()

		await page.getByLabel('Halaman berikutnya').click()
		await expect(page).toHaveURL(/page=2/)
		await expect(getVisibleTableFirstRowCheckbox(page)).toBeChecked()

		await getVisibleTableFirstRowCheckbox(page).uncheck()
		await expect(page.getByText('11/12 terpilih', { exact: true })).toBeVisible()
	})

	test('pertek: select all + bulk delete terfilter berhasil', async ({ page }) => {
		if (!adminTestContext) throw new Error('Konteks admin E2E belum siap')

		const { token, email, password } = adminTestContext
		const startPath = `/admin/pertek?keyword=${encodeURIComponent(token)}&sortBy=created_at&sortOrder=asc&pageSize=5`
		await loginAsAdmin(page, email, password, startPath)

		await expect(page.getByRole('heading', { name: 'Data Antrian Persetujuan Lingkungan' })).toBeVisible()

		await getVisibleTableHeaderCheckbox(page).check()
		await expect(page.getByText('12/12 terpilih', { exact: true })).toBeVisible()

		await page.getByRole('button', { name: 'Hapus', exact: true }).first().click()
		await expect(page.getByText('Data akan dihapus permanen', { exact: true })).toBeVisible()
		await page.getByRole('button', { name: 'Hapus', exact: true }).last().click()

		await expect(page.getByText(/data pertek berhasil dihapus/i)).toBeVisible()
		await expect(page.getByText('Belum ada data pertek.', { exact: true }).first()).toBeVisible()
		await expect(page.getByText('0/0 terpilih', { exact: true })).toBeVisible()
	})
})

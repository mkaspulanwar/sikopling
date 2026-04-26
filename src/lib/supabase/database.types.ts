export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type LayananValue = 'dokling' | 'pertek'

type StatusValue =
	| 'Submit / Masuk'
	| 'Perbaikan Uji Administrasi'
	| 'Penjadwalan Rapat'
	| 'Drafting SK'
	| 'SK Terbit'
	| 'Belum Submit Perbaikan'
	| 'Uji Administrasi'
	| 'Ditolak'
	| 'Pasca Sidang'
	| 'Evaluasi Dokumen'
	| 'Hold'
	| 'Dikembalikan'
	| 'Penilaian KA'

export type Database = {
	public: {
		Tables: {
			antrian_pengajuan: {
				Row: {
					created_at: string
					id: string
					instansi: string | null
					jenis_dokumen: string | null
					kegiatan: string | null
					layanan: LayananValue
					no_registrasi: string | null
					posisi: string | null
					status: StatusValue
					tanggal_masuk: string | null
					tanggal_update: string | null
					updated_at: string
				}
				Insert: {
					created_at?: string
					id?: string
					instansi?: string | null
					jenis_dokumen?: string | null
					kegiatan?: string | null
					layanan: LayananValue
					no_registrasi?: string | null
					posisi?: string | null
					status?: StatusValue
					tanggal_masuk?: string | null
					tanggal_update?: string | null
					updated_at?: string
				}
				Update: {
					created_at?: string
					id?: string
					instansi?: string | null
					jenis_dokumen?: string | null
					kegiatan?: string | null
					layanan?: LayananValue
					no_registrasi?: string | null
					posisi?: string | null
					status?: StatusValue
					tanggal_masuk?: string | null
					tanggal_update?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			workflow_history: {
				Row: {
					changed_at: string
					changed_by: string | null
					id: string
					new_posisi: string | null
					new_status: StatusValue
					note: string | null
					old_posisi: string | null
					old_status: StatusValue | null
					pengajuan_id: string
				}
				Insert: {
					changed_at?: string
					changed_by?: string | null
					id?: string
					new_posisi?: string | null
					new_status: StatusValue
					note?: string | null
					old_posisi?: string | null
					old_status?: StatusValue | null
					pengajuan_id: string
				}
				Update: {
					changed_at?: string
					changed_by?: string | null
					id?: string
					new_posisi?: string | null
					new_status?: StatusValue
					note?: string | null
					old_posisi?: string | null
					old_status?: StatusValue | null
					pengajuan_id?: string
				}
				Relationships: []
			}
		}
		Views: Record<string, never>
		Functions: Record<string, never>
		Enums: Record<string, never>
		CompositeTypes: Record<string, never>
	}
}


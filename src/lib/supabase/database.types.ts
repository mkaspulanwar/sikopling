export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
					layanan: 'dokling' | 'pertek'
					no_registrasi: string
					posisi: string | null
					status:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
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
					layanan: 'dokling' | 'pertek'
					no_registrasi: string
					posisi?: string | null
					status?:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
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
					layanan?: 'dokling' | 'pertek'
					no_registrasi?: string
					posisi?: string | null
					status?:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
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
					new_status:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
					note: string | null
					old_posisi: string | null
					old_status:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
						| null
					pengajuan_id: string
				}
				Insert: {
					changed_at?: string
					changed_by?: string | null
					id?: string
					new_posisi?: string | null
					new_status:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
					note?: string | null
					old_posisi?: string | null
					old_status?:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
						| null
					pengajuan_id: string
				}
				Update: {
					changed_at?: string
					changed_by?: string | null
					id?: string
					new_posisi?: string | null
					new_status?:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
					note?: string | null
					old_posisi?: string | null
					old_status?:
						| 'Masuk'
						| 'Verifikasi'
						| 'Perbaikan'
						| 'Penjadwalan'
						| 'Pasca Sidang'
						| 'Selesai'
						| null
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

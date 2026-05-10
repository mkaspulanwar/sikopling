export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type LayananValue = 'perling' | 'pertek'

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

type IntegrasiStatusValue =
	| 'Submit'
	| 'Uji Admin'
	| 'Uji Substansi'
	| 'Drafting SK/Rekom'
	| 'SK/Rekom Terbit'
	| 'Ditolak'
	| 'Lainnya'

export type Database = {
	public: {
		Tables: {
			monitoring_perling: {
				Row: {
					created_at: string
					id: string
					instansi: string | null
					jenis_perling: string | null
					kegiatan: string | null
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
					jenis_perling?: string | null
					kegiatan?: string | null
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
					jenis_perling?: string | null
					kegiatan?: string | null
					no_registrasi?: string | null
					posisi?: string | null
					status?: StatusValue
					tanggal_masuk?: string | null
					tanggal_update?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			monitoring_pertek: {
				Row: {
					created_at: string
					id: string
					instansi: string | null
					jenis_pertek: string | null
					kegiatan: string | null
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
					jenis_pertek?: string | null
					kegiatan?: string | null
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
					jenis_pertek?: string | null
					kegiatan?: string | null
					no_registrasi?: string | null
					posisi?: string | null
					status?: StatusValue
					tanggal_masuk?: string | null
					tanggal_update?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			monitoring_integrasi: {
				Row: {
					created_at: string
					id: string
					instansi: string | null
					jenis_integrasi: string | null
					kegiatan: string | null
					keterangan: string | null
					posisi: string | null
					status: IntegrasiStatusValue
					tanggal_update: string | null
					updated_at: string
				}
				Insert: {
					created_at?: string
					id?: string
					instansi?: string | null
					jenis_integrasi?: string | null
					kegiatan?: string | null
					keterangan?: string | null
					posisi?: string | null
					status?: IntegrasiStatusValue
					tanggal_update?: string | null
					updated_at?: string
				}
				Update: {
					created_at?: string
					id?: string
					instansi?: string | null
					jenis_integrasi?: string | null
					kegiatan?: string | null
					keterangan?: string | null
					posisi?: string | null
					status?: IntegrasiStatusValue
					tanggal_update?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			pengumuman_perling: {
				Row: {
					created_at: string
					id: string
					instansi: string | null
					kegiatan: string | null
					no_sk: string | null
					tanggal: string | null
					updated_at: string
				}
				Insert: {
					created_at?: string
					id?: string
					instansi?: string | null
					kegiatan?: string | null
					no_sk?: string | null
					tanggal?: string | null
					updated_at?: string
				}
				Update: {
					created_at?: string
					id?: string
					instansi?: string | null
					kegiatan?: string | null
					no_sk?: string | null
					tanggal?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			pengumuman_pertek: {
				Row: {
					created_at: string
					id: string
					instansi: string | null
					kegiatan: string | null
					no_sk: string | null
					tanggal: string | null
					updated_at: string
				}
				Insert: {
					created_at?: string
					id?: string
					instansi?: string | null
					kegiatan?: string | null
					no_sk?: string | null
					tanggal?: string | null
					updated_at?: string
				}
				Update: {
					created_at?: string
					id?: string
					instansi?: string | null
					kegiatan?: string | null
					no_sk?: string | null
					tanggal?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			pengumuman_integrasi: {
				Row: {
					created_at: string
					id: string
					instansi: string | null
					kegiatan: string | null
					no_sk: string | null
					tanggal: string | null
					updated_at: string
				}
				Insert: {
					created_at?: string
					id?: string
					instansi?: string | null
					kegiatan?: string | null
					no_sk?: string | null
					tanggal?: string | null
					updated_at?: string
				}
				Update: {
					created_at?: string
					id?: string
					instansi?: string | null
					kegiatan?: string | null
					no_sk?: string | null
					tanggal?: string | null
					updated_at?: string
				}
				Relationships: []
			}
		}
		Views: Record<string, never>
		Functions: {
			count_registered_admins: {
				Args: Record<PropertyKey, never>
				Returns: number
			}
		}
		Enums: Record<string, never>
		CompositeTypes: Record<string, never>
	}
}

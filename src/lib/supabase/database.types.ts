export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type LayananValue = 'perling' | 'pertek'

type StatusValue =
	| 'Submit FKA'
	| 'Uji Administrasi FKA'
	| 'Perbaikan Uji Adminstrasi FKA'
	| 'Penjadwalan Rapat FKA'
	| 'Pasca Sidang FKA'
	| 'Submit Andal RKL-RPL'
	| 'Uji Administrasi Andal RKL-RPL'
	| 'Penjadwalan Rapat Teknis'
	| 'Penjadwalan Rapat Komisi'
	| 'Pasca Sidang Andal RKL-RPL'
	| 'Drafting SK'
	| 'SK Terbit'
	| 'Submit / Masuk'
	| 'Perbaikan Uji Administrasi'
	| 'Penjadwalan Rapat'
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
			admin_profiles: {
				Row: {
					created_at: string
					created_by: string | null
					email: string
					full_name: string | null
					id: string
					is_active: boolean
					last_login_at: string | null
					role: 'admin' | 'super_admin'
					updated_at: string
					updated_by: string | null
				}
				Insert: {
					created_at?: string
					created_by?: string | null
					email: string
					full_name?: string | null
					id: string
					is_active?: boolean
					last_login_at?: string | null
					role?: 'admin' | 'super_admin'
					updated_at?: string
					updated_by?: string | null
				}
				Update: {
					created_at?: string
					created_by?: string | null
					email?: string
					full_name?: string | null
					id?: string
					is_active?: boolean
					last_login_at?: string | null
					role?: 'admin' | 'super_admin'
					updated_at?: string
					updated_by?: string | null
				}
				Relationships: []
			}
			admin_audit_logs: {
				Row: {
					action: string
					after_data: Json
					actor_email: string | null
					actor_id: string
					actor_role: string | null
					before_data: Json
					created_at: string
					id: string
					metadata: Json
					resource_id: string | null
					resource_type: string
					summary: string | null
				}
				Insert: {
					action: string
					after_data?: Json
					actor_email?: string | null
					actor_id?: string
					actor_role?: string | null
					before_data?: Json
					created_at?: string
					id?: string
					metadata?: Json
					resource_id?: string | null
					resource_type: string
					summary?: string | null
				}
				Update: {
					action?: string
					after_data?: Json
					actor_email?: string | null
					actor_id?: string
					actor_role?: string | null
					before_data?: Json
					created_at?: string
					id?: string
					metadata?: Json
					resource_id?: string | null
					resource_type?: string
					summary?: string | null
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

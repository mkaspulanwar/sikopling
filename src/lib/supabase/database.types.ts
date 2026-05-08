export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type LegacyLayananValue = 'dokling' | 'perling' | 'pertek'
type LayananValue = 'perling' | 'pertek'
type WorkflowLayananValue = 'perling' | 'pertek' | 'integrasi'

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

type WorkflowStatusValue = StatusValue | IntegrasiStatusValue

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
					layanan: LegacyLayananValue
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
					layanan: LegacyLayananValue
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
					layanan?: LegacyLayananValue
					no_registrasi?: string | null
					posisi?: string | null
					status?: StatusValue
					tanggal_masuk?: string | null
					tanggal_update?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			monitoring_perling: {
				Row: {
					created_at: string
					id: string
					instansi: string | null
					jenis_dokumen: string | null
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
					jenis_dokumen?: string | null
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
					jenis_dokumen?: string | null
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
					jenis_dokumen: string | null
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
					jenis_dokumen?: string | null
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
					jenis_dokumen?: string | null
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
			workflow_history: {
				Row: {
					changed_at: string
					changed_by: string | null
					id: string
					layanan: WorkflowLayananValue
					new_posisi: string | null
					new_status: WorkflowStatusValue
					note: string | null
					old_posisi: string | null
					old_status: WorkflowStatusValue | null
					pengajuan_id: string
				}
				Insert: {
					changed_at?: string
					changed_by?: string | null
					id?: string
					layanan: WorkflowLayananValue
					new_posisi?: string | null
					new_status: WorkflowStatusValue
					note?: string | null
					old_posisi?: string | null
					old_status?: WorkflowStatusValue | null
					pengajuan_id: string
				}
				Update: {
					changed_at?: string
					changed_by?: string | null
					id?: string
					layanan?: WorkflowLayananValue
					new_posisi?: string | null
					new_status?: WorkflowStatusValue
					note?: string | null
					old_posisi?: string | null
					old_status?: WorkflowStatusValue | null
					pengajuan_id?: string
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

<script lang="ts">
	import PengumumanAdminpage from '$lib/components/admin/PengumumanAdminpage.svelte'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
</script>

<PengumumanAdminpage {data} announcementType="pertek" title="Penerbitan Persetujuan Teknis" />

<script lang="ts">
	import PenerbitanAdminPage from '$lib/components/admin/PenerbitanAdminPage.svelte'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
</script>

<PenerbitanAdminPage {data} announcementType="perling" title="Penerbitan Perling" />

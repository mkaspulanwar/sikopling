import { getPublicIntegrationRows } from '$lib/server/public-queue'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		queueRows: await getPublicIntegrationRows(fetch)
	}
}

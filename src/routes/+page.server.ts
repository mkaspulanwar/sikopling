import { EMPTY_SUMMARY } from '$lib/server/admin-route'
import { getPublicSummaryMetrics } from '$lib/server/public-queue'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const metrics = await getPublicSummaryMetrics(fetch)
		return {
			summary: {
				...EMPTY_SUMMARY,
				total: metrics.total,
				selesai: metrics.selesai
			}
		}
	} catch {
		return {
			summary: EMPTY_SUMMARY
		}
	}
}

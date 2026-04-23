import { getPublicQueueRows } from '$lib/server/public-queue'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return {
		queueRows: await getPublicQueueRows('pertek')
	}
}

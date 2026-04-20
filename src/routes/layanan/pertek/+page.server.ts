import { getCmsRows } from '$lib/server/cms'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const result = await getCmsRows('pertek')

	return {
		queueRows: result.rows,
		cmsSource: result.source
	}
}

import { getPublicAnnouncementRows } from '$lib/server/public-announcements'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		publishingRows: await getPublicAnnouncementRows('pertek', fetch)
	}
}

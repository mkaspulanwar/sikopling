import { env } from '$env/dynamic/private'
import { createDirectus, rest, staticToken, type RestClient } from '@directus/sdk'

type DirectusCollections = Record<string, Record<string, unknown>[]>

let cachedClient: RestClient<DirectusCollections> | null | undefined

export const getDirectusClient = () => {
	if (cachedClient !== undefined) return cachedClient
	const directusUrl = env.DIRECTUS_URL
	const directusToken = env.DIRECTUS_TOKEN
	if (!directusUrl) {
		cachedClient = null
		return cachedClient
	}

	let client = createDirectus<DirectusCollections>(directusUrl).with(rest())
	if (directusToken) {
		client = client.with(staticToken(directusToken))
	}

	cachedClient = client
	return cachedClient
}

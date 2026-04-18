import type { Handle } from '@sveltejs/kit';

const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const STATIC_CACHE_CONTROL = 'public, max-age=86400, stale-while-revalidate=604800';

const CACHEABLE_CONTENT_TYPES = [
	'image/',
	'video/',
	'font/',
	'text/css',
	'text/javascript',
	'application/javascript'
];

const isCacheableContentType = (contentType: string) =>
	CACHEABLE_CONTENT_TYPES.some((prefix) => contentType.startsWith(prefix));

const withHeader = (response: Response, key: string, value: string) => {
	const headers = new Headers(response.headers);
	headers.set(key, value);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	if (event.request.method !== 'GET' || response.status >= 400) {
		return response;
	}

	const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
	if (!isCacheableContentType(contentType)) {
		return response;
	}

	if (event.url.pathname.startsWith('/_app/immutable/')) {
		return withHeader(response, 'cache-control', IMMUTABLE_CACHE_CONTROL);
	}

	return withHeader(response, 'cache-control', STATIC_CACHE_CONTROL);
};

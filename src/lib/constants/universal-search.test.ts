import { describe, expect, it } from 'vitest';
import {
	UNIVERSAL_SEARCH_BLOCKED_PATH_PREFIXES,
	UNIVERSAL_SEARCH_HIGHLIGHT_ATTR,
	UNIVERSAL_SEARCH_MIN_QUERY_LENGTH,
	UNIVERSAL_SEARCH_QUERY_PARAM
} from './universal-search';

describe('universal-search constants', () => {
	it('uses stable query contract and minimum query length', () => {
		expect(UNIVERSAL_SEARCH_QUERY_PARAM).toBe('usq');
		expect(UNIVERSAL_SEARCH_MIN_QUERY_LENGTH).toBe(2);
	});

	it('keeps required highlight attribute and blocked path prefixes', () => {
		expect(UNIVERSAL_SEARCH_HIGHLIGHT_ATTR).toBe('data-universal-search-highlight');
		expect(UNIVERSAL_SEARCH_BLOCKED_PATH_PREFIXES).toEqual(['/admin']);
	});
});

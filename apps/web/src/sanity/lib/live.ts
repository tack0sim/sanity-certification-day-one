import { cookies, draftMode } from 'next/headers';
import {
	defineLive,
	resolvePerspectiveFromCookies,
	type SanityFetchOptions,
} from 'next-sanity/experimental/live'; // experimental next-sanity live with nextjs 16 'use cache'
import { client } from '@/sanity/lib/client';

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
	throw new Error('Missing SANITY_API_READ_TOKEN');
}

const { sanityFetch: _sanityFetch, SanityLive } = defineLive({
	client,
	serverToken: token,
	browserToken: token,
});

// Automatically fetches draft content with the right preview perspective in draft mode, and enables stega for visual editing overlays
const sanityFetch = async <const QueryString extends string>({
	query,
	params,
}: Pick<SanityFetchOptions<QueryString>, 'query' | 'params'>) => {
	const isDraftMode = (await draftMode()).isEnabled;
	const perspective = isDraftMode
		? await resolvePerspectiveFromCookies({ cookies: await cookies() })
		: 'published';

	return _sanityFetch({ query, params, perspective, stega: isDraftMode });
};

// Fetches content for use in generateMetadata, generateViewport and such, which may have draft content but perspective switching isn't necessary and stega should never be enabled
const sanityFetchMetadata = async <const QueryString extends string>({
	query,
	params,
}: Pick<SanityFetchOptions<QueryString>, 'query' | 'params'>) => {
	const isDraftMode = (await draftMode()).isEnabled;
	const perspective = isDraftMode
		? await resolvePerspectiveFromCookies({ cookies: await cookies() })
		: 'published';
	return _sanityFetch({ query, params, perspective, stega: false });
};

// Fetches content for generateStaticParams, which only happens at build time and should only fetch published content
const sanityFetchStaticParams = async <const QueryString extends string>({
	query,
	params,
}: Pick<SanityFetchOptions<QueryString>, 'query' | 'params'>) => {
	return _sanityFetch({
		query,
		params,
		perspective: 'published',
		stega: false,
	});
};

export {
	sanityFetch,
	sanityFetchMetadata,
	sanityFetchStaticParams,
	SanityLive,
};

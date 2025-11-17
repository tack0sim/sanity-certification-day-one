import { createClient, type QueryParams } from 'next-sanity';

export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: '2025-07-09',
	// updating to use cache components with path validation
	useCdn: true,
	token: process.env.SANITY_API_READ_TOKEN,
	stega: {
		studioUrl: process.env.SANITY_STUDIO_URL,
	},
});

// enable default caching and revalidation
export async function sanityFetch<const QueryString extends string>({
	query,
	params = {},
	revalidate = 60, // default revalidation time in seconds
	tags = [],
}: {
	query: QueryString;
	params?: QueryParams;
	revalidate?: number | false;
	tags?: string[];
}) {
	return client.fetch(query, params, {
		cache: 'force-cache', // on next v14 it's force-cache by default, in v15 it has to be set explicitly
		next: {
			revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation
			tags, // for tag-based revalidation
		},
	});
}

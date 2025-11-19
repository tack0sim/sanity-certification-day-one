import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { PAGE_BUILDER_QUERY } from '@/sanity/lib/queries';
import { PageBuilder } from '../components/blocks/page-builder';

export default async function PageRoute({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}) {
	'use cache: private';
	const slug = (await params).slug.join('/');

	const { data } = await sanityFetch({
		query: PAGE_BUILDER_QUERY,
		params: { slug },
	});

	if (!data) {
		notFound();
	}

	return (
		<div>
			<PageBuilder content={data.pageBuilder} />
		</div>
	);
}

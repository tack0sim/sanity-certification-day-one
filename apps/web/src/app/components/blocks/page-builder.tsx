import type { PAGE_BUILDER_QUERYResult } from '@/sanity/types';
import { Gallery } from './gallery';
import { Hero } from './hero';
import { Organisers } from './organisers';
import { Review } from './review';

type PageBlocks = NonNullable<
	NonNullable<PAGE_BUILDER_QUERYResult>['pageBuilder']
>[number];

type PageBuilderProps = {
	content: PageBlocks[] | null;
};

export function PageBuilder({ content }: PageBuilderProps) {
	return (
		<>
			{content?.map((block) => {
				switch (block._type) {
					case 'hero':
						return <Hero key={block._key} {...block} />;
					case 'reviews':
						return <Review key={block._key} {...block} />;
					case 'organisers':
						return <Organisers key={block._key} {...block} />;
					case 'gallery':
						return <Gallery key={block._key} {...block} />;
					default:
						return <div>Block not found.</div>;
				}
			})}
		</>
	);
}

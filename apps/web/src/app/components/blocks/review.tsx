import Image from 'next/image';
import { PortableText, type PortableTextComponents } from 'next-sanity';
import { urlFor } from '@/lib/image';
import type { PageBuilderTypes } from '@/types';

export function Review({ title, review }: PageBuilderTypes<'reviews'>) {
	const components: PortableTextComponents = {
		types: {
			image: (props) =>
				props.value ? (
					<Image
						src={urlFor(props.value).height(250).width(250).quality(80).url()}
						alt="Image from text"
					/>
				) : null,
		},
	};
	return (
		<>
			{title ? <p>{title}</p> : null}
			{review ? <PortableText value={review} components={components} /> : null}
		</>
	);
}

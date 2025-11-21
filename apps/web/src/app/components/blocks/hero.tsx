import Image from 'next/image';
import { PortableText, type PortableTextComponents } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import type { PageBuilderTypes } from '@/types';

export function Hero({ title, text, image }: PageBuilderTypes<'hero'>) {
  const url = image?.asset ? urlFor(image).height(400).width(400).quality(80).format('webp').url() : '';

  const components: PortableTextComponents = {
    types: {
      image: (props) =>
        props.value ? (
          <Image
            src={urlFor(props.value).width(800).height(800).quality(80).format('webp').url()}
            alt="Image from text"
            width={250}
            height={250}
          />
        ) : null,
    },
  };
  return (
    <div>
      {title ? <h1>{title}</h1> : null}
      {text ? <PortableText value={text} components={components} /> : null}
      {image ? <Image src={url} alt="image" width={250} height={250} /> : null}
    </div>
  );
}

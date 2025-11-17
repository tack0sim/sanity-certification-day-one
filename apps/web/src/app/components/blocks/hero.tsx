import { urlFor } from '@/sanity/lib/image';
import { PageBuilderTypes } from '@/types';
import { PortableText } from 'next-sanity';
import Image from 'next/image';

export function Hero({ title, text, image }: PageBuilderTypes<'hero'>) {
  const url = image?.asset
    ? urlFor(image).height(150).width(150).quality(80).format('webp').url()
    : '';

  return (
    <div>
      {title ? <h1>{title}</h1> : null}
      {text ? <PortableText value={text} /> : null}
      {image ? <Image src={url} alt="image" width={150} height={150} /> : null}
    </div>
  );
}

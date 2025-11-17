import { urlFor } from '@/sanity/lib/image';
import { PageBuilderTypes } from '@/types';
import Image from 'next/image';

export function Gallery({ title, image }: PageBuilderTypes<'gallery'>) {
  const url = image?.asset ? urlFor(image).url() : '';
  return (
    <>
      {title ? <p>{title}</p> : null}
      {image ? <Image src={url} height={250} width={250} alt="image" /> : null}
    </>
  );
}

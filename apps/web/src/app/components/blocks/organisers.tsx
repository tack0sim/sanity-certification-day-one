import { urlFor } from '@/sanity/lib/image';
import { PageBuilderTypes } from '@/types';
import Image from 'next/image';

export function Organisers({ title, image }: PageBuilderTypes<'organisers'>) {
  const url = image ? urlFor(image).url() : '';
  return (
    <>
      {title ? <p>{title}</p> : null}
      {image ? <Image src={url} alt={'image'} width={50} height={50} /> : null}
    </>
  );
}

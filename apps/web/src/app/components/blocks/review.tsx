import { PageBuilderTypes } from '@/types';
import { PortableText } from 'next-sanity';

export function Review({ title, review }: PageBuilderTypes<'reviews'>) {
  return (
    <>
      {title ? <p>{title}</p> : null}
      {review ? <PortableText value={review} /> : null}
    </>
  );
}

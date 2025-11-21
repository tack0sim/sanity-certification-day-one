import imageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '@/sanity/env';
import type { SanityImageAsset } from '@/sanity/types';

const builder = imageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageAsset) => {
  return builder.image(source);
};

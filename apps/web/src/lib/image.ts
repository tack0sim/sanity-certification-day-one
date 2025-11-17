import imageUrlBuilder from '@sanity/image-url';
import { projectId, dataset } from '@/sanity/env';
import { SanityImageAsset } from '@/sanity/types';

const builder = imageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageAsset) => {
  return builder.image(source);
};

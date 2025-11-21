import { ImageIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const gallery = defineType({
  name: 'gallery',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title,
        media: media ?? ImageIcon,
        subtitle: 'Gallery',
      };
    },
  },
});

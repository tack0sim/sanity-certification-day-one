import {BlockContentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'text',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title,
        subtitle: 'Hero',
        media: media ?? BlockContentIcon,
      }
    },
  },
})

import {UsersIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const organisers = defineType({
  name: 'organisers',
  type: 'object',
  icon: UsersIcon,
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
    prepare({title, media}) {
      return {
        title,
        media: media ?? UsersIcon,
      }
    },
  },
})

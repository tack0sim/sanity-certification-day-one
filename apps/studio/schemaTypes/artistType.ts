import {defineType, defineField} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const artistType = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})

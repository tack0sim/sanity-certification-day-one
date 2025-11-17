import {defineType, defineField} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title,
        subtitle: `/${slug}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'pageBuilder',
      type: 'pageBuilder',
      description: 'Build your page by choosing content objects.',
    }),
  ],
})

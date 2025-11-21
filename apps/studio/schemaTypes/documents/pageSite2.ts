import { defineField, defineType } from 'sanity';
import { Groups } from '../utils/groups';

export const pageSite2 = defineType({
  name: 'pageSite2',
  title: 'Page',
  type: 'document',
  groups: Groups,
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug}`,
      };
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
});

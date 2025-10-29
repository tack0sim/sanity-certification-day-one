import {defineType, defineField} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fieldsets: [{name: 'dates', title: 'Dates', options: {collapsible: true, columns: 2}}],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      options: {source: 'name'},
      validation: (rule) => rule.required().error('Required to generate a page on the website'),
      hidden: ({document}) => !document?.name,
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      group: 'details',
      options: {
        list: ['in-person', 'virtual'],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
      hidden: ({value, document}) => !value && document?.eventType === 'virtual',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'virtual') {
            return 'Only in-person events can have a venue'
          }
          return true
        }),
      group: 'details',
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      description: 'Number of minutes before the start time for admission',
      type: 'number',
      initialValue: 60,
      group: 'details',
    }),

    defineField({
      name: 'headline',
      group: 'details',
      type: 'reference',
      to: [{type: 'artist'}],
    }),
    defineField({
      name: 'image',
      group: ['details', 'editorial'],
      type: 'image',
    }),
    defineField({
      name: 'details',
      group: ['details', 'editorial'],
      type: 'array',
      of: [{type: 'block'}],
      validation: (rule) =>
        rule
          .min(100)
          .max(500)
          .warning('The Details field should have between 100 and 500 characters'),
    }),
    defineField({
      name: 'tickets',
      group: 'details',
      type: 'url',
    }),
    defineField({
      name: 'firstPublished',
      title: 'First published',
      type: 'datetime',
      group: 'details',
      description: 'Automatically set when first published',
      readOnly: true,
      fieldset: 'dates',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
      group: 'details',
      fieldset: 'dates',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : ''

      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} @ ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})

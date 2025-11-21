import { PinIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { Groups } from '../utils/groups';

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  groups: Groups,
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      type: 'string',
      validation: (rule) => rule.warning('Please provide a location for better user experience'),
    }),
    defineField({
      name: 'country',
      type: 'string',
      validation: (rule) => rule.warning('Please enter the country for a better user experience'),
    }),
  ],
});

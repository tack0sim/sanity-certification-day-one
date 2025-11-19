import { UsersIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const artistType = defineType({
	name: 'artist',
	title: 'Artist',
	type: 'document',
	icon: UsersIcon,
	fields: [
		defineField({
			name: 'name',
			type: 'string',
			validation: (rule) => rule.required().error('Name of artist is required'),
		}),
		defineField({
			name: 'description',
			type: 'string',
		}),
		defineField({
			name: 'photo',
			type: 'image',
			options: { hotspot: true },
		}),
	],
});

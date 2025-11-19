import { TextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const reviews = defineType({
	name: 'reviews',
	type: 'object',
	icon: TextIcon,
	fields: [
		defineField({
			name: 'title',
			type: 'string',
		}),
		defineField({
			name: 'review',
			type: 'array',
			of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
		}),
	],
	preview: {
		select: {
			title: 'title',
			media: 'icon',
		},
		prepare({ title, media }) {
			return {
				title,
				subtitle: 'Review',
				media,
			};
		},
	},
});

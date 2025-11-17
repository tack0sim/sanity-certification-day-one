import { createClient } from '@sanity/client';
import { documentEventHandler } from '@sanity/functions';

export const handler = documentEventHandler(async ({ context, event }) => {
	const { data } = event;
	try {
		const client = await createClient({
			...context.clientOptions,
			apiVersion: 'vX',
			useCdn: false,
		});
		await client.agent.action
			.generate({
				schemaId: '_.schemas.default',
				documentId: data._id,
				instructionParams: {
					headline: {
						type: 'groq',
						query: `*[_type == "event" && _id == $id && defined(headline) && defined(venue)][0].headline->name`,
						params: { id: data._id },
					},
					venue: {
						type: 'groq',
						query: `*[_type == "event" && _id == $id && defined(headline) && defined(venue)][0].venue->name`,
						params: { id: data._id },
					},
				},
				instruction:
					'Create a short description of what attendees can expect when they come to this event. The headline artist is "$headline" and the venue is "$venue". Keep the text between 500 and 1000 characters long.',
				target: [{ path: ['details'] }],
			})
			.then((res) => {
				console.log('Wrote details: ', res.details[0].children[0].text);
			})
			.catch((err) => {
				console.error('Error from the agent: ', err);
			});
	} catch (err) {
		console.error('Error: ', err);
	}
});

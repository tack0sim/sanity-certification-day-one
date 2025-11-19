// from sanity.io docs: https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router

'use server';

import { draftMode } from 'next/headers';

export async function disableDraftMode() {
	const disable = (await draftMode()).disable();
	const delay = new Promise((resolve) => setTimeout(resolve, 1000));

	await Promise.allSettled([disable, delay]);
}

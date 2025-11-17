// from sanity.io docs: https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router

'use client';

import { useRouter } from 'next/navigation';
import { useDraftModeEnvironment } from 'next-sanity/hooks';
import { useTransition } from 'react';
import { disableDraftMode } from '@/app/actions';

export function DisableDraftMode() {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const environment = useDraftModeEnvironment();

	// Only show the disable draft mode button when outside of Presentation Tool
	if (environment !== 'live' && environment !== 'unknown') {
		return null;
	}

	const disable = () =>
		startTransition(async () => {
			await disableDraftMode();
			router.refresh();
		});

	return (
		<div className="fixed inset-x-0 bottom-1 z-10 px-2 md:bottom-2 md:px-4">
			<div className="mx-auto max-w-md rounded-md border border-black bg-gray-500/10 px-4 py-2 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					{environment ? <p>Viewing site in Draft mode</p> : null}
					{pending ? (
						'Disabling draft mode...'
					) : (
						<button
							className="border rounded-md border-black bg-purple-400 px-2 hover:bg-purple-600 hover:shadow-xl transition-shadow"
							type="button"
							onClick={disable}
						>
							Disable draft mode
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

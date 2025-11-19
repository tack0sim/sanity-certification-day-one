import { Stack, Text } from '@sanity/ui';
import { type NumberInputProps, useFormValue } from 'sanity';

function subtractMinutesFromDate(date: string, minute: number) {
	return new Date(new Date(date).getTime() - minute * 60000);
}

export function DoorsOpenInput(props: NumberInputProps) {
	const date = useFormValue(['date']) as string | undefined;

	return (
		<Stack space={3}>
			{props.renderDefault(props)}
			{typeof props.value === 'number' && date ? (
				<Text size={1}>
					Doors open{' '}
					{subtractMinutesFromDate(date, props.value).toLocaleDateString(
						undefined,
						{
							day: 'numeric',
							month: 'long',
							year: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						},
					)}
				</Text>
			) : null}
		</Stack>
	);
}

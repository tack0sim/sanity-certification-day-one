import type { SchemaTypeDefinition } from 'sanity';
import { artistType } from './artistType';
import { eventType } from './eventType';
import { page } from './page';
import { venueType } from './venueType';

export const documents: SchemaTypeDefinition[] = [
	page,
	eventType,
	artistType,
	venueType,
];

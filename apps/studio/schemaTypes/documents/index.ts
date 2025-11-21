import type { SchemaTypeDefinition } from 'sanity';
import { artistType } from './artistType';
import { eventType } from './eventType';
import { pageSite1 } from './pageSite1';
import { pageSite2 } from './pageSite2';
import { venueType } from './venueType';

export const documents: SchemaTypeDefinition[] = [pageSite1, pageSite2, eventType, artistType, venueType];

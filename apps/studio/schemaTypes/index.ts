import type { SchemaTypeDefinition } from 'sanity';
import { pageBuilderBlocks } from './blocks';
import { documents } from './documents';
import { objects } from './objects';

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [...documents, ...objects, ...pageBuilderBlocks],
};

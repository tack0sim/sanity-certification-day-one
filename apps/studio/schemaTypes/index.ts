import {SchemaTypeDefinition} from 'sanity'
import {documents} from './documents'
import {objects} from './objects'
import {pageBuilderBlocks} from './blocks'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [...documents, ...objects, ...pageBuilderBlocks],
}

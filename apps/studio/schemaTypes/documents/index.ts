import {SchemaTypeDefinition} from 'sanity'
import {page} from './page'
import {eventType} from './eventType'
import {artistType} from './artistType'
import {venueType} from './venueType'

export const documents: SchemaTypeDefinition[] = [page, eventType, artistType, venueType]

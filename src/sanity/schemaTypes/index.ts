import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {flexiblePostContentType} from './flexiblePostContentType'
import {flexibleContentDoc} from './flexibleContentDoc'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {dormType} from './dormType'
import studyPlaceType from './studyPlaceType'
import eventType from './eventType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, flexiblePostContentType, flexibleContentDoc, categoryType, postType, dormType, studyPlaceType, eventType],
}
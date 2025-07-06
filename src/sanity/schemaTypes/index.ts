import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {flexiblePostContentType} from './flexiblePostContentType'
import {flexibleContentDoc} from './flexibleContentDoc'
import {categoryType} from './categoryType'
import {authorType} from './authorType'
import {postType} from './postType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, flexiblePostContentType, flexibleContentDoc, categoryType, postType, authorType],
}

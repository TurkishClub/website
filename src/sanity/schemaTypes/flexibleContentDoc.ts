import {defineType} from 'sanity'
import {flexiblePostContentType} from './flexiblePostContentType'

export const flexibleContentDoc = defineType({
  name: 'flexibleContent',
  title: 'Flexible Content',
  type: 'document',
  fields: [
    {
      name: 'content',
      title: 'Blocks',
      type: 'flexiblePostContent'
    }
  ]
})
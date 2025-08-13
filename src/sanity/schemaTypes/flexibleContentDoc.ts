import {defineType} from 'sanity';

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
});

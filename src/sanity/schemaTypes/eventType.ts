import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: r => r.required()}),
    defineField({name: 'embedUrl', title: 'Embed URL', type: 'url', validation: r => r.required().uri({allowRelative: false})}),
    defineField({name: 'time', title: 'Time', type: 'datetime', validation: r => r.required()}),
    defineField({name: 'location', title: 'Location', type: 'string', validation: r => r.required()}),
  ],
  preview: {select: {title: 'name', subtitle: 'time'}},
})
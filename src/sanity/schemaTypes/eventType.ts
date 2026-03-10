import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'embedUrl', title: 'Embed URL', type: 'url', validation: r => r.required().uri({ allowRelative: false }) }),
    defineField({ name: 'time', title: 'Time', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'location', title: 'Location', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        defineField({ name: 'tr', title: 'Türkçe', type: 'text', rows: 3 }),
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
        defineField({ name: 'de', title: 'Deutsch', type: 'text', rows: 3 }),
      ]
    }),
    defineField({ name: 'image', title: 'Event Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'images',
      title: 'Event Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'time' } },
})
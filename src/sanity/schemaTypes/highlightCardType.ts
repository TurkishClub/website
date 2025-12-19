import { defineField, defineType } from 'sanity'

export const highlightCardType = defineType({
    name: 'highlightCard',
    title: 'Highlight Card',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
        }),
        defineField({
            name: 'type',
            type: 'string',
            title: 'Type',
        }),
        defineField({
            name: 'description',
            type: 'text',
            title: 'Description',
        }),
        defineField({
            name: 'image',
            type: 'image',
            title: 'Image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'link',
            type: 'url',
            title: 'Link',
        }),
    ],
})

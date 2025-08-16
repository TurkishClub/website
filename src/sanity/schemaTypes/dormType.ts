import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const dormType = defineType({
  name: 'dorm',
  title: 'Dorm',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'rent',
      title: 'Rent',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              {title: 'Single Price', value: 'single'},
              {title: 'Price Range', value: 'range'}
            ]
          },
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'singlePrice',
          title: 'Single Price',
          type: 'number',
          hidden: ({parent}) => parent?.type !== 'single'
        }),
        defineField({
          name: 'minPrice',
          title: 'Minimum Price',
          type: 'number',
          hidden: ({parent}) => parent?.type !== 'range'
        }),
        defineField({
          name: 'maxPrice',
          title: 'Maximum Price',
          type: 'number',
          hidden: ({parent}) => parent?.type !== 'range'
        })
      ]
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url'
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: Rule => Rule.required()
        })
      ]
    }),
    defineField({
      name: 'distanceToGFZ',
      title: 'Distance to GFZ (minutes)',
      type: 'number'
    }),
    defineField({
      name: 'distanceToMainCampus',
      title: 'Distance to Main Campus (minutes)',
      type: 'number'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'roomTypes',
      title: 'Room Types',
      type: 'array',
      of: [{type: 'string'}]
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'address'
    }
  }
})
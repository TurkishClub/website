import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'studyPlace',
  title: 'Study Place',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'address',
      title: 'Address', 
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'whoCanUse',
      title: 'Who Can Use',
      type: 'string',
      description: 'Who can use this study place'
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'object',
      fields: [
        defineField({
          name: 'monday',
          title: 'Monday',
          type: 'string'
        }),
        defineField({
          name: 'tuesday', 
          title: 'Tuesday',
          type: 'string'
        }),
        defineField({
          name: 'wednesday',
          title: 'Wednesday', 
          type: 'string'
        }),
        defineField({
          name: 'thursday',
          title: 'Thursday',
          type: 'string'
        }),
        defineField({
          name: 'friday',
          title: 'Friday',
          type: 'string'
        }),
        defineField({
          name: 'saturday',
          title: 'Saturday',
          type: 'string'
        }),
        defineField({
          name: 'sunday',
          title: 'Sunday',
          type: 'string'
        })
      ]
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description including user profile, organization, noise level, table width, typical occupancy times'
    }),
    defineField({
      name: 'restrictions',
      title: 'Restrictions',
      type: 'text', 
      description: 'Any restrictions (e.g., must buy coffee, membership required, specific student groups only)'
    }),
    defineField({
      name: 'electricOutlets',
      title: 'Electric Outlets Available',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'foodOptions',
      title: 'Food Options',
      type: 'string',
      description: 'Available food and drink options'
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
          validation: (Rule) => Rule.required().min(-90).max(90)
        }),
        defineField({
          name: 'lng',
          title: 'Longitude', 
          type: 'number',
          validation: (Rule) => Rule.required().min(-180).max(180)
        })
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'distanceToGFZ',
      title: 'Distance to GFZ (minutes)',
      type: 'number',
      description: 'Travel time to GFZ in minutes'
    }),
    defineField({
      name: 'distanceToMainCampus', 
      title: 'Distance to Main Campus (minutes)',
      type: 'number',
      description: 'Travel time to main campus in minutes'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Library', value: 'library'},
          {title: 'Cafe', value: 'cafe'},
          {title: 'University', value: 'university'},
          {title: 'Coworking Space', value: 'coworking'},
          {title: 'Other', value: 'other'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'isQuiet',
      title: 'Is Quiet',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'hasWifi',
      title: 'Has WiFi',
      type: 'boolean', 
      initialValue: true
    }),
    defineField({
      name: 'isFree',
      title: 'Is Free',
      type: 'boolean',
      initialValue: true 
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}]
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'address',
      media: 'images.0'
    }
  }
});

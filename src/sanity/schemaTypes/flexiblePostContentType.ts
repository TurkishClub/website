import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon, CodeIcon} from '@sanity/icons'

export const flexiblePostContentType = defineType({
  title: 'Flexible Post Content',
  name: 'flexiblePostContent',
  type: 'array',
  of: [
    // Rich text block
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Number', value: 'number'}
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) => Rule.uri({
                  allowRelative: true,
                  scheme: ['http', 'https', 'mailto', 'tel']
                })
              },
            ],
          },
        ],
      },
    }),
    
    // Image block
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      name: 'imageBlock',
      title: 'Image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility and SEO',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional caption for the image',
        }
      ]
    }),
    
    // Code block
    defineArrayMember({
      type: 'code',
      name: 'codeBlock',
      title: 'Code Block',
      icon: CodeIcon,
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'Python', value: 'python'},
          {title: 'JSON', value: 'json'},
          {title: 'CSS', value: 'css'},
          {title: 'HTML', value: 'html'},
          {title: 'Bash', value: 'bash'},
          {title: 'SQL', value: 'sql'},
        ],
        withFilename: true,
      }
    })
  ],
})
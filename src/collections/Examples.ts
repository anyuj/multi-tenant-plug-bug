import type { CollectionConfig } from 'payload'

export const Examples: CollectionConfig = {
  slug: 'examples',
  fields: [
    {
      name: 'content',
      type: 'text',
      required: true,
    },
  ],
}

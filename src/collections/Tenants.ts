import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  orderable: true,
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}

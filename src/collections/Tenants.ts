import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'supportedLocales',
      type: 'select',
      hasMany: true,
      options: ['en', 'es'],
    },
  ],
}

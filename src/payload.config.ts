// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Config } from './payload-types'
import { Tenants } from './collections/Tenants'
import { Examples } from './collections/Examples'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: '/',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tenants, Examples],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  localization: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    fallback: true,
    filterAvailableLocales: async ({ req, locales }) => {
      if (getTenantFromCookie(req.headers, 'text')) {
        console.log(getTenantFromCookie(req.headers, 'text'))
        const fullTenant = await req.payload.findByID({
          id: getTenantFromCookie(req.headers, 'text') as string,
          collection: 'tenants',
          req,
        })
        if (fullTenant && fullTenant.supportedLocales?.length) {
          return locales.filter((locale) => {
            return fullTenant.supportedLocales?.includes(locale.code as 'en' | 'es')
          })
        }
      }
      return locales
    },
  },
  sharp,
  plugins: [
    multiTenantPlugin<Config>({
      tenantsSlug: 'tenants',
      tenantSelectorLabel: 'Tenant',
      collections: { examples: { isGlobal: true } },
      userHasAccessToAllTenants: (user) => Boolean(user),
    }),
  ],
})

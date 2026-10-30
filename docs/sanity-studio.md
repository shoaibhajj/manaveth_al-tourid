# Sanity Studio (phase 2)

The content Studio is embedded in the site at `/studio`. The website still reads its content from `lib/content/*`; wiring the site to Sanity is phase 3.

## Setup

1. Create a project and a dataset (for example `production`) in the Sanity dashboard.
2. Add these variables in the project settings (see `.env.example`):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION` (optional)
3. In Sanity, open API, then CORS origins, and add the site origin (the preview URL and the production domain) with "Allow credentials" enabled.
4. Open `/studio` and sign in.

Until the two required variables exist, `/studio` shows a setup guide instead of the Studio. No tokens are used, and nothing in this phase is secret: the project ID and dataset only identify the project.

## Structure

- `sanity.config.ts`: Studio config. Singletons cannot be created, duplicated, unpublished or deleted.
- `sanity/structure.ts`: the sidebar. Company, home page, services, sectors, statistics, products and categories, branches and warehouses (all, branches only, warehouses only), gallery, and SEO per page.
- `sanity/schemaTypes/objects`: localized Arabic/English fields, shared objects (links, buttons, contact people, WhatsApp channels, unit prices), and one object per home page section.
- `sanity/schemaTypes/documents`: singletons (`siteSettings`, `homePage`, `contactSettings`, `seoHome`, `seoProducts`, `seoBranches`) and repeatable documents (`service`, `sector`, `stat`, `productCategory`, `product`, `place`, `galleryCategory`, `galleryItem`).
- A `place` document has `kind` set to `branch` or `warehouse`, so branches and warehouses share one model: image, address, map link, phones, email and the responsible person.

## Content rules

- Arabic is the required language. English is optional and falls back to Arabic in phase 3.
- Every list document has an `order` number, so the sidebar and the site share one ordering.
- Repeatable documents have an "active" switch to hide an item without deleting it.

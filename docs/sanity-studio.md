# Sanity Studio (current implementation)

The content Studio is embedded in the site at `/studio`. Public pages read managed content from Sanity with local fallbacks where configured. Catalog pages and specialty products are managed in Sanity; the catalog's page order, visibility, images, headings, and layout are editable there.

## Setup

1. Create a project and a dataset (for example `production`) in the Sanity dashboard.
2. Add these variables in the project settings (see `.env.example`):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION` (optional)
3. In Sanity, open API, then CORS origins, and add the site origin (the preview URL and the production domain) with "Allow credentials" enabled.
4. Open `/studio` and sign in.

Until the two required variables exist, `/studio` shows a setup guide instead of the Studio. The project ID and dataset identify the project; API tokens must stay server-side and must never be committed or exposed in browser code.

## Structure

- `sanity.config.ts`: Studio config. Singletons cannot be created, duplicated, unpublished or deleted.
- `sanity/structure.ts`: the sidebar. Company, home page, services, sectors, statistics, products and categories, branches and warehouses (all, branches only, warehouses only), gallery, and SEO per page.
- `sanity/schemaTypes/objects`: localized Arabic/English fields, shared objects (links, buttons, contact people, WhatsApp channels, unit prices), and one object per home page section.
- `sanity/schemaTypes/documents`: singletons (`siteSettings`, `homePage`, `contactSettings`, `seoHome`, `seoProducts`, `seoBranches`) and repeatable documents (`service`, `sector`, `stat`, `productCategory`, `product`, `place`, `galleryCategory`, `galleryItem`).
- A `place` document has `kind` set to `branch` or `warehouse`, so branches and warehouses share one model: image, address, map link, phones, email and the responsible person.

## Content rules

- Arabic is the required language. English is optional for content fields and falls back to Arabic where the page supports localized fallbacks.
- Every list document has an `order` number, so the sidebar and the site share one ordering.
- Repeatable documents have an "active" switch to hide an item without deleting it.

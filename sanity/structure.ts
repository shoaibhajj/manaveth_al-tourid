import type { StructureBuilder, StructureResolver } from 'sanity/structure'

const singleton = (S: StructureBuilder, typeName: string, title: string) =>
  S.listItem()
    .id(typeName)
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))

const orderedList = (S: StructureBuilder, typeName: string, title: string, filter?: string) =>
  S.listItem()
    .id(filter ? `${typeName}-${title}` : typeName)
    .title(title)
    .child(
      S.documentList()
        .id(filter ? `${typeName}-${title}` : typeName)
        .title(title)
        .schemaType(typeName)
        .filter(filter ?? '_type == $type')
        .params(filter ? {} : { type: typeName })
        .defaultOrdering([{ field: 'order', direction: 'asc' }]),
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website content')
    .items([
      S.listItem()
        .title('Company')
        .child(
          S.list()
            .title('Company')
            .items([
              singleton(S, 'siteSettings', 'Site settings and identity'),
              singleton(S, 'contactSettings', 'WhatsApp and contact messages'),
            ]),
        ),
      singleton(S, 'homePage', 'Home page'),
      S.divider(),
      orderedList(S, 'service', 'Services'),
      orderedList(S, 'sector', 'Sectors'),
      orderedList(S, 'stat', 'Statistics'),
      S.listItem()
        .title('Products')
        .child(
          S.list()
            .title('Products')
            .items([orderedList(S, 'product', 'Products'), orderedList(S, 'productCategory', 'Categories')]),
        ),
      S.listItem()
        .title('Branches and warehouses')
        .child(
          S.list()
            .title('Branches and warehouses')
            .items([
              orderedList(S, 'place', 'All locations'),
              orderedList(S, 'place', 'Branches', '_type == "place" && kind == "branch"'),
              orderedList(S, 'place', 'Warehouses', '_type == "place" && kind == "warehouse"'),
            ]),
        ),
      S.listItem()
        .title('Work gallery')
        .child(
          S.list()
            .title('Work gallery')
            .items([orderedList(S, 'galleryItem', 'Gallery items'), orderedList(S, 'galleryCategory', 'Categories')]),
        ),
      S.divider(),
      S.listItem()
        .title('Search engine data (SEO)')
        .child(
          S.list()
            .title('Search engine data (SEO)')
            .items([
              singleton(S, 'seoHome', 'Home page'),
              singleton(S, 'seoProducts', 'Products page'),
              singleton(S, 'seoBranches', 'Branches and warehouses page'),
            ]),
        ),
    ])

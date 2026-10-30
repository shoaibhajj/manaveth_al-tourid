import type { StructureBuilder, StructureResolver } from 'sanity/structure'

const singleton = (S: StructureBuilder, typeName: string, title: string) =>
  S.listItem()
    .id(typeName)
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))

/** `id` stays English and stable so Studio URLs do not change when a title is reworded. */
const orderedList = (S: StructureBuilder, typeName: string, title: string, id: string, filter?: string) =>
  S.listItem()
    .id(id)
    .title(title)
    .child(
      S.documentList()
        .id(id)
        .title(title)
        .schemaType(typeName)
        .filter(filter ?? '_type == $type')
        .params(filter ? {} : { type: typeName })
        .defaultOrdering([{ field: 'order', direction: 'asc' }]),
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('محتوى الموقع')
    .items([
      S.listItem()
        .id('company')
        .title('الشركة')
        .child(
          S.list()
            .id('company')
            .title('الشركة')
            .items([
              singleton(S, 'siteSettings', 'إعدادات الموقع والهوية'),
              singleton(S, 'contactSettings', 'واتساب ورسائل التواصل'),
            ]),
        ),
      singleton(S, 'homePage', 'الصفحة الرئيسية'),
      S.divider(),
      orderedList(S, 'service', 'الخدمات', 'service'),
      orderedList(S, 'sector', 'القطاعات', 'sector'),
      orderedList(S, 'stat', 'الإحصائيات', 'stat'),
      S.listItem()
        .id('products-group')
        .title('المنتجات')
        .child(
          S.list()
            .id('products-group')
            .title('المنتجات')
            .items([
              orderedList(S, 'product', 'المنتجات', 'product'),
              orderedList(S, 'productCategory', 'التصنيفات', 'productCategory'),
            ]),
        ),
      S.listItem()
        .id('places-group')
        .title('الفروع والمستودعات')
        .child(
          S.list()
            .id('places-group')
            .title('الفروع والمستودعات')
            .items([
              orderedList(S, 'place', 'كل المواقع', 'place'),
              orderedList(S, 'place', 'الفروع', 'place-Branches', '_type == "place" && kind == "branch"'),
              orderedList(S, 'place', 'المستودعات', 'place-Warehouses', '_type == "place" && kind == "warehouse"'),
            ]),
        ),
      S.listItem()
        .id('gallery-group')
        .title('معرض الأعمال')
        .child(
          S.list()
            .id('gallery-group')
            .title('معرض الأعمال')
            .items([
              orderedList(S, 'galleryItem', 'عناصر المعرض', 'galleryItem'),
              orderedList(S, 'galleryCategory', 'التصنيفات', 'galleryCategory'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .id('seo-group')
        .title('محركات البحث (SEO)')
        .child(
          S.list()
            .id('seo-group')
            .title('محركات البحث (SEO)')
            .items([
              singleton(S, 'seoHome', 'الصفحة الرئيسية'),
              singleton(S, 'seoProducts', 'صفحة المنتجات'),
              singleton(S, 'seoBranches', 'صفحة الفروع والمستودعات'),
            ]),
        ),
    ])

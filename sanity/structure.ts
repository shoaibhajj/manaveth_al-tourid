import type { DefaultDocumentNodeResolver, StructureBuilder, StructureResolver } from 'sanity/structure'
import { ProductSeoPane } from './components/ProductSeoPane'
import { ClientGuidePane } from './components/ClientGuidePane'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (schemaType === 'product') {
    return S.document().views([
      S.view.form().id('editor').title('محتوى المنتج'),
      S.view.component(ProductSeoPane).id('seo-preview').title('معاينة SEO والفهرسة'),
    ])
  }
  return S.document().views([S.view.form().id('editor').title('المحتوى')])
}

const singleton = (S: StructureBuilder, typeName: string, title: string) =>
  S.listItem()
    .id(typeName)
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))

/** `id` stays English and stable so Studio URLs do not change when a title is reworded. */
const orderedList = (
  S: StructureBuilder,
  typeName: string,
  title: string,
  id: string,
  filter?: string,
  defaultOrder: { field: string; direction: 'asc' | 'desc' }[] = [{ field: '_createdAt', direction: 'desc' }],
) =>
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
        .defaultOrdering(defaultOrder),
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
              singleton(S, 'aboutPage', 'صفحة عن الشركة والاعتمادات (/about)'),
              singleton(S, 'contactSettings', 'واتساب ورسائل التواصل ومواعيد العمل'),
              singleton(S, 'visitorCounter', 'عداد الزيارات'),
            ]),
        ),
      singleton(S, 'homePage', 'الصفحة الرئيسية وتنسيق الأقسام'),
      singleton(S, 'catalogPage', 'كتالوج المنتجات ودليل الأصناف (PDF)'),
      S.documentTypeListItem('customSection').title('الأقسام المخصصة (قابلة للنسخ والتكرار)'),
      S.documentTypeListItem('companyPost').title('نبض الشركة وآخر الأخبار والفعاليات'),
      S.divider(),
      orderedList(S, 'service', 'الخدمات', 'service'),
      orderedList(S, 'sector', 'القطاعات', 'sector'),
      orderedList(S, 'stat', 'الإحصائيات', 'stat'),
      orderedList(S, 'article', 'المقالات والبيانات الصحفية', 'article', undefined, [{ field: 'publishedAt', direction: 'desc' }]),
      // قسم توريد اللحوم المخصص
      S.listItem()
        .id('meat-supply-group')
        .title('🥩 قسم وتوريد اللحوم (Meat Supply Hub)')
        .child(
          S.list()
            .id('meat-supply-group')
            .title('🥩 قسم وتوريد اللحوم')
            .items([
              S.listItem()
                .id('meat-supply-main')
                .title('📄 صفحة توريد اللحوم الرئيسية (/meat-supply)')
                .child(
                  S.document()
                    .schemaType('landingPage')
                    .documentId('meat-supply')
                    .title('صفحة توريد اللحوم الرئيسية (/meat-supply)')
                ),
              S.divider(),
              S.documentTypeListItem('landingPage').title('📑 كافة صفحات الهبوط والتوريد المخصصة'),
              S.documentTypeListItem('sector').title('🏢 قطاعات توريد اللحوم (مطاعم، فنادق، إعاشة)'),
              S.documentTypeListItem('city').title('📍 مدن وتغطية توريد اللحوم (الرياض، جدة، مكة...)'),
              S.divider(),
              orderedList(
                S,
                'product',
                '🥩 أصناف اللحوم والدواجن في الكتالوج',
                'meat-products-filter',
                '_type == "product" && (category._ref == "category-meat-poultry" || category->_id == "category-meat-poultry" || productType in ["meat", "poultry"] || slug.current match "*bf*" || slug.current match "*ck*" || slug.current in ["frozen-meat", "frozen-liver"])',
                [{ field: '_createdAt', direction: 'desc' }]
              ),
            ])
        ),

      // قسم الشهادات والاعتمادات
      S.listItem()
        .id('certifications-group')
        .title('🎖️ الشهادات والاعتمادات (Certifications)')
        .child(
          S.list()
            .id('certifications-group')
            .title('الشهادات والاعتمادات الرسمية')
            .items([
              singleton(S, 'certificationsPage', '📄 إعدادات صفحة الشهادات (/certifications)'),
              S.divider(),
              S.documentTypeListItem('certificate').title('📜 كافة وثائق وتراخيص الجودة المعتمدة'),
            ])
        ),
      S.listItem()
        .id('products-group')
        .title('المنتجات والكتالوج')
        .child(
          S.list()
            .id('products-group')
            .title('المنتجات والكتالوج')
            .items([
              singleton(S, 'catalogPage', 'إعدادات الكتالوج والـ PDF'),
              orderedList(S, 'product', 'المنتجات والأصناف', 'product'),
              orderedList(S, 'productCategory', 'التصنيفات', 'productCategory'),
              S.divider(),
              S.documentTypeListItem('brand').title('العلامات التجارية (Brands)'),
              S.documentTypeListItem('country').title('دول المنشأ (Origin Countries)'),
              S.documentTypeListItem('city').title('مناطق ومدن الخدمة (Service Areas)'),
              S.documentTypeListItem('certificate').title('الشهادات والاعتمادات (Certificates)'),
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
              S.listItem()
                .id('client-guide-item')
                .title('📖 دليل العميل وإرشادات الفهرسة')
                .child(
                  S.component(ClientGuidePane)
                    .id('client-guide-pane')
                    .title('دليل العميل وإرشادات الفهرسة')
                ),
              S.divider(),
              singleton(S, 'seoHome', 'الصفحة الرئيسية'),
              singleton(S, 'seoProducts', 'صفحة المنتجات'),
              singleton(S, 'seoBranches', 'صفحة الفروع والمستودعات'),
              S.divider(),
              S.documentTypeListItem('redirect').title('روابط إعادة التوجيه (301 Redirects)'),
              S.documentTypeListItem('keywordCluster').title('مجموعات الكلمات المفتاحية (Keyword Clusters)'),
            ]),
        ),
    ])

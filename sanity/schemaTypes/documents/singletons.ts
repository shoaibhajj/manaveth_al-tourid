import { defineArrayMember, defineField, defineType } from 'sanity'
import { emailMessage, requiredTranslation } from '../../lib/localization'
import { seoFields } from '../objects/shared'
import { ResetSectionsButton } from '../../components/ResetSectionsButton'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'إعدادات الموقع والهوية',
  type: 'document',
  groups: [
    { name: 'identity', title: 'هوية الشركة', default: true },
    { name: 'contact', title: 'بيانات التواصل' },
    { name: 'seo', title: 'محركات البحث (الافتراضي)' },
  ],
  fields: [
    defineField({
      name: 'companyName',
      title: 'اسم الشركة',
      type: 'localizedString',
      group: 'identity',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'tagline',
      title: 'الشعار النصي',
      description: 'جملة قصيرة تظهر تحت اسم الشركة.',
      type: 'localizedString',
      group: 'identity',
    }),
    defineField({
      name: 'about',
      title: 'نبذة عن الشركة',
      description: 'وصف مختصر للشركة.',
      type: 'localizedText',
      group: 'identity',
      validation: requiredTranslation,
    }),
    defineField({ name: 'logo', title: 'الشعار', type: 'localizedImage', group: 'identity' }),
    defineField({
      name: 'favicon',
      title: 'أيقونة الموقع (Favicon)',
      description: 'صورة مربعة بمقاس 512 × 512 على الأقل.',
      type: 'image',
      group: 'identity',
    }),
    defineField({
      name: 'currency',
      title: 'العملة',
      description: 'تظهر بجانب أسعار المنتجات، مثل رمز العملة أو اختصارها.',
      type: 'localizedString',
      group: 'identity',
    }),
    defineField({
      name: 'taxId',
      title: 'الرقم الضريبي (Tax ID / VAT)',
      description: 'الرقم الضريبي المسجل لدى هيئة الزكاة والضريبة والجمارك (ZATCA). يظهر في بيانات السكيمة ومحركات البحث فقط عند إدخاله.',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'commercialRegistration',
      title: 'رقم السجل التجاري (CR Number)',
      description: 'رقم السجل التجاري المعتمد لدى وزارة التجارة (مثال: 1116011768).',
      type: 'string',
      group: 'identity',
    }),
    defineField({ name: 'phone', title: 'الهاتف', type: 'string', group: 'contact' }),
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.custom(emailMessage).warning(),
    }),
    defineField({ name: 'address', title: 'العنوان', type: 'localizedText', group: 'contact' }),
    defineField({
      name: 'socialLinks',
      title: 'حسابات التواصل الاجتماعي',
      type: 'array',
      of: [defineArrayMember({ type: 'socialLink' })],
      group: 'contact',
    }),
    defineField({ name: 'defaultSeo', title: 'بيانات محركات البحث الافتراضية', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'إعدادات الموقع والهوية' }) },
})

export const visitorCounter = defineType({
  name: 'visitorCounter',
  title: 'عداد الزيارات',
  type: 'document',
  fields: [
    defineField({ name: 'totalVisits', title: 'العدد الفعلي للزيارات', type: 'number', readOnly: true, initialValue: 0 }),
    defineField({ name: 'displayOffset', title: 'رقم إضافي للعرض', description: 'يزاد على العدد الفعلي الظاهر للزوار.', type: 'number', initialValue: 0, validation: (rule) => rule.min(0) }),
    defineField({ name: 'enabled', title: 'إظهار العداد في الموقع', type: 'boolean', initialValue: true }),
  ],
  preview: { prepare: () => ({ title: 'عداد الزيارات' }) },
})

export const contactSettings = defineType({
  name: 'contactSettings',
  title: 'واتساب ورسائل التواصل',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsappQuote',
      title: 'واتساب: طلب عرض سعر',
      description: 'القناة التي يستخدمها الزائر لطلب عرض سعر.',
      type: 'whatsappChannel',
    }),
    defineField({
      name: 'whatsappOrders',
      title: 'واتساب: الطلبات والاستفسارات',
      description: 'القناة التي يستخدمها الزائر لمتابعة الطلبات والاستفسارات العامة.',
      type: 'whatsappChannel',
    }),
    defineField({
      name: 'productOrderMessage',
      title: 'رسالة طلب منتج',
      description: 'تظهر جاهزة عندما يطلب الزائر منتجًا. اكتب {product} في المكان الذي يجب أن يظهر فيه اسم المنتج.',
      type: 'localizedText',
    }),
    defineField({
      name: 'note',
      title: 'ملاحظة',
      description: 'هاتف الشركة وبريدها وعنوانها وحساباتها الاجتماعية موجودة في «إعدادات الموقع والهوية».',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: { prepare: () => ({ title: 'واتساب ورسائل التواصل' }) },
})

export const homePage = defineType({
  name: 'homePage',
  title: 'الصفحة الرئيسية',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionsResetTool',
      title: 'استعادة الأقسام الأصلية',
      type: 'string',
      components: {
        input: ResetSectionsButton,
      },
    }),
    defineField({
      name: 'sectionsList',
      title: '📋 ترتيب وإظهار/إخفاء أقسام الصفحة الرئيسية (Drag & Drop)',
      description: 'اسحب الأقسام للأعلى أو الأسفل لتغيير ترتيب ظهورها على الموقع مباشرة. يمكنك إيقاف تفعيل أي قسم لإخفائه بنقرة واحدة، أو حذفه بالكامل. وإذا أردت استرجاع كافة الأقسام الأصلية، يمكنك الضغط على زر "🔄 استعادة الأقسام الافتراضية" في أسفل الشاشة أو زيارة الرابط المخصص.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeSectionConfig',
          title: 'قسم في الصفحة',
          fields: [
            defineField({
              name: 'key',
              title: 'نوع القسم',
              type: 'string',
              options: {
                list: [
                  { title: 'الواجهة الرئيسية (Hero)', value: 'hero' },
                  { title: 'من نحن (About)', value: 'about' },
                  { title: 'نبض الشركة وآخر الأخبار والفعاليات (Company News)', value: 'news' },
                  { title: 'الخدمات (Services)', value: 'services' },
                  { title: 'المنتجات المميزة (Featured Products)', value: 'featuredProducts' },
                  { title: 'معرض الأعمال التفاعلي (Gallery)', value: 'gallery' },
                  { title: 'الإحصائيات والأرقام (Stats)', value: 'stats' },
                  { title: 'القطاعات المستهدفة (Sectors)', value: 'sectors' },
                  { title: 'الفروع والمستودعات (Branches)', value: 'branches' },
                  { title: 'تواصل معنا (Contact)', value: 'contact' },
                  { title: 'قسم مخصص مكرر (Custom Section)', value: 'custom' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'عنوان مخصص للقسم (اختياري)',
              type: 'localizedString',
            }),
            defineField({
              name: 'enabled',
              title: 'إظهار هذا القسم على الموقع',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'customSectionRef',
              title: 'اختر القسم المخصص المكرر',
              type: 'reference',
              to: [{ type: 'customSection' }],
              hidden: ({ parent }) => parent?.key !== 'custom',
            }),
          ],
          preview: {
            select: {
              key: 'key',
              titleAr: 'title.ar',
              enabled: 'enabled',
            },
            prepare: ({ key, titleAr, enabled }) => {
              const names: Record<string, string> = {
                hero: 'الواجهة الرئيسية (Hero)',
                about: 'من نحن (About)',
                news: 'نبض الشركة وآخر الأخبار (Company News)',
                services: 'الخدمات (Services)',
                featuredProducts: 'المنتجات المميزة (Featured Products)',
                gallery: 'معرض الأعمال التفاعلي (Gallery)',
                stats: 'الإحصائيات (Stats)',
                sectors: 'القطاعات (Sectors)',
                branches: 'الفروع والمستودعات (Branches)',
                contact: 'تواصل معنا (Contact)',
                custom: 'قسم مخصص مكرر (Custom Section)',
              }
              return {
                title: titleAr || names[key] || key || 'قسم',
                subtitle: enabled !== false ? '✅ مفعّل وظاهر' : '❌ مخفي حالياً',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'الواجهة الرئيسية (Hero)',
      type: 'heroSection',
      options: { collapsible: true, collapsed: false },
    }),
    ...(
      [
        ['about', 'aboutSection', 'من نحن'],
        ['newsFeed', 'newsFeedSection', 'نبض الشركة وآخر الأخبار والفعاليات'],
        ['services', 'servicesSection', 'الخدمات'],
        ['gallery', 'gallerySection', 'معرض الأعمال'],
        ['stats', 'statsSection', 'الإحصائيات'],
        ['sectors', 'sectorsSection', 'القطاعات'],
        ['featuredProducts', 'featuredProductsSection', 'المنتجات المميزة'],
        ['branches', 'branchesSection', 'الفروع'],
        ['contact', 'contactSection', 'تواصل معنا'],
        ['footer', 'footerSection', 'التذييل'],
      ] as const
    ).map(([name, type, title]) =>
      defineField({ name, title, type, options: { collapsible: true, collapsed: true } }),
    ),
  ],
  preview: { prepare: () => ({ title: 'الصفحة الرئيسية' }) },
})

function defineSeoPage(name: string, title: string) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: seoFields,
    preview: { prepare: () => ({ title }) },
  })
}

export const seoHome = defineSeoPage('seoHome', 'محركات البحث: الصفحة الرئيسية')
export const seoProducts = defineSeoPage('seoProducts', 'محركات البحث: صفحة المنتجات')
export const seoBranches = defineSeoPage('seoBranches', 'محركات البحث: صفحة الفروع والمستودعات')

export const certificationsPage = defineType({
  name: 'certificationsPage',
  title: 'إعدادات صفحة الشهادات وتراخيص الجودة',
  type: 'document',
  groups: [
    { name: 'content', title: 'المحتوى والترويسة', default: true },
    { name: 'seo', title: 'محركات البحث' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان الصفحة (SEO Title)',
      type: 'localizedString',
      group: 'content',
    }),
    defineField({
      name: 'h1',
      title: 'الترويسة الرئيسية (H1)',
      type: 'localizedString',
      group: 'content',
    }),
    defineField({
      name: 'badge',
      title: 'نص الشارة العلوية',
      description: 'مثال: الامتثال الرقابي وسلامة الغذاء',
      type: 'localizedString',
      group: 'content',
    }),
    defineField({
      name: 'intro',
      title: 'المقدمة التعريفية',
      description: 'توضيح التزام الشركة بالتراخيص الرسمية والرقابة الصحية',
      type: 'localizedText',
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'محركات البحث',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: { prepare: () => ({ title: 'صفحة الشهادات وتراخيص الجودة' }) },
})

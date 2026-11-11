import { defineArrayMember, defineField, defineType } from 'sanity'
import { requiredTranslation } from '../../lib/localization'

const catalogPageKinds = [
  { title: 'غلاف', value: 'cover' },
  { title: 'فهرس الأصناف', value: 'productIndex' },
  { title: 'صفحة صنف أو مجموعة منتجات', value: 'productGroup' },
  { title: 'صفحة بصورة تصميم كاملة', value: 'fullPageImage' },
  { title: 'فئات السلع المساندة', value: 'supportingCommodities' },
  { title: 'صفحة ختامية', value: 'closing' },
  { title: 'صفحة محتوى عامة', value: 'custom' },
]

export const catalogPageItem = defineType({
  name: 'catalogPageItem',
  title: 'صنف أو صورة في الصفحة',
  type: 'object',
  groups: [
    { name: 'content', title: 'الكتابة والمنتج', default: true },
    { name: 'media', title: 'الصور' },
  ],
  fields: [
    defineField({
      name: 'product',
      title: 'ربط بسجل منتج (اختياري)',
      description: 'عند اختياره تُستخدم بيانات المنتج وصوره، ويمكن كتابة عنوان أو وصف خاص لهذه الصفحة.',
      type: 'reference',
      to: [{ type: 'product' }],
      group: 'content',
      options: { filter: 'visible != false' },
    }),
    defineField({ name: 'title', title: 'عنوان تحت الصورة أو الصور', type: 'localizedString', group: 'content' }),
    defineField({ name: 'subtitle', title: 'عنوان فرعي (اختياري)', type: 'localizedString', group: 'content' }),
    defineField({ name: 'caption', title: 'الوصف تحت الصور', type: 'localizedText', group: 'content' }),
    defineField({
      name: 'images',
      title: 'صور الصنف',
      description: 'أضف صورة واحدة أو أكثر. تُستخدم هذه الصور للكتالوج ويمكن تعديل ترتيبها أو حذفها من هنا.',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'وصف الصورة لقارئ الشاشة', type: 'localizedString' }),
            defineField({ name: 'caption', title: 'تعليق خاص بالصورة (اختياري)', type: 'localizedString' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title.ar', product: 'product.name.ar', media: 'images.0' },
    prepare: ({ title, product, media }) => ({
      title: title || product || 'عنصر كتالوج',
      subtitle: product ? `مرتبط بالمنتج: ${product}` : 'عنصر وصوره يديرها المحرر',
      media,
    }),
  },
})

/** Content structure for one editable, reorderable catalog page. Visual presentation is implemented separately. */
export const catalogPageBlock = defineType({
  name: 'catalogPageBlock',
  title: 'صفحة كتالوج',
  type: 'object',
  groups: [
    { name: 'content', title: 'محتوى الصفحة', default: true },
    { name: 'items', title: 'الأصناف والصور' },
    { name: 'background', title: 'الخلفية والصورة الكاملة' },
  ],
  fields: [
    defineField({
      name: 'pageType',
      title: 'نوع الصفحة',
      type: 'string',
      group: 'content',
      options: { list: catalogPageKinds, layout: 'dropdown' },
      initialValue: 'custom',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visible',
      title: 'إظهار الصفحة في الكتالوج',
      description: 'أوقفه لإخفاء الصفحة مؤقتًا مع إبقائها محفوظة وقابلة لإعادتها.',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'includeInIndex',
      title: 'إظهار هذه الصفحة في الفهرس',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'showHeading',
      title: 'إظهار العنوان النصي',
      description: 'أوقفه عند استخدام صورة تصميم كاملة تتضمن العنوان داخل الصورة.',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      title: 'عنوان الصفحة',
      type: 'localizedString',
      group: 'content',
      description: 'يظهر في رأس الصفحة، ويمكن استخدامه كاسم الصنف في الفهرس.',
    }),
    defineField({ name: 'subtitle', title: 'عنوان فرعي', type: 'localizedString', group: 'content' }),
    defineField({ name: 'description', title: 'نص تمهيدي أو وصف', type: 'localizedText', group: 'content' }),
    defineField({
      name: 'items',
      title: 'الأصناف والصور والنصوص',
      description: 'أضف من عنصر إلى أربعة عناصر في الصفحة. يمكن لكل عنصر ربطه بمنتج أو رفع صوره وكتابة النص تحته.',
      type: 'array',
      group: 'items',
      of: [defineArrayMember({ type: 'catalogPageItem' })],
      options: { layout: 'list' },
      validation: (rule) => rule.max(4).error('أضف أربعة أصناف أو أقل في الصفحة الواحدة.'),
      hidden: ({ parent }) => ['cover', 'productIndex', 'fullPageImage', 'closing'].includes(parent?.pageType),
    }),
    defineField({
      name: 'categories',
      title: 'فئات المنتجات المرتبطة',
      description: 'لإنشاء صفحة تجمع منتجات فئة محددة.',
      type: 'array',
      group: 'items',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'productCategory' }] })],
      options: { layout: 'list' },
    }),
    defineField({
      name: 'backgroundMode',
      title: 'خلفية الصفحة',
      type: 'string',
      group: 'background',
      options: {
        list: [
          { title: 'أبيض', value: 'white' },
          { title: 'صورة خلفية', value: 'image' },
        ],
        layout: 'radio',
      },
      initialValue: 'white',
      hidden: ({ parent }) => parent?.pageType === 'fullPageImage',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'صورة الخلفية',
      description: 'تظهر خلف محتوى الصفحة. يختار المحرر الصورة ويمكن استبدالها أو حذفها.',
      type: 'image',
      group: 'background',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundMode !== 'image' || parent?.pageType === 'fullPageImage',
    }),
    defineField({
      name: 'fullPageImage',
      title: 'صورة تصميم الصفحة بالكامل',
      description: 'لصفحة جاهزة التصميم: ارفع صورة واحدة وسيتم عرضها كما هي دون إضافة تصميم أو محتوى فوقها.',
      type: 'image',
      group: 'background',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'وصف الصورة لقارئ الشاشة', type: 'localizedString' })],
      hidden: ({ parent }) => parent?.pageType !== 'fullPageImage',
    }),
  ],
  preview: {
    select: { title: 'title.ar', pageType: 'pageType', visible: 'visible', media: 'fullPageImage' },
    prepare: ({ title, pageType, visible, media }) => ({
      title: title || 'صفحة جديدة',
      subtitle: `${catalogPageKinds.find((kind) => kind.value === pageType)?.title || 'صفحة محتوى عامة'}${visible === false ? ' · مخفية' : ''}`,
      media,
    }),
  },
})

export const catalogPage = defineType({
  name: 'catalogPage',
  title: 'الكتالوج وصفحاته',
  type: 'document',
  groups: [
    { name: 'general', title: 'العناوين والإصدار', default: true },
    { name: 'format', title: 'مقاس صفحات الكتالوج' },
    { name: 'pages', title: 'صفحات الكتالوج' },
    { name: 'commodities', title: 'السلع المساندة' },
    { name: 'seo', title: 'محركات البحث' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان الكتالوج',
      type: 'localizedString',
      group: 'general',
      validation: requiredTranslation,
      initialValue: { ar: 'كتالوج المنتجات الرئيسية', en: 'Wholesale Product Catalog' },
    }),
    defineField({
      name: 'subtitle',
      title: 'الوصف التمهيدي',
      type: 'localizedText',
      group: 'general',
      validation: requiredTranslation,
      initialValue: {
        ar: 'دليل أصناف شركة منافذ التوريد للمطاعم والمنشآت التجارية في المملكة العربية السعودية.',
        en: 'Mnaveth ALTourid product catalog for restaurants and commercial businesses in Saudi Arabia.',
      },
    }),
    defineField({ name: 'catalogVersion', title: 'اسم الإصدار (اختياري)', type: 'string', group: 'general' }),
    defineField({
      name: 'lastUpdated',
      title: 'تاريخ آخر تحديث (اختياري)',
      type: 'date',
      group: 'general',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'pageFormat',
      title: 'اتجاه ومقاس الصفحات',
      description: 'صفحات الكتالوج تعرض كشرائح أفقية بمقاس A4 بالعرض (297×210 مم).',
      type: 'string',
      group: 'format',
      options: {
        list: [
          { title: 'A4 بالعرض (297×210 مم)', value: 'a4Landscape' },
        ],
        layout: 'radio',
      },
      initialValue: 'a4Landscape',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pages',
      title: 'صفحات الكتالوج وترتيبها',
      description: 'أضف الصفحات واحذفها وأعد ترتيبها بالسحب. تُبنى هذه الصفحات من محتوى المنتجات الذي تديره هنا في Sanity.',
      type: 'array',
      group: 'pages',
      of: [defineArrayMember({ type: 'catalogPageBlock' })],
      options: { sortable: true },
    }),
    defineField({
      name: 'supportingCommoditiesHeading',
      title: 'عنوان السلع المساندة',
      type: 'localizedString',
      group: 'commodities',
      initialValue: { ar: 'السلع المساندة', en: 'Supporting Commodities' },
    }),
    defineField({
      name: 'supportingCommoditiesNote',
      title: 'تعريف عام بالسلع المساندة',
      description: 'اذكر توفر فئات مثل الأرز والطحين والزيوت ومواد التغليف بصورة عامة.',
      type: 'localizedText',
      group: 'commodities',
    }),
    defineField({
      name: 'supportingCommodities',
      title: 'فئات السلع المساندة',
      description: 'أضف فئات عامة مثل الأرز والطحين والزيوت والبلاستيك دون إنشاء صفحة منتج لكل صنف.',
      type: 'array',
      group: 'commodities',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'معرّف ثابت بالإنجليزية', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'name', title: 'اسم الفئة', type: 'localizedString', validation: requiredTranslation }),
            defineField({ name: 'description', title: 'وصف عام (اختياري)', type: 'localizedText' }),
            defineField({ name: 'image', title: 'صورة الفئة (اختياري)', type: 'localizedImage' }),
          ],
          preview: { select: { title: 'name.ar', subtitle: 'id', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'الكلمات المفتاحية للكتالوج',
      description: 'عبارات عربية وإنجليزية مرتبطة بتوريد اللحوم بالجملة في السعودية والمدن التي تغطيها الشركة. استخدم عبارات دقيقة فقط.',
      type: 'array',
      group: 'seo',
      of: [defineArrayMember({ type: 'localizedString' })],
    }),
    defineField({
      name: 'downloadNote',
      title: 'ملاحظة إصدار الكتالوج (اختياري)',
      type: 'localizedText',
      group: 'general',
    }),
    defineField({ name: 'seo', title: 'بيانات محركات البحث (SEO)', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title.ar', version: 'catalogVersion' },
    prepare: ({ title, version }) => ({
      title: title || 'كتالوج المنتجات',
      subtitle: version ? `الإصدار: ${version}` : 'إعدادات وصفحات الكتالوج',
    }),
  },
})

import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity'
import { displayOrderings, iconOptions, iconTitles, orderField, statusLabels, visibleField } from '../../lib/fields'
import { emailMessage, requiredTranslation } from '../../lib/localization'
import { cardPreview } from '../../lib/preview'

const iconField = defineField({
  name: 'icon',
  title: 'الأيقونة',
  type: 'string',
  options: { list: iconOptions },
  group: 'content',
})

function defineIconCard(name: string, title: string, extraFields: FieldDefinition[] = []) {
  return defineType({
    name,
    title,
    type: 'document',
    groups: [
      { name: 'content', title: 'المحتوى', default: true },
      { name: 'display', title: 'العرض' },
    ],
    fields: [
      defineField({ name: 'name', title: 'الاسم', type: 'localizedString', group: 'content', validation: requiredTranslation }),
      defineField({
        name: 'description',
        title: 'الوصف',
        type: 'localizedText',
        group: 'content',
        validation: requiredTranslation,
      }),
      iconField,
      defineField({ name: 'image', title: 'الصورة', type: 'localizedImage', group: 'content' }),
      ...extraFields,
      { ...orderField, group: 'display' },
      { ...visibleField, group: 'display' },
    ],
    orderings: displayOrderings,
    preview: cardPreview({ detail: 'icon', detailLabels: iconTitles }),
  })
}

export const service = defineIconCard('service', 'خدمة', [
  defineField({
    name: 'slug',
    title: 'المعرّف في الرابط',
    type: 'slug',
    group: 'content',
    options: { source: 'name.en', maxLength: 96 },
  }),
  defineField({ name: 'longDescription', title: 'التفاصيل الكاملة', type: 'localizedText', group: 'content' }),
  defineField({ name: 'seo', title: 'بيانات محركات البحث', type: 'seo', group: 'content' }),
  defineField({ name: 'targetPhrases', title: 'عبارات البحث المستهدفة', type: 'array', of: [defineArrayMember({ type: 'localizedString' })], group: 'content' }),
])

export const sector = defineIconCard('sector', 'قطاع')

export const stat = defineType({
  name: 'stat',
  title: 'إحصائية',
  type: 'document',
  fields: [
    defineField({
      name: 'value',
      title: 'الرقم',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({ name: 'prefix', title: 'ما قبل الرقم', description: 'اختياري، مثل «+».', type: 'string' }),
    defineField({ name: 'suffix', title: 'ما بعد الرقم', description: 'اختياري، مثل «+» أو «K».', type: 'string' }),
    defineField({ name: 'label', title: 'الوصف', type: 'localizedString', validation: requiredTranslation }),
    defineField({ name: 'icon', title: 'الأيقونة', type: 'string', options: { list: iconOptions } }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: {
    select: { value: 'value', prefix: 'prefix', suffix: 'suffix', ar: 'label.ar', en: 'label.en', visible: 'visible', order: 'order' },
    prepare: ({ value, prefix, suffix, ar, en, visible, order }) => ({
      title: `${visible === false ? '[مخفي] ' : ''}${prefix ?? ''}${value ?? '؟'}${suffix ?? ''} · ${ar || en || 'بدون وصف'}`,
      subtitle: [
        visible === false ? statusLabels.hidden : statusLabels.visible,
        ar && en ? en : undefined,
        order != null ? `الترتيب ${order}` : undefined,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

export const productCategory = defineType({
  name: 'productCategory',
  title: 'تصنيف منتجات',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'localizedString', validation: requiredTranslation }),
    defineField({
      name: 'slug',
      title: 'المعرّف في الرابط (Slug)',
      description: 'يُنشأ من الاسم الإنجليزي ويُستخدم في رابط صفحة التصنيف /products/category/[slug]',
      type: 'slug',
      options: { source: 'name.en', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'وصف التصنيف',
      description: 'وصف تعريفي يظهر في صفحة التصنيف ولأرشفة محركات البحث',
      type: 'localizedText',
    }),
    defineField({
      name: 'image',
      title: 'صورة غلاف التصنيف',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'seo',
      title: 'بيانات محركات البحث الخاصة بالتصنيف',
      type: 'seo',
    }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: cardPreview({ media: 'none' }),
})

export const product = defineType({
  name: 'product',
  title: 'منتج',
  type: 'document',
  groups: [
    { name: 'content', title: 'البيانات الأساسية', default: true },
    { name: 'specs', title: 'المواصفات والعبوات' },
    { name: 'taxonomy', title: 'التصنيف والروابط' },
    { name: 'trust', title: 'الثقة والاعتمادات' },
    { name: 'pricing', title: 'الأسعار والتوفر' },
    { name: 'seo', title: 'بيانات البحث (SEO)' },
    { name: 'display', title: 'العرض' },
  ],
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'localizedString', group: 'content', validation: requiredTranslation }),
    defineField({
      name: 'slug',
      title: 'المعرّف في الرابط (Slug)',
      description: 'يُستخدم في عنوان رابط صفحة تفاصيل المنتج /products/[slug]. يُنشأ من الاسم الإنجليزي.',
      type: 'slug',
      group: 'content',
      options: { source: 'name.en', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'رمز الصنف الفريد (SKU)',
      description: 'رمز تعريفي فريد للصنف يُستخدم في الجرد والمطابقة مع ملفات الإكسل وبيانات Schema المنظمة.',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'productType',
      title: 'نوع وفئة المنتج (Product Type)',
      description: 'يحدد قالب العرض التلقائي، والمواصفات المقترحة، وقوالب SEO.',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'لحوم حمراء ومجمدة (Meat)', value: 'meat' },
          { title: 'دواجن وطيور (Poultry)', value: 'poultry' },
          { title: 'أرز وحبوب وبقوليات (Rice & Grains)', value: 'rice' },
          { title: 'زيوت طعام ودهون تموينية (Cooking Oil)', value: 'oil' },
          { title: 'تمور وضيافة فاخرة (Dates & Hospitality)', value: 'dates' },
          { title: 'معلبات وصلصات (Canned Food)', value: 'canned' },
          { title: 'خضروات وبطاطس مجمدة (Frozen Veg)', value: 'frozenVeg' },
          { title: 'مواد تعبئة وتغليف وسفرة (Packaging)', value: 'packaging' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'الوصف المختصر',
      type: 'localizedText',
      group: 'content',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'image',
      title: 'الصورة الرئيسية',
      description: 'صورة المنتج الأساسية. الأبعاد الموصى بها: 1200×900 بكسل أو 1000×1000 بكسل بخلفية نظيفة.',
      type: 'localizedImage',
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'معرض صور المنتج الإضافية',
      description: 'صور توضيحية إضافية للمنتج وزوايا التعبئة مع نصوص بديلة (Alt Text).',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'النص البديل (Alt Text)', type: 'localizedString' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'longDescription', title: 'التفاصيل والشرح الكامل', type: 'localizedText', group: 'content' }),

    // Specs group
    defineField({
      name: 'cuts',
      title: 'جدول القطعيات والأجزاء (Cuts)',
      description: 'خاص باللحوم والدواجن: اسم القطعية، المواصفات، والاستخدام المناسب.',
      type: 'array',
      group: 'specs',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'اسم القطعية', type: 'localizedString' }),
            defineField({ name: 'description', title: 'الوصف والمواصفات', type: 'localizedText' }),
            defineField({ name: 'usage', title: 'أنسب الاستخدامات والطهي', type: 'localizedString' }),
          ],
          preview: {
            select: { ar: 'name.ar', en: 'name.en' },
            prepare: ({ ar, en }) => ({ title: ar || en || 'قطعيه' }),
          },
        }),
      ],
    }),
    defineField({
      name: 'packSizes',
      title: 'أحجام العبوات والتعبئة (Pack Sizes)',
      description: 'أوزان وعبوات التوريد بالجملة (كرتون، شوال، جالون، كجم).',
      type: 'array',
      group: 'specs',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'weight', title: 'الوزن أو السعة', type: 'number' }),
            defineField({ name: 'unit', title: 'الوحدة (كجم، لتر، جرام)', type: 'localizedString' }),
            defineField({ name: 'packageType', title: 'نوع العبوة (كرتون، شوال، تنكة)', type: 'localizedString' }),
          ],
          preview: {
            select: { weight: 'weight', unit: 'unit.ar', pkg: 'packageType.ar' },
            prepare: ({ weight, unit, pkg }) => ({
              title: `${weight ?? ''} ${unit ?? ''} · ${pkg ?? 'عبوة'}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'storageState',
      title: 'حالة التخزين والتبريد',
      type: 'string',
      group: 'specs',
      options: {
        list: [
          { title: 'مجمد (-18°C تحت الصفر)', value: 'frozen' },
          { title: 'مبرد (0°C إلى 4°C)', value: 'chilled' },
          { title: 'جاف / حرارة الغرفة (Ambient)', value: 'ambient' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'moq',
      title: 'الحد الأدنى للطلب (MOQ)',
      description: 'أقل كمية توريد بالجملة يقبلها المورد.',
      type: 'object',
      group: 'specs',
      fields: [
        defineField({ name: 'amount', title: 'الكمية', type: 'number' }),
        defineField({ name: 'unit', title: 'الوحدة (كرتون، طن، شوال)', type: 'localizedString' }),
      ],
    }),

    // Legacy fields for backward compatibility
    defineField({ name: 'origin', title: 'بلد المنشأ (نصي سابق)', type: 'localizedString', group: 'specs' }),
    defineField({ name: 'aging', title: 'مدة ودرجة التعتيق', description: 'خاص بالأرز والمنتجات المعتقة (مثل: معتق لمدة سنتين).', type: 'localizedString', group: 'specs' }),
    defineField({ name: 'grainType', title: 'نوع الحبة / القطعيات (نصي سابق)', description: 'مثل: حبة طويلة 1121 سيلا.', type: 'localizedString', group: 'specs' }),
    defineField({ name: 'packaging', title: 'التعبئة والأحجام والأوزان (نصي سابق)', type: 'localizedString', group: 'specs' }),
    defineField({ name: 'storage', title: 'تعليمات ودرجات التخزين (نصي سابق)', type: 'localizedText', group: 'specs' }),
    defineField({ name: 'usage', title: 'الاستخدامات الموصى بها', type: 'localizedText', group: 'specs' }),

    // Taxonomy group
    defineField({
      name: 'category',
      title: 'التصنيف الرئيسي',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      group: 'taxonomy',
    }),
    defineField({
      name: 'brand',
      title: 'العلامة التجارية / الماركة',
      type: 'reference',
      to: [{ type: 'brand' }],
      group: 'taxonomy',
    }),
    defineField({
      name: 'originCountries',
      title: 'دول المنشأ',
      type: 'array',
      group: 'taxonomy',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'country' }] })],
    }),
    defineField({
      name: 'serviceAreas',
      title: 'مناطق ومدن التوريد والتسليم',
      description: 'المدن التي يشملها توريد هذا الصنف (مثل: الرياض، جدة، مكة، الدمام).',
      type: 'array',
      group: 'taxonomy',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'city' }] })],
    }),
    defineField({
      name: 'sectors',
      title: 'القطاعات المستهدفة',
      description: 'المطاعم، الفنادق، مطابخ الإعاشة، الكافيهات...',
      type: 'array',
      group: 'taxonomy',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'sector' }] })],
    }),

    // Trust group
    defineField({
      name: 'certificates',
      title: 'الشهادات والاعتمادات الرسمية المرفقة',
      description: 'شهادات حلال، اعتماد هيئة الغذاء والدواء SFDA، شهادات الجودة والمطابقة.',
      type: 'array',
      group: 'trust',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'certificate' }] })],
    }),
    defineField({ name: 'certifications', title: 'الشهادات والاعتمادات الرسمية (نصي سابق)', type: 'localizedText', group: 'trust' }),

    // Pricing group
    defineField({
      name: 'availability',
      title: 'حالة التوفر (Availability)',
      type: 'string',
      group: 'pricing',
      options: {
        list: [
          { title: 'متوفر وجاهز للتوريد الفوري (In Stock)', value: 'InStock' },
          { title: 'طلب مسبق وحجز كميات (Pre Order)', value: 'PreOrder' },
          { title: 'نفد من المستودعات مؤقتاً (Out Of Stock)', value: 'OutOfStock' },
        ],
      },
      initialValue: 'InStock',
    }),
    defineField({
      name: 'priceValidUntil',
      title: 'صلاحية السعر حتى تاريخ',
      type: 'date',
      group: 'pricing',
    }),
    defineField({
      name: 'showPrice',
      title: 'إظهار السعر في الموقع',
      description: 'أوقفه ليظهر «السعر عند الطلب» بدل أي سعر مكتوب أدناه.',
      type: 'boolean',
      initialValue: false,
      group: 'pricing',
    }),
    defineField({
      name: 'price',
      title: 'سعر واحد',
      description: 'اختياري. يُستخدم عندما لا توجد أسعار حسب الكمية.',
      type: 'unitPrice',
      group: 'pricing',
    }),
    defineField({
      name: 'priceTiers',
      title: 'أسعار حسب الكمية',
      description: 'عند إضافتها تظهر بدل السعر الواحد.',
      type: 'array',
      of: [defineArrayMember({ type: 'priceTier' })],
      group: 'pricing',
    }),

    // SEO group
    defineField({
      name: 'seo',
      title: 'تجاوز يدوي لبيانات محركات البحث (SEO Override)',
      description: 'اختياري. اتركه فارغاً ليعمل محرك SEO التلقائي بتوليد العنوان والوصف وقوالب الميتا.',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'targetPhrases',
      title: 'عبارات البحث المستهدفة',
      description: 'عبارات تساعد المحرر على تضمين نية البحث في وصف المنتج ومقالاته.',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedString' })],
      group: 'seo',
    }),
    defineField({
      name: 'faqs',
      title: 'الأسئلة الشائعة الخاصة بالمنتج (Product FAQs)',
      description: 'أسئلة خاصة بالصنف تظهر في صفحته وتساعد المشتري (الحد الأدنى، مواعيد التوريد، التعبئة).',
      type: 'array',
      group: 'seo',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'السؤال', type: 'localizedString' }),
            defineField({ name: 'answer', title: 'الإجابة', type: 'localizedText' }),
          ],
          preview: {
            select: { q: 'question.ar' },
            prepare: ({ q }) => ({ title: q || 'سؤال' }),
          },
        }),
      ],
    }),

    // Display group
    defineField({
      name: 'featured',
      title: 'منتج مميز',
      description: 'المنتجات المميزة يمكن أن تظهر في الصفحة الرئيسية (يظهر منها ثلاثة).',
      type: 'boolean',
      initialValue: false,
      group: 'display',
    }),
    { ...orderField, group: 'display' },
    { ...visibleField, group: 'display' },
  ],
  orderings: displayOrderings,
  preview: cardPreview({ detail: 'category.name.ar', detailFallback: 'category.name.en' }),
})

export const place = defineType({
  name: 'place',
  title: 'فرع أو مستودع',
  type: 'document',
  groups: [
    { name: 'content', title: 'التفاصيل', default: true },
    { name: 'location', title: 'الموقع' },
    { name: 'contact', title: 'التواصل' },
    { name: 'display', title: 'العرض' },
  ],
  fields: [
    defineField({
      name: 'kind',
      title: 'النوع',
      type: 'string',
      options: {
        list: [
          { title: 'فرع', value: 'branch' },
          { title: 'مستودع', value: 'warehouse' },
        ],
        layout: 'radio',
      },
      initialValue: 'branch',
      group: 'content',
    }),
    defineField({ name: 'name', title: 'الاسم', type: 'localizedString', group: 'content', validation: requiredTranslation }),
    defineField({ name: 'description', title: 'الوصف', type: 'localizedText', group: 'content' }),
    defineField({
      name: 'mediaType',
      title: 'نوع الوسائط (Media Type)',
      description: 'اختر صورة فوتوغرافية لواجهة الفرع أو فيديو جولة تصويرية داخل الفرع والمستودع.',
      type: 'string',
      options: {
        list: [
          { title: 'صورة واجهة (Image)', value: 'image' },
          { title: 'فيديو جولة تصويرية (Video)', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'صورة الواجهة',
      description: 'صورة واجهة الفرع أو المستودع. القياسات المثالية: للواجهات المرتفعة والمربعة (مثل الفرع الرئيسي بالرياض) 1200×1200 بكسل (1:1)، وللواجهات العرضية والمستودعات 1600×900 أو 1600×1000 بكسل (16:9 / 16:10). يدعم Hotspot للتحكم بمركز التركيز.',
      type: 'localizedImage',
      group: 'content',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'videoFile',
      title: 'ملف الفيديو (Video File)',
      description: 'ارفع ملف فيديو للفرع أو المستودع (صيغة MP4 أو WebM، دقة 1080p أو 720p، ويُفضل ألا يتجاوز 30 ميغابايت لتسريع التحميل).',
      type: 'file',
      options: { accept: 'video/*' },
      group: 'content',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'رابط الفيديو المباشر (Video URL)',
      description: 'يمكنك وضع رابط مباشر لملف فيديو MP4 أو رابط فيديو خارجي (YouTube / Vimeo).',
      type: 'url',
      group: 'content',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoPoster',
      title: 'صورة غلاف الفيديو (Poster)',
      description: 'تظهر كصورة غلاف قبل تشغيل الفيديو (الأبعاد الموصى بها: 1600×900 أو 1200×1200 بكسل).',
      type: 'localizedImage',
      group: 'content',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'نسبة أبعاد بطاقة الفرع (Aspect Ratio)',
      description: 'تحكم في شكل البطاقة: (1:1 مربعة كاملة - موصى به لواجهة الرياض لإظهار اللوحة والمدخل كاملين 100% بدون أي قص)، (4:3 واجهة عميقة)، (16:10 مستطيل عرضي كلاسيكي)، (16:9 سينمائي للفيديوهات والمستودعات).',
      type: 'string',
      options: {
        list: [
          { title: 'مربعة كاملة (1:1) - موصى به لواجهة الرياض لإظهار اللوحة والمدخل كاملين 100%', value: '1/1' },
          { title: 'واجهة عميقة (4:3) - لواجهات المحلات واللوحات المرتفعة', value: '4/3' },
          { title: 'مستطيل عرضي كلاسيكي (16:10)', value: '16/10' },
          { title: 'أفقي سينمائي (16:9) - ممتاز للفيديوهات والمستودعات العريضة', value: '16/9' },
        ],
        layout: 'radio',
      },
      initialValue: '1/1',
      group: 'content',
    }),
    defineField({
      name: 'imageFit',
      title: 'نمط ملء الصورة في البطاقة (Fit Mode)',
      description: '«تغطية متناسقة (Cover)» تملأ إطار البطاقة بالكامل، أو «احتواء كامل (Contain)» تعرض الصورة كاملة 100% دون اقتطاع أي بكسل مع خلفية ضبابية فخمة.',
      type: 'string',
      options: {
        list: [
          { title: 'تغطية متناسقة للإطار (Cover) - الافتراضي', value: 'cover' },
          { title: 'احتواء كامل بدون أي قص (Contain) - تظهر الصورة 100% كاملة', value: 'contain' },
        ],
        layout: 'radio',
      },
      initialValue: 'cover',
      group: 'content',
    }),
    defineField({
      name: 'imagePosition',
      title: 'محاذاة وتركيز الصورة (Focal Position)',
      description: 'يحدد أي جزء يتم تثبيته: «أعلى الصورة» يضمن ثبات لوحة المحل والاسم التجاري دائماً، «المنتصف» يركز على الواجهة، «الأسفل» يركز على المدخل.',
      type: 'string',
      options: {
        list: [
          { title: 'أعلى الصورة (Top) - تثبيت لوحة المحل والاسم التجاري', value: 'top' },
          { title: 'منتصف الصورة (Center)', value: 'center' },
          { title: 'أسفل الصورة (Bottom)', value: 'bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'top',
      group: 'content',
    }),
    defineField({ name: 'city', title: 'المدينة', type: 'localizedString', group: 'location' }),
    defineField({
      name: 'address',
      title: 'العنوان',
      description: 'اكتب العنوان فقط بعد التأكد منه.',
      type: 'localizedText',
      group: 'location',
    }),
    defineField({
      name: 'mapUrl',
      title: 'رابط خرائط Google',
      description: 'رابط منسوخ من خرائط Google (مشاركة ثم نسخ الرابط).',
      type: 'url',
      group: 'location',
      validation: (rule) => rule.uri({ scheme: ['https', 'http'] }),
    }),
    defineField({
      name: 'reviewUrl',
      title: 'رابط التقييم المباشر على Google Maps',
      description: 'رابط مباشر يفتح نافذة كتابة التقييم والـ 5 نجوم للعملاء على Google Business مباشرة.',
      type: 'url',
      group: 'location',
      validation: (rule) => rule.uri({ scheme: ['https', 'http'] }),
    }),
    defineField({
      name: 'mapQuery',
      title: 'نص الموقع أو الإحداثيات',
      description: 'يُستخدم عند عدم وجود رابط خريطة، مثل اسم المكان أو «24.7136,46.6753».',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'phone',
      title: 'الهاتف',
      description: 'اتركه فارغًا حتى يتوفر الرقم.',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.custom(emailMessage).warning(),
    }),
    defineField({
      name: 'manager',
      title: 'المسؤول',
      description: 'الموظف المسؤول عن هذا المكان، ويُستخدم غالبًا للمستودعات.',
      type: 'contactPerson',
      group: 'contact',
    }),
    { ...orderField, group: 'display' },
    { ...visibleField, group: 'display' },
  ],
  orderings: displayOrderings,
  preview: cardPreview({ detail: 'kind', detailLabels: { branch: 'فرع', warehouse: 'مستودع' } }),
})

import { defineField, defineType } from 'sanity'
import { phoneNumberMessage, requiredTranslation } from '../../lib/localization'

const addressDescription =
  'مسار صفحة مثل /products، أو رابط داخل الصفحة مثل /#contact، أو رابط كامل يبدأ بـ https://'

export const seoFields = [
  defineField({
    name: 'title',
    title: 'عنوان الصفحة',
    description: 'يظهر في تبويب المتصفح ونتائج البحث. الأفضل أن يكون حوالي 60 حرفًا.',
    type: 'localizedString',
  }),
  defineField({
    name: 'description',
    title: 'الوصف',
    description: 'ملخص يظهر في نتائج البحث. الأفضل أن يكون حوالي 155 حرفًا.',
    type: 'localizedText',
  }),
  defineField({
    name: 'shareImage',
    title: 'صورة المشاركة',
    description: 'تظهر عند مشاركة الصفحة في شبكات التواصل. المقاس المقترح 1200 × 630.',
    type: 'localizedImage',
  }),
]

export const seo = defineType({
  name: 'seo',
  title: 'بيانات محركات البحث',
  type: 'object',
  fields: seoFields,
})

export const link = defineType({
  name: 'link',
  title: 'رابط',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'نص الرابط', type: 'localizedString', validation: requiredTranslation }),
    defineField({ name: 'href', title: 'العنوان', description: addressDescription, type: 'string' }),
  ],
  preview: {
    select: { ar: 'label.ar', en: 'label.en', href: 'href' },
    prepare: ({ ar, en, href }) => ({ title: ar || en || 'رابط بدون نص', subtitle: href }),
  },
})

const buttonStyleLabels: Record<string, string> = { primary: 'أساسي', secondary: 'ثانوي' }

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'زر',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'نص الزر', type: 'localizedString', validation: requiredTranslation }),
    defineField({ name: 'href', title: 'العنوان', description: addressDescription, type: 'string' }),
    defineField({
      name: 'style',
      title: 'شكل الزر',
      type: 'string',
      options: {
        list: [
          { title: 'أساسي', value: 'primary' },
          { title: 'ثانوي', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { ar: 'label.ar', en: 'label.en', href: 'href', style: 'style' },
    prepare: ({ ar, en, href, style }) => ({
      title: ar || en || 'زر بدون نص',
      subtitle: [buttonStyleLabels[style] ?? style, href].filter(Boolean).join(' · '),
    }),
  },
})

const platforms = [
  { title: 'فيسبوك', value: 'facebook' },
  { title: 'إنستغرام', value: 'instagram' },
  { title: 'منصة X', value: 'x' },
  { title: 'لينكدإن', value: 'linkedin' },
  { title: 'يوتيوب', value: 'youtube' },
  { title: 'تيك توك', value: 'tiktok' },
  { title: 'سناب شات', value: 'snapchat' },
  { title: 'تيليجرام', value: 'telegram' },
  { title: 'أخرى', value: 'other' },
]

export const socialLink = defineType({
  name: 'socialLink',
  title: 'رابط تواصل اجتماعي',
  type: 'object',
  fields: [
    defineField({ name: 'platform', title: 'المنصة', type: 'string', options: { list: platforms } }),
    defineField({
      name: 'url',
      title: 'الرابط',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https', 'http'] }),
    }),
  ],
  preview: {
    select: { platform: 'platform', url: 'url' },
    prepare: ({ platform, url }) => ({
      title: platforms.find((item) => item.value === platform)?.title ?? 'رابط تواصل اجتماعي',
      subtitle: url,
    }),
  },
})

export const contactPerson = defineType({
  name: 'contactPerson',
  title: 'المسؤول',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'localizedString' }),
    defineField({
      name: 'phone',
      title: 'الهاتف',
      description: 'اتركه فارغًا حتى يتوفر الرقم.',
      type: 'string',
    }),
  ],
  preview: {
    select: { ar: 'name.ar', en: 'name.en', phone: 'phone' },
    prepare: ({ ar, en, phone }) => ({ title: ar || en || 'المسؤول', subtitle: phone }),
  },
})

export const whatsappChannel = defineType({
  name: 'whatsappChannel',
  title: 'قناة واتساب',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'الاسم',
      description: 'الاسم الكامل للقناة، مثال: «واتساب: طلب عرض سعر».',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'shortLabel',
      title: 'الاسم المختصر',
      description: 'نص قصير على الزر العائم، مثال: «عروض الأسعار».',
      type: 'localizedString',
    }),
    defineField({
      name: 'purpose',
      title: 'الغرض',
      description: 'ملاحظة داخلية توضح فيمَ يُستخدم هذا الرقم.',
      type: 'localizedText',
    }),
    defineField({
      name: 'message',
      title: 'الرسالة الجاهزة',
      description: 'النص الذي يظهر جاهزًا للإرسال عندما يفتح الزائر المحادثة.',
      type: 'localizedText',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'number',
      title: 'الرقم',
      description:
        'بالصيغة الدولية وبالأرقام فقط، مثال: 9665XXXXXXXX. اتركه فارغًا حتى يزوّدك المالك بالرقم؛ سيبقى الزر معطّلًا.',
      type: 'string',
      validation: (rule) => rule.custom(phoneNumberMessage).warning(),
    }),
    defineField({ name: 'visible', title: 'ظاهر في الموقع', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { ar: 'name.ar', en: 'name.en', number: 'number', visible: 'visible' },
    prepare: ({ ar, en, number, visible }) => ({
      title: ar || en || 'قناة واتساب',
      subtitle: [visible === false ? 'مخفي' : 'ظاهر', number || 'لا يوجد رقم بعد'].join(' · '),
    }),
  },
})

export const unitPrice = defineType({
  name: 'unitPrice',
  title: 'السعر',
  type: 'object',
  fields: [
    defineField({ name: 'amount', title: 'السعر', type: 'number', validation: (rule) => rule.min(0) }),
    defineField({
      name: 'unit',
      title: 'وحدة البيع',
      description: 'مثال: «للكرتون» أو «للكيلو».',
      type: 'localizedString',
    }),
  ],
  preview: {
    select: { amount: 'amount', ar: 'unit.ar', en: 'unit.en' },
    prepare: ({ amount, ar, en }) => ({ title: amount != null ? String(amount) : 'بدون سعر', subtitle: ar || en }),
  },
})

export const priceTier = defineType({
  name: 'priceTier',
  title: 'سعر حسب الكمية',
  type: 'object',
  fields: [
    defineField({ name: 'minQuantity', title: 'أقل كمية', type: 'number', validation: (rule) => rule.min(0) }),
    defineField({
      name: 'maxQuantity',
      title: 'أكبر كمية',
      description: 'اختياري. اتركه فارغًا لتعني «وما فوق».',
      type: 'number',
      validation: (rule) =>
        rule.min(0).custom((value, context) => {
          const min = (context.parent as { minQuantity?: number } | undefined)?.minQuantity
          return value != null && min != null && value < min ? 'أكبر كمية يجب ألا تكون أقل من أقل كمية.' : true
        }),
    }),
    defineField({
      name: 'unit',
      title: 'وحدة البيع',
      description: 'مثال: «كرتون» أو «كيلو».',
      type: 'localizedString',
    }),
    defineField({ name: 'price', title: 'السعر', type: 'number', validation: (rule) => rule.min(0) }),
    defineField({
      name: 'label',
      title: 'نص مخصص',
      description: 'اختياري. يستبدل النص الذي يُنشأ تلقائيًا من الكميات.',
      type: 'localizedString',
    }),
  ],
  preview: {
    select: { min: 'minQuantity', max: 'maxQuantity', price: 'price', ar: 'unit.ar', en: 'unit.en' },
    prepare: ({ min, max, price, ar, en }) => ({
      title: `${min ?? '؟'}${max != null ? `–${max}` : '+'} ${ar || en || ''}`.trim(),
      subtitle: price != null ? `السعر: ${price}` : 'بدون سعر بعد',
    }),
  },
})

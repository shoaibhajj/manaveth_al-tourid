import { defineArrayMember, defineField, defineType } from 'sanity'
import { requiredTranslation } from '../../lib/localization'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'صفحات الهبوط المخصصة (Landing Pages)',
  type: 'document',
  initialValue: () => ({
    title: {
      _type: 'localizedString',
      ar: 'توريد اللحوم المجمدة بالجملة للمطاعم والفنادق | منافذ التوريد',
      en: 'Wholesale Frozen Meat & Poultry Supply in Saudi Arabia | Mnaveth ALTourid',
    },
    slug: {
      _type: 'slug',
      current: 'meat-supply',
    },
    h1: {
      _type: 'localizedString',
      ar: 'توريد اللحوم المجمدة والدواجن بالجملة لكبرى المطاعم والإعاشة',
      en: 'Wholesale Frozen Meat & Poultry Supply for Catering & Restaurants',
    },
    eyebrow: {
      _type: 'localizedString',
      ar: 'أصناف لحوم مختارة للبيع بالجملة',
      en: 'Selected meat specialties for wholesale',
    },
    intro: {
      _type: 'localizedText',
      ar: 'شركة منافذ التوريد متخصصة في توريد اللحوم بالجملة للمطاعم والفنادق ومطابخ الإعاشة في المملكة العربية السعودية.',
      en: 'Mnaveth ALTourid specializes in wholesale meat supply for restaurants, hotels, and catering kitchens across Saudi Arabia.',
    },
    coreSpecialties: [
      { _type: 'localizedString', ar: 'كبدة Classic', en: 'Classic liver' },
      { _type: 'localizedString', ar: 'كبدة Johny Gold', en: 'Johny Gold liver' },
      { _type: 'localizedString', ar: 'مخ', en: 'Brain' },
      { _type: 'localizedString', ar: 'لسان', en: 'Tongue' },
      { _type: 'localizedString', ar: 'ريش', en: 'Ribs' },
    ],
  }),
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان الصفحة (SEO Title)',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'slug',
      title: 'المعرّف في الرابط (Slug)',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'h1',
      title: 'الترويسة الرئيسية (H1)',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'eyebrow',
      title: 'النص التعريفي الصغير (Eyebrow)',
      type: 'localizedString',
    }),
    defineField({
      name: 'intro',
      title: 'المقدمة التعريفية التوريدية (ماذا، لمن، أين، الشروط)',
      description: 'اكتب الأصناف الرئيسية والقطاعات المستهدفة ونطاق التغطية المعتمد.',
      type: 'localizedText',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'serviceCoverage',
      title: 'مدن ونطاق التغطية',
      description: 'اذكر المدن الرئيسية المشمولة، ووضّح أن المناطق الأبعد تخدم للطلبات أو الكميات الكبيرة بعد التنسيق.',
      type: 'localizedText',
    }),
    defineField({
      name: 'coreSpecialties',
      title: 'الأصناف الرئيسية التي تركز عليها الشركة',
      description: 'أضف أو أعد ترتيب الأصناف الرئيسية المعروضة في صفحة توريد اللحوم.',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedString' })],
    }),
    defineField({
      name: 'orderSteps',
      title: 'آلية الطلب والتعاقد (Order Mechanism)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'step', title: 'رقم الخطوة', type: 'number' }),
            defineField({ name: 'title', title: 'عنوان الخطوة', type: 'localizedString' }),
            defineField({ name: 'description', title: 'شرح الخطوة', type: 'localizedText' }),
          ],
          preview: {
            select: {
              step: 'step',
              title: 'title.ar',
            },
            prepare: ({ step, title }) => ({
              title: `${step ? `خطوة ${step}: ` : ''}${title || 'بدون عنوان'}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'الأسئلة الشائعة (FAQs)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'السؤال', type: 'localizedString' }),
            defineField({ name: 'answer', title: 'الإجابة', type: 'localizedText' }),
          ],
          preview: {
            select: {
              title: 'question.ar',
            },
            prepare: ({ title }) => ({
              title: title || 'سؤال شائع',
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'sectors',
      title: 'القطاعات المرتبطة (Sectors)',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'sector' }] })],
    }),
    defineField({
      name: 'certificates',
      title: 'الشهادات والاعتمادات ذات الصلة',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'certificate' }] })],
    }),
    defineField({
      name: 'seo',
      title: 'إعدادات محركات البحث المتقدمة (SEO)',
      type: 'seo',
    }),
    defineField({
      name: 'targetPhrases',
      title: 'عبارات البحث المستهدفة',
      description: 'عبارات طبيعية مرتبطة بتوريد اللحوم في السعودية والمدن التي تخدمها الشركة.',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedString' })],
    }),
  ],
  preview: {
    select: {
      ar: 'title.ar',
      en: 'title.en',
      slug: 'slug.current',
    },
    prepare: ({ ar, en, slug }) => ({
      title: ar || en || 'صفحة هبوط',
      subtitle: `/${slug || ''}`,
    }),
  },
})

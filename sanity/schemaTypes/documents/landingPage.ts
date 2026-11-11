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
      ar: 'اعتماد الغذاء والدواء SFDA · ذبح حلال 100% · توريد مبرد ومجمد',
      en: 'SFDA Approved · 100% Halal Slaughter · Cold Chain Logistics',
    },
    intro: {
      _type: 'localizedText',
      ar: 'شركة منافذ التوريد للتجارة شريكك المعتمد في استيراد وتوريد اللحوم البقرية ولحوم الضأن والكبدة المجمدة وقطعيات الدواجن الفاخرة مباشرة من كبرى المسالخ المعتمدة في البرازيل والهند، مع الالتزام التام بالمواصفات القياسية السعودية وتأمين الفنادق والمطاعم ومطابخ الإعاشة.',
      en: 'Mnaveth ALTourid is your certified partner for importing and supplying bulk frozen beef, mutton, beef liver, and poultry cuts directly from SFDA-approved abattoirs in Brazil and India to restaurants, hotels, and institutional caterers.',
    },
    minOrderText: {
      _type: 'localizedString',
      ar: 'الحد الأدنى للطلب: 50 كرتون أو 1 طن مع عقود توريد دورية ميسرة',
      en: 'MOQ: 50 Master Cartons or 1 Ton with Scheduled Contract Deliveries',
    },
    whatsappButtonText: {
      _type: 'localizedString',
      ar: 'طلب تسعير توريد اللحوم الفوري',
      en: 'Request Instant Meat Supply Quote',
    },
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
      description: 'إجابة واضحة ومباشرة عن المنتجات الموردة، القطاعات المستهدفة، التغطية الجغرافية، والحد الأدنى للطلب',
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
      name: 'minOrderText',
      title: 'نص الحد الأدنى للطلب (MOQ)',
      description: 'مثال: الحد الأدنى للتوريد 50 كرتون أو 1 طن مع جدولة عقود شهرية وسنوية',
      type: 'localizedString',
    }),
    defineField({
      name: 'whatsappButtonText',
      title: 'نص زر الواتساب المباشر',
      type: 'localizedString',
    }),
    defineField({
      name: 'whatsappPrefill',
      title: 'الرسالة الافتراضية للواتساب',
      type: 'localizedString',
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

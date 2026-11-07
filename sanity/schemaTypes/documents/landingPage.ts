import { defineArrayMember, defineField, defineType } from 'sanity'
import { requiredTranslation } from '../../lib/localization'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'صفحات الهبوط المخصصة (Landing Pages)',
  type: 'document',
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

import { defineArrayMember, defineField, defineType } from 'sanity'
import { requiredTranslation } from '../../lib/localization'

export const brand = defineType({
  name: 'brand',
  title: 'علامة تجارية / ماركة',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم العلامة التجارية',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'slug',
      title: 'المعرّف في الرابط (Slug)',
      type: 'slug',
      options: { source: 'name.en', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'شعار العلامة التجارية',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'نبذة عن العلامة التجارية',
      type: 'localizedText',
    }),
    defineField({
      name: 'website',
      title: 'الموقع الرسمي للعلامة',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      ar: 'name.ar',
      en: 'name.en',
      media: 'logo',
    },
    prepare: ({ ar, en, media }) => ({
      title: ar || en || 'بدون اسم',
      subtitle: ar && en ? en : undefined,
      media,
    }),
  },
})

export const country = defineType({
  name: 'country',
  title: 'دولة / بلد المنشأ',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم الدولة',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'code',
      title: 'رمز الدولة (ISO Code)',
      description: 'مثال: SA, BR, IN, AU, EG',
      type: 'string',
      validation: (rule) => rule.max(3).uppercase(),
    }),
    defineField({
      name: 'flag',
      title: 'رمز العلم (Emoji أو رمز)',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      ar: 'name.ar',
      en: 'name.en',
      code: 'code',
      flag: 'flag',
    },
    prepare: ({ ar, en, code, flag }) => ({
      title: `${flag ? flag + ' ' : ''}${ar || en || 'دولة'}`,
      subtitle: [en, code].filter(Boolean).join(' · '),
    }),
  },
})

export const city = defineType({
  name: 'city',
  title: 'مدينة / منطقة خدمة',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم المدينة',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'slug',
      title: 'المعرّف في الرابط (Slug)',
      type: 'slug',
      options: { source: 'name.en', maxLength: 96 },
    }),
    defineField({
      name: 'region',
      title: 'المنطقة الإدارية',
      description: 'مثال: منطقة الرياض، منطقة مكة المكرمة، المنطقة الشرقية',
      type: 'localizedString',
    }),
    defineField({
      name: 'isSupplyConfirmed',
      title: 'التوريد مؤكد إلى المدينة',
      description: 'شرط النشر: يجب تفعيل هذا الحقل مع توفر 3 عناصر فعلية على الأقل لإنشاء صفحة المدينة',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'coveredDistricts',
      title: 'الأحياء والمناطق المغطاة',
      description: 'اكتب نطاق التغطية المعتمد. لا تذكر أحياء إلا بعد تأكيد تغطيتها.',
      type: 'localizedText',
    }),
    defineField({
      name: 'deliveryTime',
      title: 'موعد التوصيل والتنسيق',
      description: 'أضف مواعيد دقيقة عند اعتمادها؛ يمكن كتابة أن الموعد يحدد عند تأكيد الطلب.',
      type: 'localizedString',
    }),
    defineField({
      name: 'minOrder',
      title: 'الحد الأدنى للطلب (MOQ)',
      description: 'أضف حدًا رقميًا عند اعتماده؛ وإلا اذكر أن الحد يحدد بحسب الصنف والكمية.',
      type: 'localizedString',
    }),
    defineField({
      name: 'pickupPoint',
      title: 'نقطة أو طريقة الاستلام',
      description: 'أدخل عنوانًا معتمدًا فقط، أو اذكر أن التنسيق يتم مباشرة مع الشركة.',
      type: 'localizedString',
    }),
    defineField({
      name: 'coldChainFacility',
      title: 'تفاصيل الحفظ والنقل',
      description: 'لا تذكر ترخيصًا أو درجة حرارة إلا إذا كانت موثقة ومعتمدة.',
      type: 'localizedString',
    }),
    defineField({
      name: 'faqs',
      title: 'الأسئلة الشائعة عن التوريد في المدينة',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'السؤال', type: 'localizedString' }),
            defineField({ name: 'answer', title: 'الإجابة', type: 'localizedText' }),
          ],
          preview: {
            select: { question: 'question.ar' },
            prepare: ({ question }) => ({ title: question || 'سؤال شائع' }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      ar: 'name.ar',
      en: 'name.en',
      region: 'region.ar',
    },
    prepare: ({ ar, en, region }) => ({
      title: ar || en || 'مدينة',
      subtitle: [en, region].filter(Boolean).join(' · '),
    }),
  },
})

export const certificate = defineType({
  name: 'certificate',
  title: 'شهادة واعتماد جودة',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم الشهادة / الاعتماد',
      description: 'مثال: شهادة الذبح الحلال، اعتماد الهيئة العامة للغذاء والدواء SFDA، شهادة ISO 22000 سلامة الغذاء',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'issuer',
      title: 'الجهة المانحة للاعتماد',
      type: 'localizedString',
    }),
    defineField({
      name: 'description',
      title: 'وصف الشهادة أو الوثيقة',
      type: 'localizedText',
    }),
    defineField({
      name: 'category',
      title: 'نوع الوثيقة',
      type: 'string',
      options: { list: [{ title: 'تنظيمية', value: 'regulatory' }, { title: 'جودة', value: 'quality' }] },
    }),
    defineField({
      name: 'validUntil',
      title: 'تاريخ سريان الصلاحية',
      type: 'date',
    }),
    defineField({
      name: 'file',
      title: 'ملف أو وثيقة الاعتماد',
      type: 'file',
    }),
  ],
  preview: {
    select: {
      ar: 'name.ar',
      en: 'name.en',
      issuer: 'issuer.ar',
    },
    prepare: ({ ar, en, issuer }) => ({
      title: ar || en || 'شهادة واعتماد',
      subtitle: [en, issuer ? `الجهة: ${issuer}` : undefined].filter(Boolean).join(' · '),
    }),
  },
})

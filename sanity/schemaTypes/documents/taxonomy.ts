import { defineField, defineType } from 'sanity'
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
      initialValue: true,
    }),
    defineField({
      name: 'coveredDistricts',
      title: 'الأحياء والمناطق المغطاة',
      description: 'قائمة الأحياء الصناعية والتجارية المخدومة بالشاحنات المبردة',
      type: 'localizedText',
    }),
    defineField({
      name: 'deliveryTime',
      title: 'زمن التوصيل وجدولة الشحن المبرد',
      description: 'مثال: توصيل يومي صباحي بين 4:00 إلى 8:00 صباحاً للمطابخ والفنادق',
      type: 'localizedString',
    }),
    defineField({
      name: 'minOrder',
      title: 'الحد الأدنى للطلب (MOQ)',
      description: 'مثال: 30 كرتون للحوم المجمدة أو 500 كجم إجمالي توريد',
      type: 'localizedString',
    }),
    defineField({
      name: 'pickupPoint',
      title: 'نقطة أو مستودع الاستلام الفوري',
      description: 'عنوان مستودع الشركة المعتمد في المدينة',
      type: 'localizedString',
    }),
    defineField({
      name: 'coldChainFacility',
      title: 'مستودع التبريد والتخزين المرخص',
      description: 'ترخيص الهيئة العامة للغذاء والدواء SFDA',
      type: 'localizedString',
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

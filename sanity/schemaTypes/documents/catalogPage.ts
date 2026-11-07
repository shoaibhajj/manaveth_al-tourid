import { defineArrayMember, defineField, defineType } from 'sanity'
import { requiredTranslation } from '../../lib/localization'

export const catalogPage = defineType({
  name: 'catalogPage',
  title: 'صفحة الكتالوج ودليل الأصناف (PDF)',
  type: 'document',
  groups: [
    { name: 'general', title: 'العناوين والنصوص', default: true },
    { name: 'pdf', title: 'ملف الـ PDF والتنزيل' },
    { name: 'features', title: 'مميزات التوريد' },
    { name: 'seo', title: 'محركات البحث' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان الكتالوج',
      type: 'localizedString',
      group: 'general',
      validation: requiredTranslation,
      initialValue: {
        ar: 'كتالوج الأصناف والمنتجات التموينية',
        en: 'Wholesale Foodservice Product Catalog',
      },
    }),
    defineField({
      name: 'subtitle',
      title: 'الوصف التمهيدي',
      type: 'localizedText',
      group: 'general',
      validation: requiredTranslation,
      initialValue: {
        ar: 'الدليل المعتمد للأصناف والمواد الغذائية التموينية لكبرى المطاعم، الفنادق، ومطابخ الإعاشة في المملكة العربية السعودية.',
        en: 'Official certified catalog of wholesale foodservice ingredients and staples for restaurants, hotels, and central catering kitchens across Saudi Arabia.',
      },
    }),
    defineField({
      name: 'catalogVersion',
      title: 'رقم / اسم الإصدار',
      description: 'يظهر في أعلى الكتالوج وعند التنزيل (مثال: الإصدار 2025.1 أو ربيع الأول 1446هـ).',
      type: 'string',
      group: 'general',
      initialValue: '2025.1',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'تاريخ آخر تحديث',
      description: 'تاريخ تحديث الكتالوج وقائمة الأصناف.',
      type: 'date',
      group: 'general',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'bannerAlert',
      title: 'شريط التنبيه التمويني',
      description: 'ملاحظة تظهر في رأس الصفحة حول العقود والتسعير.',
      type: 'localizedString',
      group: 'general',
      initialValue: {
        ar: 'الأسعار خاضعة لحجم الكميات وعقود التوريد الدورية · إمكانية توفير عينات للمطابخ المركزية والفنادق',
        en: 'Volume-based pricing and commercial catering contracts · Sample testing available for central commissaries',
      },
    }),
    defineField({
      name: 'pdfFile',
      title: 'ملف الكتالوج الرسمي المعتمد (PDF)',
      description: 'ارفع هنا ملف الكتالوج المطبوع بصيغة PDF. عند رفعه، سيتمكن زوار الموقع من تنزيله مباشرة بنقرة زر واحدة.',
      type: 'file',
      group: 'pdf',
      options: {
        accept: 'application/pdf',
      },
    }),
    defineField({
      name: 'externalPdfUrl',
      title: 'رابط خارجي لملف الـ PDF (اختياري)',
      description: 'إذا كان ملف الـ PDF مرفوعاً على Google Drive أو خادم خارجي، يمكنك وضع رابطه المباشر هنا.',
      type: 'url',
      group: 'pdf',
    }),
    defineField({
      name: 'downloadNote',
      title: 'ملاحظة التنزيل والتحديث',
      type: 'localizedText',
      group: 'pdf',
      initialValue: {
        ar: 'يتم تحديث هذا الكتالوج بصورة دورية كلما تمت إضافة أصناف أو تحديث مواصفات التوريد. يمكنك دائماً زيارة الرابط الإلكتروني للحصول على النسخة الأحدث.',
        en: 'This catalog is regularly updated as new products and specifications are introduced. You can always visit the live web link for the latest edition.',
      },
    }),
    defineField({
      name: 'inquiryWhatsApp',
      title: 'رقم واتساب المبيعات المباشرة',
      description: 'الرقم المخصص لتلقي استفسارات التسعير وطلبات الكتالوج (مثال: 966509971699).',
      type: 'string',
      group: 'general',
      initialValue: '966509971699',
    }),
    defineField({
      name: 'highlights',
      title: 'ركائز ومميزات التوريد',
      type: 'array',
      group: 'features',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'العنوان', type: 'localizedString' }),
            defineField({ name: 'description', title: 'الشرح', type: 'localizedString' }),
            defineField({ name: 'icon', title: 'الأيقونة', type: 'string' }),
          ],
          preview: {
            select: { title: 'title.ar', subtitle: 'description.ar' },
          },
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'بيانات محركات البحث (SEO)',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title.ar', version: 'catalogVersion' },
    prepare: ({ title, version }) => ({
      title: title || 'كتالوج الأصناف والمنتجات',
      subtitle: version ? `الإصدار: ${version}` : 'صفحة الكتالوج والـ PDF',
    }),
  },
})

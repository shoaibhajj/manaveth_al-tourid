import { defineArrayMember, defineField, defineType } from 'sanity'
import { emailMessage, requiredTranslation } from '../../lib/localization'
import { seoFields } from '../objects/shared'

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
      name: 'hero',
      title: 'الواجهة الرئيسية (Hero)',
      type: 'heroSection',
      options: { collapsible: true, collapsed: false },
    }),
    ...(
      [
        ['about', 'aboutSection', 'من نحن'],
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

import { defineArrayMember, defineField, defineType } from 'sanity'
import { orderField, visibleField } from '../../lib/fields'
import { requiredTranslation } from '../../lib/localization'

export const companyPost = defineType({
  name: 'companyPost',
  title: 'نبض الشركة وآخر الأخبار والفعاليات',
  type: 'document',
  fields: [
    visibleField,
    defineField({
      name: 'title',
      title: 'عنوان الحدث / المنشور',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'slug',
      title: 'الرابط الدائم (Slug)',
      type: 'slug',
      options: { source: 'title.ar', maxLength: 96 },
    }),
    defineField({
      name: 'badge',
      title: 'شارة التصنيف',
      description: 'مثل: معارض دولية، وكالات حصرية، علامة الجودة، تكريم وإنجازات، توسع لوجستي',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'badgeType',
      title: 'نوع الحدث',
      type: 'string',
      options: {
        list: [
          { title: 'معرض أو مؤتمر (Event)', value: 'event' },
          { title: 'شراكة أو وكالة حصرية (Partnership)', value: 'partnership' },
          { title: 'اعتماد وجودة (Quality / ISO)', value: 'quality' },
          { title: 'درع أو تكريم (Award)', value: 'award' },
          { title: 'توسع لوجستي وميداني (Logistics)', value: 'logistics' },
        ],
      },
      initialValue: 'event',
    }),
    defineField({
      name: 'pinned',
      title: 'تثبيت في البداية',
      description: 'تثبيت هذا المنشور ليكون أول ما يراه الزائر.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'تاريخ النشر',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'author',
      title: 'الناشر / الجهة',
      type: 'localizedString',
      initialValue: { ar: 'المركز الإعلامي', en: 'Media Center' },
    }),
    defineField({
      name: 'coverImage',
      title: 'الصورة الرئيسية / الغلاف',
      type: 'localizedImage',
    }),
    defineField({
      name: 'excerpt',
      title: 'ملخص موجز للمنشور',
      description: 'يظهر في البطاقة بالصفحة الرئيسية قبل فتح التفاصيل.',
      type: 'localizedText',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'body',
      title: 'نص وتفاصيل المنشور الكاملة',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedText' })],
    }),
    defineField({
      name: 'highlights',
      title: 'أبرز النقاط والنتائج (Bullet Points)',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedString' })],
    }),
    defineField({
      name: 'initialLikes',
      title: 'عدد الإعجابات المبدئي',
      type: 'number',
      initialValue: 120,
    }),
    orderField,
  ],
  preview: {
    select: {
      titleAr: 'title.ar',
      titleEn: 'title.en',
      badgeAr: 'badge.ar',
      media: 'coverImage.ar',
      visible: 'visible',
    },
    prepare: ({ titleAr, titleEn, badgeAr, media, visible }) => ({
      title: titleAr || titleEn || 'منشور جديد',
      subtitle: [badgeAr, visible === false ? '❌ مخفي' : '✅ ظاهر'].filter(Boolean).join(' · '),
      media,
    }),
  },
})

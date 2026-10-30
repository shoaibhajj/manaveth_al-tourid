import { defineField, defineType } from 'sanity'
import { displayOrderings, orderField, statusLabels, visibleField } from '../../lib/fields'
import { requiredTranslation } from '../../lib/localization'
import { cardPreview } from '../../lib/preview'

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: 'تصنيف المعرض',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'localizedString', validation: requiredTranslation }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: cardPreview({ media: 'none' }),
})

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'عنصر في المعرض',
  type: 'document',
  groups: [
    { name: 'media', title: 'الصورة أو الفيديو', default: true },
    { name: 'details', title: 'التفاصيل' },
    { name: 'display', title: 'العرض' },
  ],
  fields: [
    defineField({
      name: 'mediaType',
      title: 'النوع',
      type: 'string',
      options: {
        list: [
          { title: 'صورة', value: 'image' },
          { title: 'فيديو', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      group: 'media',
    }),
    defineField({
      name: 'image',
      title: 'الصورة',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'videoFile',
      title: 'ملف الفيديو',
      description: 'ارفع ملف فيديو، أو الصق رابط فيديو في الحقل التالي.',
      type: 'file',
      options: { accept: 'video/*' },
      group: 'media',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'رابط الفيديو',
      type: 'url',
      group: 'media',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'poster',
      title: 'صورة الغلاف',
      description: 'اختيارية. تظهر قبل تشغيل الفيديو.',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'alt',
      title: 'النص البديل',
      description: 'يصف الصورة أو الفيديو لقارئات الشاشة. العربية مطلوبة والإنجليزية اختيارية.',
      type: 'localizedString',
      group: 'details',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'category',
      title: 'التصنيف',
      type: 'reference',
      to: [{ type: 'galleryCategory' }],
      group: 'details',
    }),
    defineField({
      name: 'featured',
      title: 'عنصر مميز',
      description: 'يظهر كعنصر كبير في المعرض.',
      type: 'boolean',
      initialValue: false,
      group: 'display',
    }),
    { ...orderField, group: 'display' },
    { ...visibleField, group: 'display' },
  ],
  orderings: displayOrderings,
  preview: {
    select: {
      ar: 'alt.ar',
      en: 'alt.en',
      image: 'image',
      poster: 'poster',
      mediaType: 'mediaType',
      categoryAr: 'category.name.ar',
      categoryEn: 'category.name.en',
      visible: 'visible',
      order: 'order',
    },
    prepare: ({ ar, en, image, poster, mediaType, categoryAr, categoryEn, visible, order }) => {
      const title = ar || en || 'عنصر بدون وصف'
      return {
        title: visible === false ? `[مخفي] ${title}` : title,
        subtitle: [
          visible === false ? statusLabels.hidden : statusLabels.visible,
          mediaType === 'video' ? 'فيديو' : 'صورة',
          categoryAr || categoryEn,
          order != null ? `الترتيب ${order}` : undefined,
        ]
          .filter(Boolean)
          .join(' · '),
        media: image || poster,
      }
    },
  },
})

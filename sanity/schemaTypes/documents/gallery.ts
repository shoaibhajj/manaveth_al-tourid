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
      description: 'الأبعاد الموصى بها: 1200×900 بكسل (نسبة 4:3) أو 1600×900 بكسل (نسبة 16:9). يدعم Hotspot للتحكم بمركز الصورة.',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'videoFile',
      title: 'ملف الفيديو',
      description: 'ارفع ملف فيديو (صيغة MP4 أو WebM، دقة 1080p أو 720p، ويُفضل ألا يتجاوز 30 ميغابايت لتسريع التحميل).',
      type: 'file',
      options: { accept: 'video/*' },
      group: 'media',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'رابط الفيديو',
      description: 'يمكنك وضع رابط مباشر لملف فيديو MP4 أو رابط فيديو خارجي.',
      type: 'url',
      group: 'media',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoAspectRatio',
      title: 'نسبة أبعاد الفيديو (Aspect Ratio)',
      description: 'اختر 16:9 للفيديوهات الأفقية، أو 9:16 للفيديوهات الرأسية (ريلز / ستوري / تيك توك).',
      type: 'string',
      options: {
        list: [
          { title: 'أفقي كلاسيكي (16:9) - 1920×1080', value: '16/9' },
          { title: 'رأسي / ريلز (9:16) - 1080×1920', value: '9/16' },
          { title: 'شبه مربع (4:3) - 1440×1080', value: '4/3' },
        ],
        layout: 'radio',
      },
      initialValue: '16/9',
      group: 'media',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'poster',
      title: 'صورة الغلاف',
      description: 'تظهر كصورة غلاف قبل تشغيل الفيديو (الأبعاد الموصى بها: 1600×900 بكسل، 16:9).',
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

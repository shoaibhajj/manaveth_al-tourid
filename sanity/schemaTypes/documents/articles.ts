import { defineArrayMember, defineField, defineType } from 'sanity'
import { requiredTranslation } from '../../lib/localization'
import { seoFields } from '../objects/shared'

export const article = defineType({
  name: 'article',
  title: 'مقالة',
  type: 'document',
  groups: [
    { name: 'content', title: 'المحتوى', default: true },
    { name: 'publishing', title: 'النشر' },
    { name: 'seo', title: 'محركات البحث' },
  ],
  fields: [
    defineField({ name: 'title', title: 'العنوان', type: 'localizedString', group: 'content', validation: requiredTranslation }),
    defineField({ name: 'slug', title: 'المعرّف في الرابط', type: 'slug', group: 'content', options: { source: 'title.en', maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: 'excerpt', title: 'المقتطف', type: 'localizedText', group: 'content', validation: requiredTranslation }),
    defineField({ name: 'coverImage', title: 'الصورة الرئيسية', type: 'localizedImage', group: 'content' }),
    defineField({
      name: 'body',
      title: 'المحتوى بالعربية',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'bodyEn',
      title: 'المحتوى بالإنجليزية',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({ name: 'author', title: 'الكاتب', type: 'string', group: 'publishing' }),
    defineField({ name: 'publishedAt', title: 'تاريخ النشر', type: 'datetime', group: 'publishing' }),
    defineField({ name: 'order', title: 'الترتيب', type: 'number', group: 'publishing' }),
    defineField({ name: 'visible', title: 'ظاهر في الموقع', type: 'boolean', initialValue: true, group: 'publishing' }),
    defineField({ name: 'seo', title: 'بيانات SEO مخصصة', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'الأحدث أولًا', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title.ar', fallbackTitle: 'title.en', media: 'coverImage.ar', publishedAt: 'publishedAt', visible: 'visible' },
    prepare: ({ title, fallbackTitle, media, publishedAt, visible }) => ({
      title: `${visible === false ? '[مخفي] ' : ''}${title || fallbackTitle || 'مقالة بلا عنوان'}`,
      subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString('ar-SA') : 'غير منشورة بعد',
      media,
    }),
  },
})

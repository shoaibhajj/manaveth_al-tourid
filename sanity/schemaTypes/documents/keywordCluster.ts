import { defineArrayMember, defineField, defineType } from 'sanity'

export const keywordCluster = defineType({
  name: 'keywordCluster',
  title: 'مجموعات الكلمات المفتاحية (Keyword Clusters)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم المجموعة (Cluster Name)',
      description: 'مثال: توريد اللحوم المجمدة للمطاعم بالرياض',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intent',
      title: 'نية البحث (Search Intent)',
      type: 'string',
      options: {
        list: [
          { title: 'تجاري B2B (Commercial)', value: 'commercial' },
          { title: 'شراء وطلب أسعار (Transactional)', value: 'transactional' },
          { title: 'محلي جغرافي (Local)', value: 'local' },
          { title: 'معلوماتي وإرشادي (Informational)', value: 'informational' },
          { title: 'علامة تجارية (Brand)', value: 'brand' },
        ],
      },
      initialValue: 'commercial',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'targetUrl',
      title: 'الصفحة المستهدفة (Target URL)',
      description: 'الرابط المخصص لهذه المجموعة فقط (قاعدة صفحة واحدة لكل نية)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'primaryKeyword',
      title: 'الكلمة المفتاحية الرئيسية',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variations',
      title: 'العبارات المترادفة في المجموعة',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'recommendedH2',
      title: 'عناوين H2 المقترحة للمحتوى',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'recommendedAnchors',
      title: 'نصوص الروابط الداخلية المقترحة (Internal Anchor Texts)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'targetUrl',
      intent: 'intent',
    },
    prepare({ title, subtitle, intent }) {
      return {
        title,
        subtitle: `[${intent}] ➔ ${subtitle}`,
      }
    },
  },
})

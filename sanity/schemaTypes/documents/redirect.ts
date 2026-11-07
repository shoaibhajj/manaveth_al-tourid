import { defineField, defineType } from 'sanity'

export const redirect = defineType({
  name: 'redirect',
  title: 'إعادة التوجيه (301 Redirect)',
  type: 'document',
  fields: [
    defineField({
      name: 'source',
      title: 'الرابط القديم (Source Path)',
      description: 'مثال: /products/old-product-slug أو /old-page',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (!value) return true
            if (!value.startsWith('/')) return 'يجب أن يبدأ الرابط بشرطة مائلة /'
            return true
          }),
    }),
    defineField({
      name: 'destination',
      title: 'الرابط الجديد (Destination Path)',
      description: 'مثال: /products/new-product-slug أو /new-page',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (!value) return true
            if (!value.startsWith('/')) return 'يجب أن يبدأ الرابط بشرطة مائلة /'
            return true
          }),
    }),
    defineField({
      name: 'permanent',
      title: 'توجيه دائم (301 Permanent)',
      description: 'توجيه 301 دائم لمحركات البحث لنقل قوة الرابط القديم.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent',
    },
    prepare({ source, destination, permanent }) {
      return {
        title: `${source} ➔ ${destination}`,
        subtitle: permanent !== false ? '301 دائم' : '302 مؤقت',
      }
    },
  },
})

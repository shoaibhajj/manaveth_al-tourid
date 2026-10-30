import { defineField, type SortOrdering } from 'sanity'

export const orderField = defineField({
  name: 'order',
  title: 'Display order',
  type: 'number',
  description: 'Lower numbers appear first. Leave gaps (10, 20, 30) so items can be inserted later.',
  initialValue: 100,
  validation: (rule) => rule.integer().min(0),
})

export const visibleField = defineField({
  name: 'visible',
  title: 'Visible on site',
  type: 'boolean',
  description: 'Turn off to hide the item without deleting it.',
  initialValue: true,
})

export const displayOrderings: SortOrdering[] = [
  { name: 'displayOrderAsc', title: 'Display order', by: [{ field: 'order', direction: 'asc' }] },
]

export const iconOptions = [
  'concierge',
  'store',
  'truck',
  'ship',
  'award',
  'globe',
  'shield',
  'handshake',
  'gem',
  'users',
  'container',
].map((value) => ({ title: value, value }))

import { defineField, type SortOrdering } from 'sanity'

export const orderField = defineField({
  name: 'order',
  title: 'ترتيب الظهور',
  type: 'number',
  description: 'الأرقام الأصغر تظهر أولًا. اترك فروقًا بين الأرقام (10، 20، 30) لتتمكن من إدراج عناصر جديدة لاحقًا.',
  initialValue: 100,
  validation: (rule) => rule.integer().min(0),
})

export const visibleField = defineField({
  name: 'visible',
  title: 'ظاهر في الموقع',
  type: 'boolean',
  description: 'أوقف هذا الخيار لإخفاء العنصر عن الموقع دون حذفه.',
  initialValue: true,
})

export const displayOrderings: SortOrdering[] = [
  { name: 'displayOrderAsc', title: 'ترتيب الظهور (من الأول)', by: [{ field: 'order', direction: 'asc' }] },
  { name: 'displayOrderDesc', title: 'ترتيب الظهور (من الأخير)', by: [{ field: 'order', direction: 'desc' }] },
  { name: 'hiddenFirst', title: 'المخفي أولًا', by: [{ field: 'visible', direction: 'asc' }, { field: 'order', direction: 'asc' }] },
]

/** Values are stored in the data and read by the website, so only the titles are translated. */
export const iconOptions = [
  { title: 'خدمة العملاء (concierge)', value: 'concierge' },
  { title: 'متجر (store)', value: 'store' },
  { title: 'شاحنة (truck)', value: 'truck' },
  { title: 'سفينة (ship)', value: 'ship' },
  { title: 'جائزة (award)', value: 'award' },
  { title: 'عالمي (globe)', value: 'globe' },
  { title: 'حماية (shield)', value: 'shield' },
  { title: 'شراكة (handshake)', value: 'handshake' },
  { title: 'جودة (gem)', value: 'gem' },
  { title: 'فريق (users)', value: 'users' },
  { title: 'حاوية (container)', value: 'container' },
]

export const iconTitles: Record<string, string> = Object.fromEntries(
  iconOptions.map((option) => [option.value, option.title]),
)

export const statusLabels = { visible: 'ظاهر', hidden: 'مخفي' } as const

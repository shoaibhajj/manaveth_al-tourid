import type { Localized } from '../i18n'
import { visibleSorted } from './types'

export type PriceTier = {
  label: Localized
  amount: number
}

export type Product = {
  id: string
  name: Localized
  description: Localized
  image: string
  alt: Localized
  /** Single price. Omit it, together with `tiers`, to show "price on request". */
  price?: { amount: number; unit: Localized }
  /** Quantity based prices, shown instead of the single price when present. */
  tiers?: { unit: Localized; items: PriceTier[] }
  featured?: boolean
  order: number
  visible?: boolean
}

export const currency: Localized = { ar: 'ر.س', en: 'SAR' }

export const products: Product[] = [
  {
    id: 'olive-oil',
    name: { ar: 'زيت زيتون بكر ممتاز', en: 'Extra Virgin Olive Oil' },
    description: {
      ar: 'زيت زيتون معصور على البارد بعبوات 5 لترات، مناسب للمطابخ والمطاعم.',
      en: 'Cold-pressed olive oil in 5 litre containers, suited to kitchens and restaurants.',
    },
    image: '/images/p-olive-oil.png',
    alt: { ar: 'عبوات زيت زيتون بكر وزيتون أخضر', en: 'Containers of extra virgin olive oil with green olives' },
    tiers: {
      unit: { ar: 'سعر الكرتون', en: 'Price per carton' },
      items: [
        { label: { ar: '10 كراتين', en: '10 cartons' }, amount: 480 },
        { label: { ar: '30 كرتونًا فأكثر', en: '30 cartons or more' }, amount: 455 },
      ],
    },
    featured: true,
    order: 1,
  },
  {
    id: 'basmati-rice',
    name: { ar: 'أرز بسمتي فاخر', en: 'Premium Basmati Rice' },
    description: {
      ar: 'حبوب طويلة ناصعة البياض بأكياس 20 كجم، تعطي نتائج ثابتة في الطهي.',
      en: 'Long, bright white grains in 20 kg sacks that cook consistently every time.',
    },
    image: '/images/p-rice.png',
    alt: { ar: 'أكياس أرز بسمتي مع مغرفة خشبية من الأرز', en: 'Sacks of basmati rice with a wooden scoop of rice' },
    price: { amount: 118, unit: { ar: 'للكيس', en: 'per sack' } },
    featured: true,
    order: 2,
  },
  {
    id: 'fresh-produce',
    name: { ar: 'خضار وفواكه طازجة', en: 'Fresh Fruit & Vegetables' },
    description: {
      ar: 'تشكيلة موسمية مختارة بعناية وتصل مبردة إلى وجهتك بجداول توريد منتظمة.',
      en: 'A carefully selected seasonal range delivered chilled to your door on regular schedules.',
    },
    image: '/images/g-produce.png',
    alt: { ar: 'صناديق خضار وفواكه طازجة', en: 'Crates of fresh fruit and vegetables' },
    featured: true,
    order: 3,
  },
  {
    id: 'natural-juice',
    name: { ar: 'عصائر طبيعية', en: 'Natural Juices' },
    description: {
      ar: 'عصائر مغلفة بعبوات متنوعة، مناسبة للفنادق والمقاهي ومحلات التجزئة.',
      en: 'Packaged juices in a range of sizes, ideal for hotels, cafes and retail shops.',
    },
    image: '/images/g-juice.png',
    alt: { ar: 'عبوات عصير وزيت مغلفة', en: 'Packaged bottles of juice and oil' },
    tiers: {
      unit: { ar: 'سعر الكرتون', en: 'Price per carton' },
      items: [
        { label: { ar: '10 كراتين', en: '10 cartons' }, amount: 96 },
        { label: { ar: '30 كرتونًا فأكثر', en: '30 cartons or more' }, amount: 88 },
      ],
    },
    order: 4,
  },
  {
    id: 'canned-goods',
    name: { ar: 'معلبات الطماطم والبقوليات', en: 'Canned Tomatoes & Legumes' },
    description: {
      ar: 'معجون طماطم وحمص ومعلبات أساسية بعبوات تجارية تناسب الاستخدام اليومي.',
      en: 'Tomato paste, chickpeas and pantry staples in commercial sizes for daily use.',
    },
    image: '/images/p-canned.png',
    alt: { ar: 'علب معدنية وبرطمانات من معجون الطماطم والحمص', en: 'Cans and jars of tomato paste and chickpeas' },
    price: { amount: 64, unit: { ar: 'للكرتون', en: 'per carton' } },
    order: 5,
  },
  {
    id: 'premium-dates',
    name: { ar: 'تمور فاخرة', en: 'Premium Dates' },
    description: {
      ar: 'تمور مجدول طرية بعلب خشبية وكراتين، للضيافة والهدايا والبيع بالجملة.',
      en: 'Soft Medjool dates in wooden boxes and cartons for hospitality, gifting and wholesale.',
    },
    image: '/images/p-dates.png',
    alt: { ar: 'علبة خشبية مفتوحة من التمر المجدول', en: 'An open wooden box of Medjool dates' },
    order: 6,
  },
]

export const getProducts = () => visibleSorted(products)
export const getFeaturedProducts = () => getProducts().filter((product) => product.featured)

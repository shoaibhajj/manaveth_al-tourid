import type { Localized } from '../i18n'
import { visibleSorted, type IconKey } from './types'

export type Card = {
  id: string
  icon?: IconKey
  title: Localized
  text: Localized
  image: string
  alt: Localized
  href: string
  ctaLabel: Localized
  order: number
  visible?: boolean
}

export const services: Card[] = [
  {
    id: 'food-supply',
    icon: 'concierge',
    title: { ar: 'توريد المواد الغذائية', en: 'Food Supply' },
    text: {
      ar: 'مجموعة واسعة من المنتجات الغذائية من مصادر موثوقة',
      en: 'A wide range of food products from trusted sources',
    },
    image: '/images/service-food.png',
    alt: {
      ar: 'تشكيلة من الخضار الطازجة والأجبان وزيت الزيتون',
      en: 'An assortment of fresh vegetables, cheeses and olive oil',
    },
    href: '/#contact',
    ctaLabel: { ar: 'اطلب الخدمة', en: 'Request this service' },
    order: 1,
  },
  {
    id: 'restaurants-hotels',
    icon: 'store',
    title: { ar: 'المطاعم والفنادق', en: 'Restaurants & Hotels' },
    text: {
      ar: 'توريد احتياجات المطاعم والفنادق بجودة واستمرارية',
      en: 'Reliable, consistent supply for restaurants and hotels',
    },
    image: '/images/service-hotels.png',
    alt: {
      ar: 'طاهٍ يجهز الأطباق في مطبخ فندق فاخر',
      en: 'A chef plating dishes in a luxury hotel kitchen',
    },
    href: '/#contact',
    ctaLabel: { ar: 'اطلب الخدمة', en: 'Request this service' },
    order: 2,
  },
  {
    id: 'land-transport',
    icon: 'truck',
    title: { ar: 'النقل البري', en: 'Land Transport' },
    text: {
      ar: 'نقل آمن وسريع داخل وخارج المملكة',
      en: 'Safe and fast transport within and beyond the Kingdom',
    },
    image: '/images/service-land.png',
    alt: { ar: 'شاحنة نقل على الطريق وقت الغروب', en: 'A freight truck on the road at sunset' },
    href: '/#contact',
    ctaLabel: { ar: 'اطلب الخدمة', en: 'Request this service' },
    order: 3,
  },
  {
    id: 'sea-import',
    icon: 'ship',
    title: { ar: 'الاستيراد البحري', en: 'Sea Import' },
    text: {
      ar: 'استيراد من الأسواق العالمية بأفضل الأسعار',
      en: 'Importing from global markets at the best prices',
    },
    image: '/images/service-sea.png',
    alt: { ar: 'سفينة حاويات راسية في الميناء', en: 'A container ship docked in the port' },
    href: '/#contact',
    ctaLabel: { ar: 'اطلب الخدمة', en: 'Request this service' },
    order: 4,
  },
]

export const getServices = () => visibleSorted(services)

import { visibleSorted } from './types'
import type { Card } from './services'

const cta = { ar: 'اطلب عرض سعر', en: 'Request a quote' }

export const sectors: Card[] = [
  {
    id: 'government',
    title: { ar: 'الجهات الحكومية', en: 'Government Entities' },
    text: {
      ar: 'توريد منتظم وفق المواصفات والعقود المعتمدة',
      en: 'Regular supply under approved specifications and contracts',
    },
    image: '/images/s-government.png',
    alt: { ar: 'مبنى حكومي', en: 'A government building' },
    href: '/#contact',
    ctaLabel: cta,
    order: 1,
  },
  {
    id: 'factories',
    title: { ar: 'المصانع الغذائية', en: 'Food Factories' },
    text: {
      ar: 'مواد خام ومكونات بكميات كبيرة وجودة ثابتة',
      en: 'Bulk raw materials and ingredients at consistent quality',
    },
    image: '/images/s-factory.png',
    alt: { ar: 'خط إنتاج في مصنع أغذية', en: 'A production line in a food factory' },
    href: '/#contact',
    ctaLabel: cta,
    order: 2,
  },
  {
    id: 'restaurants',
    title: { ar: 'المطاعم والمقاهي', en: 'Restaurants & Cafes' },
    text: {
      ar: 'مواد طازجة وجاهزة للتشغيل اليومي',
      en: 'Fresh supplies ready for daily operations',
    },
    image: '/images/s-restaurant.png',
    alt: { ar: 'مطعم مجهز للضيوف', en: 'A restaurant set for guests' },
    href: '/#contact',
    ctaLabel: cta,
    order: 3,
  },
  {
    id: 'hotels',
    title: { ar: 'الفنادق والضيافة', en: 'Hotels & Hospitality' },
    text: {
      ar: 'توريد متكامل يلبي معايير الضيافة',
      en: 'End-to-end supply that meets hospitality standards',
    },
    image: '/images/s-hotel.png',
    alt: { ar: 'بهو فندق', en: 'A hotel lobby' },
    href: '/#contact',
    ctaLabel: cta,
    order: 4,
  },
  {
    id: 'retail',
    title: { ar: 'قطاع التجزئة', en: 'Retail' },
    text: {
      ar: 'منتجات متنوعة للمتاجر وسلاسل البيع',
      en: 'A varied range for stores and retail chains',
    },
    image: '/images/s-retail.png',
    alt: { ar: 'رفوف متجر مواد غذائية', en: 'Shelves in a grocery store' },
    href: '/#contact',
    ctaLabel: cta,
    order: 5,
  },
  {
    id: 'central-kitchens',
    title: { ar: 'المطابخ المركزية', en: 'Central Kitchens' },
    text: {
      ar: 'كميات كبيرة وجداول توريد منتظمة',
      en: 'Large volumes and dependable delivery schedules',
    },
    image: '/images/service-hotels.png',
    alt: { ar: 'مطبخ مركزي احترافي', en: 'A professional central kitchen' },
    href: '/#contact',
    ctaLabel: cta,
    order: 6,
  },
]

export const getSectors = () => visibleSorted(sectors)

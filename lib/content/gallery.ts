import type { Localized } from '../i18n'
import { visibleSorted } from './types'

export type GalleryItem = {
  id: string
  type: 'image' | 'video'
  /** Image path, or the cover image when the item is a video. */
  src: string
  /** Optional video file. Without it, a video item shows its cover image. */
  videoSrc?: string
  alt: Localized
  category: string
  order: number
  visible?: boolean
}

export const galleryCategories: { id: string; label: Localized }[] = [
  { id: 'products', label: { ar: 'المنتجات', en: 'Products' } },
  { id: 'warehouses', label: { ar: 'المستودعات', en: 'Warehouses' } },
  { id: 'packing', label: { ar: 'التعبئة والتغليف', en: 'Packing' } },
  { id: 'transport', label: { ar: 'النقل والتوصيل', en: 'Transport & Delivery' } },
]

export const galleryFeatured = {
  src: '/images/hero.png',
  alt: {
    ar: 'رحلة المنتج من بلد المورد حتى وصوله إلى وجهتك',
    en: 'The product journey from the supplier’s country to your door',
  },
  badge: { ar: 'رحلة المنتج', en: 'Product journey' },
  caption: { ar: 'من بلد المورد حتى وصوله إلى وجهتك', en: 'From the supplier’s country to your door' },
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'produce',
    type: 'image',
    src: '/images/g-produce.png',
    alt: { ar: 'صناديق خضار وفواكه طازجة', en: 'Crates of fresh fruit and vegetables' },
    category: 'products',
    order: 1,
  },
  {
    id: 'warehouse',
    type: 'image',
    src: '/images/g-warehouse.png',
    alt: { ar: 'رافعة شوكية داخل المستودع', en: 'A forklift inside the warehouse' },
    category: 'warehouses',
    order: 2,
  },
  {
    id: 'sea-video',
    type: 'video',
    src: '/images/service-sea.png',
    alt: { ar: 'فيديو: وصول شحنة بحرية إلى الميناء', en: 'Video: a sea shipment arriving at port' },
    category: 'transport',
    order: 3,
  },
  {
    id: 'truck',
    type: 'image',
    src: '/images/g-truck.png',
    alt: { ar: 'شاحنة منافذ التوريد في ساحة الحاويات', en: 'A company truck in the container yard' },
    category: 'transport',
    order: 4,
  },
  {
    id: 'boxes',
    type: 'image',
    src: '/images/g-boxes.png',
    alt: { ar: 'كراتين مرتبة على منصات', en: 'Cartons stacked on pallets' },
    category: 'warehouses',
    order: 5,
  },
  {
    id: 'juice',
    type: 'image',
    src: '/images/g-juice.png',
    alt: { ar: 'عبوات عصير وزيت مغلفة', en: 'Packaged bottles of juice and oil' },
    category: 'products',
    order: 6,
  },
  {
    id: 'packing',
    type: 'image',
    src: '/images/g-packing.png',
    alt: { ar: 'فريق العمل يغلف الطرود', en: 'The team wrapping parcels' },
    category: 'packing',
    order: 7,
  },
  {
    id: 'kitchen-video',
    type: 'video',
    src: '/images/service-hotels.png',
    alt: { ar: 'فيديو: تجهيز طلبات المطابخ', en: 'Video: preparing kitchen orders' },
    category: 'packing',
    order: 8,
  },
]

export const getGalleryItems = () => visibleSorted(galleryItems)

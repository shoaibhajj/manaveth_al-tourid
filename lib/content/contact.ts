import type { Localized } from '../i18n'

export type WhatsappChannel = {
  /** International format, e.g. "9665XXXXXXXX". Leave empty until the owner provides the approved number; the button stays disabled. */
  number: string
  label: Localized
  message: Localized
}

export const contact = {
  phone: '',
  email: 'info@mnafeth.com',
  address: {
    ar: 'الرياض، المملكة العربية السعودية',
    en: 'Riyadh, Saudi Arabia',
  } satisfies Localized,
  whatsapp: {
    quote: {
      number: '',
      label: { ar: 'واتساب: طلب عرض سعر', en: 'WhatsApp: Request a quote' },
      message: {
        ar: 'مرحبًا، أرغب في الحصول على عرض سعر لاحتياجات شركتي من المواد الغذائية.',
        en: 'Hello, I would like to receive a quote for my company’s food supply needs.',
      },
    },
    orders: {
      number: '',
      label: { ar: 'واتساب: الطلبات والاستفسارات', en: 'WhatsApp: Orders and enquiries' },
      message: {
        ar: 'مرحبًا، لدي استفسار بخصوص طلب توريد.',
        en: 'Hello, I have an enquiry about a supply order.',
      },
    },
  } satisfies Record<string, WhatsappChannel>,
  productOrderMessage: {
    ar: 'مرحبًا، أرغب في طلب المنتج: {product}',
    en: 'Hello, I would like to order the product: {product}',
  } satisfies Localized,
}

export function whatsappUrl(number: string, message: string): string | undefined {
  const digits = number.replace(/\D/g, '')
  if (!digits) return undefined
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function telUrl(phone: string): string | undefined {
  const normalized = phone.replace(/[^\d+]/g, '')
  return normalized ? `tel:${normalized}` : undefined
}

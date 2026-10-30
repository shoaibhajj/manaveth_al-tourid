import { defineArrayMember, defineField, defineType } from 'sanity'
import { requiredTranslation } from '../../lib/localization'
import { seoFields } from '../objects/shared'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings and identity — إعدادات الموقع',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact details' },
    { name: 'seo', title: 'Default SEO' },
  ],
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company name',
      type: 'localizedString',
      group: 'identity',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      description: 'Short line shown under the company name.',
      type: 'localizedString',
      group: 'identity',
    }),
    defineField({
      name: 'about',
      title: 'Company profile',
      description: 'A short description of the company.',
      type: 'localizedText',
      group: 'identity',
      validation: requiredTranslation,
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'localizedImage', group: 'identity' }),
    defineField({
      name: 'favicon',
      title: 'Icon (favicon)',
      description: 'Square image, at least 512 × 512.',
      type: 'image',
      group: 'identity',
    }),
    defineField({
      name: 'currency',
      title: 'Currency label',
      description: 'Shown next to product prices, for example the currency code or symbol.',
      type: 'localizedString',
      group: 'identity',
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', group: 'contact' }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (rule) =>
        rule
          .custom((value?: string) =>
            !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'This does not look like an email address.',
          )
          .warning(),
    }),
    defineField({ name: 'address', title: 'Address', type: 'localizedText', group: 'contact' }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({ type: 'socialLink' })],
      group: 'contact',
    }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings and identity' }) },
})

export const contactSettings = defineType({
  name: 'contactSettings',
  title: 'WhatsApp and contact messages — واتساب',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsappQuote',
      title: 'WhatsApp: request a quote',
      description: 'Channel for visitors who want a price quote.',
      type: 'whatsappChannel',
    }),
    defineField({
      name: 'whatsappOrders',
      title: 'WhatsApp: orders and enquiries',
      description: 'Channel for order follow-up and general enquiries.',
      type: 'whatsappChannel',
    }),
    defineField({
      name: 'productOrderMessage',
      title: 'Product order message',
      description: 'Pre-filled when a visitor orders a product. Write {product} where the product name should appear.',
      type: 'localizedText',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      description: 'The company phone, email, address and social links live in "Site settings and identity".',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: { prepare: () => ({ title: 'WhatsApp and contact messages' }) },
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page — الصفحة الرئيسية',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'heroSection', options: { collapsible: true, collapsed: false } }),
    ...(
      [
        ['about', 'aboutSection', 'About'],
        ['services', 'servicesSection', 'Services'],
        ['gallery', 'gallerySection', 'Work gallery'],
        ['stats', 'statsSection', 'Statistics'],
        ['sectors', 'sectorsSection', 'Sectors'],
        ['featuredProducts', 'featuredProductsSection', 'Featured products'],
        ['branches', 'branchesSection', 'Branches'],
        ['contact', 'contactSection', 'Contact'],
        ['footer', 'footerSection', 'Footer'],
      ] as const
    ).map(([name, type, title]) =>
      defineField({ name, title, type, options: { collapsible: true, collapsed: true } }),
    ),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
})

function defineSeoPage(name: string, title: string) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: seoFields,
    preview: { prepare: () => ({ title }) },
  })
}

export const seoHome = defineSeoPage('seoHome', 'SEO: Home page')
export const seoProducts = defineSeoPage('seoProducts', 'SEO: Products page')
export const seoBranches = defineSeoPage('seoBranches', 'SEO: Branches and warehouses page')

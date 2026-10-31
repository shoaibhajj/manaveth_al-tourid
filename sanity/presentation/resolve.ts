import { defineDocuments } from 'sanity/presentation'

export const mainDocuments = defineDocuments([
  { route: '/en/products/:slug', filter: '_type == "product" && slug.current == $slug' },
  { route: '/products/:slug', filter: '_type == "product" && slug.current == $slug' },
  { route: '/en/services/:slug', filter: '_type == "service" && slug.current == $slug' },
  { route: '/services/:slug', filter: '_type == "service" && slug.current == $slug' },
  { route: '/en/blog/:slug', filter: '_type == "article" && slug.current == $slug' },
  { route: '/blog/:slug', filter: '_type == "article" && slug.current == $slug' },
  { route: '/en', type: 'homePage' },
  { route: '/', type: 'homePage' },
])

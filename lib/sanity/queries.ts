import { defineQuery } from 'next-sanity'

/** One round trip for everything the public site renders. Images stay as references and are resolved by image-url. */
export const siteContentQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0],
  "contact": *[_type == "contactSettings"][0],
  "home": *[_type == "homePage"][0]{
    ...,
    "hero": hero{..., "videoFileUrl": videoFile.asset->url},
    "featuredProducts": featuredProducts{..., "productIds": products[]._ref}
  },
  "seoHome": *[_type == "seoHome"][0],
  "seoProducts": *[_type == "seoProducts"][0],
  "seoBranches": *[_type == "seoBranches"][0],
  "services": *[_type == "service"] | order(order asc),
  "sectors": *[_type == "sector"] | order(order asc),
  "stats": *[_type == "stat"] | order(order asc),
  "products": *[_type == "product"] | order(order asc){..., "slug": slug.current, "categoryId": category._ref},
  "productCategories": *[_type == "productCategory"] | order(order asc),
  "places": *[_type == "place"] | order(order asc),
  "galleryCategories": *[_type == "galleryCategory"] | order(order asc),
  "galleryItems": *[_type == "galleryItem"] | order(order asc){
    ...,
    "videoFileUrl": videoFile.asset->url,
    "categoryId": category._ref
  },
  "articles": *[_type == "article" && visible != false && defined(slug.current)] | order(publishedAt desc){
    ...,
    "slug": slug.current,
    "coverImage": coverImage{..., "assetUrl": ar.asset->url},
    "seo": seo{...}
  }
}`)

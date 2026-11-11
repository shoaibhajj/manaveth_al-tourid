import { defineQuery } from 'next-sanity'

/** Minimal layout query for Header, Footer, and global providers without heavy page payloads */
export const layoutContentQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0],
  "contact": *[_type == "contactSettings"][0],
  "home": *[_type == "homePage"][0]{
    sectionsList[]{
      key,
      enabled
    }
  },
  "services": *[_type == "service" && visible != false] | order(order asc){
    _id,
    "id": coalesce(slug.current, _id),
    title,
    href,
    order,
    visible
  },
  "places": *[_type == "place" && visible != false] | order(order asc){
    _id,
    "id": coalesce(slug.current, _id),
    name
  },
  "seoHome": *[_type == "seoHome"][0]
}`)

/** One round trip for everything the public site renders. Images stay as references and are resolved by image-url. */
export const siteContentQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0],
  "contact": *[_type == "contactSettings"][0],
  "aboutPage": *[_type == "aboutPage"][0]{...},
  "catalogPage": *[_type == "catalogPage"][0]{
    ...,
    "pages": pages[]{
      ...,
      "backgroundImage": backgroundImage{..., "assetUrl": asset->url},
      "fullPageImage": fullPageImage{..., "assetUrl": asset->url},
      "items": items[]{
        ...,
        "product": product->{
          _id,
          name,
          "slug": slug.current,
          description,
          image,
          "gallery": gallery[]{..., "assetUrl": asset->url},
          isCoreSpecialty,
          order
        },
        "images": images[]{..., "assetUrl": asset->url}
      },
      "categories": categories[]->{
        _id,
        name,
        "slug": slug.current,
        description,
        image{..., "assetUrl": asset->url}
      }
    },
    "supportingCommodities": supportingCommodities[]{
      ...,
      "image": {
        "ar": image.ar{..., "assetUrl": asset->url},
        "en": image.en{..., "assetUrl": asset->url}
      }
    }
  },
  "home": *[_type == "homePage"][0]{
    ...,
    "hero": hero{..., "videoFileUrl": videoFile.asset->url},
    "featuredProducts": featuredProducts{..., "productIds": products[]._ref},
    "sectionsList": sectionsList[]{
      ...,
      "customSection": customSectionRef->{...}
    }
  },
  "customSections": *[_type == "customSection" && visible != false]{...},
  "companyPosts": *[_type == "companyPost" && visible != false] | order(pinned desc, publishedAt desc){
    ...,
    "slug": slug.current,
    "coverImage": coverImage.ar.asset->url
  },
  "seoHome": *[_type == "seoHome"][0],
  "seoProducts": *[_type == "seoProducts"][0],
  "seoBranches": *[_type == "seoBranches"][0],
  "services": *[_type == "service"] | order(order asc),
  "sectors": *[_type == "sector"] | order(order asc),
  "stats": *[_type == "stat"] | order(order asc),
  "products": *[_type == "product"] | order(order asc){..., "slug": slug.current, "categoryId": category._ref, "category": category->{ _id, name }},
  "productCategories": *[_type == "productCategory"] | order(order asc),
  "places": *[_type == "place"] | order(order asc){
    ...,
    "videoFileUrl": videoFile.asset->url
  },
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

export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0]{...}`)

export const catalogPageQuery = defineQuery(`{
  "catalogPage": *[_type == "catalogPage"][0]{
    ...,
    "pages": pages[]{
      ...,
      "backgroundImage": backgroundImage{..., "assetUrl": asset->url},
      "fullPageImage": fullPageImage{..., "assetUrl": asset->url},
      "items": items[]{
        ...,
        "product": product->{
          _id,
          name,
          "slug": slug.current,
          description,
          image,
          "gallery": gallery[]{..., "assetUrl": asset->url},
          isCoreSpecialty,
          order
        },
        "images": images[]{..., "assetUrl": asset->url}
      },
      "categories": categories[]->{
        _id,
        name,
        "slug": slug.current,
        description,
        image{..., "assetUrl": asset->url}
      }
    },
    "supportingCommodities": supportingCommodities[]{
      ...,
      "image": {
        "ar": image.ar{..., "assetUrl": asset->url},
        "en": image.en{..., "assetUrl": asset->url}
      }
    }
  },
  "products": *[_type == "product" && (visible != false)] | order(order asc){
    ...,
    "slug": slug.current,
    "categoryId": category._ref,
    "category": category->{ _id, name }
  },
  "productCategories": *[_type == "productCategory" && (visible != false)] | order(order asc){
    ...,
    "name": name
  },
  "settings": *[_type == "siteSettings"][0],
  "contact": *[_type == "contactSettings"][0]
}`)

export const productCategorySlugsQuery = defineQuery(`*[_type == "productCategory" && visible != false]{
  _id,
  "slug": slug.current
}`)

export const productBySlugQuery = defineQuery(`*[_type == "product" && slug.current == $slug && visible != false][0]{..., "slug": slug.current, "category": category->{ _id, name, "slug": slug.current }, "brand": brand->{ _id, name }, "image": image{..., "assetUrl": asset->url}, "gallery": gallery[]{ ..., "assetUrl": asset->url }}`)
export const productBySlugDraftQuery = defineQuery(`*[_type == "product" && slug.current == $slug][0]{..., "slug": slug.current, "category": category->{ _id, name, "slug": slug.current }, "brand": brand->{ _id, name }, "image": image{..., "assetUrl": asset->url}, "gallery": gallery[]{ ..., "assetUrl": asset->url }}`)

export const serviceBySlugQuery = defineQuery(`*[_type == "service" && slug.current == $slug && visible != false][0]{..., "slug": slug.current, "image": image{...}}`)
export const serviceBySlugDraftQuery = defineQuery(`*[_type == "service" && slug.current == $slug][0]{..., "slug": slug.current, "image": image{...}}`)

export const articleBySlugQuery = defineQuery(`*[_type == "article" && slug.current == $slug && visible != false][0]{..., "slug": slug.current, "coverImage": coverImage{...}, "seo": seo{...}}`)
export const articleBySlugDraftQuery = defineQuery(`*[_type == "article" && slug.current == $slug][0]{..., "slug": slug.current, "coverImage": coverImage{...}, "seo": seo{...}}`)

export const landingPageBySlugQuery = defineQuery(`*[_type == "landingPage" && slug.current == $slug][0]{
  ...,
  "slug": slug.current,
  "sectors": sectors[]->{ _id, name, "slug": slug.current },
  "certificates": certificates[]->{ _id, name, issuer, validUntil }
}`)

export const meatSupplyProductsQuery = defineQuery(`*[_type == "product" && (visible != false) && (category._ref == "category-meat-poultry" || category->_id == "category-meat-poultry" || productType in ['meat', 'poultry'] || category->slug.current == 'meat-poultry' || slug.current match "*bf*" || slug.current match "*ck*" || slug.current in ['frozen-meat', 'frozen-liver'])] | order(_createdAt asc){
  ...,
  "slug": slug.current,
  "category": category->{ _id, name, "slug": slug.current }
}`)

export const confirmedCitiesQuery = defineQuery(`*[_type == "city" && isSupplyConfirmed == true && defined(slug.current) && defined(name.ar) && defined(region.ar) && defined(coveredDistricts.ar) && defined(deliveryTime.ar) && defined(minOrder.ar) && defined(pickupPoint.ar) && defined(coldChainFacility.ar)] | order(name.ar asc){
  ...,
  "slug": slug.current
}`)

export const confirmedCityBySlugQuery = defineQuery(`*[_type == "city" && isSupplyConfirmed == true && slug.current == $slug && defined(name.ar) && defined(region.ar) && defined(coveredDistricts.ar) && defined(deliveryTime.ar) && defined(minOrder.ar) && defined(pickupPoint.ar) && defined(coldChainFacility.ar)][0]{
  ...,
  "slug": slug.current
}`)

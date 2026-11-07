import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'
import { catalogCategories, defaultCatalogProducts } from '@/lib/content/catalog-data'

export const dynamic = 'force-dynamic'

function getSanityClient() {
  if (!isSanityConfigured) return null
  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_READ_TOKEN_2 ||
    process.env.SANITY_API_READ_TOKEN
  if (!token) return null

  return createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: false,
    token,
  })
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function parseCsv(text: string): Record<string, string>[] {
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1)
  }
  const lines: string[] = []
  let currentLine = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentLine += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) lines.push(currentLine)
      currentLine = ''
      if (char === '\r' && text[i + 1] === '\n') i++
    } else {
      currentLine += char
    }
  }
  if (currentLine.trim()) lines.push(currentLine)
  if (lines.length < 2) return []

  const parseRow = (line: string): string[] => {
    const fields: string[] = []
    let field = ''
    let inside = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        if (inside && line[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inside = !inside
        }
      } else if (c === ',' && !inside) {
        fields.push(field.trim())
        field = ''
      } else {
        field += c
      }
    }
    fields.push(field.trim())
    return fields
  }

  const headerRow = parseRow(lines[0])
  const result: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i])
    const obj: Record<string, string> = {}
    headerRow.forEach((h, idx) => {
      obj[h] = values[idx] || ''
    })
    result.push(obj)
  }
  return result
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  const action = url.searchParams.get('action')

  if (key !== 'mnaveth2026') {
    return NextResponse.json({ error: 'Unauthorized: invalid or missing key' }, { status: 401 })
  }

  const client = getSanityClient()
  if (!client) {
    return NextResponse.json({ error: 'Sanity write client is not configured or token missing' }, { status: 500 })
  }

  if (action === 'seed-defaults') {
    try {
      // 1. Seed categories
      const categoryRefs: Record<string, string> = {}
      for (const cat of catalogCategories) {
        const catId = `category-${cat.id}`
        await client.createOrReplace({
          _id: catId,
          _type: 'productCategory',
          name: {
            _type: 'localizedString',
            ar: cat.name.ar,
            en: cat.name.en,
          },
          order: cat.order,
          visible: true,
        })
        categoryRefs[cat.id] = catId
      }

      // 2. Seed products
      let seededCount = 0
      for (const p of defaultCatalogProducts) {
        const catRef = categoryRefs[p.categoryId] || `category-${p.categoryId}`
        const slug = slugify(p.sku || p.id)
        await client.createOrReplace({
          _id: p.id,
          _type: 'product',
          name: {
            _type: 'localizedString',
            ar: p.name.ar,
            en: p.name.en,
          },
          slug: {
            _type: 'slug',
            current: slug,
          },
          description: {
            _type: 'localizedText',
            ar: p.description.ar,
            en: p.description.en,
          },
          origin: {
            _type: 'localizedString',
            ar: p.origin.ar,
            en: p.origin.en,
          },
          packaging: {
            _type: 'localizedString',
            ar: p.packaging.ar,
            en: p.packaging.en,
          },
          storage: {
            _type: 'localizedText',
            ar: p.storage.ar,
            en: p.storage.en,
          },
          certifications: {
            _type: 'localizedText',
            ar: p.certifications.ar,
            en: p.certifications.en,
          },
          usage: p.usage ? {
            _type: 'localizedText',
            ar: p.usage.ar,
            en: p.usage.en,
          } : undefined,
          category: {
            _type: 'reference',
            _ref: catRef,
          },
          featured: Boolean(p.featured),
          order: p.order,
          visible: true,
        })
        seededCount++
      }

      // 3. Ensure catalogPage singleton exists
      await client.createIfNotExists({
        _id: 'catalogPage',
        _type: 'catalogPage',
        title: {
          _type: 'localizedString',
          ar: 'كتالوج الأصناف والمنتجات التموينية',
          en: 'Wholesale Foodservice Product Catalog',
        },
        subtitle: {
          _type: 'localizedText',
          ar: 'الدليل المعتمد للأصناف والمواد الغذائية التموينية لكبرى المطاعم، الفنادق، ومطابخ الإعاشة في المملكة العربية السعودية.',
          en: 'Official certified catalog of wholesale foodservice ingredients and staples for restaurants, hotels, and central catering kitchens across Saudi Arabia.',
        },
        catalogVersion: '2025.1',
        lastUpdated: new Date().toISOString().split('T')[0],
        bannerAlert: {
          _type: 'localizedString',
          ar: 'الأسعار خاضعة لحجم الكميات وعقود التوريد الدورية · إمكانية توفير عينات للمطابخ المركزية والفنادق',
          en: 'Volume-based pricing and commercial catering contracts · Sample testing available for central commissaries',
        },
        inquiryWhatsApp: '966509971699',
      })

      return NextResponse.json({
        success: true,
        message: 'Successfully seeded 7 wholesale categories and 18 products into Sanity!',
        categoriesCount: catalogCategories.length,
        productsCount: seededCount,
      })
    } catch (err: any) {
      return NextResponse.json({ error: err?.message || 'Error seeding products' }, { status: 500 })
    }
  }

  return NextResponse.json({
    status: 'ready',
    message: 'Send POST with a CSV file (exported from Excel) to import products, or GET with action=seed-defaults to populate default products.',
  })
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const key = (formData.get('key') as string) || new URL(request.url).searchParams.get('key')

    if (key !== 'mnaveth2026') {
      return NextResponse.json({ error: 'Unauthorized: invalid or missing key' }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileText = await file.text()
    const rawRows = parseCsv(fileText)

    if (!rawRows || rawRows.length === 0) {
      return NextResponse.json({ error: 'File is empty or has no data rows' }, { status: 400 })
    }

    const client = getSanityClient()
    const results: any[] = []
    const categoriesSeen = new Map<string, string>()

    for (let index = 0; index < rawRows.length; index++) {
      const row = rawRows[index]

      const sku = String(row['كود الصنف (SKU)'] || row['كود الصنف'] || row['sku'] || row['SKU'] || `MNV-${index + 1}`).trim()
      const nameAr = String(row['اسم الصنف بالعربي'] || row['اسم الصنف'] || row['name_ar'] || row['name'] || '').trim()
      const nameEn = String(row['Product Name (EN)'] || row['Product Name'] || row['name_en'] || nameAr).trim()

      if (!nameAr) continue

      const catAr = String(row['التصنيف بالعربي'] || row['التصنيف'] || row['category_ar'] || row['category'] || 'أصناف تموينية عامة').trim()
      const catEn = String(row['Category (EN)'] || row['Category'] || row['category_en'] || catAr).trim()

      const originAr = String(row['بلد المنشأ'] || row['المنشأ'] || row['origin_ar'] || row['origin'] || '').trim()
      const originEn = String(row['Origin (EN)'] || row['origin_en'] || originAr).trim()

      const packagingAr = String(row['التعبئة والتغليف'] || row['التعبئة'] || row['العبوة'] || row['packaging_ar'] || '').trim()
      const packagingEn = String(row['Packaging (EN)'] || row['packaging_en'] || packagingAr).trim()

      const storageAr = String(row['درجة التخزين'] || row['التخزين'] || row['storage_ar'] || '').trim()
      const storageEn = String(row['Storage (EN)'] || row['storage_en'] || storageAr).trim()

      const certAr = String(row['الشهادات والاعتمادات'] || row['الشهادات'] || row['certifications_ar'] || '').trim()
      const certEn = String(row['Certifications (EN)'] || row['certifications_en'] || certAr).trim()

      const descAr = String(row['الوصف والمواصفات'] || row['الوصف'] || row['description_ar'] || '').trim()
      const descEn = String(row['Description (EN)'] || row['description_en'] || descAr).trim()

      const priceVal = parseFloat(row['السعر التقديري'] || row['السعر'] || row['price'])
      const hasPrice = !isNaN(priceVal) && priceVal > 0

      let catRefId = categoriesSeen.get(catAr)
      if (!catRefId) {
        const catSlug = slugify(catEn || catAr) || `cat-${index + 1}`
        catRefId = `category-${catSlug}`
        categoriesSeen.set(catAr, catRefId)

        if (client) {
          await client.createIfNotExists({
            _id: catRefId,
            _type: 'productCategory',
            name: { _type: 'localizedString', ar: catAr, en: catEn },
            order: categoriesSeen.size,
            visible: true,
          })
        }
      }

      const prodSlug = slugify(sku || nameEn) || `item-${index + 1}`
      const prodId = `prod-${prodSlug}`

      const productDoc: any = {
        _id: prodId,
        _type: 'product',
        name: { _type: 'localizedString', ar: nameAr, en: nameEn },
        slug: { _type: 'slug', current: prodSlug },
        description: { _type: 'localizedText', ar: descAr || nameAr, en: descEn || nameEn },
        origin: originAr ? { _type: 'localizedString', ar: originAr, en: originEn } : undefined,
        packaging: packagingAr ? { _type: 'localizedString', ar: packagingAr, en: packagingEn } : undefined,
        storage: storageAr ? { _type: 'localizedText', ar: storageAr, en: storageEn } : undefined,
        certifications: certAr ? { _type: 'localizedText', ar: certAr, en: certEn } : undefined,
        category: catRefId ? { _type: 'reference', _ref: catRefId } : undefined,
        order: index + 1,
        visible: true,
      }

      if (hasPrice) {
        productDoc.showPrice = true
        productDoc.price = { amount: priceVal, unit: { _type: 'localizedString', ar: 'ر.س', en: 'SAR' } }
      }

      if (client) {
        await client.createOrReplace(productDoc)
      }

      results.push({
        sku,
        nameAr,
        nameEn,
        categoryAr: catAr,
        status: client ? 'synced_to_sanity' : 'parsed_only',
      })
    }

    return NextResponse.json({
      success: true,
      totalRows: rawRows.length,
      importedCount: results.length,
      categoriesCount: categoriesSeen.size,
      syncedWithSanity: Boolean(client),
      items: results,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error processing spreadsheet file' }, { status: 500 })
  }
}

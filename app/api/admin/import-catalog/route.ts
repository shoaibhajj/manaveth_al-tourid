import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

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

// POST ONLY: Secure bulk import from spreadsheet requiring environment secret
export async function POST(request: Request) {
  try {
    const adminSecret = process.env.ADMIN_API_SECRET
    const authHeader = request.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const key = (formData.get('key') as string) || bearerToken

    if (!adminSecret || key !== adminSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: valid ADMIN_API_SECRET required' },
        { status: 401 }
      )
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
    if (!client) {
      return NextResponse.json(
        { error: 'Sanity write client is not configured' },
        { status: 500 }
      )
    }

    const results: any[] = []
    const categoriesSeen = new Map<string, string>()

    for (let index = 0; index < rawRows.length; index++) {
      const row = rawRows[index]

      const sku = String(
        row['كود الصنف (SKU)'] || row['كود الصنف'] || row['sku'] || row['SKU'] || `MNV-${index + 1}`
      ).trim()
      const nameAr = String(
        row['اسم الصنف بالعربي'] || row['اسم الصنف'] || row['name_ar'] || row['name'] || ''
      ).trim()
      const nameEn = String(
        row['Product Name (EN)'] || row['Product Name'] || row['name_en'] || nameAr
      ).trim()

      if (!nameAr) continue

      const catAr = String(
        row['التصنيف بالعربي'] || row['التصنيف'] || row['category_ar'] || row['category'] || 'أصناف تموينية عامة'
      ).trim()
      const catEn = String(
        row['Category (EN)'] || row['Category'] || row['category_en'] || catAr
      ).trim()

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

        await client.createIfNotExists({
          _id: catRefId,
          _type: 'productCategory',
          name: { _type: 'localizedString', ar: catAr, en: catEn },
          order: categoriesSeen.size,
          visible: true,
        })
      }

      // Generate slug from English name as required by F2
      const prodSlug = slugify(nameEn) || slugify(sku) || `item-${index + 1}`
      const prodId = `prod-${prodSlug}`

      const productDoc: any = {
        _id: prodId,
        _type: 'product',
        name: { _type: 'localizedString', ar: nameAr, en: nameEn },
        slug: { _type: 'slug', current: prodSlug },
        sku,
        category: { _type: 'reference', _ref: catRefId },
        order: index + 1,
        visible: true,
      }

      if (descAr) {
        productDoc.description = { _type: 'localizedString', ar: descAr, en: descEn || descAr }
      }
      if (originAr) {
        productDoc.origin = { _type: 'localizedString', ar: originAr, en: originEn || originAr }
      }
      if (packagingAr) {
        productDoc.packaging = { _type: 'localizedString', ar: packagingAr, en: packagingEn || packagingAr }
      }
      if (storageAr) {
        productDoc.storage = { _type: 'localizedString', ar: storageAr, en: storageEn || storageAr }
      }
      if (certAr) {
        productDoc.certifications = { _type: 'localizedString', ar: certAr, en: certEn || certAr }
      }
      if (hasPrice) {
        productDoc.showPrice = true
        productDoc.price = {
          _type: 'productPrice',
          amount: priceVal,
          unit: { _type: 'localizedString', ar: 'ر.س', en: 'SAR' },
        }
      }

      const res = await client.createOrReplace(productDoc)
      results.push({ id: res._id, name: nameAr, sku })
    }

    return NextResponse.json({
      success: true,
      importedCount: results.length,
      items: results,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error while importing catalog' },
      { status: 500 }
    )
  }
}

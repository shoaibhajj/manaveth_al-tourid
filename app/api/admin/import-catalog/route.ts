import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'
import { evaluateSeo } from '@/lib/seo/engine/evaluate'

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
  if (text.charCodeAt(0) === 0xfeff) {
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

/**
 * E8: Safe SKU-Based Catalog Importer
 * - Matches existing products by SKU using `*[_type == "product" && sku == $sku][0]`
 * - Patches existing products without overwriting missing fields
 * - Creates new products as draft documents (drafts.prod-...)
 * - Returns structured evaluation report with evaluateSeo indexability status
 */
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

    const report = {
      totalRows: rawRows.length,
      created: [] as any[],
      updated: [] as any[],
      errors: [] as any[],
    }

    const categoriesSeen = new Map<string, string>()

    for (let index = 0; index < rawRows.length; index++) {
      const row = rawRows[index]

      try {
        const sku = String(
          row['كود الصنف (SKU)'] || row['كود الصنف'] || row['sku'] || row['SKU'] || ''
        ).trim()
        const nameAr = String(
          row['اسم الصنف بالعربي'] || row['اسم الصنف'] || row['name_ar'] || row['name'] || ''
        ).trim()
        const nameEn = String(
          row['Product Name (EN)'] || row['Product Name'] || row['name_en'] || nameAr
        ).trim()

        if (!sku || !nameAr) {
          report.errors.push({
            row: index + 2,
            sku: sku || 'MISSING',
            reason: 'Missing mandatory SKU or Arabic product name',
          })
          continue
        }

        const productType = String(
          row['نوع المنتج (Product Type)'] || row['productType'] || 'meat'
        ).trim()

        const catAr = String(
          row['التصنيف بالعربي'] || row['التصنيف'] || row['category_ar'] || 'أصناف تموينية عامة'
        ).trim()
        const catEn = String(
          row['Category (EN)'] || row['Category'] || row['category_en'] || catAr
        ).trim()

        const brandName = String(row['العلامة التجارية (Brand)'] || row['العلامة التجارية'] || row['brand'] || '').trim()
        const originAr = String(row['بلد المنشأ'] || row['المنشأ'] || row['origin_ar'] || '').trim()
        const packagingAr = String(row['التعبئة والتغليف'] || row['التعبئة'] || row['العبوة'] || row['packaging_ar'] || '').trim()
        const storageAr = String(row['درجة التخزين'] || row['التخزين'] || row['storage_ar'] || '').trim()
        const moqText = String(row['الحد الأدنى للطلب (MOQ)'] || row['الحد الأدنى'] || row['moq'] || '').trim()
        const serviceAreasText = String(row['مناطق ومدن الخدمة'] || row['مدن الخدمة'] || '').trim()
        const certAr = String(row['الشهادات والاعتمادات'] || row['الشهادات'] || row['certifications_ar'] || '').trim()
        const descAr = String(row['الوصف والمواصفات'] || row['الوصف'] || row['description_ar'] || '').trim()
        const imageUrl = String(row['رابط الصورة'] || row['image'] || '').trim()

        const priceVal = parseFloat(row['السعر التقديري'] || row['السعر'] || row['price'])
        const hasPrice = !isNaN(priceVal) && priceVal > 0

        // Resolve or create category
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

        // 1. Search for existing product by SKU
        const existingProduct = await client.fetch(
          `*[_type == "product" && sku == $sku][0]{_id, slug, name, sku}`,
          { sku }
        )

        const fieldsToSet: Record<string, any> = {
          name: { _type: 'localizedString', ar: nameAr, en: nameEn },
          category: { _type: 'reference', _ref: catRefId },
          productType,
          visible: true,
        }

        if (descAr) {
          fieldsToSet.description = { _type: 'localizedString', ar: descAr, en: descAr }
        }
        if (originAr) {
          fieldsToSet.origin = { _type: 'localizedString', ar: originAr, en: originAr }
        }
        if (packagingAr) {
          fieldsToSet.packaging = { _type: 'localizedString', ar: packagingAr, en: packagingAr }
          fieldsToSet.packSizes = [{ size: packagingAr }]
        }
        if (storageAr) {
          fieldsToSet.storage = { _type: 'localizedString', ar: storageAr, en: storageAr }
          fieldsToSet.storageState = storageAr.includes('مجمد') || storageAr.includes('-18') ? 'frozen' : 'chilled'
        }
        if (moqText) {
          fieldsToSet.moq = { amount: parseInt(moqText.replace(/\D/g, '') || '1', 10), unit: moqText }
        }
        if (certAr) {
          fieldsToSet.certifications = { _type: 'localizedString', ar: certAr, en: certAr }
        }
        if (imageUrl) {
          fieldsToSet.image = imageUrl
        }
        if (hasPrice) {
          fieldsToSet.showPrice = true
          fieldsToSet.price = {
            _type: 'productPrice',
            amount: priceVal,
            unit: { _type: 'localizedString', ar: 'ر.س', en: 'SAR' },
          }
        }

        // SEO evaluation on imported document
        const evaluation = evaluateSeo({
          id: sku,
          sku,
          name: { ar: nameAr, en: nameEn },
          description: descAr ? { ar: descAr, en: descAr } : undefined,
          image: imageUrl || undefined,
          category: { id: catRefId },
          productType,
          origin: originAr ? { ar: originAr, en: originAr } : undefined,
          packaging: packagingAr ? { ar: packagingAr, en: packagingAr } : undefined,
          storage: storageAr ? { ar: storageAr, en: storageAr } : undefined,
          moq: moqText ? { amount: 1, unit: moqText } : undefined,
        } as any, 'ar')

        if (existingProduct) {
          // UPDATE existing product without deleting unmapped fields (Safe Patch)
          await client.patch(existingProduct._id).set(fieldsToSet).commit()

          report.updated.push({
            id: existingProduct._id,
            sku,
            name: nameAr,
            slug: existingProduct.slug?.current || existingProduct.slug,
            isIndexable: evaluation.isIndexable,
            score: evaluation.score,
          })
        } else {
          // CREATE new product as a DRAFT so editors can review and publish
          const prodSlug = slugify(nameEn) || slugify(sku) || `item-${index + 1}`
          const draftId = `drafts.prod-${prodSlug}`

          const newDoc = {
            _id: draftId,
            _type: 'product',
            sku,
            slug: { _type: 'slug', current: prodSlug },
            order: index + 1,
            ...fieldsToSet,
          }

          const created = await client.create(newDoc)

          report.created.push({
            id: created._id,
            sku,
            name: nameAr,
            slug: prodSlug,
            isDraft: true,
            isIndexable: evaluation.isIndexable,
            score: evaluation.score,
            missingFields: evaluation.missingFields,
          })
        }
      } catch (rowErr: any) {
        report.errors.push({
          row: index + 2,
          reason: rowErr?.message || 'Processing error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: report.totalRows,
        createdCount: report.created.length,
        updatedCount: report.updated.length,
        errorCount: report.errors.length,
      },
      report,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error while importing catalog' },
      { status: 500 }
    )
  }
}

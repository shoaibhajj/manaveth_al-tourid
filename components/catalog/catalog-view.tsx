'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Download,
  Printer,
  Search,
  FileSpreadsheet,
  Check,
  Copy,
  ArrowUpLeft,
  ArrowUpRight,
  Sparkles,
  X,
  UploadCloud,
  FileText,
} from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import {
  type CatalogProduct,
  catalogCategories,
  defaultCatalogProducts,
} from '@/lib/content/catalog-data'

type Props = {
  initialProducts?: CatalogProduct[]
  catalogConfig?: {
    title?: { ar: string; en: string }
    subtitle?: { ar: string; en: string }
    catalogVersion?: string
    lastUpdated?: string
    pdfFileUrl?: string
    externalPdfUrl?: string
    bannerAlert?: { ar: string; en: string }
    downloadNote?: { ar: string; en: string }
    inquiryWhatsApp?: string
  }
}

export function CatalogView({ initialProducts, catalogConfig }: Props) {
  const { locale, localize, t } = useLocale()
  const isAr = locale === 'ar'

  const productsList = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts
    return defaultCatalogProducts
  }, [initialProducts])

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [copiedLink, setCopiedLink] = useState(false)

  // Admin Import Modal state
  const [showImportModal, setShowImportModal] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName =
          (item.name.ar && item.name.ar.toLowerCase().includes(q)) ||
          (item.name.en && item.name.en.toLowerCase().includes(q))
        const matchSku = item.sku && item.sku.toLowerCase().includes(q)
        return matchName || matchSku
      }
      return true
    })
  }, [productsList, selectedCategory, searchQuery])

  // Categories with live count
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    productsList.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1
    })
    return catalogCategories.map((c) => ({
      ...c,
      count: counts[c.id] || 0,
    }))
  }, [productsList])

  // Grouped products by category for sections
  const productsGrouped = useMemo(() => {
    if (selectedCategory !== 'all') {
      const cat = catalogCategories.find((c) => c.id === selectedCategory)
      if (cat) return [{ category: cat, items: filteredProducts }]
      return []
    }
    const groups: { category: (typeof catalogCategories)[0]; items: CatalogProduct[] }[] = []
    catalogCategories.forEach((cat) => {
      const items = filteredProducts.filter((p) => p.categoryId === cat.id)
      if (items.length > 0) {
        groups.push({ category: cat, items })
      }
    })
    return groups
  }, [filteredProducts, selectedCategory])

  const copyLiveLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/catalog` : 'https://www.mnaveth-altourid.com/catalog'
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleDownloadPdf = () => {
    if (catalogConfig?.pdfFileUrl) {
      window.open(catalogConfig.pdfFileUrl, '_blank')
    } else if (catalogConfig?.externalPdfUrl) {
      window.open(catalogConfig.externalPdfUrl, '_blank')
    } else {
      handlePrint()
    }
  }

  const catalogTitle =
    catalogConfig?.title ? t(catalogConfig.title) : isAr ? 'كتالوج وقائمة الأصناف التموينية' : 'Wholesale Product Menu'

  const catalogSubtitle =
    catalogConfig?.subtitle
      ? t(catalogConfig.subtitle)
      : isAr
      ? 'دليل الأصناف التموينية المعتمدة. اضغط على أي منتج للاطلاع على كافة تفاصيله ومواصفاته الفنية.'
      : 'Official certified catalog menu. Click any product to view its complete specifications and compliance details.'

  const versionText = catalogConfig?.catalogVersion || '2025.1'
  const lastUpdated = catalogConfig?.lastUpdated || '2025-03-01'

  const handleSeedDefaults = async () => {
    setImportStatus(isAr ? 'جاري تهيئة الأصناف التلقائية...' : 'Seeding default products...')
    try {
      const res = await fetch(`/api/admin/import-catalog?key=${adminKey || 'mnaveth2026'}&action=seed-defaults`)
      const data = await res.json()
      if (res.ok && data.success) {
        setImportStatus(isAr ? `✅ تم بنجاح! تم استيراد ${data.productsCount} صنفاً إلى Sanity.` : `✅ Success! Seeded ${data.productsCount} products into Sanity.`)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setImportStatus(`❌ خطأ: ${data.error || 'فشل الاستيراد'}`)
      }
    } catch (err: any) {
      setImportStatus(`❌ حدث خطأ في الاتصال: ${err.message}`)
    }
  }

  const handleUploadCsv = async () => {
    if (!uploadFile) {
      setImportStatus(isAr ? 'يرجى اختيار ملف إكسل أو CSV أولاً' : 'Please select a file first')
      return
    }
    setImportStatus(isAr ? 'جاري رفع ومعالجة الأصناف...' : 'Processing and uploading...')
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('file', uploadFile)
        formData.append('key', adminKey || 'mnaveth2026')

        const res = await fetch('/api/admin/import-catalog', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setImportStatus(
            isAr
              ? `✅ تم بنجاح! تم إدراج ${data.totalRows} صنفاً في Sanity.`
              : `✅ Success! Imported ${data.totalRows} products into Sanity.`
          )
          setTimeout(() => window.location.reload(), 2000)
        } else {
          setImportStatus(`❌ فشل: ${data.error || 'حدث خطأ'}`)
        }
      } catch (err: any) {
        setImportStatus(`❌ خطأ: ${err.message}`)
      }
    })
  }

  const getProductHref = (product: CatalogProduct) => {
    const slug = product.slug || product.sku || product.id
    return localize(`/products/${slug}`)
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-forest-deep">
      {/* 1. HEADER SECTION (COMPACT & MODERN) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-deep via-[#123830] to-forest-deep px-4 pt-10 pb-12 text-cream md:pt-14 md:pb-16 print:bg-white print:p-4 print:text-black">
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] print:hidden" />

        <div className="relative mx-auto max-w-7xl text-center">
          {/* Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold text-gold-light print:hidden">
            <Sparkles className="size-3.5 text-gold" />
            <span>{isAr ? 'قائمة الأصناف التموينية المعتمدة' : 'Official Wholesale Menu'}</span>
            <span className="mx-1 text-gold/40">|</span>
            <span>{isAr ? 'سجل تجاري: 1116011768' : 'CR: 1116011768'}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-5xl print:text-2xl print:text-black">
            {catalogTitle}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-2.5 max-w-2xl text-xs text-cream/80 sm:text-sm md:text-base print:text-xs print:text-gray-700">
            {catalogSubtitle}
          </p>

          {/* Action Buttons Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 print:hidden">
            <button
              onClick={handleDownloadPdf}
              className="group inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-forest-deep shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="size-4" />
              <span>{isAr ? 'تحميل الكتالوج (PDF)' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-white/10 px-4 py-2.5 text-xs font-semibold text-cream transition-all hover:bg-white/20 active:scale-[0.98]"
            >
              <Printer className="size-4 text-gold-light" />
              <span>{isAr ? 'طباعة القائمة' : 'Print Menu'}</span>
            </button>

            <button
              onClick={copyLiveLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-cream/90 hover:bg-white/10"
              title={isAr ? 'نسخ رابط النسخة المحدثة' : 'Copy live version link'}
            >
              {copiedLink ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-300">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-gold-light" />
                  <span>{isAr ? 'نسخ الرابط المحدث' : 'Share Link'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gold/30 bg-gold/15 px-3.5 py-2.5 text-xs font-medium text-gold-light hover:bg-gold/25"
              title={isAr ? 'استيراد من إكسل' : 'Excel Import'}
            >
              <FileSpreadsheet className="size-3.5" />
              <span>{isAr ? 'إكسل (Excel)' : 'Excel'}</span>
            </button>
          </div>

          {/* Version Notice Pill */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-black/30 px-4 py-1 text-[11px] text-cream/70 backdrop-blur-sm print:hidden">
            <span className="font-semibold text-gold-light">
              {isAr ? `الإصدار: ${versionText}` : `Version: ${versionText}`}
            </span>
            <span>·</span>
            <span>{isAr ? `محدث بتاريخ: ${lastUpdated}` : `Updated: ${lastUpdated}`}</span>
            <span>·</span>
            <span className="text-emerald-300 font-medium">{isAr ? 'تحديث تلقائي مستمر' : 'Auto-updated'}</span>
          </div>
        </div>
      </section>

      {/* 2. PRINT HEADER ONLY */}
      <div className="hidden print:block print:p-6 print:border-b-2 print:border-black print:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-black">شركة منافذ التوريد للتجارة</h1>
            <p className="text-xs text-gray-700">قائمة الأصناف التموينية المعتمدة | س.ت: 1116011768</p>
          </div>
          <div className="text-left text-xs text-gray-600">
            <p>الإصدار: {versionText} | www.mnaveth-altourid.com/catalog</p>
          </div>
        </div>
      </div>

      {/* 3. STICKY CATEGORY TABS & SEARCH BAR */}
      <section className="sticky top-16 z-30 border-b border-gold/20 bg-white/95 px-4 py-3 shadow-xs backdrop-blur-md md:top-20 print:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute inset-y-0 start-3 my-auto size-4 text-forest/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isAr ? 'ابحث باسم الصنف...' : 'Search products by name...'
                }
                className="w-full rounded-xl border border-forest/15 bg-[#FBF8F2] py-2 ps-9 pe-8 text-xs text-forest-deep placeholder:text-forest/40 focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 end-2.5 my-auto flex size-4 items-center justify-center rounded-full text-forest/40 hover:text-forest"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Total count badge */}
            <div className="hidden md:block text-xs font-semibold text-forest/70">
              {isAr
                ? `${filteredProducts.length} صنف معتمد`
                : `${filteredProducts.length} products available`}
            </div>
          </div>

          {/* Category Tabs (فهرس الأصناف السريع) */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-forest text-cream shadow-xs font-bold'
                  : 'border border-forest/15 bg-white text-forest/75 hover:border-gold hover:text-forest'
              }`}
            >
              {isAr ? 'الكل' : 'All'} ({productsList.length})
            </button>

            {categoriesWithCounts.map((cat) => {
              const active = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all ${
                    active
                      ? 'bg-forest text-cream shadow-xs font-bold'
                      : 'border border-forest/15 bg-white text-forest/75 hover:border-gold hover:text-forest'
                  }`}
                >
                  <span>{t(cat.name)}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      active ? 'bg-gold text-forest-deep font-bold' : 'bg-forest/10 text-forest/70'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. MAIN PRODUCT MENU GRID (COMPACT & FAST SCANNING) */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-white p-12 text-center">
            <Search className="size-10 text-forest/30 mb-2" />
            <h3 className="text-base font-bold text-forest">
              {isAr ? 'لم يتم العثور على أصناف مطابقة' : 'No matching products found'}
            </h3>
            <p className="mt-1 text-xs text-forest/60">
              {isAr ? 'يرجى كتابة اسم آخر أو اختيار تصنيف مختلف.' : 'Please try another search keyword or category.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-3 rounded-lg bg-forest px-4 py-1.5 text-xs font-bold text-cream hover:bg-forest/90"
            >
              {isAr ? 'عرض كل الأصناف' : 'Show All Products'}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {productsGrouped.map((group) => (
              <section key={group.category.id} id={group.category.id} className="scroll-mt-36">
                {/* Clean Section Divider */}
                <div className="mb-4 flex items-center justify-between border-b border-forest/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-gold" />
                    <h2 className="text-lg font-black text-forest-deep md:text-xl">
                      {t(group.category.name)}
                    </h2>
                    <span className="rounded-md bg-forest/5 px-2 py-0.5 text-xs font-semibold text-forest/60">
                      {group.items.length} {isAr ? 'صنف' : 'items'}
                    </span>
                  </div>
                </div>

                {/* COMPACT PRODUCT GRID: 2 cols on mobile, 3 on small, 4 on tablet, 5 on desktop, 6 on xl */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4 print:grid-cols-4 print:gap-3">
                  {group.items.map((product) => {
                    const productHref = getProductHref(product)
                    return (
                      <Link
                        key={product.id}
                        href={productHref}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lg print:break-inside-avoid print:border-gray-200"
                      >
                        {/* 1. PRODUCT IMAGE ONLY */}
                        <div className="relative aspect-square w-full overflow-hidden bg-[#F5F2EA]">
                          <Image
                            src={product.image || '/images/hero.png'}
                            alt={t(product.name)}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-108"
                          />
                          {/* Minimal SKU tag */}
                          {product.sku && (
                            <div className="absolute top-2 start-2 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-white/90 backdrop-blur-xs">
                              {product.sku}
                            </div>
                          )}

                          {/* Hover Overlay with arrow */}
                          <div className="absolute inset-0 flex items-center justify-center bg-forest-deep/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 print:hidden">
                            <span className="flex size-8 items-center justify-center rounded-full bg-white text-forest shadow-md">
                              {isAr ? (
                                <ArrowUpLeft className="size-4.5" />
                              ) : (
                                <ArrowUpRight className="size-4.5" />
                              )}
                            </span>
                          </div>
                        </div>

                        {/* 2. PRODUCT NAME ONLY */}
                        <div className="flex flex-1 flex-col justify-between p-3 text-center sm:text-start">
                          <div>
                            <h3 className="text-xs font-bold text-forest-deep transition-colors group-hover:text-gold sm:text-sm line-clamp-2 leading-snug">
                              {product.name.ar}
                            </h3>
                            {product.name.en && product.name.en !== product.name.ar && (
                              <p className="mt-0.5 text-[10px] sm:text-[11px] text-forest/50 font-normal truncate">
                                {product.name.en}
                              </p>
                            )}
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[11px] text-gold font-medium pt-1 border-t border-forest/5 print:hidden">
                            <span>{isAr ? 'عرض التفاصيل' : 'View Details'}</span>
                            <span className="text-forest/30 group-hover:text-gold transition-colors">→</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* 5. EXCEL IMPORT & SEEDING MODAL (FOR ADMIN) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm print:hidden">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gold/40 bg-white p-6 shadow-2xl md:p-8">
            <button
              onClick={() => {
                setShowImportModal(false)
                setImportStatus(null)
              }}
              className="absolute top-5 end-5 flex size-8 items-center justify-center rounded-full bg-forest/5 text-forest/70 hover:bg-forest/10"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase text-gold">
              <FileSpreadsheet className="size-4" />
              <span>{isAr ? 'أداة استيراد الأصناف' : 'Product Importer'}</span>
            </div>

            <h3 className="mt-1 text-xl font-black text-forest-deep">
              {isAr ? 'استيراد الأصناف من ملف إكسل أو CSV' : 'Bulk Import from Spreadsheet'}
            </h3>

            <p className="mt-1.5 text-xs text-forest/75 leading-relaxed">
              {isAr
                ? 'يمكنك تنزيل قالب الإكسل المعتمد، تعبئة المنتجات (حتى 100+ صنف)، ثم رفع الملف ليتم إدراجها وتحديثها فوراً في Sanity وقاعدة البيانات.'
                : 'Download our standard template, fill your items (up to 100+ rows), and upload to sync directly into Sanity.'}
            </p>

            {/* Template Download */}
            <div className="mt-4 rounded-xl border border-gold/30 bg-[#FBF8F2] p-3.5">
              <p className="text-xs font-bold text-forest-deep">
                {isAr ? '1. تحميل قالب إكسل معبأ بأمثلة توضيحية:' : '1. Download standard template:'}
              </p>
              <div className="mt-2">
                <a
                  href="/api/admin/catalog-template"
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3.5 py-1.5 text-xs font-bold text-cream hover:bg-forest/90"
                >
                  <Download className="size-3.5" />
                  <span>{isAr ? 'تنزيل القالب (.csv متوافق مع Excel)' : 'Download Template (.csv)'}</span>
                </a>
              </div>
            </div>

            {/* Upload File Input */}
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-forest-deep">
                {isAr ? '2. اختيار ملف الإكسل المعبأ:' : '2. Select completed spreadsheet:'}
              </label>

              <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-forest/20 p-5 text-center hover:border-gold">
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  id="excel-file-input"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="excel-file-input" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="size-7 text-gold mb-1.5" />
                  <span className="text-xs font-bold text-forest">
                    {uploadFile ? uploadFile.name : isAr ? 'انقر لاختيار الملف من جهازك' : 'Click to select file'}
                  </span>
                  <span className="text-[10px] text-forest/50 mt-0.5">.csv (Excel)</span>
                </label>
              </div>

              {/* Admin Key */}
              <div>
                <label className="block text-[11px] font-semibold text-forest/70 mb-1">
                  {isAr ? 'مفتاح الأمان (Security Key):' : 'Admin Security Key:'}
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="mnaveth2026"
                  className="w-full rounded-lg border border-forest/15 px-3 py-1.5 text-xs font-mono"
                />
              </div>

              {/* Status Output */}
              {importStatus && (
                <div className="rounded-lg bg-[#FBF8F2] p-2.5 text-xs font-medium text-forest-deep border border-forest/10">
                  {importStatus}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={handleUploadCsv}
                  disabled={!uploadFile || isPending}
                  className="flex-1 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-cream hover:bg-forest/90 disabled:opacity-50"
                >
                  {isPending ? (isAr ? 'جاري المعالجة...' : 'Uploading...') : (isAr ? 'بدء استيراد الملف إلى Sanity' : 'Sync to Sanity')}
                </button>

                <button
                  onClick={handleSeedDefaults}
                  disabled={isPending}
                  className="rounded-xl border border-gold/40 bg-gold/15 px-3.5 py-2.5 text-xs font-bold text-forest-deep hover:bg-gold/25"
                >
                  {isAr ? 'تعبئة الـ 18 صنف التلقائية' : 'Seed 18 Items'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PRINT FOOTER (PRINT MEDIA ONLY) */}
      <div className="hidden print:block print:mt-8 print:pt-3 print:border-t print:text-[9px] print:text-gray-600">
        <div className="flex justify-between">
          <span>شركة منافذ التوريد للتجارة | سجل تجاري: 1116011768</span>
          <span>مبيعات: +966509971699 | www.mnaveth-altourid.com/catalog</span>
        </div>
      </div>
    </div>
  )
}

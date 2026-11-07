'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Download,
  Printer,
  Share2,
  Search,
  FileSpreadsheet,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ThermometerSnowflake,
  Truck,
  Award,
  Sparkles,
  RefreshCw,
  FileText,
  X,
  UploadCloud,
  ChevronDown,
  Info,
  Clock,
  PhoneCall,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import { useLocale, useContent } from '@/components/locale-provider'
import {
  type CatalogProduct,
  type CatalogCategory,
  catalogCategories,
  defaultCatalogProducts,
  type TempType,
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
  const { locale, t } = useLocale()
  const content = useContent()
  const isAr = locale === 'ar'

  const productsList = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts
    return defaultCatalogProducts
  }, [initialProducts])

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemp, setSelectedTemp] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeProduct, setActiveProduct] = useState<CatalogProduct | null>(null)

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
      // Temperature filter
      if (selectedTemp !== 'all' && item.tempType !== selectedTemp) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName =
          (item.name.ar && item.name.ar.toLowerCase().includes(q)) ||
          (item.name.en && item.name.en.toLowerCase().includes(q))
        const matchSku = item.sku && item.sku.toLowerCase().includes(q)
        const matchOrigin =
          (item.origin.ar && item.origin.ar.toLowerCase().includes(q)) ||
          (item.origin.en && item.origin.en.toLowerCase().includes(q))
        const matchDesc =
          (item.description.ar && item.description.ar.toLowerCase().includes(q)) ||
          (item.description.en && item.description.en.toLowerCase().includes(q))
        return matchName || matchSku || matchOrigin || matchDesc
      }
      return true
    })
  }, [productsList, selectedCategory, selectedTemp, searchQuery])

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

  // Products grouped by category for Table of Contents layout
  const productsGrouped = useMemo(() => {
    const groups: { category: CatalogCategory; items: CatalogProduct[] }[] = []
    catalogCategories.forEach((cat) => {
      const items = filteredProducts.filter((p) => p.categoryId === cat.id)
      if (items.length > 0) {
        groups.push({ category: cat, items })
      }
    })
    return groups
  }, [filteredProducts])

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
      // Fallback: trigger print dialog formatted as PDF brochure
      handlePrint()
    }
  }

  const catalogTitle =
    catalogConfig?.title ? t(catalogConfig.title) : isAr ? 'كتالوج الأصناف والمنتجات التموينية' : 'Wholesale Foodservice Product Catalog'

  const catalogSubtitle =
    catalogConfig?.subtitle
      ? t(catalogConfig.subtitle)
      : isAr
      ? 'الدليل المعتمد للأصناف والمواد الغذائية التموينية لكبرى المطاعم، الفنادق، ومطابخ الإعاشة في المملكة العربية السعودية.'
      : 'Official certified catalog of wholesale foodservice ingredients and staples for restaurants, hotels, and central catering kitchens across Saudi Arabia.'

  const versionText = catalogConfig?.catalogVersion || '2025.1'
  const lastUpdated = catalogConfig?.lastUpdated || '2025-03-01'
  const phone = catalogConfig?.inquiryWhatsApp || '966509971699'

  const getWhatsAppItemUrl = (product: CatalogProduct) => {
    const msg = isAr
      ? `السلام عليكم، نود الاستفسار وطلب تسعير صنف: ${product.name.ar} (كود: ${product.sku}) - شركة منافذ التوريد.`
      : `Hello, we would like to inquire about wholesale pricing for: ${product.name.en} (SKU: ${product.sku}) - Mnaveeh ALTourid.`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  }

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

  const handleUploadExcel = async () => {
    if (!uploadFile) {
      setImportStatus(isAr ? 'يرجى اختيار ملف إكسل أولاً' : 'Please select an Excel file first')
      return
    }
    setImportStatus(isAr ? 'جاري معالجة ورفع الملف...' : 'Processing and uploading file...')
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
              ? `✅ تم الاستيراد بنجاح! تم قراءة ${data.totalRows} صنفاً وربط ${data.categoriesCount} تصنيفاً.`
              : `✅ Successfully imported ${data.totalRows} items and mapped ${data.categoriesCount} categories.`
          )
          setTimeout(() => window.location.reload(), 2000)
        } else {
          setImportStatus(`❌ فشل الاستيراد: ${data.error || 'حدث خطأ'}`)
        }
      } catch (err: any) {
        setImportStatus(`❌ خطأ: ${err.message}`)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-forest-deep">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="border-b border-gold/25 bg-forest-deep px-4 py-2.5 text-xs text-cream md:text-sm print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-gold-light">
              {isAr ? 'تنويه التوريد التجاري:' : 'B2B Notice:'}
            </span>
            <span className="text-cream/90">
              {catalogConfig?.bannerAlert
                ? t(catalogConfig.bannerAlert)
                : isAr
                ? 'الأسعار خاضعة لحجم التوريد وعقود التوريد الدورية · إمكانية إرسال عينات فحص مخبري للمطابخ المركزية'
                : 'Prices vary by volume and supply contracts · Laboratory testing samples available for commissaries'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="rounded bg-gold/20 px-2.5 py-0.5 text-gold-light font-medium">
              {isAr ? `الإصدار: ${versionText}` : `Version: ${versionText}`}
            </span>
            <span className="text-cream/70">
              {isAr ? `تحديث: ${lastUpdated}` : `Updated: ${lastUpdated}`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-deep via-[#123830] to-forest-deep px-4 pt-12 pb-16 text-cream md:pt-16 md:pb-20 print:bg-white print:p-4 print:text-black">
        {/* Subtle decorative background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] print:hidden" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-light backdrop-blur-sm md:text-sm print:hidden">
              <Sparkles className="size-4 text-gold" />
              <span>{isAr ? 'كتالوج الأصناف والمنتجات التموينية المعتمدة' : 'Official Certified Foodservice Catalog'}</span>
              <span className="mx-1 text-gold/40">|</span>
              <span>{isAr ? 'سجل تجاري: 1116011768' : 'CR: 1116011768'}</span>
            </div>

            {/* Title */}
            <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl print:text-3xl print:text-black">
              {catalogTitle}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-2xl text-base text-cream/80 md:text-lg print:text-sm print:text-gray-700">
              {catalogSubtitle}
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
              {/* Download Official PDF */}
              <button
                onClick={handleDownloadPdf}
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold text-forest-deep shadow-lg shadow-gold/25 transition-all hover:scale-[1.02] hover:shadow-gold/40 active:scale-[0.98]"
              >
                <Download className="size-4.5 transition-transform group-hover:-translate-y-0.5" />
                <span>{isAr ? 'تحميل الكتالوج المعتمد (PDF)' : 'Download Official PDF Catalog'}</span>
              </button>

              {/* Print / Save as PDF */}
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2.5 rounded-xl border border-gold/40 bg-white/10 px-5 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
              >
                <Printer className="size-4.5 text-gold-light" />
                <span>{isAr ? 'طباعة / حفظ كـ PDF فوري' : 'Print / Save as Live PDF'}</span>
              </button>

              {/* Copy Live Version Link */}
              <button
                onClick={copyLiveLink}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm font-medium text-cream/90 backdrop-blur-sm transition-all hover:bg-white/10"
                title={isAr ? 'نسخ رابط النسخة المحدثة' : 'Copy live version link'}
              >
                {copiedLink ? (
                  <>
                    <Check className="size-4 text-emerald-400" />
                    <span className="text-emerald-300">{isAr ? 'تم نسخ الرابط!' : 'Link Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4 text-gold-light" />
                    <span>{isAr ? 'نسخ رابط الكتالوج' : 'Share Catalog Link'}</span>
                  </>
                )}
              </button>

              {/* Excel Import button (Admin) */}
              <button
                onClick={() => setShowImportModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/15 px-4 py-3.5 text-sm font-medium text-gold-light transition-all hover:bg-gold/25"
                title={isAr ? 'استيراد أصناف من ملف إكسل أو تحديث Sanity' : 'Import from Excel / Seed to Sanity'}
              >
                <FileSpreadsheet className="size-4" />
                <span>{isAr ? 'استيراد من إكسل (Excel)' : 'Excel Import'}</span>
              </button>
            </div>

            {/* Version Link Box */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-gold/25 bg-black/30 px-5 py-2.5 text-xs text-cream/80 backdrop-blur-md print:border-gray-300 print:bg-gray-100 print:text-black">
              <span className="font-semibold text-gold-light">
                {isAr ? 'رابط النسخة المحدثة الدائمة:' : 'Permanent Live Version URL:'}
              </span>
              <a
                href="https://www.mnaveth-altourid.com/catalog"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-cream underline decoration-gold/60 underline-offset-4 hover:text-gold-light"
              >
                https://www.mnaveth-altourid.com/catalog
              </a>
              <span className="text-cream/50">·</span>
              <span className="text-cream/70">
                {isAr ? 'يتم التحديث تلقائياً عند إضافة أو تعديل الأصناف' : 'Updated automatically upon new item arrivals'}
              </span>
            </div>
          </div>

          {/* 4 SUPPLY PILLARS */}
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 print:hidden">
            <div className="flex items-center gap-3 rounded-xl border border-gold/20 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-cream md:text-sm">
                  {isAr ? 'مطابقة SFDA 100%' : '100% SFDA Compliant'}
                </p>
                <p className="text-[11px] text-cream/70">
                  {isAr ? 'تراخيص وفحص مخبري دوري' : 'Certified food safety'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gold/20 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold">
                <ThermometerSnowflake className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-cream md:text-sm">
                  {isAr ? 'سلسلة تبريد متصلة' : 'Unbroken Cold Chain'}
                </p>
                <p className="text-[11px] text-cream/70">
                  {isAr ? 'حساسات تتبع حراري -18°C' : 'Continuous temp tracking'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gold/20 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold">
                <Truck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-cream md:text-sm">
                  {isAr ? 'أسطول توريد مباشر' : 'Direct Fleet Delivery'}
                </p>
                <p className="text-[11px] text-cream/70">
                  {isAr ? 'تغطية الرياض وجدة والمناطق' : 'Riyadh, Jeddah & Kingdom-wide'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gold/20 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-cream md:text-sm">
                  {isAr ? 'عقود إعاشة وفنادق' : 'B2B Wholesale Contracts'}
                </p>
                <p className="text-[11px] text-cream/70">
                  {isAr ? 'ثبات الإمداد وجداول أسبوعية' : 'Reliable scheduled replenishment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABLE OF CONTENTS / STICKY INDEX & FILTER BAR */}
      <section className="sticky top-16 z-30 border-b border-gold/20 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md md:top-20 print:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute inset-y-0 start-3.5 my-auto size-4.5 text-forest/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث باسم الصنف، بلد المنشأ، الكود (SKU)...'
                    : 'Search by product name, origin, SKU...'
                }
                className="w-full rounded-xl border border-forest/15 bg-[#FBF8F2] py-2.5 ps-10 pe-9 text-sm text-forest-deep placeholder:text-forest/40 focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 end-3 my-auto flex size-5 items-center justify-center rounded-full text-forest/40 hover:text-forest"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Temperature filter & View Mode toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Temp filter */}
              <div className="flex items-center rounded-lg border border-forest/15 bg-[#FBF8F2] p-1 text-xs">
                <button
                  onClick={() => setSelectedTemp('all')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                    selectedTemp === 'all'
                      ? 'bg-forest text-cream shadow-sm'
                      : 'text-forest/70 hover:text-forest'
                  }`}
                >
                  {isAr ? 'كل درجات الحفظ' : 'All Temperatures'}
                </button>
                <button
                  onClick={() => setSelectedTemp('frozen')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                    selectedTemp === 'frozen'
                      ? 'bg-forest text-cream shadow-sm'
                      : 'text-forest/70 hover:text-forest'
                  }`}
                >
                  ❄️ {isAr ? 'مجمد (-18°)' : 'Frozen'}
                </button>
                <button
                  onClick={() => setSelectedTemp('ambient')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                    selectedTemp === 'ambient'
                      ? 'bg-forest text-cream shadow-sm'
                      : 'text-forest/70 hover:text-forest'
                  }`}
                >
                  📦 {isAr ? 'جاف معتدل' : 'Dry/Ambient'}
                </button>
              </div>

              {/* View Switcher: Grid vs Table */}
              <div className="flex items-center rounded-lg border border-forest/15 bg-[#FBF8F2] p-1 text-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-forest text-cream shadow-sm'
                      : 'text-forest/70 hover:text-forest'
                  }`}
                  title={isAr ? 'عرض البطاقات' : 'Grid View'}
                >
                  <LayoutGrid className="size-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'بطاقات' : 'Grid'}</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                    viewMode === 'table'
                      ? 'bg-forest text-cream shadow-sm'
                      : 'text-forest/70 hover:text-forest'
                  }`}
                  title={isAr ? 'جدول المواصفات' : 'Table View'}
                >
                  <TableIcon className="size-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'جدول المواصفات' : 'Spec Table'}</span>
                </button>
              </div>

              {/* Counter */}
              <div className="rounded-lg bg-gold/15 px-3 py-1.5 text-xs font-semibold text-forest-deep">
                {isAr
                  ? `عرض ${filteredProducts.length} من ${productsList.length} صنف`
                  : `Showing ${filteredProducts.length} of ${productsList.length} items`}
              </div>
            </div>
          </div>

          {/* Category Tabs (فهرس الأصناف) */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-forest text-cream shadow-md shadow-forest/20'
                  : 'border border-forest/15 bg-white text-forest/80 hover:border-gold hover:text-forest'
              }`}
            >
              {isAr ? 'الكل (جميع الأصناف)' : 'All Products'} ({productsList.length})
            </button>

            {categoriesWithCounts.map((cat) => {
              const active = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'bg-forest text-cream shadow-md shadow-forest/20 font-bold'
                      : 'border border-forest/15 bg-white text-forest/80 hover:border-gold hover:text-forest'
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

      {/* 4. PRINT ONLY COVER PAGE & HEADER */}
      <div className="hidden print:block print:p-8 print:border-b-2 print:border-black print:mb-8">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-black text-black">شركة منافذ التوريد للتجارة</h1>
            <p className="text-sm text-gray-700">Mnaveeh ALTourid Commercial Co. | Since 2004</p>
            <p className="text-xs font-mono text-gray-600 mt-1">سجل تجاري: 1116011768 | ترخيص هيئة الغذاء والدواء SFDA</p>
          </div>
          <div className="text-left text-xs">
            <p className="font-bold">كتالوج الأصناف والمنتجات التموينية</p>
            <p className="text-gray-600">الإصدار: {versionText} | تاريخ: {lastUpdated}</p>
            <p className="text-gray-600">النسخة الإلكترونية المحدثة: www.mnaveth-altourid.com/catalog</p>
          </div>
        </div>
      </div>

      {/* 5. MAIN CONTENT AREA */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-white p-12 text-center">
            <Search className="size-12 text-forest/30 mb-3" />
            <h3 className="text-lg font-bold text-forest">
              {isAr ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'No matching products found'}
            </h3>
            <p className="mt-1 text-sm text-forest/60">
              {isAr
                ? 'جرب البحث بكلمة أخرى، أو قم بإلغاء تصفيات الفئات ودرجات التخزين.'
                : 'Try searching with different keywords or clearing active filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedTemp('all')
              }}
              className="mt-4 rounded-xl bg-forest px-5 py-2 text-xs font-bold text-cream hover:bg-forest/90"
            >
              {isAr ? 'إعادة ضبط عوامل التصفية' : 'Reset All Filters'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="space-y-12">
            {productsGrouped.map((group) => (
              <section key={group.category.id} id={group.category.id} className="scroll-mt-40">
                {/* Category Header */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-gold/30 pb-3">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-gold">
                      <span>{isAr ? 'فهرس الأصناف' : 'Catalog Section'}</span>
                      <span>·</span>
                      <span>{group.items.length} {isAr ? 'أصناف معتمدة' : 'certified items'}</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-forest md:text-3xl">
                      {t(group.category.name)}
                    </h2>
                    {group.category.description && (
                      <p className="mt-1 text-xs text-forest/70 md:text-sm">
                        {t(group.category.description)}
                      </p>
                    )}
                  </div>

                  <a
                    href={`#${group.category.id}`}
                    className="text-xs font-medium text-forest/60 hover:text-gold print:hidden"
                  >
                    #{group.category.id}
                  </a>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((product) => (
                    <article
                      key={product.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl print:break-inside-avoid print:border-gray-300"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-forest-deep/5 to-gold/10">
                        <Image
                          src={product.image || '/images/hero.png'}
                          alt={t(product.name)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* SKU Badge */}
                        <div className="absolute top-3 start-3 rounded-md bg-forest-deep/85 px-2.5 py-1 text-[11px] font-mono font-bold text-gold-light backdrop-blur-sm">
                          {product.sku}
                        </div>

                        {/* Storage Temp Badge */}
                        <div className="absolute top-3 end-3 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-forest-deep shadow-sm backdrop-blur-sm">
                          {product.tempType === 'frozen' ? '❄️ مجمد' : product.tempType === 'chilled' ? '🧊 مبرد' : '📦 جاف'}
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2">
                          <span className="text-[11px] font-semibold text-gold">
                            {t(product.categoryName)}
                          </span>
                          <h3 className="text-lg font-bold text-forest-deep transition-colors group-hover:text-forest">
                            {t(product.name)}
                          </h3>
                        </div>

                        <p className="line-clamp-2 text-xs text-forest/75 mb-4">
                          {t(product.description)}
                        </p>

                        {/* Key Specs Pills */}
                        <div className="mt-auto space-y-2 border-t border-forest/5 pt-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-forest/60">{isAr ? 'بلد المنشأ:' : 'Origin:'}</span>
                            <span className="font-semibold text-forest-deep">{t(product.origin)}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-forest/60">{isAr ? 'العبوة والتعبئة:' : 'Packaging:'}</span>
                            <span className="font-medium text-forest-deep text-end max-w-[65%] truncate">
                              {t(product.packaging)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-forest/60">{isAr ? 'الاعتماد الصحي:' : 'Inspection:'}</span>
                            <span className="inline-flex items-center gap-1 font-medium text-emerald-700 text-end">
                              <ShieldCheck className="size-3.5 shrink-0" />
                              <span className="truncate max-w-[160px]">{t(product.certifications)}</span>
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-forest/10 flex items-center gap-2 print:hidden">
                          <button
                            onClick={() => setActiveProduct(product)}
                            className="flex-1 rounded-xl border border-forest/20 bg-[#FBF8F2] py-2.5 text-xs font-bold text-forest-deep transition-colors hover:bg-forest hover:text-cream"
                          >
                            {isAr ? 'المواصفات الكاملة' : 'Full Specs'}
                          </button>

                          <a
                            href={getWhatsAppItemUrl(product)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-emerald-700"
                            title={isAr ? 'طلب تسعير الصنف عبر واتساب' : 'Inquire on WhatsApp'}
                          >
                            <MessageCircle className="size-4" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* SPEC SHEET / TABLE VIEW */
          <div className="overflow-x-auto rounded-2xl border border-forest/15 bg-white shadow-sm">
            <table className="w-full text-start text-xs md:text-sm">
              <thead className="border-b border-forest/15 bg-forest-deep text-cream">
                <tr>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'كود الصنف' : 'SKU'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'اسم الصنف والمواصفات' : 'Product & Specs'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'التصنيف' : 'Category'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'بلد المنشأ' : 'Origin'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'التعبئة والوزن' : 'Packaging'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'درجة الحفظ' : 'Storage'}</th>
                  <th className="py-3.5 px-4 text-start font-bold">{isAr ? 'الاعتمادات' : 'Certifications'}</th>
                  <th className="py-3.5 px-4 text-center font-bold print:hidden">{isAr ? 'تسعير الصنف' : 'Quote'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gold/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-forest text-xs">{p.sku}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image src={p.image} alt={t(p.name)} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-forest-deep">{t(p.name)}</p>
                          <p className="text-xs text-forest/60 line-clamp-1">{t(p.description)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-forest/80 font-medium">{t(p.categoryName)}</td>
                    <td className="py-3 px-4 font-medium">{t(p.origin)}</td>
                    <td className="py-3 px-4 text-xs">{t(p.packaging)}</td>
                    <td className="py-3 px-4 text-xs font-mono">{t(p.storage)}</td>
                    <td className="py-3 px-4 text-xs text-emerald-800">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <ShieldCheck className="size-3.5" />
                        {t(p.certifications)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center print:hidden">
                      <a
                        href={getWhatsAppItemUrl(p)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <MessageCircle className="size-3.5" />
                        <span>{isAr ? 'تسعير' : 'Quote'}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. BOTTOM B2B CONTRACT CALLOUT */}
        <section className="mt-16 rounded-3xl border border-gold/30 bg-gradient-to-br from-forest-deep to-[#091D18] p-8 text-cream shadow-2xl md:p-12 print:hidden">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-2xl text-center md:text-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-xs font-bold text-gold-light">
                <Building2 className="size-3.5" />
                {isAr ? 'إدارة المبيعات وعقود التوريد المؤسسي' : 'Institutional Sales & Supply Contracts'}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-white md:text-3xl">
                {isAr ? 'هل تحتاج إلى عرض سعر خاص لكميات أسبوعية أو سنوية؟' : 'Need a custom wholesale quote for recurring supply?'}
              </h2>
              <p className="mt-2 text-sm text-cream/80">
                {isAr
                  ? 'نوفر حلول إمداد مرنة، عقود توريد مجدولة، وفواتير إلكترونية ضريبية معتمدة مع التزام كامل بسلاسل التبريد والتوصيل المباشر لمستودعاتكم ومطابخكم.'
                  : 'We offer flexible supply contracts, scheduled delivery schedules, and certified tax invoices with total cold chain compliance Kingdom-wide.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  isAr
                    ? 'السلام عليكم، نرغب في طلب تسعير وعقد توريد منتجات غذائية لكبرى الكميات.'
                    : 'Hello, we would like to request wholesale contract pricing for bulk food supply.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold text-forest-deep shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="size-4.5" />
                <span>{isAr ? 'محادثة المبيعات المباشرة' : 'Chat with Sales Manager'}</span>
              </a>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-cream hover:bg-white/20"
              >
                <Printer className="size-4" />
                <span>{isAr ? 'طباعة الكتالوج للمراجعة' : 'Print Catalog Sheet'}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 7. PRODUCT SPECIFICATION MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm print:hidden">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gold/30 bg-white p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-5 end-5 flex size-9 items-center justify-center rounded-full bg-forest/5 text-forest/70 hover:bg-forest/10 hover:text-forest"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold">
              <span>{activeProduct.sku}</span>
              <span>·</span>
              <span>{t(activeProduct.categoryName)}</span>
            </div>

            <h3 className="mt-1 text-2xl font-black text-forest-deep">
              {t(activeProduct.name)}
            </h3>

            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={activeProduct.image}
                alt={t(activeProduct.name)}
                fill
                className="object-cover"
              />
            </div>

            <p className="mt-4 text-sm text-forest/80 leading-relaxed">
              {t(activeProduct.description)}
            </p>

            {/* Detailed Spec Grid */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-2xl bg-[#FBF8F2] p-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-forest/60">{isAr ? 'بلد المنشأ والمسلخ:' : 'Origin & Plant:'}</span>
                <p className="font-bold text-forest-deep">{t(activeProduct.origin)}</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-forest/60">{isAr ? 'مواصفة التعبئة والتغليف:' : 'Packaging Specs:'}</span>
                <p className="font-bold text-forest-deep">{t(activeProduct.packaging)}</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-forest/60">{isAr ? 'تعليمات التخزين ودرجة الحرارة:' : 'Storage Instructions:'}</span>
                <p className="font-bold text-forest-deep">{t(activeProduct.storage)}</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-forest/60">{isAr ? 'شهادات الجودة والسلامة:' : 'Certifications:'}</span>
                <p className="font-bold text-emerald-800">{t(activeProduct.certifications)}</p>
              </div>

              {activeProduct.usage && (
                <div className="sm:col-span-2 space-y-1 border-t border-forest/10 pt-2">
                  <span className="font-semibold text-forest/60">{isAr ? 'الاستخدامات الموصى بها:' : 'Recommended Applications:'}</span>
                  <p className="font-medium text-forest-deep">{t(activeProduct.usage)}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-forest/10">
              <button
                onClick={() => setActiveProduct(null)}
                className="rounded-xl border border-forest/20 px-5 py-2.5 text-xs font-bold text-forest hover:bg-forest/5"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>

              <a
                href={getWhatsAppItemUrl(activeProduct)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <MessageCircle className="size-4" />
                <span>{isAr ? 'طلب تسعير فوري عبر واتساب' : 'Request Quote on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 8. EXCEL IMPORT & SEEDING MODAL (ADMIN TOOL) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm print:hidden">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-gold/40 bg-white p-6 shadow-2xl md:p-8">
            <button
              onClick={() => {
                setShowImportModal(false)
                setImportStatus(null)
              }}
              className="absolute top-5 end-5 flex size-9 items-center justify-center rounded-full bg-forest/5 text-forest/70 hover:bg-forest/10"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase text-gold">
              <FileSpreadsheet className="size-4" />
              <span>{isAr ? 'أداة استيراد الأصناف التموينية' : 'Product Catalog Bulk Importer'}</span>
            </div>

            <h3 className="mt-1 text-2xl font-black text-forest-deep">
              {isAr ? 'استيراد المنتجات من ملف إكسل (Excel / CSV)' : 'Import Products from Excel Sheet'}
            </h3>

            <p className="mt-2 text-xs text-forest/75 leading-relaxed">
              {isAr
                ? 'يمكنك تنزيل قالب الإكسل المعتمد، تعبئة بيانات الأصناف، ثم رفع الملف ليتم إدراجها وتحديثها فوراً في Sanity وقاعدة البيانات.'
                : 'Download our official Excel template, fill your product rows, and upload it here to bulk sync directly into Sanity.'}
            </p>

            {/* Template Download Button */}
            <div className="mt-4 rounded-2xl border border-gold/30 bg-[#FBF8F2] p-4">
              <p className="text-xs font-bold text-forest-deep">
                {isAr ? '1. تحميل قالب إكسل المعتمد مع أمثلة جاهزة:' : '1. Download standard template with samples:'}
              </p>
              <div className="mt-2 flex gap-2">
                <a
                  href="/api/admin/catalog-template?format=xlsx"
                  download
                  className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-4 py-2 text-xs font-bold text-cream hover:bg-forest/90"
                >
                  <Download className="size-3.5" />
                  <span>{isAr ? 'تحميل قالب Excel (.xlsx)' : 'Download Excel (.xlsx)'}</span>
                </a>
                <a
                  href="/api/admin/catalog-template?format=csv"
                  download
                  className="inline-flex items-center gap-1.5 rounded-xl border border-forest/30 bg-white px-3.5 py-2 text-xs font-semibold text-forest hover:bg-forest/5"
                >
                  <FileText className="size-3.5" />
                  <span>CSV</span>
                </a>
              </div>
            </div>

            {/* Upload File Input */}
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-forest-deep">
                {isAr ? '2. اختيار ملف الإكسل المعبأ (.xlsx أو .csv):' : '2. Select completed spreadsheet file:'}
              </label>

              <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-forest/20 p-6 text-center hover:border-gold">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  id="excel-file-input"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="excel-file-input" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="size-8 text-gold mb-2" />
                  <span className="text-xs font-bold text-forest">
                    {uploadFile ? uploadFile.name : isAr ? 'انقر لاختيار ملف إكسل من جهازك' : 'Click to select Excel file'}
                  </span>
                  <span className="text-[11px] text-forest/50 mt-1">.xlsx, .xls, .csv</span>
                </label>
              </div>

              {/* Admin Access Key */}
              <div>
                <label className="block text-[11px] font-semibold text-forest/70 mb-1">
                  {isAr ? 'مفتاح الترخيص الإداري (Security Key):' : 'Admin Security Key:'}
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="mnaveth2026"
                  className="w-full rounded-xl border border-forest/15 px-3 py-2 text-xs font-mono"
                />
              </div>

              {/* Status Output */}
              {importStatus && (
                <div className="rounded-xl bg-[#FBF8F2] p-3 text-xs font-medium text-forest-deep border border-forest/10">
                  {importStatus}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleUploadExcel}
                  disabled={!uploadFile || isPending}
                  className="flex-1 rounded-xl bg-forest px-4 py-3 text-xs font-bold text-cream hover:bg-forest/90 disabled:opacity-50"
                >
                  {isPending ? (isAr ? 'جاري الرفع والمعالجة...' : 'Processing...') : (isAr ? 'بدء استيراد الملف إلى Sanity' : 'Upload & Sync to Sanity')}
                </button>

                <button
                  onClick={handleSeedDefaults}
                  disabled={isPending}
                  className="rounded-xl border border-gold/40 bg-gold/15 px-4 py-3 text-xs font-bold text-forest-deep hover:bg-gold/25"
                >
                  {isAr ? 'تعبئة الـ 18 صنف الافتراضية' : 'Seed Default 18 Items'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. PRINT FOOTER (PRINT MEDIA ONLY) */}
      <div className="hidden print:block print:mt-12 print:pt-4 print:border-t print:text-[10px] print:text-gray-600">
        <div className="flex justify-between">
          <span>شركة منافذ التوريد للتجارة | سجل تجاري: 1116011768</span>
          <span>هاتف ومبيعات: +966509971699 | www.mnaveth-altourid.com/catalog</span>
        </div>
      </div>
    </div>
  )
}

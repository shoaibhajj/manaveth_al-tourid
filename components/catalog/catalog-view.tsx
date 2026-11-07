'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  Check,
  X,
  MessageCircle,
  ShoppingBag,
  Trash2,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  FileDown,
  Clock,
  Printer,
  ExternalLink,
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
    inquiryWhatsApp?: string
  }
}

type SelectedItem = {
  product: CatalogProduct
  quantity: number
}

export function CatalogView({ initialProducts, catalogConfig }: Props) {
  const { locale, localize, t } = useLocale()
  const isAr = locale === 'ar'

  const productsList = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts
    return defaultCatalogProducts
  }, [initialProducts])

  // Search query
  const [searchQuery, setSearchQuery] = useState('')

  // Selected products & quantities
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({})
  const [clientName, setClientName] = useState('')
  const [clientCity, setClientCity] = useState('')
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false)

  const phone = catalogConfig?.inquiryWhatsApp || '966509971699'

  // Dynamic "Last Updated" Date Calculation
  const latestDateFormatted = useMemo(() => {
    const dates: number[] = []

    productsList.forEach((p) => {
      if (p.updatedAt) {
        const t = new Date(p.updatedAt).getTime()
        if (!isNaN(t)) dates.push(t)
      }
    })

    if (catalogConfig?.lastUpdated) {
      const t = new Date(catalogConfig.lastUpdated).getTime()
      if (!isNaN(t)) dates.push(t)
    }

    const d = dates.length > 0 ? new Date(Math.max(...dates)) : new Date()

    try {
      return isAr
        ? d.toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })
        : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return isAr ? '7 نوفمبر 2026' : 'November 7, 2026'
    }
  }, [productsList, catalogConfig, isAr])

  // Filtered Products by Search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return productsList
    const q = searchQuery.toLowerCase().trim()
    return productsList.filter((item) => {
      const matchName =
        (item.name.ar && item.name.ar.toLowerCase().includes(q)) ||
        (item.name.en && item.name.en.toLowerCase().includes(q))
      const matchSku = item.sku && item.sku.toLowerCase().includes(q)
      return matchName || matchSku
    })
  }, [productsList, searchQuery])

  // Grouped products by category
  const productsGrouped = useMemo(() => {
    const groups: { category: (typeof catalogCategories)[0]; items: CatalogProduct[] }[] = []
    catalogCategories.forEach((cat) => {
      const items = filteredProducts.filter((p) => p.categoryId === cat.id)
      if (items.length > 0) {
        groups.push({ category: cat, items })
      }
    })
    return groups
  }, [filteredProducts])

  // Selection handlers
  const toggleSelectItem = (product: CatalogProduct) => {
    setSelectedItems((prev) => {
      const next = { ...prev }
      if (next[product.id]) {
        delete next[product.id]
      } else {
        next[product.id] = { product, quantity: 1 }
      }
      return next
    })
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })
      return
    }
    setSelectedItems((prev) => {
      if (!prev[productId]) return prev
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity,
        },
      }
    })
  }

  const clearAllSelected = () => {
    setSelectedItems({})
    setShowSummaryDrawer(false)
  }

  const selectedList = useMemo(() => Object.values(selectedItems), [selectedItems])
  const totalSelectedCount = selectedList.length
  const totalUnits = useMemo(
    () => selectedList.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [selectedList]
  )

  // Construct WhatsApp Request Message
  const generateWhatsAppQuoteUrl = () => {
    if (selectedList.length === 0) return '#'

    const header = isAr
      ? `السلام عليكم ورحمة الله وبركاته،\nنود طلب عرض سعر رسمي للأصناف والكميات التموينية التالية من شركة منافذ التوريد:\n`
      : `Hello,\nWe would like to request an official wholesale quotation for the following items from Mnaveeh ALTourid:\n`

    const itemsText = selectedList
      .map((item, idx) => {
        const name = isAr ? item.product.name.ar : item.product.name.en || item.product.name.ar
        const sku = item.product.sku ? ` [${item.product.sku}]` : ''
        return `${idx + 1}. ${name}${sku} ⟵ الكمية المطلوبة: (${item.quantity})`
      })
      .join('\n')

    const clientInfoLines: string[] = []
    if (clientName.trim()) {
      clientInfoLines.push(`${isAr ? 'اسم المنشأة / العميل' : 'Company/Client'}: ${clientName.trim()}`)
    }
    if (clientCity.trim()) {
      clientInfoLines.push(`${isAr ? 'المدينة' : 'City'}: ${clientCity.trim()}`)
    }

    const clientInfoText =
      clientInfoLines.length > 0 ? `\n\n${clientInfoLines.join('\n')}` : ''

    const footer = isAr
      ? `\n\nيرجى تزويدنا بأفضل أسعار التوريد وعروض الكميات.\nشاكرين ومقدرين حسن تعاونكم.`
      : `\n\nPlease provide us with your best volume pricing.\nThank you.`

    const fullMessage = `${header}\n${itemsText}${clientInfoText}${footer}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(fullMessage)}`
  }

  const getProductHref = (product: CatalogProduct) => {
    const slug = product.slug || product.sku || product.id
    return localize(`/products/${slug}`)
  }

  // Handle PDF Download (Print to PDF or open Sanity PDF)
  const handleDownloadPdf = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-forest-deep pb-28 print:bg-white print:pb-0 print:text-black">
      {/* =========================================================================
          PRINT ONLY HEADER (يظهر في ملف الـ PDF فقط مع زر لفتح وتحديث الموقع)
          ========================================================================= */}
      <div className="hidden print:block mb-4 border-b-2 border-forest pb-3 text-start">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-black">
              {isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveeh ALTourid Trading Co.'}
            </h1>
            <p className="text-xs text-gray-700 mt-0.5">
              {isAr
                ? 'سجل تجاري: 1116011768 | هاتف ومبيعات: +966509971699 | الرياض - المملكة العربية السعودية'
                : 'CR: 1116011768 | Sales: +966509971699 | Riyadh, Saudi Arabia'}
            </p>
          </div>
          <div className="text-end">
            <span className="inline-block px-2.5 py-1 rounded border border-gray-400 bg-gray-100 text-xs font-bold text-gray-800">
              {isAr ? `تاريخ آخر تحديث: ${latestDateFormatted}` : `Last Updated: ${latestDateFormatted}`}
            </span>
          </div>
        </div>

        {/* زر ورابط مباشر لفتح وتحديث الكتالوج عبر الموقع الإلكتروني */}
        <div className="mt-3 p-2.5 rounded-lg border-2 border-dashed border-[#B8860B] bg-[#FFFDF9] text-center">
          <p className="text-[11px] font-bold text-gray-800">
            {isAr
              ? '📌 للتحقق من أحدث نسخة محدثة من الكتالوج أو طلب عروض الأسعار والكميات فورياً عبر الموقع:'
              : '📌 To check the latest updated catalog or request instant quotations via our website:'}
          </p>
          <a
            href="https://www.mnaveth-altourid.com/catalog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 px-4 py-1.5 bg-[#1A3326] text-[#FBF8F2] text-xs font-black rounded shadow-xs"
          >
            🌐 www.mnaveth-altourid.com/catalog ({isAr ? 'انقر هنا لفتح وتحديث الكتالوج' : 'Click to Open & Update Catalog'})
          </a>
        </div>
      </div>

      {/* =========================================================================
          1. CLEAN COMPACT WEB HEADER (شريط أنيق مع زر تنزيل PDF وتاريخ آخر تحديث)
          ========================================================================= */}
      <header className="border-b border-forest/10 bg-white px-4 py-4 md:py-5 print:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-forest-deep">
                  {isAr ? 'قائمة الأصناف والمنتجات التموينية' : 'Foodservice Products Menu'}
                </h1>
                {/* Last Updated Badge */}
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 border border-gold/30 px-2.5 py-0.5 text-[11px] font-bold text-forest-deep">
                  <Clock className="size-3 text-gold-dark" />
                  <span>{isAr ? `آخر تحديث: ${latestDateFormatted}` : `Updated: ${latestDateFormatted}`}</span>
                </span>
              </div>
              <p className="mt-1 text-xs text-forest/70">
                {isAr
                  ? 'اختر الأصناف والكميات المطلوبة واطلب عرض سعر مباشر عبر واتساب، أو نزّل نسخة PDF معتمدة.'
                  : 'Check items and quantities to request an instant WhatsApp quote, or download PDF.'}
              </p>
            </div>

            {/* Actions: Search + Single PDF Download Button */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Compact Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute inset-y-0 start-2.5 my-auto size-3.5 text-forest/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث باسم الصنف...' : 'Search items...'}
                  className="w-full rounded-xl border border-forest/15 bg-[#FBF8F2] py-1.5 ps-8 pe-7 text-xs text-forest-deep placeholder:text-forest/40 focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 end-2 my-auto flex size-4 items-center justify-center rounded-full text-forest/40 hover:text-forest"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {/* SINGLE PDF DOWNLOAD BUTTON (زر تنزيل ملف PDF واحد) */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 rounded-xl border border-forest bg-forest text-cream px-3 py-1.5 text-xs font-bold hover:bg-forest/90 transition-all shadow-xs shrink-0 cursor-pointer"
                title={isAr ? 'تنزيل أو حفظ الكتالوج كملف PDF' : 'Download or Save Catalog as PDF'}
              >
                <FileDown className="size-3.5 text-gold" />
                <span>{isAr ? 'تنزيل PDF' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. DENSE SIDE-BY-SIDE CATEGORY LISTS (قوائم أصغر وجنب بعضها وتلتف للأسفل)
          ========================================================================= */}
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-4 md:py-6 print:px-0 print:py-0">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-white p-8 text-center print:hidden">
            <Search className="size-8 text-forest/30 mb-2" />
            <p className="text-sm font-bold text-forest">
              {isAr ? 'لم يتم العثور على أي صنف مطابق للبحث' : 'No matching products found'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 rounded-lg bg-forest px-4 py-1.5 text-xs font-bold text-cream hover:bg-forest/90"
            >
              {isAr ? 'إلغاء البحث' : 'Clear search'}
            </button>
          </div>
        ) : (
          /* Multi-column layout: side by side, wrapping down naturally without excessive scrolling */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3 print:columns-2 print:gap-3 print:space-y-3">
            {productsGrouped.map((group) => (
              <div
                key={group.category.id}
                className="break-inside-avoid mb-3 rounded-xl border border-forest/15 bg-white shadow-xs overflow-hidden transition-all hover:border-gold/50 print:border-gray-300 print:shadow-none"
              >
                {/* Category Header Bar */}
                <div className="bg-forest-deep px-2.5 py-1.5 text-cream flex items-center justify-between border-b border-forest/20 print:bg-gray-100 print:text-black print:border-gray-400">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="size-1.5 rounded-full bg-gold shrink-0 print:bg-black" />
                    <h2 className="text-xs sm:text-[13px] font-black truncate">
                      {t(group.category.name)}
                    </h2>
                  </div>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded text-gold font-bold shrink-0 print:bg-gray-200 print:text-black">
                    {group.items.length} {isAr ? 'صنف' : 'items'}
                  </span>
                </div>

                {/* Micro Product Rows */}
                <div className="divide-y divide-forest/5 print:divide-gray-200">
                  {group.items.map((product) => {
                    const productHref = getProductHref(product)
                    const isSelected = Boolean(selectedItems[product.id])
                    const currentQty = selectedItems[product.id]?.quantity || 1

                    return (
                      <div
                        key={product.id}
                        className={`flex items-center justify-between gap-1.5 px-2 py-1.5 transition-colors print:py-1 ${
                          isSelected
                            ? 'bg-emerald-50/70 border-s-2 border-emerald-600'
                            : 'hover:bg-[#FBF8F2]'
                        }`}
                      >
                        {/* Checkbox + Image + Name */}
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          {/* 1. Micro Checkbox (hidden in print) */}
                          <button
                            type="button"
                            onClick={() => toggleSelectItem(product)}
                            className={`size-4.5 shrink-0 rounded border flex items-center justify-center transition-all print:hidden ${
                              isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                                : 'border-forest/25 bg-white hover:border-emerald-600'
                            }`}
                            title={isSelected ? (isAr ? 'إلغاء التحديد' : 'Deselect') : (isAr ? 'تحديد' : 'Select')}
                          >
                            <Check
                              className={`size-3 stroke-[3] ${
                                isSelected ? 'text-white' : 'text-transparent'
                              }`}
                            />
                          </button>

                          {/* Print bullet indicator */}
                          <span className="hidden print:inline-block size-1.5 rounded-full bg-gray-400 shrink-0" />

                          {/* 2. Tiny Thumbnail (32x32px) */}
                          <Link
                            href={productHref}
                            className="relative size-8 shrink-0 rounded-md overflow-hidden bg-[#F5F2EA] border border-forest/10 hover:opacity-85 block"
                            title={isAr ? 'عرض تفاصيل المنتج' : 'View product details'}
                          >
                            <Image
                              src={product.image || '/images/hero.png'}
                              alt={t(product.name)}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </Link>

                          {/* 3. Product Name */}
                          <Link
                            href={productHref}
                            className="min-w-0 flex-1 text-start group cursor-pointer"
                            title={isAr ? 'عرض تفاصيل المنتج' : 'View product details'}
                          >
                            <p className="text-[11px] sm:text-xs font-bold text-forest-deep group-hover:text-gold transition-colors truncate leading-tight print:text-black">
                              {product.name.ar}
                            </p>
                            {product.name.en && (
                              <p className="text-[9px] text-forest/45 truncate leading-none mt-0.5 print:text-gray-600">
                                {product.name.en}
                              </p>
                            )}
                          </Link>
                        </div>

                        {/* Quantity Stepper (if checked) or Quick Select */}
                        <div className="shrink-0 flex items-center gap-1 print:hidden">
                          {isSelected ? (
                            <div className="flex items-center gap-0.5 bg-white border border-emerald-300 rounded p-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(product.id, currentQty - 1)}
                                className="size-4 rounded bg-emerald-50 text-emerald-800 text-[10px] font-black flex items-center justify-center hover:bg-emerald-100"
                                title={isAr ? 'تقليل الكمية' : 'Decrease'}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={currentQty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10)
                                  if (!isNaN(val)) updateItemQuantity(product.id, Math.max(1, val))
                                }}
                                className="w-7 text-center text-[10px] font-black bg-transparent border-none py-0 text-forest-deep focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(product.id, currentQty + 1)}
                                className="size-4 rounded bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center hover:bg-emerald-700"
                                title={isAr ? 'زيادة الكمية' : 'Increase'}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleSelectItem(product)}
                              className="text-[10px] text-forest/40 hover:text-emerald-700 font-bold px-1.5 py-0.5 rounded hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all shrink-0"
                              title={isAr ? 'طلب تسعير' : 'Quote'}
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* =========================================================================
          PRINT ONLY FOOTER
          ========================================================================= */}
      <div className="hidden print:block mt-4 pt-2 border-t text-[9px] text-gray-600 text-center">
        <span>شركة منافذ التوريد للتجارة | سجل تجاري: 1116011768 | مبيعات: +966509971699 | www.mnaveth-altourid.com/catalog</span>
      </div>

      {/* =========================================================================
          3. FLOATING WHATSAPP RFQ BAR (شريط طلب عرض السعر المباشر بالأسفل)
          ========================================================================= */}
      {totalSelectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-2 sm:p-3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none print:hidden">
          <div className="mx-auto max-w-4xl pointer-events-auto">
            {/* Expanded Review Drawer */}
            {showSummaryDrawer && (
              <div className="mb-2 rounded-2xl border border-forest/15 bg-white p-3.5 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div className="flex items-center justify-between border-b border-forest/10 pb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="size-4 text-emerald-600" />
                    <span className="text-xs font-black text-forest-deep">
                      {isAr ? 'مراجعة قائمة الأصناف المطلوبة' : 'Review Selected Items'}
                    </span>
                    <span className="text-[11px] rounded-full bg-emerald-100 px-2 py-0.2 text-emerald-800 font-bold">
                      {totalSelectedCount} {isAr ? 'صنف' : 'items'} ({totalUnits} {isAr ? 'وحدة' : 'units'})
                    </span>
                  </div>
                  <button
                    onClick={clearAllSelected}
                    className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="size-3" />
                    <span>{isAr ? 'تفريغ القائمة' : 'Clear all'}</span>
                  </button>
                </div>

                {/* Selected Items Scroll Area */}
                <div className="max-h-48 overflow-y-auto divide-y divide-forest/5 pe-1 space-y-1">
                  {selectedList.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-2 py-1 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-bold text-forest-deep truncate">
                          {product.name.ar}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded px-1 py-0.5">
                          <span className="text-[10px] text-emerald-800 font-bold">{quantity}</span>
                        </div>
                        <button
                          onClick={() => updateItemQuantity(product.id, 0)}
                          className="text-forest/30 hover:text-red-600"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Client Details for Quotation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-forest/10 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-forest/70 mb-0.5">
                      {isAr ? 'اسم المنشأة / الفندق / المطعم (اختياري):' : 'Company/Establishment Name:'}
                    </label>
                    <div className="relative">
                      <Building2 className="absolute inset-y-0 start-2 my-auto size-3 text-forest/40" />
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder={isAr ? 'مثال: فندق قصر الرياض' : 'e.g. Riyadh Palace Hotel'}
                        className="w-full rounded-lg border border-forest/15 bg-[#FBF8F2] py-1 ps-7 pe-2 text-[11px] focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-forest/70 mb-0.5">
                      {isAr ? 'المدينة / فرع التوريد (اختياري):' : 'Delivery City:'}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute inset-y-0 start-2 my-auto size-3 text-forest/40" />
                      <input
                        type="text"
                        value={clientCity}
                        onChange={(e) => setClientCity(e.target.value)}
                        placeholder={isAr ? 'مثال: الرياض - حي السلي' : 'e.g. Riyadh'}
                        className="w-full rounded-lg border border-forest/15 bg-[#FBF8F2] py-1 ps-7 pe-2 text-[11px] focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Sticky Action Bar */}
            <div className="rounded-2xl border border-emerald-500/40 bg-forest-deep px-3 py-2 text-cream shadow-2xl flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-xl bg-emerald-500 text-white font-black text-xs shadow-xs">
                  {totalSelectedCount}
                </span>
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {isAr ? 'الأصناف المحددة للتسعير' : 'Selected Products'}
                  </p>
                  <p className="text-[10px] text-cream/70">
                    {totalUnits} {isAr ? 'إجمالي الكميات المطلوبة' : 'Total quantity'}
                  </p>
                </div>

                <button
                  onClick={() => setShowSummaryDrawer((prev) => !prev)}
                  className="ms-1 inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-cream hover:bg-white/20 transition-colors"
                >
                  <span>{showSummaryDrawer ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'مراجعة' : 'Review')}</span>
                  {showSummaryDrawer ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
                </button>
              </div>

              {/* Big WhatsApp RFQ Button */}
              <a
                href={generateWhatsAppQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-black text-white hover:bg-emerald-600 transition-transform active:scale-95 shadow-md shadow-emerald-900/30"
              >
                <MessageCircle className="size-4" />
                <span>{isAr ? 'إرسال طلب التسعير عبر واتساب' : 'Send RFQ via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

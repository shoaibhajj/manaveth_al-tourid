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
  FileDown,
  Clock,
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
  // Open review drawer by default as requested
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(true)

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
        if (Object.keys(next).length === 0) {
          setShowSummaryDrawer(false)
        }
      } else {
        next[product.id] = { product, quantity: 1 }
        setShowSummaryDrawer(true) // Immediately open review drawer when product is added
      }
      return next
    })
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems((prev) => {
        const next = { ...prev }
        delete next[productId]
        if (Object.keys(next).length === 0) {
          setShowSummaryDrawer(false)
        }
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

  // Direct, Frictionless WhatsApp Request Message
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

    const footer = isAr
      ? `\n\nيرجى تزويدنا بأفضل أسعار التوريد وعروض الكميات.\nشاكرين ومقدرين حسن تعاونكم.`
      : `\n\nPlease provide us with your best volume pricing.\nThank you.`

    const fullMessage = `${header}\n${itemsText}${footer}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(fullMessage)}`
  }

  const getProductHref = (product: CatalogProduct) => {
    const slug = product.slug || product.sku || product.id
    return localize(`/products/${slug}`)
  }

  // Handle PDF Download (Triggers native print dialog optimized for A4 PDF saving)
  const handleDownloadPdf = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-forest-deep pb-28 print:bg-white print:pb-0 print:text-black">
      {/* =========================================================================
          PRINT ONLY VIEW (يظهر فقط عند تصدير الـ PDF - قائمتين جنب بعض بدون تقطيع)
          ========================================================================= */}
      <div className="hidden print:block w-full text-start py-2">
        {/* Print Header */}
        <div className="border-b-2 border-gray-800 pb-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <div role="heading" aria-level={1} className="text-lg font-black text-black">
                {isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.'}
              </div>
              <p className="text-[10px] text-gray-700 mt-0.5 font-medium">
                {isAr
                  ? 'سجل تجاري: 1116011768 | هاتف ومبيعات: +966509971699 | الرياض - المملكة العربية السعودية'
                  : 'CR: 1116011768 | Sales: +966509971699 | Riyadh, Saudi Arabia'}
              </p>
            </div>
            <div className="text-end">
              <span className="inline-block px-2 py-0.5 rounded border border-gray-400 bg-gray-100 text-[10px] font-bold text-gray-800">
                {isAr ? `تاريخ آخر تحديث: ${latestDateFormatted}` : `Last Updated: ${latestDateFormatted}`}
              </span>
            </div>
          </div>

          {/* زر ورابط مباشر لفتح وتحديث الكتالوج عبر الموقع الإلكتروني */}
          <div className="mt-2.5 p-2 rounded-lg border-2 border-dashed border-[#B8860B] bg-[#FFFDF9] text-center">
            <p className="text-[10px] font-bold text-gray-900">
              {isAr
                ? '📌 للتحقق من أحدث نسخة محدثة من الكتالوج أو طلب عروض الأسعار والكميات فورياً عبر الموقع الإلكتروني:'
                : '📌 To check the latest updated catalog or request instant quotations via our website:'}
            </p>
            <a
              href="https://www.mnaveth-altourid.com/catalog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-0.5 text-[11px] font-black text-[#1A3326] underline"
            >
              🌐 www.mnaveth-altourid.com/catalog ({isAr ? 'انقر هنا لفتح وتحديث الكتالوج' : 'Click to Open & Update Catalog'})
            </a>
          </div>
        </div>

        {/* 2 COLUMNS PRINT GRID (قائمتين جنب بعض كحد أقصى والباقي يلتف للأسفل) */}
        <div className="grid grid-cols-2 gap-3.5 items-start w-full">
          {productsGrouped.map((group) => (
            <div
              key={`print-${group.category.id}`}
              className="break-inside-avoid rounded-lg border border-gray-400 bg-white p-2.5 shadow-none mb-3"
              style={{ pageBreakInside: 'avoid' }}
            >
              {/* Category Header */}
              <div className="bg-gray-100 border-b border-gray-300 -mx-2.5 -mt-2.5 px-2.5 py-1 rounded-t-lg flex items-center justify-between mb-2">
                <span className="text-xs font-black text-black">
                  {t(group.category.name)}
                </span>
                <span className="text-[10px] bg-white border border-gray-300 px-1.5 py-0.2 rounded font-bold text-gray-700">
                  {group.items.length} {isAr ? 'صنف' : 'items'}
                </span>
              </div>

              {/* Product Items Table */}
              <table className="w-full text-start border-collapse">
                <tbody>
                  {group.items.map((product, pIdx) => (
                    <tr
                      key={`print-item-${product.id}`}
                      className="border-b border-gray-200 last:border-b-0 text-[10px]"
                    >
                      <td className="py-1 pe-1 w-5 text-gray-500 font-bold align-top">
                        {pIdx + 1}.
                      </td>
                      <td className="py-1 align-top">
                        <span className="font-bold text-black block leading-tight">
                          {product.name.ar}
                        </span>
                        {product.name.en && (
                          <span className="text-[9px] text-gray-600 block leading-tight mt-0.5">
                            {product.name.en}
                          </span>
                        )}
                      </td>
                      {product.sku && (
                        <td className="py-1 text-end text-[9px] text-gray-500 font-mono whitespace-nowrap ps-2 align-top">
                          {product.sku}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Print Footer */}
        <div className="mt-4 pt-2 border-t border-gray-400 text-[9px] text-gray-600 text-center">
          <span>شركة منافذ التوريد للتجارة | سجل تجاري: 1116011768 | مبيعات: +966509971699 | www.mnaveth-altourid.com/catalog</span>
        </div>
      </div>

      {/* =========================================================================
          SCREEN ONLY: 1. CLEAN COMPACT WEB HEADER
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
          SCREEN ONLY: 2. DENSE SIDE-BY-SIDE CATEGORY LISTS (أعمدة متراصة وجنب بعضها)
          ========================================================================= */}
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-4 md:py-6 print:hidden">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-white p-8 text-center">
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
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
            {productsGrouped.map((group) => (
              <div
                key={group.category.id}
                className="break-inside-avoid mb-3 rounded-xl border border-forest/15 bg-white shadow-xs overflow-hidden transition-all hover:border-gold/50"
              >
                {/* Category Header Bar */}
                <div className="bg-forest-deep px-2.5 py-1.5 text-cream flex items-center justify-between border-b border-forest/20">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="size-1.5 rounded-full bg-gold shrink-0" />
                    <h2 className="text-xs sm:text-[13px] font-black truncate">
                      {t(group.category.name)}
                    </h2>
                  </div>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded text-gold font-bold shrink-0">
                    {group.items.length} {isAr ? 'صنف' : 'items'}
                  </span>
                </div>

                {/* Micro Product Rows */}
                <div className="divide-y divide-forest/5">
                  {group.items.map((product) => {
                    const productHref = getProductHref(product)
                    const isSelected = Boolean(selectedItems[product.id])
                    const currentQty = selectedItems[product.id]?.quantity || 1

                    return (
                      <div
                        key={product.id}
                        className={`flex items-center justify-between gap-1.5 px-2 py-1.5 transition-colors ${
                          isSelected
                            ? 'bg-emerald-50/70 border-s-2 border-emerald-600'
                            : 'hover:bg-[#FBF8F2]'
                        }`}
                      >
                        {/* Checkbox + Image + Name */}
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          {/* 1. Micro Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleSelectItem(product)}
                            className={`size-4.5 shrink-0 rounded border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                                : 'border-forest/25 bg-white hover:border-emerald-600'
                            }`}
                            title={isSelected ? (isAr ? 'إلغاء التحديد' : 'Deselect') : (isAr ? 'تحديد الصنف' : 'Select')}
                          >
                            <Check
                              className={`size-3 stroke-[3] ${
                                isSelected ? 'text-white' : 'text-transparent'
                              }`}
                            />
                          </button>

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

                          {/* 3. Product Name: Strictly in active page locale */}
                          <Link
                            href={productHref}
                            className="min-w-0 flex-1 text-start group cursor-pointer"
                            title={isAr ? 'عرض تفاصيل المنتج' : 'View product details'}
                          >
                            <p className="text-[11px] sm:text-xs font-bold text-forest-deep group-hover:text-gold transition-colors truncate leading-tight">
                              {isAr ? product.name.ar : product.name.en || product.name.ar}
                            </p>
                          </Link>
                        </div>

                        {/* Quantity Stepper (if checked) or Quick Select */}
                        <div className="shrink-0 flex items-center gap-1">
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
          SCREEN ONLY: 3. FLOATING WHATSAPP RFQ BAR (مفتوح فورا وبدون حقول معقدة)
          ========================================================================= */}
      {totalSelectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-2 sm:p-3 bg-gradient-to-t from-black/25 to-transparent pointer-events-none print:hidden">
          <div className="mx-auto max-w-4xl pointer-events-auto">
            {/* Expanded Review Drawer (مفتوح تلقائياً ومباشر) */}
            {showSummaryDrawer && (
              <div className="mb-2 rounded-2xl border border-forest/15 bg-white p-3 shadow-2xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between border-b border-forest/10 pb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="size-4 text-emerald-600" />
                    <span className="text-xs font-black text-forest-deep">
                      {isAr ? 'قائمة الأصناف المختارة للتسعير' : 'Selected Products for Quote'}
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
                    <span>{isAr ? 'مسح الكل' : 'Clear all'}</span>
                  </button>
                </div>

                {/* Selected Items Scroll Area */}
                <div className="max-h-44 overflow-y-auto divide-y divide-forest/5 pe-1 space-y-1">
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
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(product.id, quantity - 1)}
                            className="text-emerald-800 font-bold px-1 hover:text-black"
                          >
                            -
                          </button>
                          <span className="text-xs text-emerald-800 font-black min-w-4 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(product.id, quantity + 1)}
                            className="text-emerald-800 font-bold px-1 hover:text-black"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => updateItemQuantity(product.id, 0)}
                          className="text-forest/30 hover:text-red-600 p-0.5"
                          title={isAr ? 'حذف' : 'Remove'}
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                    {isAr ? 'الأصناف المحددة' : 'Selected Products'}
                  </p>
                  <p className="text-[10px] text-cream/70">
                    {totalUnits} {isAr ? 'إجمالي الكميات المطلوبة' : 'Total quantity'}
                  </p>
                </div>

                <button
                  onClick={() => setShowSummaryDrawer((prev) => !prev)}
                  className="ms-1 inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-cream hover:bg-white/20 transition-colors"
                >
                  <span>{showSummaryDrawer ? (isAr ? 'تصغير' : 'Collapse') : (isAr ? 'عرض القائمة' : 'Review')}</span>
                  {showSummaryDrawer ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
                </button>
              </div>

              {/* Instant WhatsApp RFQ Button */}
              <a
                href={generateWhatsAppQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-white hover:bg-emerald-600 transition-transform active:scale-95 shadow-md shadow-emerald-900/30"
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

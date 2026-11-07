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
  ArrowUpLeft,
  ArrowUpRight,
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
        const pName = isAr ? item.product.name.ar : item.product.name.en || item.product.name.ar
        const skuText = item.product.sku ? ` (${isAr ? 'كود' : 'SKU'}: ${item.product.sku})` : ''
        return `${idx + 1}. ${pName}${skuText} - ${isAr ? 'الكمية المطلوبة' : 'Quantity'}: ${item.quantity}`
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

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-forest-deep pb-32">
      {/* 1. SIMPLE, MINIMAL HEADER (NO BIG HERO, NO CLUTTER) */}
      <header className="border-b border-forest/10 bg-white px-4 py-6 md:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-forest-deep">
                {isAr ? 'قائمة الأصناف التموينية' : 'Foodservice Products Menu'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-forest/70">
                {isAr
                  ? 'اختر الأصناف والكميات المطلوبة واضغط على زر واتساب بالأسفل لطلب عرض سعر فوري.'
                  : 'Check items, set quantities, and click WhatsApp below to request an instant quote.'}
              </p>
            </div>

            {/* Compact Search Input */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute inset-y-0 start-3 my-auto size-4 text-forest/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث باسم الصنف...' : 'Search items...'}
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
          </div>
        </div>
      </header>

      {/* 2. CATEGORY LISTS WITH COMPACT ROW CARDS (قد السطر أو أكبر قليلاً) */}
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8 space-y-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-white p-10 text-center">
            <Search className="size-8 text-forest/30 mb-2" />
            <p className="text-sm font-bold text-forest">
              {isAr ? 'لم يتم العثور على أي صنف مطابق' : 'No matching products found'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 rounded-lg bg-forest px-4 py-1.5 text-xs font-bold text-cream hover:bg-forest/90"
            >
              {isAr ? 'إلغاء البحث' : 'Clear search'}
            </button>
          </div>
        ) : (
          productsGrouped.map((group) => (
            <section key={group.category.id} className="space-y-3">
              {/* Category Title Header */}
              <div className="flex items-center gap-2 border-b border-forest/10 pb-2">
                <span className="size-2 rounded-full bg-gold" />
                <h2 className="text-base sm:text-lg font-black text-forest-deep">
                  {t(group.category.name)}
                </h2>
                <span className="text-xs text-forest/50 font-medium">
                  ({group.items.length})
                </span>
              </div>

              {/* COMPACT ROW CARDS: 1 column on mobile, 2 columns on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {group.items.map((product) => {
                  const productHref = getProductHref(product)
                  const isSelected = Boolean(selectedItems[product.id])
                  const currentQty = selectedItems[product.id]?.quantity || 1

                  return (
                    <div
                      key={product.id}
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border bg-white transition-all shadow-xs ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/25 ring-1 ring-emerald-500'
                          : 'border-forest/10 hover:border-gold/60'
                      }`}
                    >
                      {/* Checkbox + Image + Name */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* 1. CHECKBOX */}
                        <button
                          type="button"
                          onClick={() => toggleSelectItem(product)}
                          className={`size-6 shrink-0 rounded-lg border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'border-forest/30 bg-white hover:border-emerald-600'
                          }`}
                          title={isSelected ? (isAr ? 'إلغاء التحديد' : 'Deselect') : (isAr ? 'تحديد' : 'Select')}
                        >
                          <Check
                            className={`size-3.5 stroke-[3] ${
                              isSelected ? 'text-white' : 'text-transparent'
                            }`}
                          />
                        </button>

                        {/* 2. SMALL PRODUCT IMAGE (48x48px) */}
                        <Link
                          href={productHref}
                          className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-[#F5F2EA] border border-forest/10 hover:opacity-90 block"
                          title={isAr ? 'عرض تفاصيل المنتج' : 'View product details'}
                        >
                          <Image
                            src={product.image || '/images/hero.png'}
                            alt={t(product.name)}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </Link>

                        {/* 3. PRODUCT NAME */}
                        <Link
                          href={productHref}
                          className="min-w-0 flex-1 text-start group cursor-pointer"
                          title={isAr ? 'عرض تفاصيل المنتج' : 'View product details'}
                        >
                          <p className="text-xs sm:text-sm font-bold text-forest-deep group-hover:text-gold transition-colors truncate">
                            {product.name.ar}
                          </p>
                          {product.name.en && (
                            <p className="text-[10px] sm:text-[11px] text-forest/50 truncate">
                              {product.name.en}
                            </p>
                          )}
                        </Link>
                      </div>

                      {/* Quantity Stepper (if checked) or Quick Select */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {isSelected ? (
                          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(product.id, currentQty - 1)}
                              className="size-5 rounded bg-white border border-emerald-300 text-emerald-800 text-xs font-black flex items-center justify-center hover:bg-emerald-100"
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
                              className="w-10 text-center text-xs font-black bg-white rounded border border-emerald-300 py-0.5 text-forest-deep"
                            />
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(product.id, currentQty + 1)}
                              className="size-5 rounded bg-emerald-600 text-white text-xs font-black flex items-center justify-center hover:bg-emerald-700"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleSelectItem(product)}
                            className="text-[11px] text-forest/50 hover:text-emerald-700 font-semibold px-2 py-1 rounded-md hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all"
                          >
                            + {isAr ? 'تسعير' : 'Select'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))
        )}
      </main>

      {/* 3. FLOATING WHATSAPP QUOTATION BAR (APPEARS WHEN ITEMS ARE CHECKED) */}
      {totalSelectedCount > 0 && (
        <aside className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:inset-x-5 z-40 max-w-4xl mx-auto rounded-2xl border-2 border-gold/50 bg-forest-deep/95 text-cream p-3 sm:p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-6 duration-300">
          <div className="flex flex-col gap-3">
            {/* Summary Bar Top */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold-light">
                  <ShoppingBag className="size-4" />
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-white">
                    {isAr
                      ? `${totalSelectedCount} أصناف محددة للتسعير`
                      : `${totalSelectedCount} items selected`}
                  </span>
                  <span className="rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-light">
                    {totalUnits} {isAr ? 'إجمالي الكميات' : 'total units'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSummaryDrawer(!showSummaryDrawer)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-cream hover:bg-white/20"
                >
                  <span>{isAr ? 'مراجعة' : 'Review'}</span>
                  {showSummaryDrawer ? (
                    <ChevronDown className="size-3" />
                  ) : (
                    <ChevronUp className="size-3" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={clearAllSelected}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-rose-300 hover:bg-rose-950/40 hover:text-rose-200"
                  title={isAr ? 'مسح التحديد' : 'Clear all'}
                >
                  <Trash2 className="size-3" />
                  <span className="hidden sm:inline">{isAr ? 'مسح' : 'Clear'}</span>
                </button>
              </div>
            </div>

            {/* EXPANDABLE REVIEW LIST DRAWER */}
            {showSummaryDrawer && (
              <div className="max-h-56 overflow-y-auto space-y-1.5 py-1.5 border-b border-white/10 scrollbar-thin">
                {selectedList.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-1.5 text-xs"
                  >
                    <span className="font-bold truncate max-w-[60%]">{item.product.name.ar}</span>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 py-0.5">
                        <button
                          onClick={() => updateItemQuantity(item.product.id, item.quantity - 1)}
                          className="size-4 flex items-center justify-center font-bold hover:text-gold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-gold-light">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.product.id, item.quantity + 1)}
                          className="size-4 flex items-center justify-center font-bold hover:text-gold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => updateItemQuantity(item.product.id, 0)}
                        className="text-white/40 hover:text-rose-300"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CLIENT DETAILS & WHATSAPP SEND BUTTON */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Optional Client Name & City */}
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Building2 className="absolute inset-y-0 start-2.5 my-auto size-3.5 text-cream/40" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={isAr ? 'اسم المنشأة / العميل (اختياري)' : 'Company Name (Optional)'}
                    className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 ps-8 pe-3 text-xs text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="relative w-28 sm:w-32">
                  <MapPin className="absolute inset-y-0 start-2.5 my-auto size-3.5 text-cream/40" />
                  <input
                    type="text"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder={isAr ? 'المدينة' : 'City'}
                    className="w-full rounded-xl border border-white/20 bg-white/10 py-1.5 ps-8 pe-2 text-xs text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Primary WhatsApp Action Button */}
              <a
                href={generateWhatsAppQuoteUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] px-5 py-2 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-500/30 transition-transform"
              >
                <MessageCircle className="size-4" />
                <span>{isAr ? 'إرسال طلب عرض السعر عبر واتساب' : 'Send RFQ on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}

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
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  Droplet,
  Utensils,
  Wheat,
  Container,
  Flame,
} from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import {
  type CatalogProduct,
  type SupportingCommodity,
  catalogCategories,
  defaultCatalogProducts,
  supportingCommodities,
} from '@/lib/content/catalog-data'

type Props = {
  initialProducts?: CatalogProduct[]
  products?: CatalogProduct[]
  categories?: typeof catalogCategories
  catalogConfig?: {
    title?: { ar: string; en: string }
    subtitle?: { ar: string; en: string }
    catalogVersion?: string
    lastUpdated?: string
    pdfFileUrl?: string
    externalPdfUrl?: string
    bannerAlert?: { ar: string; en: string }
    coreSpecialtiesHeading?: { ar: string; en: string }
    supportingCommoditiesHeading?: { ar: string; en: string }
    supportingCommoditiesNote?: { ar: string; en: string }
    inquiryWhatsApp?: string
  }
  catalogMeta?: {
    title?: { ar: string; en: string }
    subtitle?: { ar: string; en: string }
    catalogVersion?: string
    lastUpdated?: string
    pdfFileUrl?: string
    externalPdfUrl?: string
    bannerAlert?: { ar: string; en: string }
    coreSpecialtiesHeading?: { ar: string; en: string }
    supportingCommoditiesHeading?: { ar: string; en: string }
    supportingCommoditiesNote?: { ar: string; en: string }
    inquiryWhatsApp?: string
  }
}

type SelectedMeatItem = {
  product: CatalogProduct
  quantity: number
}

export function CatalogView({
  initialProducts,
  products,
  catalogConfig,
  catalogMeta,
}: Props) {
  const { locale, localize, t } = useLocale()
  const isAr = locale === 'ar'

  const effectiveConfig = catalogConfig || catalogMeta

  const productsList = useMemo(() => {
    const list = products || initialProducts
    if (list && list.length > 0) return list
    return defaultCatalogProducts
  }, [products, initialProducts])

  // Core Specialty Meats (First priority focus)
  const coreSpecialties = useMemo(() => {
    return productsList.filter(
      (p) => p.isCoreSpecialty || p.featured || p.categoryId === 'meat-poultry' || p.order <= 5
    )
  }, [productsList])

  // Search query
  const [searchQuery, setSearchQuery] = useState('')

  // Selected Core Meats & quantities
  const [selectedMeats, setSelectedMeats] = useState<Record<string, SelectedMeatItem>>({})

  // Selected Supporting Commodities (generalized checkboxes)
  const [selectedCommodities, setSelectedCommodities] = useState<Record<string, boolean>>({})

  // Toggle drawer for summary review
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false)

  const phone = effectiveConfig?.inquiryWhatsApp || '966509971699'

  // Dynamic "Last Updated" Date Calculation
  const latestDateFormatted = useMemo(() => {
    const dates: number[] = []

    productsList.forEach((p) => {
      if (p.updatedAt) {
        const timestamp = new Date(p.updatedAt).getTime()
        if (!isNaN(timestamp)) dates.push(timestamp)
      }
    })

    if (effectiveConfig?.lastUpdated) {
      const timestamp = new Date(effectiveConfig.lastUpdated).getTime()
      if (!isNaN(timestamp)) dates.push(timestamp)
    }

    const d = dates.length > 0 ? new Date(Math.max(...dates)) : new Date()

    try {
      return isAr
        ? d.toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })
        : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return isAr ? 'نوفمبر 2026' : 'November 2026'
    }
  }, [productsList, effectiveConfig, isAr])

  // Filtered Core Specialties by Search
  const filteredCoreMeats = useMemo(() => {
    if (!searchQuery.trim()) return coreSpecialties
    const q = searchQuery.toLowerCase().trim()
    return coreSpecialties.filter((item) => {
      const matchName =
        (item.name.ar && item.name.ar.toLowerCase().includes(q)) ||
        (item.name.en && item.name.en.toLowerCase().includes(q))
      const matchSku = item.sku && item.sku.toLowerCase().includes(q)
      const matchOrigin = item.origin?.ar?.toLowerCase().includes(q)
      return matchName || matchSku || matchOrigin
    })
  }, [coreSpecialties, searchQuery])

  // Filtered Supporting Commodities by Search
  const filteredCommodities = useMemo(() => {
    if (!searchQuery.trim()) return supportingCommodities
    const q = searchQuery.toLowerCase().trim()
    return supportingCommodities.filter((item) => {
      const matchName =
        item.name.ar.toLowerCase().includes(q) || item.name.en.toLowerCase().includes(q)
      const matchDesc =
        item.description.ar.toLowerCase().includes(q) || item.description.en.toLowerCase().includes(q)
      const matchSample =
        item.sampleItems.ar.some((s) => s.toLowerCase().includes(q)) ||
        item.sampleItems.en.some((s) => s.toLowerCase().includes(q))
      return matchName || matchDesc || matchSample
    })
  }, [searchQuery])

  // Core Meat Selection handlers
  const toggleSelectMeat = (product: CatalogProduct) => {
    setSelectedMeats((prev) => {
      const next = { ...prev }
      if (next[product.id]) {
        delete next[product.id]
      } else {
        next[product.id] = { product, quantity: 1 }
        setShowSummaryDrawer(true)
      }
      return next
    })
  }

  const updateMeatQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedMeats((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })
      return
    }
    setSelectedMeats((prev) => {
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

  // Supporting Commodity toggle
  const toggleSelectCommodity = (commodityId: string) => {
    setSelectedCommodities((prev) => {
      const next = { ...prev }
      if (next[commodityId]) {
        delete next[commodityId]
      } else {
        next[commodityId] = true
        setShowSummaryDrawer(true)
      }
      return next
    })
  }

  const clearAllSelected = () => {
    setSelectedMeats({})
    setSelectedCommodities({})
    setShowSummaryDrawer(false)
  }

  const selectedMeatList = useMemo(() => Object.values(selectedMeats), [selectedMeats])
  const selectedCommodityList = useMemo(() => {
    return supportingCommodities.filter((c) => selectedCommodities[c.id])
  }, [selectedCommodities])

  const totalSelectedCount = selectedMeatList.length + selectedCommodityList.length
  const totalMeatUnits = useMemo(
    () => selectedMeatList.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [selectedMeatList]
  )

  // Direct, Professional WhatsApp Request Message
  const generateWhatsAppQuoteUrl = () => {
    if (totalSelectedCount === 0) {
      const defaultMsg = isAr
        ? 'السلام عليكم ورحمة الله وبركاته،\nأود الاستفسار عن عروض أسعار توريد اللحوم المجمدة بالجملة لمطعمنا من شركة منافذ التوريد.'
        : 'Hello, I would like to inquire about wholesale frozen meat supply for our restaurant from Mnaveth ALTourid.'
      return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMsg)}`
    }

    const header = isAr
      ? `السلام عليكم ورحمة الله وبركاته،\nنود طلب عرض سعر رسمي للأصناف التالية من شركة منافذ التوريد:\n`
      : `Hello,\nWe would like to request an official wholesale quotation for the following items from Mnaveth ALTourid:\n`

    let meatsSection = ''
    if (selectedMeatList.length > 0) {
      meatsSection = isAr ? `\n🥩 أصناف اللحوم التخصصية الرئيسية المطلوبة:\n` : `\n🥩 Core Wholesale Specialty Meats:\n`
      meatsSection += selectedMeatList
        .map((item, idx) => {
          const name = isAr ? item.product.name.ar : item.product.name.en || item.product.name.ar
          const sku = item.product.sku ? ` [${item.product.sku}]` : ''
          return `${idx + 1}. ${name}${sku} ⟵ الكمية المطلوبة: (${item.quantity} كرتون)`
        })
        .join('\n')
    }

    let commoditiesSection = ''
    if (selectedCommodityList.length > 0) {
      commoditiesSection = isAr ? `\n\n📦 السلع والمستلزمات التموينية المساندة المطلوبة:\n` : `\n\n📦 Supporting Foodservice Commodities:\n`
      commoditiesSection += selectedCommodityList
        .map((comm, idx) => {
          const name = isAr ? comm.name.ar : comm.name.en
          return `${idx + 1}. ${name} (${isAr ? 'توريد جملة دوري' : 'Wholesale supply'})`
        })
        .join('\n')
    }

    const footer = isAr
      ? `\n\nيرجى تزويدنا بأفضل أسعار التوريد وعروض الكميات المعتمدة.\nاسم المطعم / المنشأة: \nالمدينة: `
      : `\n\nPlease provide your best volume contract rates.\nRestaurant/Company: \nCity: `

    const fullMessage = `${header}${meatsSection}${commoditiesSection}${footer}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(fullMessage)}`
  }

  const getProductHref = (product: CatalogProduct) => {
    const slug = product.slug || product.sku || product.id
    return localize(`/products/${slug}`)
  }

  // Handle PDF Download (Direct File from Sanity, or Native Optimized Print)
  const handleDownloadPdf = () => {
    const directPdf = effectiveConfig?.pdfFileUrl || effectiveConfig?.externalPdfUrl
    if (directPdf) {
      window.open(directPdf, '_blank')
      return
    }
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const getCommodityIcon = (iconName: string) => {
    switch (iconName) {
      case 'wheat':
        return <Wheat className="size-5 text-amber-600" />
      case 'droplet':
        return <Droplet className="size-5 text-amber-500" />
      case 'utensils':
        return <Utensils className="size-5 text-emerald-600" />
      case 'package':
        return <Package className="size-5 text-blue-600" />
      case 'container':
        return <Container className="size-5 text-red-600" />
      default:
        return <Package className="size-5 text-gold-dark" />
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-forest-deep pb-28 print:bg-white print:pb-0 print:text-black">
      {/* =========================================================================
          PRINT ONLY VIEW (يظهر فقط عند تصدير الـ PDF - تصميم أنيق ومعتمد)
          ========================================================================= */}
      <div className="hidden print:block w-full text-start py-2">
        {/* Print Header */}
        <div className="border-b-2 border-forest-deep pb-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div role="heading" aria-level={1} className="text-xl font-black text-black">
                {isAr ? 'شركة منافذ التوريد للتجارة | دليل أصناف التوريد المعتمد' : 'Mnaveth ALTourid Trading Co. | Foodservice Catalog'}
              </div>
              <p className="text-xs text-gray-700 mt-1 font-medium">
                {isAr
                  ? 'سجل تجاري: 1116011768 · ترخيص هيئة الغذاء والدواء SFDA · هاتف ومبيعات: +966509971699 · الرياض - المملكة العربية السعودية'
                  : 'CR: 1116011768 · SFDA Licensed · Sales: +966509971699 · Riyadh, Saudi Arabia'}
              </p>
            </div>
            <div className="text-end">
              <span className="inline-block px-2.5 py-1 rounded border border-gray-400 bg-gray-100 text-xs font-bold text-gray-800">
                {isAr ? `تاريخ الإصدار: ${latestDateFormatted}` : `Issued: ${latestDateFormatted}`}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1 in Print: Core Specialty Meats */}
        <div className="mb-6">
          <div className="bg-forest-deep text-white px-3 py-1.5 rounded-t font-black text-sm mb-2">
            {isAr ? '1. أصناف اللحوم التخصصية الرئيسية (كبدة، ريش، مخ، لسان)' : '1. Core Specialty Wholesale Meats'}
          </div>
          <table className="w-full text-start border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-900 border-b border-gray-300">
                <th className="p-2 text-start">#</th>
                <th className="p-2 text-start">{isAr ? 'الصنف والماركة' : 'Product & Brand'}</th>
                <th className="p-2 text-start">{isAr ? 'بلد المنشأ / المسلخ' : 'Origin / Abattoir'}</th>
                <th className="p-2 text-start">{isAr ? 'نوع التعبئة والتغليف' : 'Packaging & Storage'}</th>
                <th className="p-2 text-start">{isAr ? 'الشهادات والاعتمادات' : 'Certifications'}</th>
              </tr>
            </thead>
            <tbody>
              {coreSpecialties.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="p-2 font-bold">{idx + 1}</td>
                  <td className="p-2 font-black text-gray-900">
                    {item.name.ar}
                    <span className="block text-[10px] text-gray-600 font-normal">{item.name.en}</span>
                  </td>
                  <td className="p-2">{item.origin?.ar || 'أستراليا معتمد'}</td>
                  <td className="p-2">{item.packaging?.ar || 'كرتون جملة فاكيوم معقم'}</td>
                  <td className="p-2 font-semibold text-emerald-800">ذبح حلال 100% · معتمد SFDA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2 in Print: Supporting Commodities */}
        <div>
          <div className="bg-forest-deep text-white px-3 py-1.5 rounded-t font-black text-sm mb-2">
            {isAr ? '2. السلع والمستلزمات التموينية المساندة للمطاعم' : '2. Supporting Wholesale Commodities'}
          </div>
          <table className="w-full text-start border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-900 border-b border-gray-300">
                <th className="p-2 text-start">#</th>
                <th className="p-2 text-start">{isAr ? 'الفئة التموينية' : 'Category'}</th>
                <th className="p-2 text-start">{isAr ? 'أشكال التعبئة المتوفرة' : 'Wholesale Pack'}</th>
                <th className="p-2 text-start">{isAr ? 'أمثلة الأصناف' : 'Key Lines'}</th>
              </tr>
            </thead>
            <tbody>
              {supportingCommodities.map((comm, idx) => (
                <tr key={comm.id} className="border-b border-gray-200">
                  <td className="p-2 font-bold">{idx + 1}</td>
                  <td className="p-2 font-black text-gray-900">{comm.name.ar}</td>
                  <td className="p-2">{comm.packagingSummary.ar}</td>
                  <td className="p-2 text-gray-700">{comm.sampleItems.ar.join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print Footer */}
        <div className="mt-6 pt-3 border-t border-gray-400 text-xs text-gray-600 text-center">
          <span>شركة منافذ التوريد للتجارة | سجل تجاري: 1116011768 | هاتف: +966509971699 | www.mnaveth-altourid.com/catalog</span>
        </div>
      </div>

      {/* =========================================================================
          SCREEN ONLY: 1. HERO HEADER WITH FULL SANITY CONTROLS
          ========================================================================= */}
      <header className="border-b border-forest/10 bg-white px-4 py-8 md:py-10 print:hidden shadow-xs">
        <div className="mx-auto max-w-7xl">
          {/* Banner Alert from Sanity if configured */}
          {effectiveConfig?.bannerAlert && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-bold text-forest-deep">
              <Sparkles className="size-4 shrink-0 text-gold-dark" />
              <span>{isAr ? effectiveConfig.bannerAlert.ar : effectiveConfig.bannerAlert.en || effectiveConfig.bannerAlert.ar}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-forest-deep px-3 py-1 text-xs font-bold text-cream">
                  <ShieldCheck className="size-3.5 text-gold" />
                  <span>{isAr ? 'دليل الأصناف المعتمد B2B' : 'Certified B2B Catalog'}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 border border-gold/30 px-2.5 py-1 text-xs font-bold text-forest-deep">
                  <Clock className="size-3 text-gold-dark" />
                  <span>{isAr ? `آخر تحديث: ${latestDateFormatted}` : `Updated: ${latestDateFormatted}`}</span>
                </span>
                {effectiveConfig?.catalogVersion && (
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800">
                    {effectiveConfig.catalogVersion}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-forest-deep leading-tight">
                {effectiveConfig?.title
                  ? (isAr ? effectiveConfig.title.ar : effectiveConfig.title.en || effectiveConfig.title.ar)
                  : (isAr ? 'كتالوج توريد اللحوم المجمدة المتخصصة والسلع التموينية' : 'Wholesale Meat Specialties & Foodservice Catalog')}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-forest/75 leading-relaxed">
                {effectiveConfig?.subtitle
                  ? (isAr ? effectiveConfig.subtitle.ar : effectiveConfig.subtitle.en || effectiveConfig.subtitle.ar)
                  : (isAr
                    ? 'التركيز الأساسي على توريد أصناف الكبدة والريش والمخ واللسان لمطاعم المملكة، مع تلبية كافة السلع التموينية المساندة (أرز، زيوت، طحين، ومواد تغليف).'
                    : 'Primary wholesale focus on specialized frozen meats (liver, ribs, brain, tongue) alongside essential supporting restaurant commodities.')}
              </p>
            </div>

            {/* Actions: Search + Direct PDF Download */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute inset-y-0 start-3 my-auto size-4 text-forest/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث عن صنف (كبدة، ريش، أرز...)' : 'Search items (liver, ribs...)'}
                  className="w-full rounded-xl border border-forest/20 bg-[#FBF8F2] py-2.5 ps-9 pe-8 text-xs sm:text-sm text-forest-deep placeholder:text-forest/40 focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 end-2.5 my-auto flex size-5 items-center justify-center rounded-full text-forest/40 hover:text-forest"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Single PDF Download Button (Direct Sanity PDF or Print) */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-forest-deep bg-forest-deep text-cream px-5 py-2.5 text-xs sm:text-sm font-bold hover:bg-forest-deep/90 transition-all shadow-md active:scale-95 cursor-pointer"
                title={isAr ? 'تنزيل الكتالوج كملف PDF' : 'Download Catalog PDF'}
              >
                <FileDown className="size-4 text-gold" />
                <span>{isAr ? 'تنزيل الكتالوج (PDF)' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SCREEN ONLY: 2. MAIN CONTENT (CORE MEATS + SUPPORTING COMMODITIES)
          ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12 print:hidden space-y-14">
        {/* =====================================================================
            SECTION 1: CORE WHOLESALE MEAT SPECIALTIES (المسار التخصصي البارز)
            ===================================================================== */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 border-b border-forest/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-dark mb-1">
                <Flame className="size-4 text-amber-600" />
                <span>{isAr ? 'التخصص الاستراتيجي الرئيسي' : 'Core Supply Specialty'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-forest-deep">
                {effectiveConfig?.coreSpecialtiesHeading
                  ? (isAr ? effectiveConfig.coreSpecialtiesHeading.ar : effectiveConfig.coreSpecialtiesHeading.en || effectiveConfig.coreSpecialtiesHeading.ar)
                  : (isAr ? 'أصناف اللحوم التخصصية الرئيسية للمطاعم' : 'Core Specialty Wholesale Meats for Foodservice')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-forest/70 max-w-md">
              {isAr
                ? 'كبدة كلاسيك وجوني جولد، ريش ضأن واجستاف، مخ ولسان مجمد بأعلى معايير النظافة والاعتماد.'
                : 'Premium frozen liver, ribs, brain, and tongue sourced from world-class certified abattoirs.'}
            </p>
          </div>

          {filteredCoreMeats.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-forest/20 bg-white p-8 text-center">
              <Search className="size-8 text-forest/30 mx-auto mb-2" />
              <p className="text-sm font-bold text-forest">
                {isAr ? 'لا يوجد صنف لحوم مطابق لكلمة البحث الحالية' : 'No meat products match your search'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCoreMeats.map((product) => {
                const productHref = getProductHref(product)
                const isSelected = Boolean(selectedMeats[product.id])
                const currentQty = selectedMeats[product.id]?.quantity || 1
                const galleryCount = (product.gallery?.length || 0) + (product.image ? 1 : 0)

                return (
                  <article
                    key={product.id}
                    className={`group relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-lg'
                        : 'border-forest/15 hover:border-gold hover:shadow-md'
                    }`}
                  >
                    {/* Top Image & Gallery Indicator */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-warm">
                      <Image
                        src={product.image || '/images/hero.png'}
                        alt={isAr ? product.name.ar : product.name.en || product.name.ar}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-forest-deep/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-gold border border-gold/30">
                          {isAr ? 'صنف رئيسي' : 'Core Item'}
                        </span>
                        {galleryCount > 1 && (
                          <span className="rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-cream">
                            📷 {galleryCount} {isAr ? 'صور' : 'Photos'}
                          </span>
                        )}
                      </div>

                      {/* Origin overlay at bottom of image */}
                      {product.origin && (
                        <div className="absolute bottom-2.5 start-3 end-3 text-cream">
                          <p className="text-[11px] font-medium opacity-90 truncate">
                            📍 {isAr ? product.origin.ar : product.origin.en || product.origin.ar}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-black text-forest-deep group-hover:text-gold transition-colors leading-snug">
                          <Link href={productHref}>
                            {isAr ? product.name.ar : product.name.en || product.name.ar}
                          </Link>
                        </h3>
                        {product.name.en && isAr && (
                          <p className="text-xs text-forest/60 font-medium mt-0.5 truncate">
                            {product.name.en}
                          </p>
                        )}

                        <p className="mt-2.5 text-xs text-forest/75 line-clamp-2 leading-relaxed">
                          {isAr ? product.description.ar : product.description.en || product.description.ar}
                        </p>

                        {/* Specs Micro Pills */}
                        <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px]">
                          {product.packaging && (
                            <span className="rounded-lg bg-secondary/80 px-2 py-1 font-semibold text-forest-deep flex items-center gap-1">
                              <Package className="size-3 text-gold-dark" />
                              <span className="truncate max-w-[200px]">
                                {isAr ? product.packaging.ar : product.packaging.en}
                              </span>
                            </span>
                          )}
                          <span className="rounded-lg bg-emerald-50 px-2 py-1 font-bold text-emerald-800 border border-emerald-200">
                            ✓ {isAr ? 'حلال 100% · SFDA' : 'Halal · SFDA'}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer: Quantity Stepper + Add to Quote Action */}
                      <div className="mt-5 pt-3.5 border-t border-forest/10 flex items-center justify-between gap-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1 bg-secondary/70 border border-forest/15 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                updateMeatQuantity(product.id, currentQty - 1)
                              }
                            }}
                            disabled={!isSelected || currentQty <= 1}
                            className="size-7 rounded-lg bg-white text-forest-deep font-bold flex items-center justify-center hover:bg-forest/10 disabled:opacity-40 transition-colors"
                            title={isAr ? 'تقليل الكمية' : 'Decrease'}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-black text-forest-deep">
                            {isSelected ? currentQty : 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                updateMeatQuantity(product.id, currentQty + 1)
                              } else {
                                toggleSelectMeat(product)
                              }
                            }}
                            className="size-7 rounded-lg bg-white text-forest-deep font-bold flex items-center justify-center hover:bg-forest/10 transition-colors"
                            title={isAr ? 'زيادة الكمية' : 'Increase'}
                          >
                            +
                          </button>
                        </div>

                        {/* Toggle Select Button */}
                        <button
                          type="button"
                          onClick={() => toggleSelectMeat(product)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-xs ${
                            isSelected
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-forest-deep text-cream hover:bg-forest-deep/90'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="size-3.5 stroke-[3]" />
                              <span>{isAr ? 'محدد في الطلب' : 'Selected'}</span>
                            </>
                          ) : (
                            <>
                              <span>{isAr ? '+ إضافة للتسعير' : '+ Add to Quote'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Link to view product page */}
                      <div className="mt-2 text-center">
                        <Link
                          href={productHref}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-forest/70 hover:text-gold transition-colors"
                        >
                          <span>{isAr ? 'عرض المواصفات والصور كاملة' : 'View Full Details & Specs'}</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* =====================================================================
            SECTION 2: SUPPORTING WHOLESALE COMMODITIES (السلع التموينية المساندة)
            ===================================================================== */}
        <section className="rounded-3xl border border-forest/15 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest/60 mb-1">
              <Layers className="size-4 text-gold-dark" />
              <span>{isAr ? 'خدمات التوريد التمويني الشامل' : 'Full Foodservice Supply Scope'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-forest-deep">
              {effectiveConfig?.supportingCommoditiesHeading
                ? (isAr ? effectiveConfig.supportingCommoditiesHeading.ar : effectiveConfig.supportingCommoditiesHeading.en || effectiveConfig.supportingCommoditiesHeading.ar)
                : (isAr ? 'السلع والمستلزمات التموينية المساندة للمطابخ والمطاعم' : 'Supporting Foodservice Commodities & Packaging')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-forest/75 max-w-3xl leading-relaxed">
              {effectiveConfig?.supportingCommoditiesNote
                ? (isAr ? effectiveConfig.supportingCommoditiesNote.ar : effectiveConfig.supportingCommoditiesNote.en || effectiveConfig.supportingCommoditiesNote.ar)
                : (isAr
                  ? 'إلى جانب تركيزنا التخصصي الرائد في توريد أصناف اللحوم، توفر شركة منافذ التوريد كافة السلع التموينية والمواد الاستهلاكية الأساسية لتشغيل المطابخ المركزية والمطاعم لتلبية احتياجاتكم من مورد واحد معتمد.'
                  : 'Alongside our specialized wholesale meat cuts, Mnaveth ALTourid supplies supporting catering commodities and food packaging to ensure single-source foodservice fulfillment.')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCommodities.map((comm) => {
              const isChecked = Boolean(selectedCommodities[comm.id])

              return (
                <div
                  key={comm.id}
                  onClick={() => toggleSelectCommodity(comm.id)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer ${
                    isChecked
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-600/20'
                      : 'border-forest/15 bg-[#FCFAF5] hover:border-gold hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header: Icon + Title + Checkbox */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white border border-forest/10 shadow-2xs">
                          {getCommodityIcon(comm.icon)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-forest-deep group-hover:text-gold transition-colors leading-tight">
                            {isAr ? comm.name.ar : comm.name.en}
                          </h3>
                          <span className="text-[10px] text-forest/60 font-semibold block mt-0.5">
                            {isAr ? comm.packagingSummary.ar : comm.packagingSummary.en}
                          </span>
                        </div>
                      </div>

                      {/* Custom Checkbox */}
                      <div
                        className={`size-5 shrink-0 rounded-md border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                            : 'border-forest/30 bg-white group-hover:border-emerald-600'
                        }`}
                      >
                        <Check className={`size-3 stroke-[3] ${isChecked ? 'text-white' : 'text-transparent'}`} />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-forest/75 leading-relaxed">
                      {isAr ? comm.description.ar : comm.description.en}
                    </p>

                    {/* Sample Lines Pills */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(isAr ? comm.sampleItems.ar : comm.sampleItems.en).map((sample, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-white/90 border border-forest/10 px-2 py-0.5 text-[10px] font-semibold text-forest/80"
                        >
                          {sample}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom selection indicator */}
                  <div className="mt-4 pt-3 border-t border-forest/10 flex items-center justify-between text-xs font-bold">
                    <span className={isChecked ? 'text-emerald-700 font-black' : 'text-forest/60'}>
                      {isChecked
                        ? (isAr ? '✓ مضاف لطلب التسعير' : '✓ Added to RFQ')
                        : (isAr ? '+ اضغط للإضافة لطلب التسعير' : '+ Click to add to quote')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* =========================================================================
          SCREEN ONLY: 3. FLOATING WHATSAPP RFQ ACTION BAR (مجمع ومرن)
          ========================================================================= */}
      {totalSelectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-2 sm:p-4 bg-gradient-to-t from-black/30 to-transparent pointer-events-none print:hidden">
          <div className="mx-auto max-w-4xl pointer-events-auto">
            {/* Expanded Review Drawer */}
            {showSummaryDrawer && (
              <div className="mb-2.5 rounded-2xl border border-forest/15 bg-white p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between border-b border-forest/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="size-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-black text-forest-deep">
                      {isAr ? 'الأصناف والمستلزمات المختارة لعرض السعر' : 'Selected Items for Wholesale Quotation'}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs text-emerald-800 font-bold">
                      {totalSelectedCount} {isAr ? 'عنصر' : 'items'}
                    </span>
                  </div>
                  <button
                    onClick={clearAllSelected}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="size-3.5" />
                    <span>{isAr ? 'مسح الكل' : 'Clear all'}</span>
                  </button>
                </div>

                {/* Selected Meats List */}
                {selectedMeatList.length > 0 && (
                  <div>
                    <p className="text-[11px] font-black uppercase text-gold-dark mb-1.5">
                      {isAr ? '🥩 أصناف اللحوم الرئيسية:' : '🥩 Core Meat Specialties:'}
                    </p>
                    <div className="max-h-36 overflow-y-auto divide-y divide-forest/5 pe-1 space-y-1">
                      {selectedMeatList.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-2 py-1.5 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                            <span className="font-bold text-forest-deep truncate">
                              {isAr ? product.name.ar : product.name.en || product.name.ar}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded-lg px-2 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateMeatQuantity(product.id, quantity - 1)}
                                className="text-emerald-800 font-bold px-1 hover:text-black"
                              >
                                -
                              </button>
                              <span className="text-xs text-emerald-800 font-black min-w-4 text-center">
                                {quantity} {isAr ? 'كرتون' : 'ctn'}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateMeatQuantity(product.id, quantity + 1)}
                                className="text-emerald-800 font-bold px-1 hover:text-black"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => updateMeatQuantity(product.id, 0)}
                              className="text-forest/30 hover:text-red-600 p-0.5"
                              title={isAr ? 'حذف' : 'Remove'}
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Supporting Commodities List */}
                {selectedCommodityList.length > 0 && (
                  <div className="pt-2 border-t border-forest/10">
                    <p className="text-[11px] font-black uppercase text-gold-dark mb-1.5">
                      {isAr ? '📦 السلع والمستلزمات المساندة:' : '📦 Supporting Commodities:'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCommodityList.map((comm) => (
                        <span
                          key={comm.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-2.5 py-1 text-xs font-bold text-emerald-900"
                        >
                          <span>{isAr ? comm.name.ar : comm.name.en}</span>
                          <button
                            type="button"
                            onClick={() => toggleSelectCommodity(comm.id)}
                            className="hover:text-red-600"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main Bottom Sticky Bar */}
            <div className="rounded-2xl border border-emerald-500/40 bg-forest-deep px-4 py-3 text-cream shadow-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-xs">
                  {totalSelectedCount}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-bold leading-tight">
                    {isAr ? 'الأصناف المختارة للتسعير' : 'Selected Products for Quote'}
                  </p>
                  <p className="text-[11px] text-cream/70">
                    {selectedMeatList.length > 0 && `${totalMeatUnits} ${isAr ? 'كرتون لحوم' : 'meat cartons'}`}
                    {selectedMeatList.length > 0 && selectedCommodityList.length > 0 && ' · '}
                    {selectedCommodityList.length > 0 && `${selectedCommodityList.length} ${isAr ? 'سلع مساندة' : 'supporting lines'}`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSummaryDrawer((prev) => !prev)}
                  className="ms-1 inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-cream hover:bg-white/20 transition-colors"
                >
                  <span>{showSummaryDrawer ? (isAr ? 'تصغير' : 'Collapse') : (isAr ? 'عرض القائمة' : 'Review')}</span>
                  {showSummaryDrawer ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
                </button>
              </div>

              {/* Instant WhatsApp RFQ Action */}
              <a
                href={generateWhatsAppQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white transition-all active:scale-95 shadow-md shadow-emerald-950/40"
              >
                <MessageCircle className="size-4" />
                <span>{isAr ? 'إرسال طلب التسعير عبر واتساب' : 'Request Quote via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

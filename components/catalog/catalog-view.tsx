'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Download,
  FileDown,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import './catalog-view.css'
import type {
  CatalogPageBlockData,
  CatalogPageItemData,
  SiteContent,
} from '@/lib/content/model'
import type { CatalogProduct } from '@/lib/content/catalog-data'

type CatalogMeta = NonNullable<SiteContent['catalogPage']>

type Props = {
  products: CatalogProduct[]
  catalogMeta?: CatalogMeta
}

function text(value: { ar: string; en: string } | undefined, locale: string, fallback = '') {
  if (!value) return fallback
  return locale === 'ar' ? value.ar || value.en || fallback : value.en || value.ar || fallback
}

function toCatalogProduct(product: CatalogProduct): NonNullable<CatalogPageItemData['product']> {
  return {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    description: product.description,
    image: { ar: product.image, en: product.image },
    gallery: product.gallery || [],
    isCoreSpecialty: product.isCoreSpecialty === true,
    order: product.order,
  }
}

function generatedPages(title: CatalogMeta['title'] | undefined, subtitle: CatalogMeta['subtitle'] | undefined, products: CatalogProduct[], meta?: CatalogMeta): CatalogPageBlockData[] {
  const focused = products
    .filter((product) => product.isCoreSpecialty)
    .sort((left, right) => left.order - right.order)
  const productItems = focused.map((product, index): CatalogPageItemData => ({
    id: `generated-${product.id}-${index}`,
    title: product.name,
    caption: product.description,
    product: toCatalogProduct(product),
    images: [],
  }))
  const pages: CatalogPageBlockData[] = [
    {
      id: 'generated-cover', pageType: 'cover', visible: true, includeInIndex: false,
      showHeading: true, title, subtitle, backgroundMode: 'white', items: productItems.slice(0, 1), categories: [],
    },
    {
      id: 'generated-index', pageType: 'productIndex', visible: true, includeInIndex: false,
      showHeading: true,
      title: { ar: 'فهرس الأصناف', en: 'Product Index' },
      subtitle: { ar: 'الأصناف الرئيسية التي نوفرها', en: 'Our focused product range' },
      backgroundMode: 'white', items: [], categories: [],
    },
  ]
  for (let index = 0; index < productItems.length; index += 4) {
    const items = productItems.slice(index, index + 4)
    pages.push({
      id: `generated-products-${index / 4 + 1}`, pageType: 'productGroup', visible: true,
      includeInIndex: true, showHeading: true,
      title: { ar: 'أصناف اللحوم الرئيسية', en: 'Core Meat Specialties' },
      backgroundMode: 'white', items, categories: [],
    })
  }
  if (meta?.supportingCommodities?.length) {
    pages.push({
      id: 'generated-supporting', pageType: 'supportingCommodities', visible: true,
      includeInIndex: true, showHeading: true,
      title: meta.supportingCommoditiesHeading || { ar: 'السلع المساندة', en: 'Supporting Commodities' },
      description: meta.supportingCommoditiesNote,
      backgroundMode: 'white', items: [], categories: [],
    })
  }
  return pages
}

function CatalogSlide({
  page,
  pages,
  pageIndex,
  locale,
  isAr,
  meta,
  print = false,
}: {
  page: CatalogPageBlockData
  pages: CatalogPageBlockData[]
  pageIndex: number
  locale: string
  isAr: boolean
  meta?: CatalogMeta
  print?: boolean
}) {
  const title = text(page.title, locale, page.pageType === 'cover' ? text(meta?.title, locale, 'كتالوج المنتجات') : '')
  const subtitle = text(page.subtitle, locale, page.pageType === 'cover' ? text(meta?.subtitle, locale) : '')
  const description = text(page.description, locale)
  const direction = isAr ? 'rtl' : 'ltr'
  const style = page.backgroundMode === 'image' && page.backgroundImage
    ? {
        backgroundImage: `linear-gradient(90deg, rgba(12,45,34,.9), rgba(12,45,34,.48)), url("${page.backgroundImage}")`,
        backgroundPosition: 'center', backgroundSize: 'cover',
      }
    : undefined

  if (page.pageType === 'fullPageImage') {
    return (
            <article
        className={`catalog-slide catalog-full-image ${print ? 'catalog-print-slide catalog-print-full-image' : ''}`}
        data-print-page-index={print ? pageIndex : undefined}
        dir={direction}
      >
        {page.fullPageImage ? <img src={page.fullPageImage} alt={text(page.fullPageImageAlt, locale, title)} /> : (
          <div className="catalog-slide-empty">{isAr ? 'أضف صورة تصميم الصفحة في Sanity' : 'Add a full-page design image in Sanity'}</div>
        )}
      </article>
    )
  }

  if (page.pageType === 'cover') {
    const hero = page.items[0]
    const heroImage = hero?.images[0]?.url || hero?.product?.gallery?.[0] || hero?.product?.image?.ar || hero?.product?.image?.en
    return (
      <article className={`catalog-slide catalog-cover ${print ? 'catalog-print-slide' : ''}`} dir={direction} style={style}>
        <div className="catalog-brand">
          <span className="catalog-brand-mark" aria-hidden="true">M</span>
          <span>{isAr ? 'منافذ التوريد التجارية' : 'Mnaveth ALTourid'}</span>
        </div>
        <div className="catalog-cover-copy">
          <span className="catalog-company-name">{isAr ? 'شركة منافذ التوريد التجارية' : 'Mnaveth ALTourid Commercial'}</span>
          {page.showHeading && <h2>{title || (isAr ? 'كتالوج المنتجات' : 'Product Catalog')}</h2>}
          {subtitle && <p>{subtitle}</p>}
          {meta?.catalogVersion && <span className="catalog-version">{meta.catalogVersion}</span>}
        </div>
        {heroImage ? <div className="catalog-cover-photo"><img src={heroImage} alt={text(hero?.images[0]?.alt, locale, title)} /></div> : (
          <div className="catalog-cover-art" aria-hidden="true"><span>M</span></div>
        )}
        <div className="catalog-cover-band" />
        <span className="catalog-slide-number">01</span>
      </article>
    )
  }

  if (page.pageType === 'closing') {
    return (
      <article className={`catalog-slide catalog-closing ${print ? 'catalog-print-slide' : ''}`} dir={direction} style={style}>
        <span className="catalog-closing-emblem" aria-hidden="true">M</span>
        <div className="catalog-brand"><span className="catalog-brand-mark" aria-hidden="true">M</span><span>{isAr ? 'منافذ التوريد التجارية' : 'Mnaveth ALTourid'}</span></div>
        <div className="catalog-closing-copy">
          {page.showHeading && <h2>{title || (isAr ? 'منافذ التوريد التجارية' : 'Mnaveth ALTourid')}</h2>}
          {subtitle && <p>{subtitle}</p>}
          {description && <p>{description}</p>}
          <span className="catalog-closing-rule" />
        </div>
        <span className="catalog-slide-number">{String(pageIndex + 1).padStart(2, '0')}</span>
      </article>
    )
  }

  if (page.pageType === 'productIndex') {
    const indexed = pages
      .map((candidate, index) => ({ candidate, index }))
      .filter(({ candidate }) => candidate.visible && candidate.includeInIndex && candidate.pageType !== 'productIndex' && candidate.pageType !== 'cover')
      .flatMap(({ candidate, index }) => {
        const itemEntries = candidate.items.map((item) => ({
          id: `${candidate.id}-${item.id}`,
          title: text(item.title, locale, text(item.product?.name, locale, '')),
          page: index + 1,
        })).filter((entry) => entry.title)
        if (itemEntries.length) return itemEntries
        const categoryEntries = candidate.categories.map((category) => ({
          id: `${candidate.id}-${category.id}`,
          title: text(category.name, locale),
          page: index + 1,
        }))
        if (categoryEntries.length) return categoryEntries
        return [{ id: candidate.id, title: text(candidate.title, locale, isAr ? 'صفحة أصناف' : 'Product page'), page: index + 1 }]
      })
    return (
      <article className={`catalog-slide catalog-paper catalog-index ${print ? 'catalog-print-slide' : ''}`} dir={direction} style={style}>
        <div className="catalog-slide-topline"><span className="catalog-mini-brand">M · {isAr ? 'منافذ التوريد' : 'Mnaveth ALTourid'}</span><span>{isAr ? 'دليل الأصناف' : 'CATALOG'}</span></div>
        {page.showHeading && <header className="catalog-page-heading"><h2>{title || (isAr ? 'فهرس الأصناف' : 'Product Index')}</h2>{subtitle && <p>{subtitle}</p>}</header>}
        {description && <p className="catalog-page-description">{description}</p>}
        <div className="catalog-index-list">
          {indexed.length ? indexed.map((entry, index) => (
            <div className="catalog-index-row" key={entry.id}>
              <span className="catalog-index-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="catalog-index-title">{entry.title}</span>
              <span className="catalog-index-rule" />
              <span className="catalog-index-page">{String(entry.page).padStart(2, '0')}</span>
            </div>
          )) : <p className="catalog-empty-copy">{isAr ? 'أضف صفحات المنتجات من Sanity لتظهر هنا.' : 'Add product pages in Sanity to list them here.'}</p>}
        </div>
        <div className="catalog-slide-footer"><span>{isAr ? 'الأصناف الرئيسية' : 'CORE RANGE'}</span><span>02</span></div>
      </article>
    )
  }

  if (page.pageType === 'supportingCommodities') {
    const commodities = meta?.supportingCommodities || []
    return (
      <article className={`catalog-slide catalog-paper catalog-supporting ${print ? 'catalog-print-slide' : ''}`} dir={direction} style={style}>
        <div className="catalog-slide-topline"><span className="catalog-mini-brand">M · {isAr ? 'منافذ التوريد' : 'Mnaveth ALTourid'}</span><span>{isAr ? 'التوريد التجاري' : 'FOODSERVICE SUPPLY'}</span></div>
        {page.showHeading && <header className="catalog-page-heading"><h2>{title || (isAr ? 'السلع المساندة' : 'Supporting Commodities')}</h2>{subtitle && <p>{subtitle}</p>}</header>}
        {(description || text(meta?.supportingCommoditiesNote, locale)) && <p className="catalog-page-description">{description || text(meta?.supportingCommoditiesNote, locale)}</p>}
        <div className="catalog-support-list">
          {commodities.map((commodity) => (
            <div className="catalog-support-row" key={commodity.id}>
              {commodity.image && <img src={commodity.image.ar || commodity.image.en} alt="" />}
              <div><h3>{text(commodity.name, locale)}</h3>{text(commodity.description, locale) && <p>{text(commodity.description, locale)}</p>}</div>
              <ArrowRight size={16} aria-hidden="true" />
            </div>
          ))}
          {!commodities.length && <p className="catalog-empty-copy">{isAr ? 'أضف فئات السلع المساندة في إعدادات الكتالوج داخل Sanity.' : 'Add supporting categories in the catalog settings in Sanity.'}</p>}
        </div>
        <div className="catalog-slide-footer"><span>{isAr ? 'متوفرة للمنشآت التجارية' : 'AVAILABLE FOR BUSINESS SUPPLY'}</span><span>{String(pageIndex + 1).padStart(2, '0')}</span></div>
      </article>
    )
  }

  const items = page.items.slice(0, 4)
  return (
    <article className={`catalog-slide catalog-paper catalog-products ${print ? 'catalog-print-slide' : ''}`} dir={direction} style={style}>
      <div className="catalog-slide-topline"><span className="catalog-mini-brand">M · {isAr ? 'منافذ التوريد' : 'Mnaveth ALTourid'}</span><span>{isAr ? 'كتالوج المنتجات' : 'PRODUCT CATALOG'}</span></div>
      {(page.showHeading || subtitle) && <header className="catalog-page-heading"><h2>{page.showHeading ? title : ''}</h2>{subtitle && <p>{subtitle}</p>}</header>}
      {description && <p className="catalog-page-description">{description}</p>}
      {page.categories.length > 0 && <div className="catalog-category-line">{page.categories.map((category) => <span key={category.id}>{text(category.name, locale)}</span>)}</div>}
      <div className={`catalog-product-grid count-${Math.max(1, items.length)}`}>
        {items.map((item, itemIndex) => {
          const name = text(item.title, locale, text(item.product?.name, locale, isAr ? 'صنف رئيسي' : 'Featured product'))
          const itemSubtitle = text(item.subtitle, locale)
          const caption = text(item.caption, locale, text(item.product?.description, locale))
          const images = item.images.map((image) => ({ url: image.url, alt: text(image.alt, locale, name), caption: text(image.caption, locale) }))
          const gallery = item.product?.gallery?.map((url) => ({ url, alt: name, caption: '' })) || []
          const productImage = item.product?.image?.[locale === 'ar' ? 'ar' : 'en'] || item.product?.image?.ar || item.product?.image?.en
          const available = images.length ? images : gallery.length ? gallery : productImage ? [{ url: productImage, alt: name, caption: '' }] : []
          return (
            <section className="catalog-product-item" key={item.id}>
              {available[0] ? <div className="catalog-product-image"><img src={available[0].url} alt={available[0].alt} />{available.length > 1 && <span className="catalog-image-count">{available.length} {isAr ? 'صور' : 'PHOTOS'}</span>}</div> : (
                <div className="catalog-product-placeholder"><ImageIcon size={34} strokeWidth={1.4} /><span>{isAr ? 'تضاف صورة الصنف من Sanity' : 'Add product image in Sanity'}</span></div>
              )}
              <div className="catalog-product-copy"><h3>{name}</h3>{itemSubtitle && <p className="catalog-product-subtitle">{itemSubtitle}</p>}{caption && <p className="catalog-product-caption">{caption}</p>}</div>
              {available.length > 1 && <div className="catalog-product-thumbnails">{available.slice(1, 4).map((image, index) => <img key={`${item.id}-image-${index}`} src={image.url} alt={image.alt} />)}</div>}
              <span className="catalog-product-index">{String(itemIndex + 1).padStart(2, '0')}</span>
            </section>
          )
        })}
        {!items.length && <p className="catalog-empty-copy">{isAr ? 'أضف الأصناف والصور من Sanity.' : 'Add products and images in Sanity.'}</p>}
      </div>
      <div className="catalog-slide-footer"><span>{isAr ? 'شركة منافذ التوريد التجارية' : 'MNAVETH ALTOURID'}</span><span>{String(pageIndex + 1).padStart(2, '0')}</span></div>
    </article>
  )
}

export function CatalogView({ products, catalogMeta }: Props) {
  const { locale } = useLocale()
  const isAr = locale === 'ar'
  const authoredPages = catalogMeta?.pages?.filter((page) => page.visible !== false) || []
  const pages = useMemo(
    () => authoredPages.length ? authoredPages : generatedPages(catalogMeta?.title, catalogMeta?.subtitle, products, catalogMeta),
    [authoredPages, catalogMeta, products],
  )
  const format = 'a4Landscape'
  const [activeIndex, setActiveIndex] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const activePage = pages[Math.min(activeIndex, Math.max(pages.length - 1, 0))]
  const PreviousIcon = isAr ? ArrowRight : ArrowLeft
  const NextIcon = isAr ? ArrowLeft : ArrowRight

  useEffect(() => setActiveIndex(0), [pages.length])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return
      if (event.key === 'ArrowRight') setActiveIndex((index) => Math.min(pages.length - 1, index + (isAr ? -1 : 1)))
      if (event.key === 'ArrowLeft') setActiveIndex((index) => Math.max(0, index + (isAr ? 1 : -1)))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isAr, pages.length])

  const title = text(catalogMeta?.title, locale, isAr ? 'كتالوج المنتجات' : 'Product Catalog')
  const downloadPdf = async () => {
    setIsExporting(true)
    let captureRoot: HTMLDivElement | undefined

    try {
      const [{ jsPDF }, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])
      const html2canvas = html2canvasModule.default
      const sourceSlides = Array.from(document.querySelectorAll<HTMLElement>('.catalog-print-slide'))
      if (!sourceSlides.length) return

      captureRoot = document.createElement('div')
      captureRoot.setAttribute('aria-hidden', 'true')
      Object.assign(captureRoot.style, {
        position: 'fixed',
        left: '-20000px',
        top: '0',
        display: 'block',
        visibility: 'visible',
        pointerEvents: 'none',
        zIndex: '-1',
      })
      document.body.append(captureRoot)

      const a4WidthPx = Math.round((297 / 25.4) * 96)
      const a4HeightPx = Math.round((210 / 25.4) * 96)
      const a4WidthPt = (297 / 25.4) * 72
      const a4HeightPt = (210 / 25.4) * 72
      let pdf: InstanceType<typeof jsPDF> | undefined

      for (const sourceSlide of sourceSlides) {
        const slide = sourceSlide.cloneNode(true) as HTMLElement
        const isFullImage = sourceSlide.classList.contains('catalog-print-full-image')
        const image = slide.querySelector<HTMLImageElement>('img')

        if (image) await image.decode().catch(() => undefined)

        const widthPx = isFullImage && image?.naturalWidth ? image.naturalWidth : a4WidthPx
        const heightPx = isFullImage && image?.naturalHeight ? image.naturalHeight : a4HeightPx
        Object.assign(slide.style, {
          width: `${widthPx}px`,
          height: `${heightPx}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          aspectRatio: 'auto',
          flex: 'none',
          margin: '0',
          boxShadow: 'none',
        })
        captureRoot.append(slide)

        await Promise.all(
          Array.from(slide.querySelectorAll('img')).map((pageImage) =>
            pageImage.decode().catch(() => undefined),
          ),
        )

        const canvas = await html2canvas(slide, {
          backgroundColor: '#ffffff',
          scale: isFullImage ? 1 : 2,
          useCORS: true,
          logging: false,
          width: widthPx,
          height: heightPx,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
        })
        const pageWidthPt = isFullImage ? widthPx * 0.75 : a4WidthPt
        const pageHeightPt = isFullImage ? heightPx * 0.75 : a4HeightPt
        const orientation = pageWidthPt >= pageHeightPt ? 'landscape' : 'portrait'
        const format: [number, number] = [pageWidthPt, pageHeightPt]
        const data = canvas.toDataURL(isFullImage ? 'image/png' : 'image/jpeg', 0.96)

        if (!pdf) {
          pdf = new jsPDF({ orientation, unit: 'pt', format, compress: true })
        } else {
          pdf.addPage(format, orientation)
        }
        pdf.addImage(data, isFullImage ? 'PNG' : 'JPEG', 0, 0, pageWidthPt, pageHeightPt)
        slide.remove()
      }

      if (pdf) {
        const safeTitle = title.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'catalog'
        pdf.save(`${safeTitle}.pdf`)
      }
    } catch (error) {
      console.error('Catalog PDF generation failed:', error)
      window.alert(isAr
        ? 'تعذر إنشاء ملف PDF. تحقق من اتصال الصور ثم أعد المحاولة.'
        : 'Could not create the PDF. Check the image connection and try again.')
    } finally {
      captureRoot?.remove()
      setIsExporting(false)
    }
  }

  if (!activePage) return null

  return (
    <main className="catalog-experience" dir={isAr ? 'rtl' : 'ltr'}>
      <section className="catalog-screen" aria-label={isAr ? 'عارض كتالوج المنتجات' : 'Product catalog viewer'}>
        <div className="catalog-toolbar">
          <div className="catalog-title-lockup"><span className="catalog-lockup-mark">M</span><div><p>{isAr ? 'كتالوج شركة منافذ التوريد' : 'MNAVETH ALTOURID CATALOG'}</p><h1>{title}</h1></div></div>
          <div className="catalog-toolbar-actions">
            <span className="catalog-format-label"><Maximize2 size={15} />{format === 'a4Landscape' ? (isAr ? 'أفقي · A4' : 'LANDSCAPE · A4') : '16:9'}</span>
            <button className="catalog-download-button" type="button" onClick={downloadPdf} disabled={isExporting}><Download size={17} /><span>{isExporting ? (isAr ? 'جارٍ تجهيز PDF' : 'Preparing PDF') : (isAr ? 'تنزيل PDF' : 'Download PDF')}</span></button>
          </div>
        </div>
        <div className="catalog-stage">
          <button className="catalog-side-nav" type="button" onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} disabled={activeIndex === 0} aria-label={isAr ? 'الصفحة السابقة' : 'Previous page'}><PreviousIcon size={21} /></button>
          <CatalogSlide page={activePage} pages={pages} pageIndex={activeIndex} locale={locale} isAr={isAr} meta={catalogMeta} />
          <button className="catalog-side-nav" type="button" onClick={() => setActiveIndex((index) => Math.min(pages.length - 1, index + 1))} disabled={activeIndex >= pages.length - 1} aria-label={isAr ? 'الصفحة التالية' : 'Next page'}><NextIcon size={21} /></button>
        </div>
        <div className="catalog-pagination">
          <label className="catalog-page-select"><BookOpen size={16} /><span>{isAr ? 'الصفحة' : 'PAGE'} {activeIndex + 1} <i>/</i> {pages.length}</span><ChevronDown size={15} /><select aria-label={isAr ? 'اختيار الصفحة' : 'Choose page'} value={activeIndex} onChange={(event) => setActiveIndex(Number(event.target.value))}>{pages.map((page, index) => <option key={page.id} value={index}>{index + 1}. {text(page.title, locale, isAr ? 'صفحة الكتالوج' : 'Catalog page')}</option>)}</select></label>
          <div className="catalog-page-dots" aria-label={isAr ? 'صفحات الكتالوج' : 'Catalog pages'}>{pages.map((page, index) => <button key={page.id} type="button" onClick={() => setActiveIndex(index)} className={index === activeIndex ? 'active' : ''} aria-label={`${isAr ? 'انتقل إلى الصفحة' : 'Go to page'} ${index + 1}`} aria-current={index === activeIndex ? 'page' : undefined} />)}</div>
          <span className="catalog-page-name">{text(activePage.title, locale, isAr ? 'صفحة الكتالوج' : 'Catalog page')}</span>
        </div>
      </section>
      <section className="catalog-print-pages" aria-hidden="true">
        {pages.map((page, index) => <CatalogSlide key={`print-${page.id}`} page={page} pages={pages} pageIndex={index} locale={locale} isAr={isAr} meta={catalogMeta} print />)}
      </section>
      <div className="catalog-print-hint"><FileDown size={15} />{isAr ? 'اختر «حفظ كـ PDF» في نافذة الطباعة' : 'Choose “Save as PDF” in the print dialog'}</div>
    </main>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react'
import { Globe, Menu, X } from 'lucide-react'
import { DirArrow } from './dir-arrow'
import { useContent, useLocale } from './locale-provider'

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { locale, setLocale, t } = useLocale()
  const { site, sections } = useContent()
  const navItems = site.nav.filter((item) => sections[item.id as keyof typeof sections] !== false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  const solid = scrolled || !isHome
  const activeId = isHome ? activeSection : navItems.find((item) => item.href === pathname)?.id

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isHome) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isHome, navItems])

  const slide = locale === 'ar' ? 20 : -20

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'bg-forest-deep/90 py-2 shadow-lg shadow-black/20 backdrop-blur-md' : 'bg-transparent py-4'
      }`}
    >
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-gradient rtl:origin-right ltr:origin-left"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/#home" className="flex items-center gap-3" aria-label={t(site.brand.homeLabel)}>
          <Image
            src={site.brand.logo}
            alt=""
            width={56}
            height={56}
            className={`rounded-full ring-1 ring-gold/40 transition-all duration-500 ${solid ? 'size-11' : 'size-14'}`}
            priority
          />
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-gold-gradient">{t(site.brand.name)}</span>
            <span className="block text-[11px] font-medium tracking-wider text-cream/70">
              {t(site.brand.subtitle)}
            </span>
          </span>
        </Link>

        <nav aria-label={t(site.ui.mainNav)} className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`relative rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                    activeId === item.id ? 'text-gold' : 'text-cream/85 hover:text-gold'
                  }`}
                >
                  {t(item.label)}
                  {activeId === item.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-gold"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            className="group relative hidden items-center gap-2 overflow-hidden rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-bold text-forest-deep shadow-md shadow-gold/20 transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40"
              aria-hidden="true"
            />
            {t(site.ui.requestQuote)}
            <DirArrow />
          </Link>
          <button
            type="button"
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cream/20 px-3 py-2 text-sm font-bold text-cream/85 transition-colors hover:border-gold hover:text-gold"
            aria-label={t(site.ui.switchLanguage)}
            lang={locale === 'ar' ? 'en' : 'ar'}
          >
            <Globe className="size-4" aria-hidden="true" />
            {t(site.ui.languageButton)}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-cream/20 text-cream xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t(open ? site.ui.closeMenu : site.ui.openMenu)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={t(site.ui.mobileNav)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-forest-deep/95 backdrop-blur-md xl:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: slide }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-3 font-medium hover:bg-white/5 hover:text-gold ${
                      activeId === item.id ? 'text-gold' : 'text-cream/90'
                    }`}
                  >
                    {t(item.label)}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-2">
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-5 py-3 font-bold text-forest-deep"
                >
                  {t(site.ui.requestQuote)}
                  <DirArrow />
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

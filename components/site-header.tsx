'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react'
import { ArrowLeft, Globe, Menu, X } from 'lucide-react'

const links = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#about', label: 'من نحن' },
  { href: '#services', label: 'خدماتنا' },
  { href: '#gallery', label: 'المعرض' },
  { href: '#sectors', label: 'القطاعات' },
  { href: '#contact', label: 'تواصل معنا' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-forest-deep/90 py-2 shadow-lg shadow-black/20 backdrop-blur-md' : 'bg-transparent py-4'
      }`}
    >
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 origin-right bg-gold-gradient"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <a href="#home" className="flex items-center gap-3" aria-label="منافذ التوريد - الرئيسية">
          <Image
            src="/images/logo.png"
            alt=""
            width={56}
            height={56}
            className={`rounded-full ring-1 ring-gold/40 transition-all duration-500 ${scrolled ? 'size-11' : 'size-14'}`}
            priority
          />
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-gold-gradient">منافذ التوريد</span>
            <span className="block text-[11px] font-medium tracking-wider text-cream/70">Mnaveeh ALTourid · since 2001</span>
          </span>
        </a>

        <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active === link.href ? 'text-gold' : 'text-cream/85 hover:text-gold'
                  }`}
                >
                  {link.label}
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="group relative hidden items-center gap-2 overflow-hidden rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-bold text-forest-deep shadow-md shadow-gold/20 transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40"
              aria-hidden="true"
            />
            طلب عرض سعر
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-lg border border-cream/20 px-3 py-2 text-sm font-bold text-cream/85 transition-colors hover:border-gold hover:text-gold md:inline-flex"
            aria-label="Switch to English"
          >
            <Globe className="size-4" aria-hidden="true" />
            EN
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-cream/20 text-cream lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="قائمة الجوال"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-forest-deep/95 backdrop-blur-md lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 font-medium text-cream/90 hover:bg-white/5 hover:text-gold"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-2">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-5 py-3 font-bold text-forest-deep"
                >
                  طلب عرض سعر
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

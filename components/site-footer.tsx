import Image from 'next/image'

const columns = [
  {
    title: 'روابط سريعة',
    links: [
      { href: '#about', label: 'من نحن' },
      { href: '#services', label: 'خدماتنا' },
      { href: '#gallery', label: 'المعرض' },
      { href: '#sectors', label: 'القطاعات' },
    ],
  },
  {
    title: 'خدماتنا',
    links: [
      { href: '#services', label: 'توريد المواد الغذائية' },
      { href: '#services', label: 'المطاعم والفنادق' },
      { href: '#services', label: 'النقل البري' },
      { href: '#services', label: 'الاستيراد البحري' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 bg-forest-deep text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.5fr_1fr_1fr] md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="" width={56} height={56} className="size-14 rounded-full ring-1 ring-gold/40" />
            <span>
              <span className="block text-xl font-extrabold text-gold-gradient">منافذ التوريد</span>
              <span className="block text-xs tracking-wider">Mnaveeh ALTourid · since 2001</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm leading-relaxed">
            شريكك الموثوق في توريد المواد الغذائية، من المصدر إلى وجهتك بجودة عالمية وسلاسل إمداد متكاملة.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-4 font-bold text-cream">{col.title}</h2>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-gold">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-sm">
        © {new Date().getFullYear()} منافذ التوريد. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}

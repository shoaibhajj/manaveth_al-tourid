import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-black text-forest">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-foreground">
        الصفحة غير موجودة | Page Not Found
      </h2>
      <p className="mt-2 text-muted-foreground">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-gold-gradient px-6 py-3 font-bold text-forest-deep shadow-md hover:scale-105 transition-transform"
      >
        العودة للرئيسية / Back to Home
      </Link>
    </main>
  )
}

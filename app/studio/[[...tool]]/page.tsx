import { isSanityConfigured, requiredSanityVariables } from '@/sanity/env'
import { StudioFrame } from './studio-frame'

export { metadata, viewport } from 'next-sanity/studio'

function SetupGuide() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6 py-24">
      <section dir="rtl" lang="ar" className="flex flex-col gap-4">
        <h1 className="text-balance text-2xl font-extrabold text-foreground">استوديو المحتوى غير مُعدّ بعد</h1>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          أنشئ مشروع Sanity من لوحة تحكم Sanity، ثم أضف المتغيرين التاليين في إعدادات المشروع (Vars)، وأعد تحميل هذه
          الصفحة. أضف أيضًا عنوان الموقع إلى قائمة CORS في Sanity مع تفعيل «Allow credentials».
        </p>
      </section>
      <section dir="ltr" lang="en" className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-foreground">The content Studio is not configured yet</h2>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          Create a Sanity project, add the variables below to the project settings, then reload this page. Also add this
          site&apos;s origin to the Sanity CORS origins with &quot;Allow credentials&quot; enabled.
        </p>
        <ul className="flex flex-col gap-2 font-mono text-sm">
          {requiredSanityVariables.map(({ name, present }) => (
            <li key={name} className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2">
              <span className="text-foreground">{name}</span>
              <span className={present ? 'text-foreground' : 'text-muted-foreground'}>{present ? 'set' : 'missing'}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default function StudioPage() {
  return isSanityConfigured ? <StudioFrame /> : <SetupGuide />
}

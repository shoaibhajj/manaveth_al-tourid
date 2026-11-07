import { visionTool } from '@sanity/vision'
import { defineConfig, type DocumentActionComponent } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { mainDocuments } from './sanity/presentation/resolve'
import { sanityEnv } from './sanity/env'
import { arabicBundles, arabicLocale } from './sanity/i18n/arabic'
import { schemaTypes, singletonTypes } from './sanity/schemaTypes'
import { structure, defaultDocumentNode } from './sanity/structure'
import { defaultSectionsList } from './lib/content/default-sections'

const isSingleton = (type: string | undefined) => singletonTypes.some((name) => name === type)
const blockedSingletonActions = ['unpublish', 'delete', 'duplicate']

const ResetSectionsAction: DocumentActionComponent = (props) => {
  if (props.type !== 'homePage') return null

  return {
    label: '🔄 استعادة الأقسام الافتراضية (Reset)',
    title: 'إعادة كافة أقسام الصفحة الرئيسية الـ 10 إلى ترتيبها وحالتها الأصلية',
    onHandle: () => {
      const confirmed = window.confirm(
        'هل تريد بالتأكيد إعادة ضبط كافة أقسام الصفحة الرئيسية الـ 10 إلى ترتيبها وحالتها الافتراضية الأصلية؟',
      )
      if (confirmed) {
        props.patch.execute([
          {
            set: {
              sectionsList: defaultSectionsList,
            },
          },
        ])
      }
    },
  }
}

const siteOrigin =
  typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mnaveth-altourid.com'

// The Studio is only mounted when the project is configured (see app/studio),
// so empty fallbacks here never reach a real Sanity request.
export default defineConfig({
  name: 'default',
  title: 'Mnaveth ALTourid Content',
  basePath: '/studio',
  projectId: sanityEnv.projectId ?? '',
  dataset: sanityEnv.dataset ?? '',
  // Arabic is listed last so it becomes the default; editors can still switch to English from the user menu.
  i18n: {
    bundles: arabicBundles,
    locales: (prev) => [...prev, arabicLocale],
  },
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => !isSingleton(template.schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) => {
      const filtered = isSingleton(schemaType)
        ? actions.filter(({ action }) => !action || !blockedSingletonActions.includes(action))
        : actions

      if (schemaType === 'homePage') {
        return [...filtered, ResetSectionsAction]
      }
      return filtered
    },
    newDocumentOptions: (options, { creationContext }) =>
      creationContext.type === 'global' ? options.filter((option) => !isSingleton(option.templateId)) : options,
  },
  plugins: [
    structureTool({ structure, defaultDocumentNode }),
    presentationTool({
      title: 'معاينة الموقع',
      previewUrl: {
        initial: siteOrigin,
        previewMode: { enable: '/api/draft-mode/enable' },
      },
      resolve: { mainDocuments },
    }),
    visionTool({ defaultApiVersion: sanityEnv.apiVersion }),
  ],
})

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { mainDocuments } from './sanity/presentation/resolve'
import { sanityEnv } from './sanity/env'
import { arabicBundles, arabicLocale } from './sanity/i18n/arabic'
import { schemaTypes, singletonTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

const isSingleton = (type: string | undefined) => singletonTypes.some((name) => name === type)
const blockedSingletonActions = ['unpublish', 'delete', 'duplicate']

// The Studio is only mounted when the project is configured (see app/studio),
// so empty fallbacks here never reach a real Sanity request.
export default defineConfig({
  name: 'default',
  title: 'Mnaveeh ALTourid Content',
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
    actions: (actions, { schemaType }) =>
      isSingleton(schemaType) ? actions.filter(({ action }) => !action || !blockedSingletonActions.includes(action)) : actions,
    newDocumentOptions: (options, { creationContext }) =>
      creationContext.type === 'global' ? options.filter((option) => !isSingleton(option.templateId)) : options,
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: 'معاينة الموقع',
      previewUrl: {
        initial: '/',
        previewMode: { enable: '/api/draft-mode/enable' },
      },
      resolve: { mainDocuments },
    }),
    visionTool({ defaultApiVersion: sanityEnv.apiVersion }),
  ],
})

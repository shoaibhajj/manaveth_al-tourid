import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { sanityEnv } from './sanity/env'
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
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: sanityEnv.apiVersion })],
})

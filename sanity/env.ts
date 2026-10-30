/**
 * Public Sanity identifiers. They only name the project and dataset; they grant no access.
 * Never put a read or write token in a NEXT_PUBLIC_ variable.
 */
export const sanityEnv = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  // A date-based API version is a constant of the Sanity API, not a project value.
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
}

export const isSanityConfigured = Boolean(sanityEnv.projectId && sanityEnv.dataset)

export const requiredSanityVariables = [
  { name: 'NEXT_PUBLIC_SANITY_PROJECT_ID', present: Boolean(sanityEnv.projectId) },
  { name: 'NEXT_PUBLIC_SANITY_DATASET', present: Boolean(sanityEnv.dataset) },
]

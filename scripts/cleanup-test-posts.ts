/**
 * scripts/cleanup-test-posts.ts
 *
 * Staged cleanup script for test/orphan posts in Sanity production dataset (e.g. 'oli1').
 * NOTE: DO NOT EXECUTE AGAINST PRODUCTION WITHOUT EXPLICIT USER CONSENT.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN="sk..." node --loader ts-node/esm scripts/cleanup-test-posts.ts
 */

import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '10ol7pkg'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('Error: SANITY_API_WRITE_TOKEN is required to execute deletion.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

async function cleanupTestPosts() {
  console.log('Querying for test post "oli1" across draft and published documents...')
  const docs = await client.fetch<Array<{ _id: string; title?: any }>>(
    `*[_type == "article" && (slug.current == "oli1" || _id in ["oli1", "drafts.oli1"])] { _id, title }`
  )

  if (!docs.length) {
    console.log('No documents found with slug or ID "oli1". Dataset is clean.')
    return
  }

  console.log(`Found ${docs.length} document(s) matching "oli1":`, docs)
  for (const doc of docs) {
    console.log(`Deleting ${doc._id}...`)
    await client.delete(doc._id)
    console.log(`Deleted ${doc._id} successfully.`)
  }
}

cleanupTestPosts().catch((err) => {
  console.error('Cleanup failed:', err)
  process.exit(1)
})

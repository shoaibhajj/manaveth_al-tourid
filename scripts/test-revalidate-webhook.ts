/**
 * scripts/test-revalidate-webhook.ts
 *
 * Automated verification test for Task D2 (Sanity Webhook Revalidation):
 * 1. Tests rejection of missing signature -> 401
 * 2. Tests rejection of forged / invalid signature -> 401
 * 3. Tests acceptance of valid HMAC signature -> 200 with revalidation confirmation
 */

import { encodeSignatureHeader } from '@sanity/webhook'

const secret = 'test-secret-12345'
process.env.SANITY_WEBHOOK_SECRET = secret

async function runTests() {
  console.log('--- Testing Sanity Webhook Revalidation (D2) ---')

  const { POST } = await import('../app/api/revalidate/route.ts')

  // Test 1: Missing signature header
  const reqNoSig = new Request('http://localhost:3000/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ _type: 'product', slug: { current: 'test-product' } }),
    headers: { 'Content-Type': 'application/json' },
  })
  const resNoSig = await POST(reqNoSig as any)
  console.log(`Test 1 (Missing Signature): status = ${resNoSig.status} (expected: 401)`)
  if (resNoSig.status !== 401) throw new Error('Test 1 Failed: Expected 401')

  // Test 2: Forged / Invalid signature
  const reqBadSig = new Request('http://localhost:3000/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ _type: 'product', slug: { current: 'test-product' } }),
    headers: {
      'Content-Type': 'application/json',
      'sanity-webhook-signature': 't=1700000000000,v1=bad_signature_hash',
    },
  })
  const resBadSig = await POST(reqBadSig as any)
  console.log(`Test 2 (Bad Signature): status = ${resBadSig.status} (expected: 401)`)
  if (resBadSig.status !== 401) throw new Error('Test 2 Failed: Expected 401')

  // Test 3: Valid HMAC Signature
  const body = JSON.stringify({
    _type: 'product',
    slug: { current: 'premium-test-product' },
    categoryId: 'meat-poultry',
  })
  const timestamp = Date.now()
  const validHeader = await encodeSignatureHeader(body, timestamp, secret)

  const reqValid = new Request('http://localhost:3000/api/revalidate', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      'sanity-webhook-signature': validHeader,
    },
  })
  const resValid = await POST(reqValid as any)
  const json = await resValid.json()
  console.log(`Test 3 (Valid HMAC Signature): status = ${resValid.status} (expected: 200)`)
  console.log('Test 3 Response JSON:', json)
  if (resValid.status !== 200 || !json.success) throw new Error('Test 3 Failed: Expected 200 with success: true')

  console.log('--- ALL D2 WEBHOOK TESTS PASSED! ---')
}

runTests().catch((err) => {
  console.error('Webhook Test Error:', err)
  process.exit(1)
})

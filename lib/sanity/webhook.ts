export const SIGNATURE_HEADER_NAME = 'sanity-webhook-signature'

/**
 * Validates HMAC-SHA256 signatures from Sanity webhooks using standard Web Crypto API.
 * Requires zero external dependencies and runs identically in Node, Edge, and Turbopack.
 */
export async function isValidSignature(
  stringifiedPayload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    if (!signature || !secret || !stringifiedPayload) return false
    const match = signature.trim().match(/^t=(\d+)[, ]+v1=([^, ]+)$/)
    if (!match) return false
    const timestamp = parseInt(match[1], 10)
    if (isNaN(timestamp)) return false

    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signaturePayload = `${timestamp}.${stringifiedPayload}`
    const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(signaturePayload))
    const sigArray = Array.from(new Uint8Array(sigBuffer))
    const expectedHashed = btoa(String.fromCharCode.apply(null, sigArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    return signature.trim() === `t=${timestamp},v1=${expectedHashed}`
  } catch {
    return false
  }
}

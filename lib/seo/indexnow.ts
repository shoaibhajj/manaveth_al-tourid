/**
 * IndexNow submission utility for instant search engine notifications (Bing, Yandex, etc.)
 * Strictly non-blocking: failure to ping IndexNow never impedes publishing or ISR revalidation.
 */
export async function submitIndexNow(urls: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY || 'e7b8c9d0f1a234567890abcdef123456'
  if (!key || urls.length === 0) return false

  try {
    const firstUrl = new URL(urls[0])
    const host = firstUrl.host
    const keyLocation = `${firstUrl.protocol}//${host}/${key}.txt`

    const payload = {
      host,
      key,
      keyLocation,
      urlList: urls,
    }

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })

    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Successfully notified ${urls.length} URLs to IndexNow.`)
      return true
    } else {
      const msg = await res.text().catch(() => '')
      console.warn(`[IndexNow] Notice returned HTTP ${res.status}: ${msg}`)
      return false
    }
  } catch (err) {
    console.warn('[IndexNow] Ping failed (non-blocking):', err)
    return false
  }
}

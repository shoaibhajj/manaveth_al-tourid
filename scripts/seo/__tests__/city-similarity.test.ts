import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { VERIFIED_CITIES } from '../../../lib/content/meat-supply-data'

/**
 * Task P2 Acceptance Rule:
 * Automated test that measures textual similarity between city pages after removing city names.
 * Fails if similarity exceeds 70% threshold, preventing scaled duplicate doorway pages.
 */

function tokenizeAndClean(text: string, cityNames: string[]): Set<string> {
  let cleaned = text.toLowerCase()
  for (const name of cityNames) {
    const re = new RegExp(name.toLowerCase(), 'gi')
    cleaned = cleaned.replace(re, '')
  }
  // Strip punctuation and numbers
  cleaned = cleaned.replace(/[^\u0600-\u06FF\w\s]/g, ' ')
  const words = cleaned
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2)

  return new Set(words)
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0
  let intersectionSize = 0
  for (const item of setA) {
    if (setB.has(item)) intersectionSize++
  }
  const unionSize = new Set([...setA, ...setB]).size
  return intersectionSize / unionSize
}

describe('Task P2: City Landing Pages Non-Duplication Test', () => {
  const MAX_ALLOWED_SIMILARITY = 0.70 // 70% maximum threshold

  test('Arabic city pages (Riyadh vs Jeddah) must have distinct text and <= 70% similarity', () => {
    const riyadh = VERIFIED_CITIES['riyadh'].ar
    const jeddah = VERIFIED_CITIES['jeddah'].ar

    const riyadhFullText = [
      riyadh.coveredDistricts,
      riyadh.deliveryTime,
      riyadh.minOrder,
      riyadh.pickupPoint,
      riyadh.coldChainFacility,
      ...riyadh.faqs.map((f) => `${f.question} ${f.answer}`),
    ].join(' ')

    const jeddahFullText = [
      jeddah.coveredDistricts,
      jeddah.deliveryTime,
      jeddah.minOrder,
      jeddah.pickupPoint,
      jeddah.coldChainFacility,
      ...jeddah.faqs.map((f) => `${f.question} ${f.answer}`),
    ].join(' ')

    const cityNames = ['الرياض', 'جدة', 'مكة المكرمة', 'مكة']
    const tokensRiyadh = tokenizeAndClean(riyadhFullText, cityNames)
    const tokensJeddah = tokenizeAndClean(jeddahFullText, cityNames)

    const similarity = calculateJaccardSimilarity(tokensRiyadh, tokensJeddah)
    console.log(`[P2 City Similarity Test] Riyadh vs Jeddah similarity: ${(similarity * 100).toFixed(1)}% (Threshold: ${MAX_ALLOWED_SIMILARITY * 100}%)`)

    assert.ok(
      similarity < MAX_ALLOWED_SIMILARITY,
      `City pages are too similar (${(similarity * 100).toFixed(1)}% >= ${MAX_ALLOWED_SIMILARITY * 100}%). Each city must have distinct logistics, districts, and FAQs.`
    )
  })

  test('Every verified city must possess at least 3 factual operational fields', () => {
    for (const [cityKey, cityData] of Object.entries(VERIFIED_CITIES)) {
      const ar = cityData.ar
      const factualFieldsCount = [
        ar.coveredDistricts,
        ar.deliveryTime,
        ar.minOrder,
        ar.pickupPoint,
        ar.coldChainFacility,
      ].filter(Boolean).length

      assert.ok(
        factualFieldsCount >= 3,
        `City '${cityKey}' has only ${factualFieldsCount} factual fields. Minimum 3 required for publishing.`
      )
    }
  })
})

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SEED_DATA } from '../seed-sanity-pages'

describe('Sanity Initial Seed Data Structure', () => {
  it('has valid landingPage document for meat-supply', () => {
    assert.equal(SEED_DATA.landingPageMeatSupply._id, 'meat-supply')
    assert.equal(SEED_DATA.landingPageMeatSupply._type, 'landingPage')
    assert.ok(SEED_DATA.landingPageMeatSupply.title.ar)
    assert.ok(SEED_DATA.landingPageMeatSupply.title.en)
    assert.ok(SEED_DATA.landingPageMeatSupply.h1.ar)
    assert.ok(SEED_DATA.landingPageMeatSupply.intro.ar)
  })

  it('has valid certificationsPage document', () => {
    assert.equal(SEED_DATA.certificationsPage._id, 'certificationsPage')
    assert.equal(SEED_DATA.certificationsPage._type, 'certificationsPage')
    assert.ok(SEED_DATA.certificationsPage.title.ar)
    assert.ok(SEED_DATA.certificationsPage.intro.ar)
  })

  it('has 4 official certificates including SFDA and Halal', () => {
    assert.equal(SEED_DATA.certificates.length, 4)
    const sfda = SEED_DATA.certificates.find((c) => c._id === 'cert-sfda')
    const halal = SEED_DATA.certificates.find((c) => c._id === 'cert-halal')
    assert.ok(sfda)
    assert.ok(halal)
  })

  it('has 7 key distribution cities in Saudi Arabia', () => {
    assert.equal(SEED_DATA.cities.length, 7)
    const slugs = SEED_DATA.cities.map((c) => c.slug.current)
    assert.ok(slugs.includes('riyadh'))
    assert.ok(slugs.includes('jeddah'))
    assert.ok(slugs.includes('makkah'))
    assert.ok(slugs.includes('madinah'))
    assert.ok(slugs.includes('dammam'))
    assert.ok(slugs.includes('qassim'))
    assert.ok(slugs.includes('dawadmi'))
  })
})

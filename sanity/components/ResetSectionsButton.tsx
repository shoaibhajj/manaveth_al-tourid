import React, { useState } from 'react'
import { useClient } from 'sanity'
import { defaultSectionsList } from '@/lib/content/default-sections'

export function ResetSectionsButton() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [loading, setLoading] = useState(false)
  const [statusText, setStatusText] = useState('')

  const handleReset = async () => {
    if (
      !window.confirm(
        'هل تريد بالتأكيد إعادة رص واسترجاع كافة أقسام الصفحة الرئيسية الـ 10 إلى ترتيبها وحالتها الأصلية؟'
      )
    ) {
      return
    }

    setLoading(true)
    setStatusText('جاري استرجاع الأقسام...')

    try {
      // Direct authenticated patch using the Sanity Studio session
      await client.patch('homePage').set({ sectionsList: defaultSectionsList }).commit()
      await client
        .patch('drafts.homePage')
        .set({ sectionsList: defaultSectionsList })
        .commit()
        .catch(() => null)

      setStatusText('✅ تمت الاستعادة بنجاح! جاري التحديث...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err: any) {
      setStatusText('❌ حدث خطأ: ' + (err.message || 'فشلت الاستعادة'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'rgba(212, 175, 55, 0.08)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        marginBottom: '16px',
        textAlign: 'right',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '13px',
              color: '#c5a028',
              marginBottom: '4px',
            }}
          >
            🔄 استعادة ترتيب أقسام الصفحة الرئيسية (Reset to Default)
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.5,
            }}
          >
            إذا حذفت قسماً بالخطأ أو أردت العودة الفورية لكافة الأقسام الـ 10 بترتيبها الأصلي، اضغط على هذا الزر:
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            style={{
              cursor: loading ? 'not-allowed' : 'pointer',
              background: '#d4af37',
              color: '#071e18',
              fontWeight: 'bold',
              fontSize: '12px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: '0.2s',
            }}
          >
            {loading ? '⏳ جاري الاسترجاع...' : '🔄 استعادة الترتيب الافتراضي للأقسام'}
          </button>
        </div>
      </div>

      {statusText && (
        <div
          style={{
            marginTop: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: statusText.includes('✅') ? '#4ade80' : '#f87171',
          }}
        >
          {statusText}
        </div>
      )}
    </div>
  )
}

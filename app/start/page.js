'use client'

const BUILDING_A_PHOTO = 'https://iknfxnmrhxntfzxukaiz.supabase.co/storage/v1/object/public/room-photos/building%20A.jpg'
const BUILDING_B_PHOTO = 'https://iknfxnmrhxntfzxukaiz.supabase.co/storage/v1/object/public/room-photos/building%20B.jpg'
const POKHARA_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Phewa_lake_Pokhara.jpg/1280px-Phewa_lake_Pokhara.jpg'

export default function Start() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

      {/* Header with Pokhara Machhapuchhre background */}
      <div style={{
        position: 'relative',
        height: '220px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={POKHARA_PHOTO}
          alt="Pokhara Machhapuchhre"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26,26,46,0.65)' }}></div>
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 1, padding: '1rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '13px', letterSpacing: '2px', marginBottom: '4px' }}>नमस्ते 🙏</div>
          <div style={{ color: '#c9a84c', fontSize: '20px', fontWeight: '700', letterSpacing: '3px', marginBottom: '4px' }}>अतिथि देवो भव:</div>
          <div style={{ color: '#e8d5a3', fontSize: '12px', fontStyle: 'italic', marginBottom: '4px' }}>The Guest is God — Treat every soul as divine</div>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>HNRM Family — Tenant Portal</div>
          <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>Please select your building / आफ्नो भवन छान्नुस्</div>
        </div>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>

        {/* Building A */}
        <div
          onClick={() => window.location.href = '/register?building=1'}
          style={{ background: 'white', border: '2px solid #1a1a2e', borderRadius: '16px', marginBottom: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}
        >
          <div style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#1a1a2e' }}>
            <img
              src={BUILDING_A_PHOTO}
              alt="Building A"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#1a1a2e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
              Building A
            </div>
          </div>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>Building A</div>
              <div style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>घरधनी: Yubaraj Timilsina</div>
              <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>व्यवस्थापक: Anita Pokharel Timilsina</div>
            </div>
            <div style={{ background: '#1a1a2e', color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700' }}>→</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', padding: '0 1rem 1rem' }}>
            <a href="/rooms?building=1" onClick={e => e.stopPropagation()} style={{ flex: 1, background: '#f4f6fb', border: '1px solid #ddd', borderRadius: '8px', padding: '8px', textAlign: 'center', textDecoration: 'none', color: '#1a1a2e', fontSize: '12px', fontWeight: '600' }}>
              View Rooms
            </a>
            <div style={{ flex: 2, background: '#1a1a2e', borderRadius: '8px', padding: '8px', textAlign: 'center', color: 'white', fontSize: '12px', fontWeight: '600' }}>
              Tap to Register / दर्ता गर्न थिच्नुस्
            </div>
          </div>
        </div>

        {/* Building B */}
        <div
          onClick={() => window.location.href = '/register?building=2'}
          style={{ background: 'white', border: '2px solid #c9a84c', borderRadius: '16px', marginBottom: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}
        >
          <div style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#4a2c0a' }}>
            <img
              src={BUILDING_B_PHOTO}
              alt="Building B"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#c9a84c', color: '#1a1a2e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
              Building B
            </div>
          </div>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>Building B (Krishna Timsena)</div>
              <div style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>घरधनी: Krishna Timsena</div>
              <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>व्यवस्थापक: Tej Narayan Timilsina</div>
            </div>
            <div style={{ background: '#c9a84c', color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700' }}>→</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', padding: '0 1rem 1rem' }}>
            <a href="/rooms?building=2" onClick={e => e.stopPropagation()} style={{ flex: 1, background: '#f4f6fb', border: '1px solid #ddd', borderRadius: '8px', padding: '8px', textAlign: 'center', textDecoration: 'none', color: '#1a1a2e', fontSize: '12px', fontWeight: '600' }}>
              View Rooms
            </a>
            <div style={{ flex: 2, background: '#c9a84c', borderRadius: '8px', padding: '8px', textAlign: 'center', color: 'white', fontSize: '12px', fontWeight: '600' }}>
              Tap to Register / दर्ता गर्न थिच्नुस्
            </div>
          </div>
        </div>

        {/* Notice Board */}
        <a href="/noticeboard" style={{ display: 'block', background: '#1a1a2e', color: 'white', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginBottom: '1.5rem' }}>
          📋 House Rules and Charges / घरका नियमहरू
        </a>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', paddingBottom: '2rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '16px', marginBottom: '4px' }}>ॐ अतिथि देवो भव:</div>
          <div>HNRM Family — Human Nature Reality Movement</div>
          <a href="https://www.yubarajtimilsina.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c' }}>
            www.yubarajtimilsina.com.np
          </a>
        </div>

      </div>
    </main>
  )
}
'use client'

export default function Start() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>🏠</div>
          <h1 style={{ color: '#1a1a2e', fontSize: '22px', margin: '0 0 0.5rem' }}>
            HNRM Family — Tenant Portal
          </h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
            Please select which building you live in
          </p>
          <p style={{ color: '#888', fontSize: '13px', margin: '4px 0 0' }}>
            कृपया तपाईं कुन भवनमा बस्नुहुन्छ छान्नुस्
          </p>
        </div>

        {/* Building A */}
        <div
          onClick={() => window.location.href = '/register?building=1'}
          style={{
            background: 'white',
            border: '2px solid #1a1a2e',
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#f0f4ff'}
          onMouseOut={e => e.currentTarget.style.background = 'white'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#1a1a2e', color: 'white', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
              🏢
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>Building A</div>
              <div style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>
                घरधनी: Yubaraj Timilsina
              </div>
              <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                व्यवस्थापक: Anita Pokharel Timilsina
              </div>
            </div>
            <div style={{ marginLeft: 'auto', color: '#1a1a2e', fontSize: '20px' }}>→</div>
          </div>
        </div>

        {/* Building B */}
        <div
          onClick={() => window.location.href = '/register?building=2'}
          style={{
            background: 'white',
            border: '2px solid #c9a84c',
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '2rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#fffbf0'}
          onMouseOut={e => e.currentTarget.style.background = 'white'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#c9a84c', color: 'white', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
              🏢
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>Building B</div>
              <div style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>
                घरधनी: Krishna Timsena
              </div>
              <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                व्यवस्थापक: Tej Narayan Timilsina
              </div>
            </div>
            <div style={{ marginLeft: 'auto', color: '#c9a84c', fontSize: '20px' }}>→</div>
          </div>
        </div>

        {/* View Rooms */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          
            href="/rooms?building=1"
            style={{ flex: 1, background: '#f4f6fb', border: '1px solid #ddd', borderRadius: '10px', padding: '10px', textAlign: 'center', textDecoration: 'none', color: '#1a1a2e', fontSize: '13px', fontWeight: '600' }}
          >
            🛏️ View Building A Rooms
          </a>
          
            href="/rooms?building=2"
            style={{ flex: 1, background: '#fffbf0', border: '1px solid #c9a84c', borderRadius: '10px', padding: '10px', textAlign: 'center', textDecoration: 'none', color: '#1a1a2e', fontSize: '13px', fontWeight: '600' }}
          >
            🛏️ View Building B Rooms
          </a>
        </div>

        {/* Notice Board */}
        
          href="/noticeboard"
          style={{ display: 'block', background: '#1a1a2e', color: 'white', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginBottom: '2rem' }}
        >
          📋 Read House Rules and Charges / घरका नियमहरू
        </a>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa' }}>
          <div style={{ color: '#c9a84c', fontSize: '18px', marginBottom: '4px' }}>ॐ अतिथि देवो भव:</div>
          <div>HNRM Family — Human Nature Reality Movement</div>
          <a href="https://www.yubarajtimilsina.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c' }}>
            www.yubarajtimilsina.com.np
          </a>
        </div>

      </div>
    </main>
  )
}
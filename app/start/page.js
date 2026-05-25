'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Start() {
  const [buildings, setBuildings] = useState([])
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: b } = await supabase.from('buildings').select('*')
    const { data: r } = await supabase.from('rooms').select('*')
    setBuildings(b || [])
    setRooms(r || [])
  }

  function getVacantCount(buildingId) {
    return rooms.filter(r => r.building_id === buildingId && !r.is_occupied).length
  }

  function getBuildingPhoto(building) {
    return building.photo_url || null
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2c1810)', padding: '2rem', textAlign: 'center', borderBottom: '3px solid #c9a84c' }}>
        <div style={{ fontSize: '14px', color: '#c9a84c', letterSpacing: '2px', marginBottom: '4px' }}>नमस्ते 🙏</div>
        <h1 style={{ color: 'white', margin: '0 0 4px', fontSize: '20px' }}>HNRM Family — Tenant Portal</h1>
        <p style={{ color: '#aaa', margin: 0, fontSize: '13px' }}>Please select which building you live in</p>
        <p style={{ color: '#b8a070', margin: '4px 0 0', fontSize: '12px' }}>कृपया तपाईं कुन भवनमा बस्नुहुन्छ छान्नुस्</p>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '1.5rem' }}>
          Tap your building to register / आफ्नो भवन छोएर दर्ता गर्नुस्
        </p>

        {buildings.sort((a, b) => a.id - b.id).map(building => {
          const photo = getBuildingPhoto(building)
          const vacant = getVacantCount(building.id)
          const isA = building.id === 1

          return (
            <div
              key={building.id}
              onClick={() => window.location.href = '/register?building=' + building.id}
              style={{
                background: 'white',
                border: '2px solid',
                borderColor: isA ? '#1a1a2e' : '#c9a84c',
                borderRadius: '16px',
                marginBottom: '1.2rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Building Photo */}
              <div style={{
                height: '160px',
                background: photo ? 'transparent' : isA ? 'linear-gradient(135deg, #1a1a2e, #2c3e50)' : 'linear-gradient(135deg, #4a2c0a, #c9a84c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {photo ? (
                  <img src={photo} alt={building.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '56px' }}>🏢</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>
                      Add photo via Room Photos page
                    </div>
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: isA ? '#1a1a2e' : '#c9a84c',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                }}>
                  {isA ? 'Building A' : 'Building B'}
                </div>
                {vacant > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#22bb66',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}>
                    {vacant} Vacant
                  </div>
                )}
              </div>

              {/* Building Info */}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>
                      {building.name}
                    </div>
                    <div style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>
                      घरधनी: {building.owner}
                    </div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                      {isA ? 'व्यवस्थापक: Anita Pokharel Timilsina' : 'व्यवस्थापक: Tej Narayan Timilsina'}
                    </div>
                  </div>
                  <div style={{
                    background: isA ? '#1a1a2e' : '#c9a84c',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}>
                    →
                  </div>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                  
                    href={'/rooms?building=' + building.id}
                    onClick={e => e.stopPropagation()}
                    style={{ flex: 1, background: '#f4f6fb', border: '1px solid #ddd', borderRadius: '8px', padding: '8px', textAlign: 'center', textDecoration: 'none', color: '#1a1a2e', fontSize: '12px', fontWeight: '600' }}
                  >
                    View Rooms
                  </a>
                  <div
                    style={{ flex: 2, background: isA ? '#1a1a2e' : '#c9a84c', borderRadius: '8px', padding: '8px', textAlign: 'center', color: 'white', fontSize: '12px', fontWeight: '600' }}
                  >
                    Tap card to Register / दर्ता गर्न कार्ड थिच्नुस्
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <a href="/noticeboard" style={{ display: 'block', background: '#1a1a2e', color: 'white', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginBottom: '1rem' }}>
          📋 Read House Rules / घरका नियमहरू पढ्नुस्
        </a>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', paddingBottom: '2rem' }}>
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
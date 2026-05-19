'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [buildings, setBuildings] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    const { data: r } = await supabase.from('rooms').select('*').order('room_number')
    const { data: b } = await supabase.from('buildings').select('*')
    setRooms(r || [])
    setBuildings(b || [])
  }

  function getBuildingName(building_id) {
    const b = buildings.find(b => b.id === building_id)
    return b ? b.name : ''
  }

  function getRoomIcon(type) {
    if (type === 'shop') return 'Shop'
    if (type === 'flat') return 'Flat'
    return 'Room'
  }

  const filtered = rooms.filter(r => {
    if (filter === 'all') return true
    if (filter === 'vacant') return !r.is_occupied
    if (filter === 'room') return r.room_type === 'room'
    if (filter === 'shop') return r.room_type === 'shop'
    if (filter === 'flat') return r.room_type === 'flat'
    return true
  })

  const vacantCount = rooms.filter(r => !r.is_occupied).length

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

      <div style={{ background: '#1a1a2e', padding: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '22px' }}>Available Rooms - HNRM Family</h1>
        <p style={{ color: '#aaa', margin: '4px 0 0', fontSize: '13px' }}>Browse our rooms and find your perfect home</p>
        <p style={{ color: '#c9a84c', margin: '4px 0 0', fontSize: '13px' }}>{vacantCount} vacant unit(s) available now</p>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
          {['all', 'vacant', 'room', 'shop', 'flat'].map(key => (
            <button key={key} onClick={() => setFilter(key)} style={{ padding: '8px 16px', borderRadius: '20px', border: '2px solid', borderColor: filter === key ? '#1a1a2e' : '#ddd', background: filter === key ? '#1a1a2e' : 'white', color: filter === key ? 'white' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: filter === key ? '700' : '400' }}>
              {key === 'all' ? 'All Units' : key === 'vacant' ? 'Vacant Only' : key === 'room' ? 'Rooms' : key === 'shop' ? 'Shops' : 'Flats'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {filtered.map(room => (
            <div key={room.id} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid', borderColor: room.is_occupied ? '#eee' : '#c9a84c', opacity: room.is_occupied ? 0.75 : 1 }}>

              <div style={{ height: '180px', background: 'linear-gradient(135deg, #1a1a2e, #2c1810)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {room.photo_url ? (
                  <img src={room.photo_url} alt={'Room ' + room.room_number} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#c9a84c' }}>
                    <div style={{ fontSize: '48px' }}>{room.room_type === 'shop' ? '🏪' : room.room_type === 'flat' ? '🏠' : '🛏️'}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>No photo yet</div>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: room.is_occupied ? '#e03030' : '#22bb66', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                  {room.is_occupied ? 'Occupied' : 'Vacant'}
                </div>
              </div>

              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#1a1a2e' }}>{getRoomIcon(room.room_type)} {room.room_number}</h3>
                  <span style={{ background: '#f4f6fb', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', color: '#555' }}>{room.floor} Floor</span>
                </div>

                <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>{getBuildingName(room.building_id)}</div>

                {room.description && (
                  <p style={{ color: '#555', fontSize: '13px', marginBottom: '8px', lineHeight: '1.5' }}>{room.description}</p>
                )}

                {!room.is_occupied && (
                  <a href="/noticeboard" style={{ display: 'block', marginTop: '10px', background: '#1a1a2e', color: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    📋 Read Rules then Register
                  </a>
                )}

                {room.is_occupied && (
                  <div style={{ marginTop: '10px', background: '#f9f9f9', borderRadius: '8px', padding: '8px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                    Not available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            <p>No rooms found for this filter.</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '12px', color: '#aaa', paddingBottom: '2rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '16px', marginBottom: '4px' }}>HNRM Family</div>
          <div>Human Nature Reality Movement</div>
          <a href="https://www.yubarajtimilsina.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c' }}>www.yubarajtimilsina.com.np</a>
        </div>

      </div>
    </main>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function GovReport() {
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState([])
  const [buildings, setBuildings] = useState([])
  const [filterBuilding, setFilterBuilding] = useState('all')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: t } = await supabase.from('tenants').select('*').eq('is_active', true).order('full_name')
    const { data: r } = await supabase.from('rooms').select('*')
    const { data: b } = await supabase.from('buildings').select('*')
    setTenants(t || [])
    setRooms(r || [])
    setBuildings(b || [])
  }

  function getRoom(room_id) {
    return rooms.find(r => r.id === Number(room_id))
  }

  function getBuilding(room_id) {
    const room = getRoom(room_id)
    if (!room) return null
    return buildings.find(b => b.id === room.building_id)
  }

  const filtered = tenants.filter(t => {
    if (filterBuilding === 'all') return true
    const building = getBuilding(t.room_id)
    return building?.id === Number(filterBuilding)
  })

  const today = new Date().toLocaleDateString('en-GB')

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-family: sans-serif; font-size: 12px; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      `}</style>

      <div className="no-print" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <a href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</a>
        <h1 style={{ marginTop: '1rem' }}>📋 Government / Ward Office Report</h1>
        <p style={{ color: 'gray' }}>Print tenant details for ward office, police, or any government use</p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ fontWeight: '600' }}>Filter by Building:</label>
          <select
            value={filterBuilding}
            onChange={e => setFilterBuilding(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          >
            <option value="all">All Buildings</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name} — {b.owner}</option>
            ))}
          </select>
          <button
            onClick={() => window.print()}
            style={{ background: '#1a1a2e', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
          >
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '3px double #1a1a2e', paddingBottom: '1rem' }}>
          <div style={{ fontSize: '24px', color: '#c9a84c' }}>ॐ</div>
          <h2 style={{ margin: '4px 0', fontSize: '18px' }}>HNRM Family — Tenant Details Report</h2>
          <p style={{ color: '#555', margin: '2px 0', fontSize: '13px' }}>Human Nature Reality Movement — www.yubarajtimilsina.com.np</p>
          <p style={{ color: '#555', margin: '2px 0', fontSize: '13px' }}>
            {filterBuilding === 'all' ? 'All Buildings' : buildings.find(b => b.id === Number(filterBuilding))?.name}
            {' — '}Date: {today}
            {' — '}Total Tenants: {filtered.length}
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: 'white' }}>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>S.N.</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Full Name</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Father</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Grandfather</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Citizenship No.</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Phone</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Profession</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Permanent Address</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Temporary Address</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Room</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>People</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', border: '1px solid #333' }}>Since</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tenant, index) => {
              const room = getRoom(tenant.room_id)
              const building = getBuilding(tenant.room_id)
              return (
                <tr key={tenant.id} style={{ background: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{index + 1}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd', fontWeight: '600' }}>{tenant.full_name}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{tenant.father_name || '—'}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{tenant.grandfather_name || '—'}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{tenant.citizenship_id || '—'}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{tenant.phone || '—'}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{tenant.profession || '—'}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{tenant.permanent_address || '—'}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{tenant.temporary_address || '—'}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{building?.name} — {room?.room_number || tenant.room_id}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd', textAlign: 'center' }}>{tenant.number_of_people || 1}</td>
                  <td style={{ padding: '7px 6px', border: '1px solid #ddd' }}>{tenant.lease_start || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #333', width: '180px', marginBottom: '4px' }}></div>
            <div style={{ fontSize: '12px', color: '#555' }}>Prepared by — Yubaraj Timilsina</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #333', width: '180px', marginBottom: '4px' }}></div>
            <div style={{ fontSize: '12px', color: '#555' }}>Office Stamp</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #333', width: '180px', marginBottom: '4px' }}></div>
            <div style={{ fontSize: '12px', color: '#555' }}>Verified by</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '11px', color: '#aaa' }}>
          ॐ अतिथि देवो भव 🙏 — HNRM Family — Human Nature Reality Movement
        </div>

      </div>
    </>
  )
}
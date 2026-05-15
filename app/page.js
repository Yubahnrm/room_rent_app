'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [buildings, setBuildings] = useState([])
  const [rooms, setRooms] = useState([])
  const [tenants, setTenants] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    fetchData()
  }, [])
  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  async function fetchData() {
    const { data: b } = await supabase.from('buildings').select('*')
    const { data: r } = await supabase.from('rooms').select('*')
    const { data: t } = await supabase.from('tenants').select('*').eq('is_active', true)
    const { data: p } = await supabase.from('payments').select('*')
    setBuildings(b || [])
    setRooms(r || [])
    setTenants(t || [])
    setPayments(p || [])
  }

  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter(r => r.is_occupied).length
  const vacantRooms = totalRooms - occupiedRooms
  const unpaidBills = payments.filter(p => !p.is_paid).length
  const totalDue = payments.filter(p => !p.is_paid).reduce((sum, p) => sum + (p.balance || 0), 0)

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem', background: '#0070f3', borderRadius: '10px' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>🏠 Dashboard</Link>
        <Link href="/tenants" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>➕ Add Tenant</Link>
        <Link href="/tenants/list" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>👥 Tenant List</Link>
        <Link href="/billing" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>🧾 Billing</Link>
        <Link href="/payments" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>💰 Payments</Link>
        <button onClick={handleLogout} style={{ color: 'white', padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,0,0,0.3)', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>🚪 Logout</button>
      </div>

      <h1>🏠 Rental Management App</h1>
      <p style={{ color: 'gray' }}>Welcome, Yubaraj dai</p>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-block', padding: '1rem 1.5rem', borderRadius: '10px', margin: '0.5rem', textAlign: 'center', minWidth: '120px', background: '#e5ffe5' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalRooms}</div>
          <div style={{ color: 'gray', fontSize: '13px' }}>Total Rooms</div>
        </div>
        <div style={{ display: 'inline-block', padding: '1rem 1.5rem', borderRadius: '10px', margin: '0.5rem', textAlign: 'center', minWidth: '120px', background: '#ffe5e5' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{occupiedRooms}</div>
          <div style={{ color: 'gray', fontSize: '13px' }}>Occupied</div>
        </div>
        <div style={{ display: 'inline-block', padding: '1rem 1.5rem', borderRadius: '10px', margin: '0.5rem', textAlign: 'center', minWidth: '120px', background: '#e5f0ff' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{vacantRooms}</div>
          <div style={{ color: 'gray', fontSize: '13px' }}>Vacant</div>
        </div>
        <div style={{ display: 'inline-block', padding: '1rem 1.5rem', borderRadius: '10px', margin: '0.5rem', textAlign: 'center', minWidth: '120px', background: '#fff8e1' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{tenants.length}</div>
          <div style={{ color: 'gray', fontSize: '13px' }}>Active Tenants</div>
        </div>
        <div style={{ display: 'inline-block', padding: '1rem 1.5rem', borderRadius: '10px', margin: '0.5rem', textAlign: 'center', minWidth: '120px', background: '#ffe5e5' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>Rs.{totalDue}</div>
          <div style={{ color: 'gray', fontSize: '13px' }}>Total Due</div>
        </div>
      </div>
      {buildings.map(building => (
        <div key={building.id} style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ marginTop: 0 }}>🏢 {building.name}</h2>
          <p style={{ color: 'gray' }}>Owner: {building.owner} — Total rooms: {building.total_rooms}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {rooms
              .filter(room => room.building_id === building.id)
              .map(room => (
                <div key={room.id} style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: room.is_occupied ? '#ffe5e5' : '#e5ffe5',
                  fontSize: '14px',
                  border: '1px solid',
                  borderColor: room.is_occupied ? '#ffaaaa' : '#aaffaa',
                }}>
                  Room {room.room_number} {room.is_occupied ? '🔴' : '🟢'}
                </div>
              ))}
          </div>
        </div>
      ))}

      {unpaidBills > 0 && (
        <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ marginTop: 0 }}>⚠️ Unpaid Bills</h2>
          <p>{unpaidBills} tenant(s) have unpaid bills. Total due: <strong>Rs. {totalDue}</strong></p>
          <Link href="/payments" style={{ color: '#0070f3' }}>View all payments →</Link>
        </div>
      )}

    </main>
  )
}
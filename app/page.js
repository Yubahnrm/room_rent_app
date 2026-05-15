'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { useLang } from './providers'

export default function Home() {
  const { t, toggleLanguage } = useLang()
  const [buildings, setBuildings] = useState([])
  const [rooms, setRooms] = useState([])
  const [tenants, setTenants] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: b } = await supabase.from('buildings').select('*')
    const { data: r } = await supabase.from('rooms').select('*')
    const { data: tn } = await supabase.from('tenants').select('*').eq('is_active', true)
    const { data: p } = await supabase.from('payments').select('*')
    setBuildings(b || [])
    setRooms(r || [])
    setTenants(tn || [])
    setPayments(p || [])

    if (tn && tn.length > 0 && r && r.length > 0) {
      const occupiedRoomIds = tn.map(tenant => Number(tenant.room_id))
      for (const room of r) {
        const shouldBeOccupied = occupiedRoomIds.includes(room.id)
        if (room.is_occupied !== shouldBeOccupied) {
          await supabase.from('rooms').update({ is_occupied: shouldBeOccupied }).eq('id', room.id)
        }
      }
      const { data: updatedRooms } = await supabase.from('rooms').select('*')
      setRooms(updatedRooms || [])
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter(r => r.is_occupied).length
  const vacantRooms = totalRooms - occupiedRooms
  const totalDue = payments.filter(p => !p.is_paid).reduce((sum, p) => sum + (p.balance || 0), 0)
  const totalCollected = payments.filter(p => p.is_paid).reduce((sum, p) => sum + (p.paid_amount || 0), 0)
  const unpaidBills = payments.filter(p => !p.is_paid).length

  const navBtn = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.15)',
    fontWeight: '600',
    fontSize: '14px',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

      {/* Navigation */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '1rem 2rem', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginRight: '0.5rem' }}>🏠 RentApp</span>
        <Link href="/" style={navBtn}>{t.dashboard}</Link>
        <Link href="/tenants" style={navBtn}>{t.addTenant}</Link>
        <Link href="/tenants/list" style={navBtn}>{t.tenants}</Link>
        <Link href="/billing" style={navBtn}>{t.billing}</Link>
        <Link href="/payments" style={navBtn}>{t.payments}</Link>
        <button onClick={toggleLanguage} style={{ ...navBtn, background: 'rgba(201,168,76,0.3)', border: '1px solid rgba(201,168,76,0.5)' }}>{t.language}</button>
        <button onClick={handleLogout} style={{ ...navBtn, background: 'rgba(255,60,60,0.3)', border: '1px solid rgba(255,60,60,0.4)', marginLeft: 'auto' }}>{t.logout}</button>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '26px', color: '#1a1a2e' }}>{t.goodDay}</h1>
          <p style={{ color: '#888', margin: '4px 0 0' }}>{t.overview}</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #1a1a2e' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e' }}>{totalRooms}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{t.totalRooms}</div>
          </div>
          <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{occupiedRooms}</div>
            <div style={{ color: '#aaa', fontSize: '13px', marginTop: '4px' }}>{t.occupied}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #eee' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#444' }}>{vacantRooms}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{t.vacant}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #f0a500' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f0a500' }}>{tenants.length}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{t.activeTenants}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #22bb66' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#22bb66' }}>Rs.{totalCollected}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{t.collected}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #e03030' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#e03030' }}>Rs.{totalDue}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{t.totalDue}</div>
          </div>
        </div>

        {/* Unpaid Warning */}
        {unpaidBills > 0 && (
          <div style={{ background: '#fff8e1', border: '1px solid #ffd54f', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>⚠️ {unpaidBills} {t.unpaidBills}</strong>
              <span style={{ color: '#888', marginLeft: '8px', fontSize: '14px' }}>{t.totalDue}: Rs. {totalDue}</span>
            </div>
            <Link href="/payments" style={{ color: '#0070f3', fontSize: '14px', fontWeight: 'bold' }}>{t.view}</Link>
          </div>
        )}

        {/* Buildings */}
        {buildings.map(building => (
          <div key={building.id} style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#1a1a2e' }}>🏢 {building.name}</h2>
                <p style={{ margin: '2px 0 0', color: '#888', fontSize: '13px' }}>{t.owner}: {building.owner} — {building.total_rooms} {t.rooms}</p>
              </div>
              <div style={{ background: '#f4f6fb', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: '#555' }}>
                {rooms.filter(r => r.building_id === building.id && r.is_occupied).length} / {rooms.filter(r => r.building_id === building.id).length} {t.occupiedOf}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {rooms
                .filter(room => room.building_id === building.id)
                .map(room => (
                  <div key={room.id} style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: room.is_occupied ? '#1a1a2e' : '#f8f8f8',
                    border: '1px solid',
                    borderColor: room.is_occupied ? '#1a1a2e' : '#ddd',
                    minWidth: '75px',
                    textAlign: 'center',
                    boxShadow: room.is_occupied ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: room.is_occupied ? 'white' : '#333' }}>
                      {room.room_number}
                    </div>
                    <div style={{ fontSize: '11px', color: room.is_occupied ? '#aaa' : '#999', marginTop: '2px' }}>
                      {room.is_occupied ? t.occupied : t.vacant}
                    </div>
                    <div style={{ fontSize: '11px', color: room.is_occupied ? '#888' : '#bbb', marginTop: '2px' }}>
                      Rs.{room.rent_amount}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

      </div>
    </main>
  )
}
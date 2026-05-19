'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { useLang } from './providers'

export default function Home() {
  const { t, toggleLanguage, lang } = useLang()
  const [buildings, setBuildings] = useState([])
  const [rooms, setRooms] = useState([])
  const [tenants, setTenants] = useState([])
  const [payments, setPayments] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)

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

  function getBuildingStats(buildingId) {
    const buildingRooms = rooms.filter(r => r.building_id === buildingId)
    const buildingTenants = tenants.filter(t => {
      const room = rooms.find(r => r.id === Number(t.room_id))
      return room?.building_id === buildingId
    })
    const buildingTenantIds = buildingTenants.map(t => t.id)
    const buildingPayments = payments.filter(p => buildingTenantIds.includes(p.tenant_id))
    const totalRooms = buildingRooms.length
    const occupiedRooms = buildingRooms.filter(r => r.is_occupied).length
    const vacantRooms = totalRooms - occupiedRooms
    const totalDue = buildingPayments.filter(p => !p.is_paid).reduce((sum, p) => sum + (p.balance || 0), 0)
    const totalCollected = buildingPayments.filter(p => p.is_paid).reduce((sum, p) => sum + (p.paid_amount || 0), 0)
    const unpaidBills = buildingPayments.filter(p => !p.is_paid).length
    return { buildingRooms, buildingTenants, totalRooms, occupiedRooms, vacantRooms, totalDue, totalCollected, unpaidBills }
  }

  const totalDueAll = payments.filter(p => !p.is_paid).reduce((sum, p) => sum + (p.balance || 0), 0)
  const totalCollectedAll = payments.filter(p => p.is_paid).reduce((sum, p) => sum + (p.paid_amount || 0), 0)

const navBtn = {
    color: 'white',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.15)',
    fontWeight: '600',
    fontSize: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

<div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '0.6rem 1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <Link href="/" style={navBtn}>📊 {lang === 'np' ? 'ड्यासबोर्ड' : 'Dashboard'}</Link>
          <Link href="/tenants" style={navBtn}>➕ {lang === 'np' ? 'थप्नुस्' : 'Add Tenant'}</Link>
          <Link href="/tenants/list" style={navBtn}>👥 {lang === 'np' ? 'सूची' : 'Tenants'}</Link>
          <Link href="/billing" style={navBtn}>🧾 {lang === 'np' ? 'बिल' : 'Billing'}</Link>
          <Link href="/payments" style={navBtn}>💰 {lang === 'np' ? 'भुक्तानी' : 'Payments'}</Link>
          <Link href="/summary" style={navBtn}>👁️ {lang === 'np' ? 'सारांश' : 'Summary'}</Link>
          <Link href="/printbill" style={navBtn}>🖨️ {lang === 'np' ? 'प्रिन्ट' : 'Print'}</Link>
          <Link href="/govreport" style={navBtn}>📋 {lang === 'np' ? 'रिपोर्ट' : 'Gov'}</Link>
          <Link href="/moveout" style={navBtn}>🚪 {lang === 'np' ? 'सर्नु' : 'Move Out'}</Link>
          <Link href="/history" style={navBtn}>📚 {lang === 'np' ? 'इतिहास' : 'History'}</Link>
          <button onClick={toggleLanguage} style={{ ...navBtn, background: 'rgba(201,168,76,0.4)', border: '1px solid rgba(201,168,76,0.6)' }}>{t.language}</button>
          <Link href="/noticeboard" style={navBtn}>📋 {lang === 'np' ? 'सूचना' : 'Notices'}</Link>
        <Link href="/managenotices" style={navBtn}>⚙️ {lang === 'np' ? 'सूचना व्यवस्था' : 'Manage Notices'}</Link>
        <Link href="/noticeboard" style={navBtn}>📋 {lang === 'np' ? 'सूचना' : 'Notices'}</Link>
        <Link href="/managenotices" style={navBtn}>⚙️ {lang === 'np' ? 'सूचना व्यवस्था' : 'Manage Notices'}</Link>
        <Link href="/noticeboard" style={navBtn}>📋 {lang === 'np' ? 'सूचना' : 'Notices'}</Link>
        <Link href="/managenotices" style={navBtn}>⚙️ {lang === 'np' ? 'सूचना व्यवस्था' : 'Manage Notices'}</Link>
        <Link href="/managerooms" style={navBtn}>📸 {lang === 'np' ? 'फोटो' : 'Room Photos'}</Link>
        <button onClick={handleLogout} style={{ ...navBtn, background: 'rgba(255,60,60,0.3)', border: '1px solid rgba(255,60,60,0.4)' }}>{t.logout}</button>
        </div>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1a1a2e' }}>{lang === 'np' ? 'नमस्ते, युबराज दाई 👋' : 'Good day, Yubaraj dai 👋'}</h1>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: '13px' }}>{lang === 'np' ? 'दुवै भवनको पूरा विवरण' : 'Complete overview of both buildings'}</p>
        </div>

        <div style={{ background: '#1a1a2e', borderRadius: '14px', padding: '1.2rem 1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ color: 'white', fontWeight: '700', fontSize: '16px', marginRight: '1rem' }}>📊 {lang === 'np' ? 'जम्मा सारांश' : 'Overall Summary'}</div>
          <div style={{ textAlign: 'center', minWidth: '80px' }}>
            <div style={{ color: 'white', fontSize: '24px', fontWeight: '700' }}>{rooms.length}</div>
            <div style={{ color: '#aaa', fontSize: '11px' }}>{lang === 'np' ? 'जम्मा कोठा' : 'Total Units'}</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '80px' }}>
            <div style={{ color: '#c9a84c', fontSize: '24px', fontWeight: '700' }}>{tenants.length}</div>
            <div style={{ color: '#aaa', fontSize: '11px' }}>{lang === 'np' ? 'भाडावाला' : 'Tenants'}</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ color: '#22bb66', fontSize: '20px', fontWeight: '700' }}>Rs.{totalCollectedAll}</div>
            <div style={{ color: '#aaa', fontSize: '11px' }}>{lang === 'np' ? 'संकलन' : 'Collected'}</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ color: '#ff6b6b', fontSize: '20px', fontWeight: '700' }}>Rs.{totalDueAll}</div>
            <div style={{ color: '#aaa', fontSize: '11px' }}>{lang === 'np' ? 'बाँकी' : 'Total Due'}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
          {buildings.map(building => {
            const stats = getBuildingStats(building.id)
            return (
              <div key={building.id} style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #eee' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '2px solid #f0f0f0' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#1a1a2e' }}>🏢 {building.name}</h2>
                    <p style={{ margin: '2px 0 0', color: '#888', fontSize: '12px' }}>{lang === 'np' ? 'घरधनी' : 'Owner'}: <strong>{building.owner}</strong></p>
                  </div>
                  <div style={{ background: '#f4f6fb', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#555', textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>{stats.occupiedRooms}/{stats.totalRooms}</div>
                    <div>{lang === 'np' ? 'भरिएको' : 'Occupied'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '10px', padding: '0.8rem 1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderTop: '3px solid #888', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#888' }}>{stats.vacantRooms}</div>
                    <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>{lang === 'np' ? 'खाली' : 'Vacant'}</div>
                  </div>
                  <div style={{ background: 'white', borderRadius: '10px', padding: '0.8rem 1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderTop: '3px solid #f0a500', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#f0a500' }}>{stats.buildingTenants.length}</div>
                    <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>{lang === 'np' ? 'भाडावाला' : 'Tenants'}</div>
                  </div>
                  <div style={{ background: 'white', borderRadius: '10px', padding: '0.8rem 1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderTop: '3px solid #22bb66', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#22bb66' }}>Rs.{stats.totalCollected}</div>
                    <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>{lang === 'np' ? 'संकलन' : 'Collected'}</div>
                  </div>
                  <div style={{ background: 'white', borderRadius: '10px', padding: '0.8rem 1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderTop: '3px solid #e03030', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#e03030' }}>Rs.{stats.totalDue}</div>
                    <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>{lang === 'np' ? 'बाँकी' : 'Due'}</div>
                  </div>
                </div>

                {stats.unpaidBills > 0 && (
                  <div style={{ background: '#fff8e1', border: '1px solid #ffd54f', borderRadius: '8px', padding: '8px 12px', marginBottom: '1rem', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚠️ {stats.unpaidBills} {lang === 'np' ? 'तिर्न बाँकी बिल' : 'unpaid bill(s)'}</span>
                    <Link href="/payments" style={{ color: '#0070f3', fontWeight: '700' }}>{lang === 'np' ? 'हेर्नुस्' : 'View'} →</Link>
                  </div>
                )}

                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px', fontWeight: '600' }}>{lang === 'np' ? 'कोठाहरू — क्लिक गर्नुस् विवरणको लागि' : 'Units — Click any room for details'}:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                  {stats.buildingRooms.map(room => {
                    const roomTenant = tenants.find(t => Number(t.room_id) === room.id)
                    const tenantPayments = roomTenant ? payments.filter(p => p.tenant_id === roomTenant.id) : []
                    const due = tenantPayments.filter(p => !p.is_paid).reduce((sum, p) => sum + (p.balance || 0), 0)
                    const firstName = roomTenant ? roomTenant.full_name.split(' ')[0] : ''
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: room.is_occupied ? '#1a1a2e' : '#f8f8f8',
                          border: '2px solid',
                          borderColor: selectedRoom?.id === room.id ? '#c9a84c' : room.is_occupied ? '#1a1a2e' : '#ddd',
                          minWidth: '70px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          boxShadow: selectedRoom?.id === room.id ? '0 0 0 2px #c9a84c' : 'none',
                        }}
                      >
                        <div style={{ fontWeight: '700', fontSize: '12px', color: room.is_occupied ? 'white' : '#333' }}>
                          {room.room_type === 'shop' ? '🏪' : room.room_type === 'flat' ? '🏠' : '🛏️'} {room.room_number}
                        </div>
                        <div style={{ fontSize: '10px', color: room.is_occupied ? '#aaa' : '#999', marginTop: '1px' }}>
                          {room.is_occupied ? (lang === 'np' ? 'भरिएको' : 'Occupied') : (lang === 'np' ? 'खाली' : 'Vacant')}
                        </div>
                        <div style={{ fontSize: '10px', color: room.is_occupied ? '#888' : '#bbb' }}>Rs.{room.rent_amount}</div>
                        {firstName && <div style={{ fontSize: '9px', color: '#c9a84c', marginTop: '2px', fontWeight: '700' }}>{firstName}</div>}
                        {due > 0 && <div style={{ fontSize: '9px', color: '#ff6b6b', marginTop: '1px' }}>❌ Rs.{due}</div>}
                      </div>
                    )
                  })}
                </div>
                {selectedRoom && stats.buildingRooms.find(r => r.id === selectedRoom.id) && (() => {
                  const tenant = tenants.find(t => Number(t.room_id) === selectedRoom.id)
                  const tenantPayments = tenant ? payments.filter(p => p.tenant_id === tenant.id) : []
                  const due = tenantPayments.filter(p => !p.is_paid).reduce((sum, p) => sum + (p.balance || 0), 0)
                  const paid = tenantPayments.filter(p => p.is_paid).reduce((sum, p) => sum + (p.paid_amount || 0), 0)
                  const lastBill = tenantPayments[0]
                  return (
                    <div style={{ background: '#f4f6fb', borderRadius: '10px', padding: '1rem', border: '2px solid #c9a84c', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <h3 style={{ margin: 0, color: '#1a1a2e', fontSize: '15px' }}>
                          {selectedRoom.room_type === 'shop' ? '🏪' : selectedRoom.room_type === 'flat' ? '🏠' : '🛏️'} {lang === 'np' ? 'कोठा' : 'Room'} {selectedRoom.room_number}
                        </h3>
                        <button onClick={() => setSelectedRoom(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' }}>✕</button>
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                        <span style={{ background: '#1a1a2e', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', marginRight: '6px' }}>Rs.{selectedRoom.rent_amount}/month</span>
                        <span style={{ background: selectedRoom.is_occupied ? '#e03030' : '#22bb66', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                          {selectedRoom.is_occupied ? (lang === 'np' ? 'भरिएको' : 'Occupied') : (lang === 'np' ? 'खाली' : 'Vacant')}
                        </span>
                      </div>

                      {tenant ? (
                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'पूरा नाम' : 'Full Name'}</div>
                              <div style={{ fontWeight: '700', fontSize: '13px' }}>{tenant.full_name}</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'फोन' : 'Phone'}</div>
                              <div style={{ fontWeight: '700', fontSize: '13px' }}>{tenant.phone || '—'}</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'बुबाको नाम' : 'Father'}</div>
                              <div style={{ fontWeight: '700', fontSize: '13px' }}>{tenant.father_name || '—'}</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'पेशा' : 'Profession'}</div>
                              <div style={{ fontWeight: '700', fontSize: '13px' }}>{tenant.profession || '—'}</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'नागरिकता' : 'Citizenship'}</div>
                              <div style={{ fontWeight: '700', fontSize: '13px' }}>{tenant.citizenship_id || '—'}</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'मान्छे' : 'People'}</div>
                              <div style={{ fontWeight: '700', fontSize: '13px' }}>{tenant.number_of_people || 1}</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'अस्थायी ठेगाना' : 'Temp Address'}</div>
                              <div style={{ fontWeight: '700', fontSize: '12px' }}>{tenant.temporary_address || '—'}</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'स्थायी ठेगाना' : 'Perm Address'}</div>
                              <div style={{ fontWeight: '700', fontSize: '12px' }}>{tenant.permanent_address || '—'}</div>
                            </div>
                          </div>

                          {tenant.emergency_contact_name && (
                            <div style={{ background: '#fff0f0', borderRadius: '8px', padding: '8px', marginBottom: '8px', fontSize: '12px' }}>
                              <div style={{ fontWeight: '700', color: '#c00', marginBottom: '2px' }}>🚨 {lang === 'np' ? 'आपतकालीन सम्पर्क' : 'Emergency Contact'}</div>
                              <div>{tenant.emergency_contact_name} ({tenant.emergency_contact_relation}) — {tenant.emergency_contact_phone}</div>
                            </div>
                          )}

                          {tenant.office_name && (
                            <div style={{ background: '#f0f0ff', borderRadius: '8px', padding: '8px', marginBottom: '8px', fontSize: '12px' }}>
                              <div style={{ fontWeight: '700', color: '#0070f3', marginBottom: '2px' }}>🏢 {lang === 'np' ? 'कार्यालय' : 'Office'}</div>
                              <div>{tenant.office_name} — {tenant.office_contact_person} — {tenant.office_contact_phone}</div>
                            </div>
                          )}

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ background: '#e5ffe5', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'तिरेको' : 'Paid'}</div>
                              <div style={{ fontWeight: '700', color: '#22bb66' }}>Rs.{paid}</div>
                            </div>
                            <div style={{ background: due > 0 ? '#ffe5e5' : '#e5ffe5', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'बाँकी' : 'Due'}</div>
                              <div style={{ fontWeight: '700', color: due > 0 ? '#e03030' : '#22bb66' }}>Rs.{due}</div>
                            </div>
                            <div style={{ background: '#fff8e1', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>{lang === 'np' ? 'अग्रिम' : 'Advance'}</div>
                              <div style={{ fontWeight: '700', color: '#f0a500' }}>Rs.{tenant.advance_amount || 0}</div>
                            </div>
                          </div>

                          {lastBill && (
                            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px', fontSize: '12px', color: '#555', marginBottom: '8px' }}>
                              <strong>{lang === 'np' ? 'अन्तिम बिल' : 'Last Bill'}:</strong> {lastBill.month} {lastBill.year} — {lang === 'np' ? 'जम्मा' : 'Total'}: Rs.{lastBill.total_bill} — {lastBill.is_paid ? '✅ Paid' : '❌ Due'}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Link href="/billing" style={{ padding: '6px 12px', borderRadius: '6px', background: '#1a1a2e', color: 'white', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                              🧾 {lang === 'np' ? 'बिल बनाउनुस्' : 'Create Bill'}
                            </Link>
                            <Link href="/tenants/list" style={{ padding: '6px 12px', borderRadius: '6px', background: '#f4f6fb', color: '#1a1a2e', textDecoration: 'none', fontSize: '12px', border: '1px solid #ddd' }}>
                              ✏️ {lang === 'np' ? 'सम्पादन' : 'Edit Tenant'}
                            </Link>
                            <Link href="/printbill" style={{ padding: '6px 12px', borderRadius: '6px', background: '#f4f6fb', color: '#1a1a2e', textDecoration: 'none', fontSize: '12px', border: '1px solid #ddd' }}>
                              🖨️ {lang === 'np' ? 'बिल प्रिन्ट' : 'Print Bill'}
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                          <div style={{ fontSize: '30px', marginBottom: '8px' }}>🏠</div>
                          <p style={{ margin: 0 }}>{lang === 'np' ? 'यो कोठा खाली छ' : 'This room is vacant'}</p>
                          <Link href="/tenants" style={{ display: 'inline-block', marginTop: '8px', padding: '6px 14px', borderRadius: '6px', background: '#1a1a2e', color: 'white', textDecoration: 'none', fontSize: '12px' }}>
                            ➕ {lang === 'np' ? 'भाडावाला थप्नुस्' : 'Add Tenant'}
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {stats.buildingTenants.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                    <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px', fontWeight: '600' }}>{lang === 'np' ? 'सक्रिय भाडावालाहरू' : 'Active Tenants'}:</p>
                    {stats.buildingTenants.map(tenant => {
                      const tenantPayments = payments.filter(p => p.tenant_id === tenant.id)
                      const due = tenantPayments.filter(p => !p.is_paid).reduce((sum, p) => sum + (p.balance || 0), 0)
                      const room = rooms.find(r => r.id === Number(tenant.room_id))
                      return (
                        <div key={tenant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', marginBottom: '6px', borderRadius: '8px', background: due > 0 ? '#fff0f0' : '#f0fff4', border: '1px solid', borderColor: due > 0 ? '#ffcccc' : '#ccffdd' }}>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a2e' }}>{tenant.full_name}</div>
                            <div style={{ fontSize: '11px', color: '#888' }}>
                              {room?.room_type === 'shop' ? '🏪' : room?.room_type === 'flat' ? '🏠' : '🛏️'} {lang === 'np' ? 'कोठा' : 'Room'} {room?.room_number} — {tenant.phone}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: due > 0 ? '#e03030' : '#22bb66' }}>
                            {due > 0 ? `❌ Rs.${due}` : '✅ Clear'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

              </div>
            )
          })}
        </div>

      </div>
    </main>
  )
}
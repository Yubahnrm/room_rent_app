'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function TenantHistory() {
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState([])
  const [payments, setPayments] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: t } = await supabase.from('tenants').select('*').eq('is_active', false).order('created_at', { ascending: false })
    const { data: r } = await supabase.from('rooms').select('*')
    const { data: p } = await supabase.from('payments').select('*')
    setTenants(t || [])
    setRooms(r || [])
    setPayments(p || [])
  }

  function getRoom(room_id) {
    return rooms.find(r => r.id === Number(room_id))
  }

  function getTenantPayments(tenant_id) {
    return payments.filter(p => p.tenant_id === tenant_id && p.month !== 'MOVE-OUT')
  }

  function getMoveOut(tenant_id) {
    return payments.find(p => p.tenant_id === tenant_id && p.month === 'MOVE-OUT')
  }

  function getTotalPaid(tenant_id) {
    return getTenantPayments(tenant_id).reduce((sum, p) => sum + (p.paid_amount || 0), 0)
  }

  const filtered = tenants.filter(t =>
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (t.phone || '').includes(search) ||
    (t.citizenship_id || '').includes(search)
  )

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>📚 Tenant History</h1>
      <p style={{ color: 'gray' }}>All past tenants who have moved out — {tenants.length} records</p>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, phone or citizenship ID..."
        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', marginTop: '1rem', marginBottom: '1.5rem', boxSizing: 'border-box' }}
      />

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888', background: '#f9f9f9', borderRadius: '12px' }}>
          <div style={{ fontSize: '40px', marginBottom: '1rem' }}>📚</div>
          <p>No past tenant records found.</p>
        </div>
      )}

      {filtered.map(tenant => {
        const room = getRoom(tenant.room_id)
        const moveOut = getMoveOut(tenant.id)
        const allBills = getTenantPayments(tenant.id)
        const totalPaid = getTotalPaid(tenant.id)

        return (
          <div key={tenant.id} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1a1a2e' }}>{tenant.full_name}</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: '2px 0' }}>
                  Room {room?.room_number || tenant.room_id} — {tenant.phone || '—'} — {tenant.profession || '—'}
                </p>
              </div>
              <span style={{ background: '#f0f0f0', color: '#555', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                🚪 Moved Out
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '10px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '11px', color: '#aaa' }}>Father</div>
                <div style={{ fontWeight: '600', fontSize: '13px' }}>{tenant.father_name || '—'}</div>
              </div>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '11px', color: '#aaa' }}>Citizenship</div>
                <div style={{ fontWeight: '600', fontSize: '13px' }}>{tenant.citizenship_id || '—'}</div>
              </div>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '11px', color: '#aaa' }}>Permanent Address</div>
                <div style={{ fontWeight: '600', fontSize: '13px' }}>{tenant.permanent_address || '—'}</div>
              </div>
              <div style={{ background: '#e5ffe5', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '11px', color: '#aaa' }}>Total Paid</div>
                <div style={{ fontWeight: '700', color: '#22bb66', fontSize: '14px' }}>Rs. {totalPaid}</div>
              </div>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '11px', color: '#aaa' }}>Total Bills</div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{allBills.length} months</div>
              </div>
            </div>

            {moveOut && (
              <div style={{ background: '#f4f6fb', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#555' }}>
                <strong>Move Out Settlement:</strong> {moveOut.notes}
              </div>
            )}

            {tenant.emergency_contact_name && (
              <div style={{ background: '#fff0f0', borderRadius: '8px', padding: '8px', marginTop: '8px', fontSize: '12px' }}>
                🚨 Emergency: {tenant.emergency_contact_name} ({tenant.emergency_contact_relation}) — {tenant.emergency_contact_phone}
              </div>
            )}

          </div>
        )
      })}
    </main>
  )
}
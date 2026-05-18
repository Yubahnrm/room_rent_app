'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function MoveOut() {
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState([])
  const [payments, setPayments] = useState([])
  const [selected, setSelected] = useState(null)
  const [settlement, setSettlement] = useState({
    advance_returned: 0,
    final_due_collected: 0,
    damage_deducted: 0,
    notes: '',
    move_out_date: new Date().toISOString().split('T')[0],
  })
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: t } = await supabase.from('tenants').select('*').eq('is_active', true)
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
    return payments.filter(p => p.tenant_id === tenant_id)
  }

  function getTotalDue(tenant_id) {
    return getTenantPayments(tenant_id)
      .filter(p => !p.is_paid)
      .reduce((sum, p) => sum + (p.balance || 0), 0)
  }

  function getTotalPaid(tenant_id) {
    return getTenantPayments(tenant_id)
      .filter(p => p.is_paid)
      .reduce((sum, p) => sum + (p.paid_amount || 0), 0)
  }

  function selectTenant(tenant) {
    setSelected(tenant)
    setMessage('')
    setDone(false)
    const due = getTotalDue(tenant.id)
    const advance = tenant.advance_amount || 0
    const advanceAfterDue = Math.max(0, advance - due)
    setSettlement({
      advance_returned: advanceAfterDue,
      final_due_collected: Math.max(0, due - advance),
      damage_deducted: 0,
      notes: '',
      move_out_date: new Date().toISOString().split('T')[0],
    })
  }

  async function handleMoveOut() {
    if (!selected) return
    if (!confirm(`Are you sure you want to move out ${selected.full_name}? This cannot be undone.`)) return

    // Mark tenant inactive
    await supabase.from('tenants').update({
      is_active: false,
      advance_amount: 0,
    }).eq('id', selected.id)

    // Mark room vacant
    await supabase.from('rooms').update({ is_occupied: false }).eq('id', Number(selected.room_id))

    // Save move out record in payments as final settlement
    await supabase.from('payments').insert([{
      tenant_id: selected.id,
      room_id: selected.room_id,
      month: 'MOVE-OUT',
      year: new Date().getFullYear(),
      rent_amount: 0,
      electricity_charge: 0,
      water_charge: 0,
      dustbin_charge: 0,
      internet_charge: 0,
      damage_charge: Number(settlement.damage_deducted),
      total_bill: Number(settlement.damage_deducted),
      advance_used: selected.advance_amount || 0,
      paid_amount: Number(settlement.final_due_collected),
      balance: 0,
      payment_method: 'Settlement',
      is_paid: true,
      notes: `MOVE OUT — ${settlement.move_out_date} — Advance returned: Rs.${settlement.advance_returned} — ${settlement.notes}`,
    }])

    setDone(true)
    setMessage(`${selected.full_name} has been moved out successfully. Room is now vacant.`)
    setSelected(null)
    fetchAll()
  }

  const input = {
    width: '100%',
    padding: '8px',
    marginTop: '4px',
    marginBottom: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '15px',
    boxSizing: 'border-box',
  }

  const label = { fontWeight: 'bold', fontSize: '14px', color: '#444' }

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>🚪 Tenant Move Out</h1>
      <p style={{ color: 'gray' }}>Process a tenant moving out with final settlement</p>

      {message && (
        <div style={{ padding: '12px', borderRadius: '8px', background: '#e5ffe5', color: '#060', marginBottom: '1rem', fontWeight: '600' }}>
          ✅ {message}
        </div>
      )}

      {/* Select Tenant */}
      <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Select Tenant Moving Out</h2>
        {tenants.length === 0 && <p style={{ color: '#888' }}>No active tenants found.</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tenants.map(t => {
            const room = getRoom(t.room_id)
            return (
              <button
                key={t.id}
                onClick={() => selectTenant(t)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '2px solid',
                  borderColor: selected?.id === t.id ? '#e03030' : '#ddd',
                  background: selected?.id === t.id ? '#fff0f0' : 'white',
                  cursor: 'pointer',
                  fontWeight: selected?.id === t.id ? 'bold' : 'normal',
                  fontSize: '13px',
                }}
              >
                {t.full_name} — Room {room?.room_number || t.room_id}
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <>
          {/* Tenant Summary */}
          <div style={{ background: '#fff8e1', border: '1px solid #ffd54f', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ marginTop: 0 }}>📋 Financial Summary for {selected.full_name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ background: 'white', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#aaa' }}>Total Paid</div>
                <div style={{ fontWeight: '700', color: '#22bb66', fontSize: '16px' }}>Rs. {getTotalPaid(selected.id)}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#aaa' }}>Total Due</div>
                <div style={{ fontWeight: '700', color: getTotalDue(selected.id) > 0 ? '#e03030' : '#22bb66', fontSize: '16px' }}>Rs. {getTotalDue(selected.id)}</div>
              </div>
              <div style={{ background: 'white', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#aaa' }}>Advance Held</div>
                <div style={{ fontWeight: '700', color: '#f0a500', fontSize: '16px' }}>Rs. {selected.advance_amount || 0}</div>
              </div>
            </div>

            {/* Auto calculation */}
            <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '10px', color: 'white', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Advance held:</span>
                <strong>Rs. {selected.advance_amount || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Minus total due:</span>
                <strong>- Rs. {getTotalDue(selected.id)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #444', paddingTop: '4px', fontWeight: '700', fontSize: '14px' }}>
                <span>Advance to return:</span>
                <strong style={{ color: '#22bb66' }}>Rs. {Math.max(0, (selected.advance_amount || 0) - getTotalDue(selected.id))}</strong>
              </div>
            </div>
          </div>

          {/* Settlement Form */}
          <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ marginTop: 0 }}>💰 Final Settlement</h2>

            <label style={label}>Move Out Date</label>
            <input style={input} type="date" value={settlement.move_out_date} onChange={e => setSettlement({ ...settlement, move_out_date: e.target.value })} />

            <label style={label}>Advance Amount to Return to Tenant — Rs.</label>
            <input style={input} type="number" value={settlement.advance_returned} onChange={e => setSettlement({ ...settlement, advance_returned: e.target.value })} placeholder="Amount to return to tenant" />

            <label style={label}>Final Due Collected from Tenant — Rs. (if any)</label>
            <input style={input} type="number" value={settlement.final_due_collected} onChange={e => setSettlement({ ...settlement, final_due_collected: e.target.value })} placeholder="0 if nothing to collect" />

            <label style={label}>Damage Deducted from Advance — Rs. (if any)</label>
            <input style={input} type="number" value={settlement.damage_deducted} onChange={e => setSettlement({ ...settlement, damage_deducted: e.target.value })} placeholder="0 if no damage" />

            <label style={label}>Notes (any extra info)</label>
            <input style={input} value={settlement.notes} onChange={e => setSettlement({ ...settlement, notes: e.target.value })} placeholder="e.g. Left in good condition, keys returned" />
          </div>

          <button
            onClick={handleMoveOut}
            style={{ background: '#e03030', color: 'white', padding: '12px 32px', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', width: '100%', fontWeight: '700' }}
          >
            🚪 Confirm Move Out — {selected.full_name}
          </button>
        </>
      )}
    </main>
  )
}
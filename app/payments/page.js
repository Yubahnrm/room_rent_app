'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [tenants, setTenants] = useState([])
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: p } = await supabase.from('payments').select('*').order('created_at', { ascending: false })
    const { data: t } = await supabase.from('tenants').select('*')
    setPayments(p || [])
    setTenants(t || [])
  }

  function getTenantName(tenant_id) {
    const t = tenants.find(t => t.id === tenant_id)
    return t ? t.full_name : 'Unknown'
  }

  function startEdit(payment) {
    setEditing({ ...payment })
    setMessage('')
  }

  function handleEditChange(e) {
    const updated = { ...editing, [e.target.name]: e.target.value }
    const total = 
      Number(updated.rent_amount) +
      Number(updated.electricity_charge) +
      Number(updated.water_charge) +
      Number(updated.dustbin_charge) +
      Number(updated.damage_charge)
    const balance = total - Number(updated.advance_used) - Number(updated.paid_amount)
    updated.total_bill = total
    updated.balance = balance
    updated.is_paid = balance <= 0
    setEditing(updated)
  }

  async function saveEdit() {
    const { error } = await supabase
      .from('payments')
      .update({
        rent_amount: Number(editing.rent_amount),
        electricity_units: Number(editing.electricity_units),
        electricity_rate: Number(editing.electricity_rate),
        electricity_charge: Number(editing.electricity_charge),
        water_charge: Number(editing.water_charge),
        dustbin_charge: Number(editing.dustbin_charge),
        damage_charge: Number(editing.damage_charge),
        total_bill: Number(editing.total_bill),
        advance_used: Number(editing.advance_used),
        paid_amount: Number(editing.paid_amount),
        balance: Number(editing.balance),
        payment_method: editing.payment_method,
        is_paid: editing.is_paid,
        notes: editing.notes,
      })
      .eq('id', editing.id)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Payment updated successfully!')
      setEditing(null)
      fetchAll()
    }
  }

  const input = {
    width: '100%',
    padding: '8px',
    marginTop: '4px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  }

  const totalDue = payments.filter(p => !p.is_paid).reduce((sum, p) => sum + (p.balance || 0), 0)
  const totalCollected = payments.filter(p => p.is_paid).reduce((sum, p) => sum + (p.paid_amount || 0), 0)

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>💰 Payments</h1>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#e5ffe5', borderRadius: '10px', padding: '1rem', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Rs. {totalCollected}</div>
          <div style={{ color: 'gray', fontSize: '13px' }}>Total Collected</div>
        </div>
        <div style={{ background: '#ffe5e5', borderRadius: '10px', padding: '1rem', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Rs. {totalDue}</div>
          <div style={{ color: 'gray', fontSize: '13px' }}>Total Due</div>
        </div>
        <div style={{ background: '#fff8e1', borderRadius: '10px', padding: '1rem', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{payments.length}</div>
          <div style={{ color: 'gray', fontSize: '13px' }}>Total Bills</div>
        </div>
      </div>

      {message && (
        <p style={{
          padding: '10px',
          borderRadius: '6px',
          background: message.includes('Error') ? '#ffe5e5' : '#e5ffe5',
          color: message.includes('Error') ? '#c00' : '#060',
          marginBottom: '1rem'
        }}>{message}</p>
      )}

      {payments.map(payment => (
        <div key={payment.id} style={{
          background: '#f9f9f9',
          border: '1px solid',
          borderColor: payment.is_paid ? '#aaffaa' : '#ffaaaa',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          {editing?.id === payment.id ? (
            <>
              <h3 style={{ marginTop: 0 }}>✏️ Editing Bill</h3>
              <label>Rent Amount</label>
              <input style={input} type="number" name="rent_amount" value={editing.rent_amount} onChange={handleEditChange} />
              <label>Electricity Units</label>
              <input style={input} type="number" name="electricity_units" value={editing.electricity_units} onChange={handleEditChange} />
              <label>Electricity Rate</label>
              <input style={input} type="number" name="electricity_rate" value={editing.electricity_rate} onChange={handleEditChange} />
              <label>Electricity Charge</label>
              <input style={{ ...input, background: '#eee' }} value={editing.electricity_charge} readOnly />
              <label>Water Charge</label>
              <input style={input} type="number" name="water_charge" value={editing.water_charge} onChange={handleEditChange} />
              <label>Dustbin Charge</label>
              <input style={input} type="number" name="dustbin_charge" value={editing.dustbin_charge} onChange={handleEditChange} />
              <label>Damage Charge</label>
              <input style={input} type="number" name="damage_charge" value={editing.damage_charge} onChange={handleEditChange} />
              <label>Advance Used</label>
              <input style={input} type="number" name="advance_used" value={editing.advance_used} onChange={handleEditChange} />
              <label>Paid Amount</label>
              <input style={input} type="number" name="paid_amount" value={editing.paid_amount} onChange={handleEditChange} />
              <label>Payment Method</label>
              <select style={input} name="payment_method" value={editing.payment_method} onChange={handleEditChange}>
                <option>Cash</option>
                <option>Mobile Banking</option>
                <option>QR Code</option>
              </select>
              <label>Notes</label>
              <input style={input} name="notes" value={editing.notes || ''} onChange={handleEditChange} />
              <div style={{
                padding: '10px',
                borderRadius: '6px',
                background: editing.balance > 0 ? '#ffe5e5' : '#e5ffe5',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                Total: Rs.{editing.total_bill} | Balance: Rs.{editing.balance} {editing.is_paid ? '✅' : '❌'}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={saveEdit} style={{ background: '#0070f3', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Save Changes
                </button>
                <button onClick={() => setEditing(null)} style={{ background: '#eee', padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{getTenantName(payment.tenant_id)}</h3>
                  <p style={{ color: 'gray', margin: '4px 0', fontSize: '14px' }}>
                    {payment.month} {payment.year} — Room {payment.room_id}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: payment.is_paid ? '#e5ffe5' : '#ffe5e5',
                    color: payment.is_paid ? '#060' : '#c00',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    {payment.is_paid ? '✅ Paid' : '❌ Unpaid'}
                  </span>
                  <button onClick={() => startEdit(payment)} style={{ background: '#0070f3', color: 'white', padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    ✏️ Edit
                  </button>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>
                <p style={{ margin: '2px 0' }}>🏠 Rent: Rs.{payment.rent_amount} | ⚡ Electricity: Rs.{payment.electricity_charge} | 💧 Water: Rs.{payment.water_charge}</p>
                <p style={{ margin: '2px 0' }}>🗑️ Dustbin: Rs.{payment.dustbin_charge} | 🔧 Damage: Rs.{payment.damage_charge}</p>
                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>Total: Rs.{payment.total_bill} | Paid: Rs.{payment.paid_amount} | Balance: Rs.{payment.balance}</p>
                <p style={{ margin: '2px 0' }}>💳 {payment.payment_method} {payment.notes ? '| ' + payment.notes : ''}</p>
              </div>
            </>
          )}
        </div>
      ))}
    </main>
  )
}
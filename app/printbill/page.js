'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function PrintBill() {
  const [payments, setPayments] = useState([])
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState([])
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: p } = await supabase.from('payments').select('*').order('created_at', { ascending: false })
    const { data: t } = await supabase.from('tenants').select('*')
    const { data: r } = await supabase.from('rooms').select('*')
    setPayments(p || [])
    setTenants(t || [])
    setRooms(r || [])
  }

  function getTenant(id) {
    return tenants.find(t => t.id === id)
  }

  function getRoom(id) {
    return rooms.find(r => r.id === Number(id))
  }

  function handlePrint() {
    window.print()
  }

  function handleSendEmail() {
    if (!selected) return
    const tenant = getTenant(selected.tenant_id)
    if (!tenant?.email) {
      setMessage('This tenant has no email address saved.')
      return
    }
    const billText = `
Dear ${tenant.full_name},

Your monthly bill for ${selected.month} ${selected.year}:

Room: ${getRoom(tenant.room_id)?.room_number || tenant.room_id}
Rent: Rs. ${selected.rent_amount}
Electricity (${selected.electricity_units} units x Rs.${selected.electricity_rate}): Rs. ${selected.electricity_charge}
Water: Rs. ${selected.water_charge}
Dustbin: Rs. ${selected.dustbin_charge}
Internet: Rs. ${selected.internet_charge || 0}
Damage: Rs. ${selected.damage_charge}
Total Bill: Rs. ${selected.total_bill}
Amount Paid: Rs. ${selected.paid_amount}
Balance Due: Rs. ${selected.balance}
Payment Method: ${selected.payment_method}
Status: ${selected.is_paid ? 'FULLY PAID' : 'PAYMENT DUE'}

Thank you for staying with us.
Warm regards,
{tenant.room_owner_name || 'Yubaraj Timilsina'}
HNRM Family — Managed by Yubaraj Timilsina
www.yubarajtimilsina.com.np
    `.trim()

    const subject = encodeURIComponent(`Rent Bill — ${selected.month} ${selected.year} — Room ${getRoom(tenant.room_id)?.room_number || tenant.room_id}`)
    const body = encodeURIComponent(billText)
    window.open(`mailto:${tenant.email}?subject=${subject}&body=${body}`)
    setMessage(`Email draft opened for ${tenant.email} — please click Send in your email app.`)
  }

  const tenant = selected ? getTenant(selected.tenant_id) : null
  const room = tenant ? getRoom(tenant.room_id) : null

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { font-family: sans-serif; padding: 2rem; max-width: 700px; margin: 0 auto; }
          body { background: white; }
        }
      `}</style>

      <div className="no-print" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <Link href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
        <h1 style={{ marginTop: '1rem' }}>🖨️ Print Bill / Send Email</h1>
        <p style={{ color: 'gray' }}>Select a payment record to print or send to tenant</p>

        {payments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888', background: '#f9f9f9', borderRadius: '12px', marginTop: '1rem' }}>
            <div style={{ fontSize: '40px', marginBottom: '1rem' }}>📋</div>
            <p>No bills found. Create a bill first from the Billing page.</p>
            <Link href="/billing" style={{ color: '#0070f3' }}>Go to Billing →</Link>
          </div>
        )}

        <div style={{ marginTop: '1rem' }}>
          {payments.map(p => {
            const t = getTenant(p.tenant_id)
            return (
              <div
                key={p.id}
                onClick={() => { setSelected(p); setMessage('') }}
                style={{
                  padding: '10px 14px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: selected?.id === p.id ? '#1a1a2e' : '#eee',
                  background: selected?.id === p.id ? '#f0f0f8' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong>{t?.full_name || 'Unknown'}</strong>
                  <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>
                    {p.month} {p.year} — Rs.{p.total_bill}
                  </span>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', background: p.is_paid ? '#e5ffe5' : '#ffe5e5', color: p.is_paid ? '#060' : '#c00' }}>
                  {p.is_paid ? '✅ Paid' : '❌ Due'}
                </span>
              </div>
            )
          })}
        </div>

        {selected && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button onClick={handlePrint} style={{ background: '#1a1a2e', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}>
              🖨️ Print Bill
            </button>
            <button onClick={handleSendEmail} style={{ background: '#0070f3', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}>
              📧 Send to Tenant Email
            </button>
          </div>
        )}

        {message && (
          <p style={{ marginTop: '1rem', padding: '10px', borderRadius: '6px', background: message.includes('no email') ? '#ffe5e5' : '#e5ffe5', color: message.includes('no email') ? '#c00' : '#060' }}>{message}</p>
        )}
      </div>

      {selected && tenant && (
        <div className="print-area" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>

          <div style={{ textAlign: 'center', borderBottom: '3px solid #1a1a2e', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '28px', color: '#c9a84c' }}>ॐ</div>
            <h2 style={{ margin: '4px 0', color: '#1a1a2e' }}>🏠 HNRM Family — Rental Bill</h2>
            <p style={{ color: '#888', margin: '2px 0', fontSize: '13px' }}>Human Nature Reality Movement</p>
            <p style={{ color: '#0070f3', margin: '2px 0', fontSize: '12px' }}>www.yubarajtimilsina.com.np</p>
            <div style={{ color: '#c9a84c', fontSize: '13px', fontStyle: 'italic' }}>अतिथि देवो भव 🙏</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#888' }}>Bill For</div>
              <div style={{ fontWeight: '700', fontSize: '18px' }}>{tenant.full_name}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>Father: {tenant.father_name || '—'}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>Phone: {tenant.phone || '—'}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>Address: {tenant.temporary_address || '—'}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>Citizenship: {tenant.citizenship_id || '—'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#888' }}>Bill Period</div>
              <div style={{ fontWeight: '700', fontSize: '18px' }}>{selected.month} {selected.year}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>Room: {room?.room_number || tenant.room_id}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>Floor: {room?.floor || '—'}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>Date: {new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: 'white' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Charge / शुल्क</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount / रकम</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 12px' }}>🏠 Rent (भाडा)</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {selected.rent_amount}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee', background: '#f9f9f9' }}>
                <td style={{ padding: '8px 12px' }}>⚡ Electricity — {selected.electricity_units} units × Rs.{selected.electricity_rate}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {selected.electricity_charge}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 12px' }}>💧 Water (पानी)</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {selected.water_charge}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee', background: '#f9f9f9' }}>
                <td style={{ padding: '8px 12px' }}>🗑️ Dustbin (फोहोर)</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {selected.dustbin_charge}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 12px' }}>🌐 Internet (इन्टरनेट)</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {selected.internet_charge || 0}</td>
              </tr>
              {selected.damage_charge > 0 && (
                <tr style={{ borderBottom: '1px solid #eee', background: '#fff0f0' }}>
                  <td style={{ padding: '8px 12px' }}>🔧 Damage (क्षति)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {selected.damage_charge}</td>
                </tr>
              )}
              <tr style={{ background: '#1a1a2e', color: 'white', fontWeight: '700', fontSize: '16px' }}>
                <td style={{ padding: '10px 12px' }}>TOTAL BILL (जम्मा)</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>Rs. {selected.total_bill}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ background: selected.is_paid ? '#e5ffe5' : '#fff0f0', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Advance Used (अग्रिम प्रयोग)</span>
              <strong>Rs. {selected.advance_used}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Amount Paid (तिरेको रकम)</span>
              <strong>Rs. {selected.paid_amount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Payment Method (भुक्तानी तरिका)</span>
              <strong>{selected.payment_method}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: '700', borderTop: '1px solid #ccc', paddingTop: '8px' }}>
              <span>Balance Due (बाँकी)</span>
              <strong style={{ color: selected.is_paid ? '#060' : '#c00' }}>
                Rs. {selected.balance} {selected.is_paid ? '✅ PAID' : '❌ DUE'}
              </strong>
            </div>
          </div>

          {selected.notes && (
            <div style={{ background: '#fff8e1', borderRadius: '8px', padding: '8px 12px', marginBottom: '1rem', fontSize: '13px' }}>
              <strong>Notes:</strong> {selected.notes}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #333', width: '150px', marginBottom: '4px' }}></div>
              <div style={{ fontSize: '12px', color: '#555' }}>Tenant Signature / भाडावालाको सही</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #333', width: '150px', marginBottom: '4px' }}></div>
              <div style={{ fontSize: '12px', color: '#555' }}>Owner Signature / घरधनीको सही</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '12px', color: '#aaa' }}>
            <div style={{ color: '#c9a84c', fontSize: '16px' }}>ॐ अतिथि देवो भव 🙏</div>
            <div>HNRM Family — Human Nature Reality Movement — www.yubarajtimilsina.com.np</div>
          </div>

        </div>
      )}
    </>
  )
}
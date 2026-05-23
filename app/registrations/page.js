'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Registrations() {
  const [registrations, setRegistrations] = useState([])
  const [rooms, setRooms] = useState([])
  const [buildings, setBuildings] = useState([])
  const [selected, setSelected] = useState(null)
  const [approvedTenant, setApprovedTenant] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [rentAmount, setRentAmount] = useState('')
  const [advanceAmount, setAdvanceAmount] = useState('')
  const [leaseStart, setLeaseStart] = useState('')
  const [leaseEnd, setLeaseEnd] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: r } = await supabase.from('tenant_registrations').select('*').order('created_at', { ascending: false })
    const { data: allRooms } = await supabase.from('rooms').select('*').eq('is_occupied', false)
    const rooms = allRooms || []
    const { data: b } = await supabase.from('buildings').select('*')
    setRegistrations(r || [])
    setRooms(rooms || [])
    setBuildings(b || [])
  }

  function getBuildingName(building_id) {
    const b = buildings.find(b => b.id === building_id)
    return b ? b.name : ''
  }

  function getRoomType(type) {
    if (type === 'shop') return 'Shop'
    if (type === 'flat') return 'Flat'
    return 'Room'
  }

  function buildMessage(reg) {
    return 'नमस्ते ' + reg.full_name + ' जी! 🙏\n\n' +
      'तपाईंको कोठा दर्ता सफलतापूर्वक भयो।\n' +
      'अतिथि देवो भव: — HNRM परिवारमा स्वागत छ!\n\n' +
      'तपाईंको विवरण:\n' +
      '──────────────────\n' +
      '👤 नाम: ' + reg.full_name + '\n' +
      '👨 बुबाको नाम: ' + (reg.father_name || '—') + '\n' +
      '👴 हजुरबुबाको नाम: ' + (reg.grandfather_name || '—') + '\n' +
      '📞 फोन: ' + (reg.phone || '—') + '\n' +
      '💼 पेशा: ' + (reg.profession || '—') + '\n' +
      '🪪 नागरिकता: ' + (reg.citizenship_id || '—') + '\n' +
      '📍 अस्थायी ठेगाना: ' + (reg.temporary_address || '—') + '\n' +
      '🏡 स्थायी ठेगाना: ' + (reg.permanent_address || '—') + '\n' +
      '👥 कोठामा बस्नेको संख्या: ' + (reg.number_of_people || 1) + '\n' +
      (reg.family_members ? '👨‍👩‍👧‍👦 परिवारका सदस्यहरू:\n' + reg.family_members + '\n' : '') +
      '──────────────────\n' +
      '🏠 घरधनी: Yubaraj Timilsina\n' +
      '🛏️ कोठा नम्बर: ' + (reg.approvedRoomNumber || '—') + '\n' +
      '💰 मासिक भाडा: Rs. ' + (reg.approvedRent || '—') + '\n' +
      '💵 अग्रिम रकम: Rs. ' + (reg.approvedAdvance || 0) + '\n' +
      '📅 सम्झौता सुरु: ' + (reg.approvedLeaseStart || '—') + '\n' +
      '📅 सम्झौता सकिने: ' + (reg.approvedLeaseEnd || '—') + '\n' +
      '──────────────────\n\n' +
      'कृपया माथिको विवरण जाँच गर्नुस्।\n' +
      '✅ सही छ भने "ठीक छ" लेखेर पठाउनुस्।\n' +
      '❌ कुनै गल्ती छ भने सोही लेखेर पठाउनुस्।\n\n' +
      'उजुरी वा प्रश्न भए यहाँ लेख्नुस्:\n' +
      'https://room-rent-app-ecru.vercel.app/noticeboard\n\n' +
      '— युबराज तिमिल्सिना (HNRM परिवार) 🙏\n' +
      'www.yubarajtimilsina.com.np'
  }

  function sendWhatsApp() {
    if (!approvedTenant) return
    const msg = encodeURIComponent(buildMessage(approvedTenant))
    const phone = approvedTenant.phone ? approvedTenant.phone.replace(/^0/, '977') : ''
    const link = phone
      ? 'https://wa.me/' + phone + '?text=' + msg
      : 'https://wa.me/?text=' + msg
    window.open(link, '_blank')
  }

  function sendEmail() {
    if (!approvedTenant) return
    if (!approvedTenant.email) {
      alert('This tenant has no email address saved.')
      return
    }
    const msg = buildMessage(approvedTenant)
    const subject = encodeURIComponent('कोठा दर्ता पुष्टि — Room ' + (approvedTenant.approvedRoomNumber || '—') + ' — HNRM Family')
    const body = encodeURIComponent(msg)
    window.open('mailto:' + approvedTenant.email + '?subject=' + subject + '&body=' + body, '_blank')
  }

  async function handleApprove() {
    if (!selected || !roomId || !rentAmount) {
      setMessage('Please select a room and enter rent amount.')
      return
    }

    const { error } = await supabase.from('tenants').insert([{
      full_name: selected.full_name,
      father_name: selected.father_name,
      grandfather_name: selected.grandfather_name,
      phone: selected.phone,
      email: selected.email,
      profession: selected.profession,
      citizenship_id: selected.citizenship_id,
      temporary_address: selected.temporary_address,
      permanent_address: selected.permanent_address,
      number_of_people: selected.number_of_people,
      family_members: selected.family_members,
      emergency_contact_name: selected.emergency_contact_name,
      emergency_contact_phone: selected.emergency_contact_phone,
      emergency_contact_relation: selected.emergency_contact_relation,
      office_name: selected.office_name,
      office_contact_person: selected.office_contact_person,
      office_contact_phone: selected.office_contact_phone,
      room_id: Number(roomId),
      rent_amount: Number(rentAmount),
      advance_amount: Number(advanceAmount) || 0,
      lease_start: leaseStart,
      lease_end: leaseEnd,
      room_owner_name: 'Yubaraj Timilsina',
      is_active: true,
    }])

    if (error) {
      setMessage('Error: ' + error.message)
      return
    }

    await supabase.from('rooms').update({ is_occupied: true }).eq('id', Number(roomId))
    await supabase.from('tenant_registrations').update({ status: 'approved' }).eq('id', selected.id)

    const approvedRoom = rooms.find(r => r.id === Number(roomId))
    setTimeout(() => {
      const el = document.getElementById('send-confirmation')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
    setApprovedTenant({
      ...selected,
      approvedRoomNumber: approvedRoom ? approvedRoom.room_number : roomId,
      approvedRent: rentAmount,
      approvedAdvance: advanceAmount || 0,
      approvedLeaseStart: leaseStart || '—',
      approvedLeaseEnd: leaseEnd || '—',
    })
    setMessage(selected.full_name + ' approved successfully! Now send confirmation via WhatsApp or Email below.')
    setSelected(null)
    setRoomId('')
    setRentAmount('')
    setAdvanceAmount('')
    setLeaseStart('')
    setLeaseEnd('')
    fetchAll()
  }

  async function handleReject(id, name) {
    if (!confirm('Reject registration from ' + name + '?')) return
    await supabase.from('tenant_registrations').update({ status: 'rejected' }).eq('id', id)
    fetchAll()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this registration permanently?')) return
    await supabase.from('tenant_registrations').delete().eq('id', id)
    fetchAll()
  }

  const pending = registrations.filter(r => r.status === 'pending')
  const approved = registrations.filter(r => r.status === 'approved')
  const rejected = registrations.filter(r => r.status === 'rejected')

  const input = {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    boxSizing: 'border-box',
  }

  const label = {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
    display: 'block',
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>📥 Tenant Registrations</h1>
      <p style={{ color: 'gray' }}>Review and approve registrations submitted by tenants</p>

      {message && (
        <div style={{ padding: '12px', borderRadius: '8px', background: message.includes('Error') ? '#ffe5e5' : '#e5ffe5', color: message.includes('Error') ? '#c00' : '#060', marginBottom: '1rem', fontWeight: '600' }}>
          {message.includes('Error') ? '❌ ' : '✅ '}{message}
        </div>
      )}

      {/* Send Confirmation Buttons */}
      {approvedTenant && (
        <div id="send-confirmation" style={{ background: '#fff8e1', border: '2px solid #ffd54f', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#1a1a2e', fontSize: '15px' }}>
            📤 Send Confirmation to {approvedTenant.full_name}
          </h3>
          <p style={{ color: '#888', fontSize: '13px', margin: '0 0 1rem' }}>
            Send approved details to tenant so they can confirm everything is correct.
            भाडावालालाई उनको विवरण पठाउनुस् ताकि उनले पुष्टि गर्न सकून्।
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={sendWhatsApp}
              style={{ background: '#25D366', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', flex: 1, minWidth: '180px' }}
            >
              📱 Send via WhatsApp
            </button>
            <button
              onClick={sendEmail}
              style={{ background: '#0070f3', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', flex: 1, minWidth: '180px' }}
            >
              📧 Send via Email
            </button>
          </div>
          <p style={{ color: '#aaa', fontSize: '11px', marginTop: '8px' }}>
            Phone: {approvedTenant.phone || '—'} | Email: {approvedTenant.email || 'No email saved'}
          </p>
          <button onClick={() => setApprovedTenant(null)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '12px', marginTop: '4px', textDecoration: 'underline' }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Share Link */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ color: 'white', fontWeight: '700', marginBottom: '6px' }}>📤 Share this link with new tenants:</div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#c9a84c', fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          https://room-rent-app-ecru.vercel.app/register
        </div>
        <div style={{ color: '#888', fontSize: '12px', marginTop: '6px' }}>Tenant opens this link on their phone and fills their own details</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff8e1', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '2px solid #ffd54f' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#f0a500' }}>{pending.length}</div>
          <div style={{ color: '#888', fontSize: '12px' }}>⏳ Pending</div>
        </div>
        <div style={{ background: '#e5ffe5', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '2px solid #aaffaa' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#22bb66' }}>{approved.length}</div>
          <div style={{ color: '#888', fontSize: '12px' }}>✅ Approved</div>
        </div>
        <div style={{ background: '#ffe5e5', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '2px solid #ffaaaa' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#e03030' }}>{rejected.length}</div>
          <div style={{ color: '#888', fontSize: '12px' }}>❌ Rejected</div>
        </div>
      </div>

      {/* Pending */}
      <h2 style={{ color: '#1a1a2e', fontSize: '16px', marginBottom: '1rem' }}>⏳ Pending Registrations ({pending.length})</h2>

      {pending.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', background: '#f9f9f9', borderRadius: '12px', color: '#888', marginBottom: '1.5rem' }}>
          No pending registrations. Share the link above with new tenants.
        </div>
      )}

      {pending.map(reg => (
        <div key={reg.id} style={{ background: 'white', border: '2px solid', borderColor: selected?.id === reg.id ? '#c9a84c' : '#eee', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ margin: 0, color: '#1a1a2e' }}>{reg.full_name}</h3>
              <p style={{ color: '#888', fontSize: '13px', margin: '2px 0' }}>📞 {reg.phone} — {reg.profession || '—'}</p>
              <p style={{ color: '#888', fontSize: '13px', margin: '2px 0' }}>🪪 {reg.citizenship_id || '—'}</p>
              <p style={{ color: '#888', fontSize: '13px', margin: '2px 0' }}>📍 {reg.temporary_address || '—'}</p>
              <p style={{ color: '#888', fontSize: '13px', margin: '2px 0' }}>👨 Father: {reg.father_name || '—'} | Grandfather: {reg.grandfather_name || '—'}</p>
              {reg.family_members && (
                <div style={{ background: '#f4f6fb', borderRadius: '6px', padding: '6px 10px', marginTop: '4px', fontSize: '12px', color: '#555' }}>
                  <strong>Family Members:</strong><br />
                  <span style={{ whiteSpace: 'pre-line' }}>{reg.family_members}</span>
                </div>
              )}
              {reg.emergency_contact_name && <p style={{ color: '#c00', fontSize: '12px', margin: '2px 0' }}>🚨 Emergency: {reg.emergency_contact_name} ({reg.emergency_contact_relation}) — {reg.emergency_contact_phone}</p>}
              {reg.office_name && <p style={{ color: '#0070f3', fontSize: '12px', margin: '2px 0' }}>🏢 Office: {reg.office_name} — {reg.office_contact_person} — {reg.office_contact_phone}</p>}
              <p style={{ color: '#aaa', fontSize: '11px', margin: '4px 0 0' }}>Submitted: {new Date(reg.created_at).toLocaleDateString('en-GB')}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => { setSelected(reg); setMessage('') }} style={{ background: '#1a1a2e', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                ✅ Approve
              </button>
              <button onClick={() => handleReject(reg.id, reg.full_name)} style={{ background: '#fff0f0', color: '#c00', padding: '8px 16px', border: '1px solid #ffaaaa', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                ❌ Reject
              </button>
              <button onClick={() => handleDelete(reg.id)} style={{ background: '#f9f9f9', color: '#888', padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Approval Form */}
          {selected?.id === reg.id && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f4f6fb', borderRadius: '10px', border: '2px solid #c9a84c' }}>
              <h3 style={{ marginTop: 0, color: '#1a1a2e', fontSize: '15px' }}>✅ Approve — Assign Room and Rent</h3>

              <label style={label}>Select Room *</label>
              <select style={input} value={roomId} onChange={e => setRoomId(e.target.value)}>
                <option value="">-- Select vacant room --</option>
                {rooms
                  .filter(room => selected?.building_id ? room.building_id === selected.building_id : true)
                  .map(room => (
                    <option key={room.id} value={room.id}>
                      {getBuildingName(room.building_id)} — {getRoomType(room.room_type)} {room.room_number}
                    </option>
                  ))}
              </select>

              <label style={label}>Agreed Rent Amount — Rs. *</label>
              <input style={input} type="number" value={rentAmount} onChange={e => setRentAmount(e.target.value)} placeholder="e.g. 7677 or any agreed amount" />

              <label style={label}>Advance Amount — Rs.</label>
              <input style={input} type="number" value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} placeholder="0 if no advance" />

              <label style={label}>Lease Start Date</label>
              <input style={input} type="date" value={leaseStart} onChange={e => setLeaseStart(e.target.value)} />

              <label style={label}>Lease End Date</label>
              <input style={input} type="date" value={leaseEnd} onChange={e => setLeaseEnd(e.target.value)} />

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={handleApprove} style={{ background: '#22bb66', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', flex: 1 }}>
                  ✅ Confirm Approval
                </button>
                <button onClick={() => setSelected(null)} style={{ background: '#eee', color: '#555', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Approved */}
      {approved.length > 0 && (
        <>
          <h2 style={{ color: '#22bb66', fontSize: '16px', marginBottom: '1rem', marginTop: '2rem' }}>
            ✅ Approved ({approved.length}) — 
            <a href="/tenants/list" style={{ color: '#0070f3', fontSize: '13px', marginLeft: '8px' }}>
              View in Tenant List →
            </a>
          </h2>
          {approved.map(reg => (
            <div key={reg.id} style={{ background: '#f0fff4', border: '1px solid #ccffdd', borderRadius: '10px', padding: '1rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong>{reg.full_name}</strong>
                <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>{reg.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => { setApprovedTenant(reg); setMessage('') }}
                  style={{ background: '#25D366', color: 'white', padding: '5px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  📱 Resend WhatsApp
                </button>
                <button onClick={() => handleDelete(reg.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <>
          <h2 style={{ color: '#e03030', fontSize: '16px', marginBottom: '1rem', marginTop: '2rem' }}>❌ Rejected ({rejected.length})</h2>
          {rejected.map(reg => (
            <div key={reg.id} style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '10px', padding: '1rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{reg.full_name}</strong>
                <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>{reg.phone}</span>
              </div>
              <button onClick={() => handleDelete(reg.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
            </div>
          ))}
        </>
      )}

    </main>
  )
}
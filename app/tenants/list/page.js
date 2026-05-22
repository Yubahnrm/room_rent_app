'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default function TenantList() {
  const [tenants, setTenants] = useState([])
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchTenants()
  }, [])

  async function fetchTenants() {
    const { data } = await supabase.from('tenants').select('*').eq('is_active', true)
    setTenants(data || [])
  }

  function startEdit(tenant) {
    setEditing({ ...tenant })
    setMessage('')
  }

  function handleEditChange(e) {
    setEditing({ ...editing, [e.target.name]: e.target.value })
  }

  async function saveEdit() {
    const { error } = await supabase
      .from('tenants')
      .update({
        full_name: editing.full_name,
        father_name: editing.father_name,
        grandfather_name: editing.grandfather_name,
        phone: editing.phone,
        email: editing.email,
        profession: editing.profession,
        citizenship_id: editing.citizenship_id,
        temporary_address: editing.temporary_address,
        permanent_address: editing.permanent_address,
        number_of_people: editing.number_of_people,
        advance_amount: editing.advance_amount,
        family_members: editing.family_members,
        emergency_contact_name: editing.emergency_contact_name,
        emergency_contact_phone: editing.emergency_contact_phone,
        emergency_contact_relation: editing.emergency_contact_relation,
        office_name: editing.office_name,
        office_contact_person: editing.office_contact_person,
        office_contact_phone: editing.office_contact_phone,
      })
      .eq('id', editing.id)
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Tenant updated successfully!')
      setEditing(null)
      fetchTenants()
    }
  }

  async function deactivateTenant(id) {
    if (!confirm('Are you sure you want to remove this tenant?')) return
    const tenant = tenants.find(t => t.id === id)
    await supabase.from('tenants').update({ is_active: false }).eq('id', id)
    if (tenant?.room_id) {
      await supabase.from('rooms').update({ is_occupied: false }).eq('id', tenant.room_id)
    }
    fetchTenants()
  }

  const input = {
    width: '100%',
    padding: '8px',
    marginTop: '4px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>👥 Tenant List</h1>
      <p style={{ color: 'gray' }}>{tenants.length} active tenant(s)</p>

      {message && (
        <p style={{ padding: '10px', borderRadius: '6px', background: message.includes('Error') ? '#ffe5e5' : '#e5ffe5', color: message.includes('Error') ? '#c00' : '#060', marginBottom: '1rem' }}>
          {message}
        </p>
      )}

      {tenants.map(tenant => (
        <div key={tenant.id} style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
          {editing?.id === tenant.id ? (
            <>
              <h3 style={{ marginTop: 0 }}>✏️ Editing: {tenant.full_name}</h3>
              <label>Full Name</label>
              <input style={input} name="full_name" value={editing.full_name} onChange={handleEditChange} />
              <label>Father's Name</label>
              <input style={input} name="father_name" value={editing.father_name || ''} onChange={handleEditChange} />
              <label>Grandfather's Name</label>
              <input style={input} name="grandfather_name" value={editing.grandfather_name || ''} onChange={handleEditChange} />
              <label>Phone</label>
              <input style={input} name="phone" value={editing.phone || ''} onChange={handleEditChange} />
              <label>Email</label>
              <input style={input} name="email" value={editing.email || ''} onChange={handleEditChange} />
              <label>Profession</label>
              <input style={input} name="profession" value={editing.profession || ''} onChange={handleEditChange} />
              <label>Citizenship ID</label>
              <input style={input} name="citizenship_id" value={editing.citizenship_id || ''} onChange={handleEditChange} />
              <label>Temporary Address</label>
              <input style={input} name="temporary_address" value={editing.temporary_address || ''} onChange={handleEditChange} />
              <label>Permanent Address</label>
              <input style={input} name="permanent_address" value={editing.permanent_address || ''} onChange={handleEditChange} />
              <label>Number of People</label>
              <input style={input} type="number" name="number_of_people" value={editing.number_of_people || 1} onChange={handleEditChange} />
              <label>Family Members Details</label>
              <textarea style={{ ...input, resize: 'vertical', minHeight: '80px' }} name="family_members" value={editing.family_members || ''} onChange={handleEditChange} placeholder="1. Name — Relation&#10;2. Name — Relation" />
              <label>Advance Amount</label>
              <input style={input} type="number" name="advance_amount" value={editing.advance_amount || 0} onChange={handleEditChange} />
              <label>Emergency Contact Name</label>
              <input style={input} name="emergency_contact_name" value={editing.emergency_contact_name || ''} onChange={handleEditChange} />
              <label>Emergency Contact Relation</label>
              <input style={input} name="emergency_contact_relation" value={editing.emergency_contact_relation || ''} onChange={handleEditChange} />
              <label>Emergency Contact Phone</label>
              <input style={input} name="emergency_contact_phone" value={editing.emergency_contact_phone || ''} onChange={handleEditChange} />
              <label>Office Name</label>
              <input style={input} name="office_name" value={editing.office_name || ''} onChange={handleEditChange} />
              <label>Office Contact Person</label>
              <input style={input} name="office_contact_person" value={editing.office_contact_person || ''} onChange={handleEditChange} />
              <label>Office Contact Phone</label>
              <input style={input} name="office_contact_phone" value={editing.office_contact_phone || ''} onChange={handleEditChange} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={saveEdit} style={{ background: '#0070f3', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Changes</button>
                <button onClick={() => setEditing(null)} style={{ background: '#eee', padding: '8px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{tenant.full_name}</h3>
                  <p style={{ color: 'gray', margin: '4px 0', fontSize: '14px' }}>Room {tenant.room_id} — {tenant.phone}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startEdit(tenant)} style={{ background: '#0070f3', color: 'white', padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>✏️ Edit</button>
                  <button onClick={() => deactivateTenant(tenant.id)} style={{ background: '#ff4444', color: 'white', padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>🚪 Remove</button>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>
                <p style={{ margin: '2px 0' }}>👨 Father: {tenant.father_name || '—'} | Grandfather: {tenant.grandfather_name || '—'}</p>
                <p style={{ margin: '2px 0' }}>💼 Profession: {tenant.profession || '—'}</p>
                <p style={{ margin: '2px 0' }}>🪪 Citizenship: {tenant.citizenship_id || '—'}</p>
                <p style={{ margin: '2px 0' }}>📍 Temporary: {tenant.temporary_address || '—'}</p>
                <p style={{ margin: '2px 0' }}>🏡 Permanent: {tenant.permanent_address || '—'}</p>
                <p style={{ margin: '2px 0' }}>👥 People in room: {tenant.number_of_people || 1}</p>
                {tenant.family_members && (
                  <div style={{ background: '#f4f6fb', borderRadius: '6px', padding: '6px 10px', marginTop: '4px', fontSize: '12px', color: '#555' }}>
                    <strong>Family Members:</strong><br />
                    <span style={{ whiteSpace: 'pre-line' }}>{tenant.family_members}</span>
                  </div>
                )}
                <p style={{ margin: '2px 0' }}>💰 Advance: Rs. {tenant.advance_amount || 0}</p>
                {tenant.emergency_contact_name && <p style={{ margin: '2px 0', color: '#c00' }}>🚨 Emergency: {tenant.emergency_contact_name} ({tenant.emergency_contact_relation}) — {tenant.emergency_contact_phone}</p>}
                {tenant.office_name && <p style={{ margin: '2px 0', color: '#0070f3' }}>🏢 Office: {tenant.office_name} — {tenant.office_contact_person} — {tenant.office_contact_phone}</p>}
              </div>
            </>
          )}
        </div>
      ))}
    </main>
  )
}
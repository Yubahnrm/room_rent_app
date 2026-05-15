'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddTenant() {
  const [form, setForm] = useState({
    room_id: '',
    full_name: '',
    father_name: '',
    grandfather_name: '',
    room_owner_name: 'Yubaraj',
    phone: '',
    email: '',
    profession: '',
    citizenship_id: '',
    temporary_address: '',
    permanent_address: '',
    number_of_people: 1,
    lease_start: '',
    lease_end: '',
    advance_amount: 0,
  })

  const [message, setMessage] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.full_name || !form.room_id) {
      setMessage('Please fill full name and room number at minimum.')
      return
    }

    const { error } = await supabase.from('tenants').insert([form])

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Tenant saved successfully!')
      setForm({
        room_id: '',
        full_name: '',
        father_name: '',
        grandfather_name: '',
        room_owner_name: 'Yubaraj',
        phone: '',
        email: '',
        profession: '',
        citizenship_id: '',
        temporary_address: '',
        permanent_address: '',
        number_of_people: 1,
        lease_start: '',
        lease_end: '',
        advance_amount: 0,
      })
    }
  }

  const input = {
    width: '100%',
    padding: '8px',
    marginTop: '4px',
    marginBottom: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '15px',
  }

  const label = {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#444',
  }

  const section = {
    background: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1.5rem',
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🏠 Add New Tenant</h1>
      <p style={{ color: 'gray' }}>Fill all details carefully. All info can be edited later.</p>

      {/* Personal Info */}
      <div style={section}>
        <h2 style={{ marginTop: 0 }}>Personal Information</h2>

        <label style={label}>Full Name (पुरा नाम) *</label>
        <input style={input} name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Ram Bahadur Thapa" />

        <label style={label}>Father's Name (बुबाको नाम)</label>
        <input style={input} name="father_name" value={form.father_name} onChange={handleChange} placeholder="e.g. Hari Bahadur Thapa" />

        <label style={label}>Grandfather's Name (हजुरबुबाको नाम)</label>
        <input style={input} name="grandfather_name" value={form.grandfather_name} onChange={handleChange} placeholder="e.g. Kalu Bahadur Thapa" />

        <label style={label}>Profession (पेशा)</label>
        <input style={input} name="profession" value={form.profession} onChange={handleChange} placeholder="e.g. Teacher, Business, Student" />

        <label style={label}>Citizenship ID / National ID (नागरिकता नम्बर)</label>
        <input style={input} name="citizenship_id" value={form.citizenship_id} onChange={handleChange} placeholder="e.g. 12-34-56-78901" />
      </div>

      {/* Contact Info */}
      <div style={section}>
        <h2 style={{ marginTop: 0 }}>Contact Information</h2>

        <label style={label}>Phone Number (फोन नम्बर)</label>
        <input style={input} name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9841234567" />

        <label style={label}>Email Address (इमेल)</label>
        <input style={input} name="email" value={form.email} onChange={handleChange} placeholder="e.g. ram@gmail.com" />

        <label style={label}>Temporary Address (अस्थायी ठेगाना)</label>
        <input style={input} name="temporary_address" value={form.temporary_address} onChange={handleChange} placeholder="e.g. Kathmandu-10, Baneshwor" />

        <label style={label}>Permanent Address (स्थायी ठेगाना)</label>
        <input style={input} name="permanent_address" value={form.permanent_address} onChange={handleChange} placeholder="e.g. Sindhupalchok-5, Melamchi" />
      </div>

      {/* Room Info */}
      <div style={section}>
        <h2 style={{ marginTop: 0 }}>Room and Lease Information</h2>

        <label style={label}>Room ID (कोठा नम्बर) *</label>
        <input style={input} name="room_id" value={form.room_id} onChange={handleChange} placeholder="e.g. 1 or 2 or 3" />

        <label style={label}>Room Owner Name (घरधनीको नाम)</label>
        <input style={input} name="room_owner_name" value={form.room_owner_name} onChange={handleChange} />

        <label style={label}>Number of People in Room (कोठामा बस्ने मान्छेको संख्या)</label>
        <input style={input} type="number" name="number_of_people" value={form.number_of_people} onChange={handleChange} min="1" />

        <label style={label}>Lease Start Date (सम्झौता सुरु मिति)</label>
        <input style={input} type="date" name="lease_start" value={form.lease_start} onChange={handleChange} />

        <label style={label}>Lease End Date (सम्झौता सकिने मिति)</label>
        <input style={input} type="date" name="lease_end" value={form.lease_end} onChange={handleChange} />

        <label style={label}>Advance Amount (अग्रिम रकम)</label>
        <input style={input} type="number" name="advance_amount" value={form.advance_amount} onChange={handleChange} min="0" />
      </div>

      {/* Submit */}
      {message && (
        <p style={{
          padding: '10px',
          borderRadius: '6px',
          background: message.includes('Error') ? '#ffe5e5' : '#e5ffe5',
          color: message.includes('Error') ? '#c00' : '#060',
          marginBottom: '1rem'
        }}>
          {message}
        </p>
      )}

      <button
        onClick={handleSubmit}
        style={{
          background: '#0070f3',
          color: 'white',
          padding: '12px 32px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Save Tenant Information
      </button>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</a>
      </p>
    </main>
  )
}
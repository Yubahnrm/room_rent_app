'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddTenant() {
  const [rooms, setRooms] = useState([])
  const [buildings, setBuildings] = useState([])
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
    advance_amount: '',
    rent_amount: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    office_name: '',
    office_contact_person: '',
    office_contact_phone: '',
  })

  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    const { data: b } = await supabase.from('buildings').select('*')
    const { data: r } = await supabase.from('rooms').select('*').eq('is_occupied', false)
    setBuildings(b || [])
    setRooms(r || [])
  }

  function getBuildingName(building_id) {
    const b = buildings.find(b => b.id === building_id)
    return b ? b.name : ''
  }

  function getRoomType(type) {
    if (type === 'shop') return '🏪 Shop'
    if (type === 'flat') return '🏠 Flat'
    return '🛏️ Room'
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.full_name || !form.room_id) {
      setMessage('Please fill full name and select a room.')
      return
    }
    if (!form.rent_amount) {
      setMessage('Please enter the agreed rent amount.')
      return
    }

    const { error } = await supabase.from('tenants').insert([{
      ...form,
      room_id: Number(form.room_id),
      rent_amount: Number(form.rent_amount),
      advance_amount: Number(form.advance_amount) || 0,
      number_of_people: Number(form.number_of_people) || 1,
    }])

    if (error) {
      setMessage('Error: ' + error.message)
      return
    }

    await supabase.from('rooms').update({ is_occupied: true }).eq('id', Number(form.room_id))

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
      advance_amount: '',
      rent_amount: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relation: '',
      office_name: '',
      office_contact_person: '',
      office_contact_phone: '',
    })
    fetchRooms()
  }

  const input = {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    marginBottom: '14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    boxSizing: 'border-box',
    background: 'white',
  }

  const label = {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
    display: 'block',
    marginTop: '4px',
  }

  const section = {
    background: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '1.2rem',
    marginBottom: '1.5rem',
  }

  const sectionTitle = {
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '16px',
    color: '#1a1a2e',
    borderBottom: '2px solid #eee',
    paddingBottom: '8px',
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif', background: '#f4f6fb', minHeight: '100vh' }}>

      <a href="/" style={{ color: '#0070f3', fontSize: '14px' }}>← Back to Dashboard</a>

      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1rem 1.5rem', margin: '1rem 0 1.5rem', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>🏠 Add New Tenant</h1>
        <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: '13px' }}>Fill all details carefully. All info can be edited later.</p>
      </div>

      {/* Personal Info */}
      <div style={section}>
        <h2 style={sectionTitle}>👤 Personal Information / व्यक्तिगत जानकारी</h2>

        <label style={label}>Full Name (पूरा नाम) *</label>
        <input style={input} name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Ram Bahadur Thapa" />

        <label style={label}>Father's Name (बुबाको नाम)</label>
        <input style={input} name="father_name" value={form.father_name} onChange={handleChange} placeholder="e.g. Hari Bahadur Thapa" />

        <label style={label}>Grandfather's Name (हजुरबुबाको नाम)</label>
        <input style={input} name="grandfather_name" value={form.grandfather_name} onChange={handleChange} placeholder="e.g. Kalu Bahadur Thapa" />

        <label style={label}>Profession (पेशा)</label>
        <input style={input} name="profession" value={form.profession} onChange={handleChange} placeholder="e.g. Teacher, Business, Student, Labour" />

        <label style={label}>Citizenship ID / National ID (नागरिकता नम्बर)</label>
        <input style={input} name="citizenship_id" value={form.citizenship_id} onChange={handleChange} placeholder="e.g. 12-34-56-78901" />
      </div>

      {/* Contact Info */}
      <div style={section}>
        <h2 style={sectionTitle}>📞 Contact Information / सम्पर्क जानकारी</h2>

        <label style={label}>Phone Number (फोन नम्बर)</label>
        <input style={input} name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9841234567" />

        <label style={label}>Email Address (इमेल) — optional</label>
        <input style={input} name="email" value={form.email} onChange={handleChange} placeholder="e.g. ram@gmail.com" />

        <label style={label}>Temporary Address (अस्थायी ठेगाना)</label>
        <input style={input} name="temporary_address" value={form.temporary_address} onChange={handleChange} placeholder="e.g. Kathmandu-10, Baneshwor" />

        <label style={label}>Permanent Address (स्थायी ठेगाना)</label>
        <input style={input} name="permanent_address" value={form.permanent_address} onChange={handleChange} placeholder="e.g. Sindhupalchok-5, Melamchi" />
      </div>

      {/* Emergency Contact */}
      <div style={{ ...section, borderColor: '#ffaaaa', background: '#fff8f8' }}>
        <h2 style={{ ...sectionTitle, borderColor: '#ffcccc' }}>🚨 Emergency Contact / आपतकालीन सम्पर्क</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '1rem', marginTop: '-0.5rem' }}>
          Family member to contact in emergency — father, mother, brother, relative
        </p>

        <label style={label}>Emergency Contact Name (आपतकालीन व्यक्तिको नाम)</label>
        <input style={input} name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} placeholder="e.g. Hari Bahadur Thapa" />

        <label style={label}>Relation (नाता)</label>
        <input style={input} name="emergency_contact_relation" value={form.emergency_contact_relation} onChange={handleChange} placeholder="e.g. Father, Mother, Brother, Uncle" />

        <label style={label}>Emergency Phone Number (आपतकालीन फोन नम्बर)</label>
        <input style={input} name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} placeholder="e.g. 9851234567" />
      </div>

      {/* Office Contact */}
      <div style={{ ...section, borderColor: '#aaaaff', background: '#f8f8ff' }}>
        <h2 style={{ ...sectionTitle, borderColor: '#ccccff' }}>🏢 Office / Workplace Contact</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '1rem', marginTop: '-0.5rem' }}>
          Only if tenant is employed — fill manager or supervisor contact
        </p>

        <label style={label}>Office / Company Name (कार्यालयको नाम)</label>
        <input style={input} name="office_name" value={form.office_name} onChange={handleChange} placeholder="e.g. ABC School, XYZ Company, Nepal Police" />

        <label style={label}>Contact Person at Office (सम्पर्क व्यक्ति)</label>
        <input style={input} name="office_contact_person" value={form.office_contact_person} onChange={handleChange} placeholder="e.g. Principal, Manager, Supervisor" />

        <label style={label}>Office Phone Number (कार्यालयको फोन)</label>
        <input style={input} name="office_contact_phone" value={form.office_contact_phone} onChange={handleChange} placeholder="e.g. 01-4567890 or 9801234567" />
      </div>

      {/* Room Info */}
      <div style={{ ...section, borderColor: '#aad4ff', background: '#f0f8ff' }}>
        <h2 style={{ ...sectionTitle, borderColor: '#cce4ff' }}>🏠 Room and Lease Information / कोठा र सम्झौता</h2>

        <label style={label}>Select Room (कोठा छान्नुस्) *</label>
        <select style={input} name="room_id" value={form.room_id} onChange={handleChange}>
          <option value="">-- Select a vacant room --</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              {getBuildingName(room.building_id)} — {getRoomType(room.room_type)} {room.room_number}
            </option>
          ))}
        </select>

        <label style={label}>Agreed Rent Amount — Rs. (सहमत भाडा रकम) *</label>
        <input style={{ ...input, fontSize: '18px', fontWeight: 'bold', border: '2px solid #1a1a2e' }} type="number" name="rent_amount" value={form.rent_amount} onChange={handleChange} placeholder="Type exact agreed rent e.g. 7677" min="0" />
        <p style={{ color: '#888', fontSize: '12px', marginTop: '-10px', marginBottom: '14px' }}>
          Enter the actual agreed rent — any amount is fine e.g. 7500, 8250, 12000
        </p>

        <label style={label}>Room Owner Name (घरधनीको नाम)</label>
        <input style={input} name="room_owner_name" value={form.room_owner_name} onChange={handleChange} />

        <label style={label}>Number of People in Room (कोठामा बस्नेको संख्या)</label>
        <input style={input} type="number" name="number_of_people" value={form.number_of_people} onChange={handleChange} min="1" />

        <label style={label}>Lease Start Date (सम्झौता सुरु मिति)</label>
        <input style={input} type="date" name="lease_start" value={form.lease_start} onChange={handleChange} />

        <label style={label}>Lease End Date (सम्झौता सकिने मिति)</label>
        <input style={input} type="date" name="lease_end" value={form.lease_end} onChange={handleChange} />

        <label style={label}>Advance Amount — Rs. (अग्रिम रकम)</label>
        <input style={input} type="number" name="advance_amount" value={form.advance_amount} onChange={handleChange} placeholder="Enter advance amount paid — e.g. 15000" min="0" />
        <p style={{ color: '#888', fontSize: '12px', marginTop: '-10px', marginBottom: '14px' }}>
          Enter any amount — 0 if no advance was taken
        </p>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: message.includes('Error') ? '#ffe5e5' : '#e5ffe5',
          color: message.includes('Error') ? '#c00' : '#060',
          marginBottom: '1rem',
          fontWeight: '600',
        }}>
          {message.includes('Error') ? '❌ ' : '✅ '}{message}
        </div>
      )}

      <button
        onClick={handleSubmit}
        style={{
          background: '#1a1a2e',
          color: 'white',
          padding: '14px 32px',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          width: '100%',
          fontWeight: '700',
          marginBottom: '2rem',
        }}
      >
        ✅ Save Tenant Information / भाडावालाको जानकारी सेभ गर्नुस्
      </button>

      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <a href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</a>
      </p>

    </main>
  )
}
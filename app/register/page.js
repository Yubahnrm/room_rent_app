'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    father_name: '',
    grandfather_name: '',
    phone: '',
    email: '',
    profession: '',
    citizenship_id: '',
    temporary_address: '',
    permanent_address: '',
    number_of_people: 1,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    office_name: '',
    office_contact_person: '',
    office_contact_phone: '',
  })

  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.full_name || !form.phone) {
      setMessage('Please fill at least your full name and phone number.')
      return
    }

    const { error } = await supabase.from('tenant_registrations').insert([{
      ...form,
      number_of_people: Number(form.number_of_people) || 1,
      status: 'pending',
    }])

    if (error) {
      setMessage('Error: ' + error.message)
      return
    }

    setSubmitted(true)
  }

  const input = {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    marginBottom: '14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
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
    background: 'white',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '1.2rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
  }

  const sectionTitle = {
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '16px',
    color: '#1a1a2e',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '8px',
  }

  if (submitted) {
    return (
      <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '60px', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>Submitted Successfully!</h2>
          <h3 style={{ color: '#c9a84c' }}>सफलतापूर्वक पठाइयो!</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '0.5rem' }}>
            Your information has been received. The owner will contact you shortly to confirm your room.
          </p>
          <p style={{ color: '#888', fontSize: '13px' }}>
            तपाईंको जानकारी प्राप्त भयो। घरधनीले छिट्टै सम्पर्क गर्नुहुनेछ।
          </p>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f4f6fb', borderRadius: '8px', fontSize: '13px', color: '#555' }}>
            <div style={{ color: '#c9a84c', fontSize: '20px', marginBottom: '4px' }}>ॐ</div>
            <div style={{ fontStyle: 'italic' }}>अतिथि देवो भव</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>HNRM Family — Yubaraj Timilsina</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

<div style={{ background: '#1a1a2e', padding: '1rem 1.5rem', textAlign: 'center' }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>🏠 HNRM Family — Tenant Registration</div>
        <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>Please fill your details carefully — कृपया आफ्नो विवरण ध्यानपूर्वक भर्नुहोस्</div>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>

        {/* Personal Info */}
        <div style={section}>
          <h2 style={sectionTitle}>👤 Personal Information / व्यक्तिगत जानकारी</h2>

          <label style={label}>Full Name (पूरा नाम) *</label>
          <input style={input} name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Ram Bahadur Thapa / राम बहादुर थापा" />

          <label style={label}>Father's Name (बुबाको नाम)</label>
          <input style={input} name="father_name" value={form.father_name} onChange={handleChange} placeholder="e.g. Hari Bahadur Thapa" />

          <label style={label}>Grandfather's Name (हजुरबुबाको नाम)</label>
          <input style={input} name="grandfather_name" value={form.grandfather_name} onChange={handleChange} placeholder="e.g. Kalu Bahadur Thapa" />

          <label style={label}>Profession (पेशा)</label>
          <input style={input} name="profession" value={form.profession} onChange={handleChange} placeholder="e.g. Teacher, Business, Student, Labour" />

          <label style={label}>Citizenship ID / National ID (नागरिकता नम्बर)</label>
          <input style={input} name="citizenship_id" value={form.citizenship_id} onChange={handleChange} placeholder="e.g. 12-34-56-78901" />
        </div>

        {/* Contact */}
        <div style={section}>
          <h2 style={sectionTitle}>📞 Contact / सम्पर्क जानकारी</h2>

          <label style={label}>Phone Number (फोन नम्बर) *</label>
          <input style={input} name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9841234567" />

          <label style={label}>Email Address (इमेल) — optional</label>
          <input style={input} name="email" value={form.email} onChange={handleChange} placeholder="e.g. ram@gmail.com" />

          <label style={label}>Temporary Address — where you live now (अस्थायी ठेगाना)</label>
          <input style={input} name="temporary_address" value={form.temporary_address} onChange={handleChange} placeholder="e.g. Kathmandu-10, Baneshwor" />

          <label style={label}>Permanent Address — hometown (स्थायी ठेगाना)</label>
          <input style={input} name="permanent_address" value={form.permanent_address} onChange={handleChange} placeholder="e.g. Sindhupalchok-5, Melamchi" />

          <label style={label}>Number of People Moving In (कोठामा बस्नेको संख्या)</label>
          <input style={input} type="number" name="number_of_people" value={form.number_of_people} onChange={handleChange} min="1" />
        </div>

        {/* Emergency */}
        <div style={{ ...section, borderColor: '#ffaaaa' }}>
          <h2 style={{ ...sectionTitle, borderColor: '#ffcccc' }}>🚨 Emergency Contact / आपतकालीन सम्पर्क</h2>
          <p style={{ color: '#888', fontSize: '13px', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            Family member we can contact in case of emergency
          </p>

          <label style={label}>Name (नाम)</label>
          <input style={input} name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} placeholder="e.g. Hari Bahadur Thapa" />

          <label style={label}>Relation (नाता) — Father / Mother / Brother / Sister / Uncle</label>
          <input style={input} name="emergency_contact_relation" value={form.emergency_contact_relation} onChange={handleChange} placeholder="e.g. Father, Mother, Brother" />

          <label style={label}>Phone Number (फोन नम्बर)</label>
          <input style={input} name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} placeholder="e.g. 9851234567" />
        </div>

        {/* Office */}
        <div style={{ ...section, borderColor: '#aaaaff' }}>
          <h2 style={{ ...sectionTitle, borderColor: '#ccccff' }}>🏢 Office / Workplace — optional</h2>
          <p style={{ color: '#888', fontSize: '13px', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            Only fill if you are employed somewhere
          </p>

          <label style={label}>Office / Company Name (कार्यालयको नाम)</label>
          <input style={input} name="office_name" value={form.office_name} onChange={handleChange} placeholder="e.g. ABC School, XYZ Company" />

          <label style={label}>Supervisor / Manager Name (माथिल्लो अधिकारीको नाम)</label>
          <input style={input} name="office_contact_person" value={form.office_contact_person} onChange={handleChange} placeholder="e.g. Principal, Manager, Supervisor" />

          <label style={label}>Office Phone (कार्यालयको फोन)</label>
          <input style={input} name="office_contact_phone" value={form.office_contact_phone} onChange={handleChange} placeholder="e.g. 01-4567890" />
        </div>

        {message && (
          <div style={{ padding: '12px', borderRadius: '8px', background: message.includes('Error') ? '#ffe5e5' : '#e5ffe5', color: message.includes('Error') ? '#c00' : '#060', marginBottom: '1rem', fontWeight: '600' }}>
            {message}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{ background: '#1a1a2e', color: 'white', padding: '14px 32px', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer', width: '100%', fontWeight: '700', marginBottom: '2rem' }}
        >
          ✅ Submit Registration / दर्ता गर्नुस्
        </button>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', marginBottom: '2rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '18px' }}>ॐ अतिथि देवो भव 🙏</div>
          <div>HNRM Family — Human Nature Reality Movement</div>
          <a href="https://www.yubarajtimilsina.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c' }}>www.yubarajtimilsina.com.np</a>
        </div>

      </div>
    </main>
  )
}
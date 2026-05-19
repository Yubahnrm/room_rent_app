'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Register() {
  const [agreed, setAgreed] = useState(false)
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

  if (submitted) {
    return (
      <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '60px', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>Submitted Successfully!</h2>
          <h3 style={{ color: '#c9a84c' }}>सफलतापूर्वक पठाइयो!</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '0.5rem' }}>Your information has been received. The owner will contact you shortly.</p>
          <p style={{ color: '#888', fontSize: '13px' }}>तपाईंको जानकारी प्राप्त भयो। घरधनीले छिट्टै सम्पर्क गर्नुहुनेछ।</p>
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
        <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>Please fill your details carefully</div>
        <a href="/noticeboard" style={{ display: 'inline-block', marginTop: '8px', color: '#c9a84c', fontSize: '12px', border: '1px solid #c9a84c', padding: '3px 14px', borderRadius: '20px', textDecoration: 'none' }}>
          📋 Read House Rules First
        </a>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>

        {/* Agreement Checkbox */}
        {!agreed && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #c9a84c', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '40px', marginBottom: '1rem' }}>📋</div>
            <h2 style={{ color: '#1a1a2e', margin: '0 0 1rem', fontSize: '18px' }}>Before You Register</h2>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Please make sure you have read and understood all house rules, charges, and the HNRM Family guidelines before proceeding.
            </p>
            <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              दर्ता गर्नु अघि कृपया घरका सबै नियमहरू, शुल्कहरू र HNRM परिवारका दिशानिर्देशहरू पढ्नुभएको छ भनी निश्चित गर्नुहोस्।
            </p>

            <a href="/noticeboard" style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#0070f3', fontSize: '14px', fontWeight: '600', textDecoration: 'underline' }}>
              👉 Click here to read House Rules and Charges
            </a>

            <div style={{ background: '#fff8e1', borderRadius: '10px', padding: '1rem', border: '2px solid #ffd54f', marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', lineHeight: '1.6' }}>
                  I have read and understood all house rules, charges and guidelines of HNRM Family. I agree to follow them during my stay.
                  <br />
                  <span style={{ color: '#666', fontWeight: '400', fontSize: '13px' }}>
                    मैले HNRM परिवारका सबै घर नियमहरू, शुल्कहरू र दिशानिर्देशहरू पढेको र बुझेको छु। मैले आफ्नो बसाइमा तिनीहरू पालना गर्न सहमत छु।
                  </span>
                </span>
              </label>
            </div>

            <button
              onClick={() => setAgreed(true)}
              disabled={!agreed}
              style={{
                background: agreed ? '#1a1a2e' : '#ccc',
                color: 'white',
                padding: '12px 32px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                cursor: agreed ? 'pointer' : 'not-allowed',
                width: '100%',
                fontWeight: '700',
              }}
            >
              {agreed ? '✅ Proceed to Registration Form' : '☐ Please tick the checkbox above first'}
            </button>
          </div>
        )}

        {/* Registration Form — only shows after checkbox ticked */}
        {agreed && (
          <>
            <div style={{ background: '#e5ffe5', borderRadius: '10px', padding: '10px 14px', marginBottom: '1.5rem', fontSize: '13px', color: '#060', fontWeight: '600' }}>
              ✅ You have agreed to house rules. Please fill your details below.
            </div>

            <div style={section}>
              <h2 style={{ marginTop: 0, fontSize: '16px', color: '#1a1a2e', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '1rem' }}>👤 Personal Information</h2>
              <label style={label}>Full Name (पूरा नाम) *</label>
              <input style={input} name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Ram Bahadur Thapa" />
              <label style={label}>Father's Name (बुबाको नाम)</label>
              <input style={input} name="father_name" value={form.father_name} onChange={handleChange} placeholder="e.g. Hari Bahadur Thapa" />
              <label style={label}>Grandfather's Name (हजुरबुबाको नाम)</label>
              <input style={input} name="grandfather_name" value={form.grandfather_name} onChange={handleChange} placeholder="e.g. Kalu Bahadur Thapa" />
              <label style={label}>Profession (पेशा)</label>
              <input style={input} name="profession" value={form.profession} onChange={handleChange} placeholder="e.g. Teacher, Business, Student" />
              <label style={label}>Citizenship ID (नागरिकता नम्बर)</label>
              <input style={input} name="citizenship_id" value={form.citizenship_id} onChange={handleChange} placeholder="e.g. 12-34-56-78901" />
            </div>

            <div style={section}>
              <h2 style={{ marginTop: 0, fontSize: '16px', color: '#1a1a2e', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '1rem' }}>📞 Contact Information</h2>
              <label style={label}>Phone Number (फोन नम्बर) *</label>
              <input style={input} name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9841234567" />
              <label style={label}>Email (इमेल) — optional</label>
              <input style={input} name="email" value={form.email} onChange={handleChange} placeholder="e.g. ram@gmail.com" />
              <label style={label}>Temporary Address (अस्थायी ठेगाना)</label>
              <input style={input} name="temporary_address" value={form.temporary_address} onChange={handleChange} placeholder="e.g. Kathmandu-10, Baneshwor" />
              <label style={label}>Permanent Address (स्थायी ठेगाना)</label>
              <input style={input} name="permanent_address" value={form.permanent_address} onChange={handleChange} placeholder="e.g. Sindhupalchok-5, Melamchi" />
              <label style={label}>Number of People Moving In</label>
              <input style={input} type="number" name="number_of_people" value={form.number_of_people} onChange={handleChange} min="1" />
            </div>

            <div style={{ ...section, borderColor: '#ffaaaa' }}>
              <h2 style={{ marginTop: 0, fontSize: '16px', color: '#c00', borderBottom: '2px solid #ffcccc', paddingBottom: '8px', marginBottom: '1rem' }}>🚨 Emergency Contact</h2>
              <label style={label}>Name (नाम)</label>
              <input style={input} name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} placeholder="e.g. Hari Bahadur Thapa" />
              <label style={label}>Relation (नाता)</label>
              <input style={input} name="emergency_contact_relation" value={form.emergency_contact_relation} onChange={handleChange} placeholder="e.g. Father, Mother, Brother" />
              <label style={label}>Phone (फोन)</label>
              <input style={input} name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} placeholder="e.g. 9851234567" />
            </div>

            <div style={{ ...section, borderColor: '#aaaaff' }}>
              <h2 style={{ marginTop: 0, fontSize: '16px', color: '#0070f3', borderBottom: '2px solid #ccccff', paddingBottom: '8px', marginBottom: '1rem' }}>🏢 Office / Workplace — optional</h2>
              <label style={label}>Office Name (कार्यालयको नाम)</label>
              <input style={input} name="office_name" value={form.office_name} onChange={handleChange} placeholder="e.g. ABC School, XYZ Company" />
              <label style={label}>Contact Person (सम्पर्क व्यक्ति)</label>
              <input style={input} name="office_contact_person" value={form.office_contact_person} onChange={handleChange} placeholder="e.g. Principal, Manager" />
              <label style={label}>Office Phone (फोन)</label>
              <input style={input} name="office_contact_phone" value={form.office_contact_phone} onChange={handleChange} placeholder="e.g. 01-4567890" />
            </div>

            {message && (
              <div style={{ padding: '12px', borderRadius: '8px', background: '#ffe5e5', color: '#c00', marginBottom: '1rem', fontWeight: '600' }}>
                {message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              style={{ background: '#1a1a2e', color: 'white', padding: '14px 32px', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer', width: '100%', fontWeight: '700', marginBottom: '2rem' }}
            >
              ✅ Submit Registration / दर्ता गर्नुस्
            </button>

            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <a href="/noticeboard" style={{ color: '#0070f3' }}>← Back to House Rules</a>
            </p>
          </>
        )}

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', marginBottom: '2rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '18px' }}>ॐ अतिथि देवो भव</div>
          <div>HNRM Family — Human Nature Reality Movement</div>
          <a href="https://www.yubarajtimilsina.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c' }}>www.yubarajtimilsina.com.np</a>
        </div>

      </div>
    </main>
  )
}
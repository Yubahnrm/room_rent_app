'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function NoticeBoard() {
  const [notices, setNotices] = useState([])
  const [complaint, setComplaint] = useState({
    tenant_name: '',
    room_number: '',
    phone: '',
    complaint_type: 'General',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchNotices()
  }, [])

  async function fetchNotices() {
    const { data } = await supabase.from('notices').select('*').eq('is_active', true).order('notice_type')
    setNotices(data || [])
  }

  function handleChange(e) {
    setComplaint({ ...complaint, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!complaint.tenant_name || !complaint.room_number || !complaint.description) {
      setMessage('Please fill your name, room number and describe the issue.')
      return
    }
    const { error } = await supabase.from('complaints').insert([complaint])
    if (error) {
      setMessage('Error: ' + error.message)
      return
    }
    setSubmitted(true)
  }

  const charges = notices.filter(n => n.notice_type === 'charge')
  const rules = notices.filter(n => n.notice_type === 'rule')
  const general = notices.filter(n => n.notice_type === 'general')

  const input = {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    background: 'white',
  }

  const label = {
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#333',
    display: 'block',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

      <div style={{ background: '#1a1a2e', padding: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '22px' }}>📋 Notice Board — HNRM Family</h1>
        <p style={{ color: '#aaa', margin: '4px 0 0', fontSize: '13px' }}>Important information for all tenants</p>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>

        {/* Big Welcome Message */}
        <div style={{ background: 'linear-gradient(135deg, #2c1810, #1a1a2e)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', border: '2px solid #c9a84c' }}>
          <div style={{ fontSize: '32px', color: '#c9a84c', marginBottom: '8px' }}>ॐ</div>
          <div style={{ color: '#c9a84c', fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '8px' }}>अतिथि देवो भव</div>
          <p style={{ color: '#e8d5a3', fontSize: '14px', lineHeight: '1.8', margin: '0 0 10px' }}>
            Welcome to HNRM Family. We are happy to have you as our guest.
          </p>
          <div style={{ background: 'rgba(201,168,76,0.15)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(201,168,76,0.3)' }}>
            <p style={{ color: '#c9a84c', fontSize: '15px', fontWeight: '700', margin: '0 0 8px', fontStyle: 'italic' }}>
              "Your behaviour is your identity."
            </p>
            <p style={{ color: '#e8d5a3', fontSize: '13px', margin: '0 0 8px', lineHeight: '1.7' }}>
              We love polite, calm and honest guests. We treat every tenant as family — with respect, care and warmth.
            </p>
            <p style={{ color: '#ff9999', fontSize: '13px', fontWeight: '600', margin: 0, lineHeight: '1.7' }}>
              Important: Anyone found violating house rules will be required to vacate the room — with good lessons learned and good wishes from our family.
            </p>
          </div>
        </div>

        {/* Monthly Charges */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '17px', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
            💰 Monthly Charges (मासिक शुल्क)
          </h2>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '1rem', marginTop: '-0.5rem' }}>
            Charges may change — always confirm with owner
          </p>
          {charges.map(notice => (
            <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', marginBottom: '8px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <span style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>{notice.title}</span>
              <span style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '14px', background: '#fff8e1', padding: '3px 10px', borderRadius: '8px', border: '1px solid #ffd54f' }}>{notice.content}</span>
            </div>
          ))}
          {charges.length === 0 && <p style={{ color: '#888', fontSize: '13px' }}>No charges listed yet.</p>}
        </div>

        {/* House Rules */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '17px', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
            📜 House Rules (घरका नियमहरू)
          </h2>
          {rules.map((notice, index) => (
            <div key={notice.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 12px', marginBottom: '8px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <div style={{ background: '#1a1a2e', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                {index + 1}
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#333', fontSize: '14px' }}>{notice.title}</div>
                <div style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>{notice.content}</div>
              </div>
            </div>
          ))}
          {rules.length === 0 && <p style={{ color: '#888', fontSize: '13px' }}>No rules listed yet.</p>}
        </div>

        {/* General Notices */}
        {general.length > 0 && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '17px', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
              📢 General Notices
            </h2>
            {general.map(notice => (
              <div key={notice.id} style={{ padding: '10px 12px', marginBottom: '8px', background: '#fff8e1', borderRadius: '8px', border: '1px solid #ffd54f' }}>
                <div style={{ fontWeight: '700', color: '#333', fontSize: '14px' }}>{notice.title}</div>
                <div style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>{notice.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Complaint Form */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #eee' }}>
          <h2 style={{ margin: '0 0 0.5rem', color: '#1a1a2e', fontSize: '17px' }}>📝 Submit a Complaint or Request</h2>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '1rem', lineHeight: '1.6' }}>
            If you have any problem — maintenance issue, neighbour dispute, water, electricity, or anything — please write here calmly before it becomes a bigger problem. We will respond as soon as possible.
          </p>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '1rem' }}>
            कुनै पनि समस्या भएमा — कृपया यहाँ लेख्नुहोस्। हामी सकेसम्म चाँडो जवाफ दिनेछौं।
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#e5ffe5', borderRadius: '10px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
              <h3 style={{ color: '#060', margin: '0 0 8px' }}>Submitted Successfully!</h3>
              <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
                Your complaint has been sent to the owner. Thank you for letting us know calmly.
              </p>
              <button onClick={() => { setSubmitted(false); setComplaint({ tenant_name: '', room_number: '', phone: '', complaint_type: 'General', description: '' }) }} style={{ marginTop: '1rem', background: '#1a1a2e', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                Submit Another
              </button>
            </div>
          ) : (
            <>
              <label style={label}>Your Full Name (तपाईंको नाम) *</label>
              <input style={input} name="tenant_name" value={complaint.tenant_name} onChange={handleChange} placeholder="e.g. Ram Bahadur Thapa" />

              <label style={label}>Your Room Number (कोठा नम्बर) *</label>
              <input style={input} name="room_number" value={complaint.room_number} onChange={handleChange} placeholder="e.g. 05 or Shop-1 or Flat-2" />

              <label style={label}>Your Phone Number (फोन नम्बर)</label>
              <input style={input} name="phone" value={complaint.phone} onChange={handleChange} placeholder="e.g. 9841234567" />

              <label style={label}>Type of Issue (समस्याको प्रकार)</label>
              <select style={input} name="complaint_type" value={complaint.complaint_type} onChange={handleChange}>
                <option>General</option>
                <option>Maintenance / Repair</option>
                <option>Water Problem</option>
                <option>Electricity Problem</option>
                <option>Noise / Neighbour Issue</option>
                <option>Cleanliness</option>
                <option>Security</option>
                <option>Billing Question</option>
                <option>Other</option>
              </select>

              <label style={label}>Describe the Issue (समस्याको विवरण) *</label>
              <textarea
                name="description"
                value={complaint.description}
                onChange={handleChange}
                placeholder="Please describe your problem calmly and clearly... / कृपया आफ्नो समस्या शान्तरूपमा र स्पष्टरूपमा लेख्नुहोस्..."
                rows={5}
                style={{ ...input, resize: 'vertical', lineHeight: '1.6' }}
              />

              {message && (
                <div style={{ padding: '10px', borderRadius: '8px', background: '#ffe5e5', color: '#c00', marginBottom: '1rem', fontSize: '13px' }}>
                  {message}
                </div>
              )}

              <button
                onClick={handleSubmit}
                style={{ background: '#1a1a2e', color: 'white', padding: '12px 32px', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', width: '100%', fontWeight: '700' }}
              >
                Submit Complaint / उजुरी पठाउनुस्
              </button>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', paddingBottom: '2rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '18px', marginBottom: '4px' }}>ॐ अतिथि देवो भव 🙏</div>
          <div>HNRM Family — Human Nature Reality Movement</div>
          <a href="https://www.yubarajtimilsina.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c' }}>www.yubarajtimilsina.com.np</a>
        </div>

      </div>
    </main>
  )
}
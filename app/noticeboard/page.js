'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function NoticeBoard() {
  const [notices, setNotices] = useState([])
  const [lang, setLang] = useState('np')
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
      setMessage(lang === 'np' ? 'कृपया नाम, कोठा नम्बर र समस्याको विवरण भर्नुहोस्।' : 'Please fill your name, room number and describe the issue.')
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

  const t = {
    title: lang === 'np' ? '📋 सूचना पाटी — HNRM परिवार' : '📋 Notice Board — HNRM Family',
    subtitle: lang === 'np' ? 'सबै भाडावालाहरूका लागि महत्त्वपूर्ण सूचना' : 'Important information for all tenants',
    quote: lang === 'np' ? '"तपाईंको व्यवहार नै तपाईंको पहिचान हो।"' : '"Your behaviour is your identity."',
    welcome: lang === 'np' ? 'हामी शान्त, विनम्र र इमानदार भाडावालालाई माया गर्छौं। हामी हरेक भाडावालालाई परिवारको सदस्यझैं — सम्मान, स्याहार र न्यानोपनका साथ व्यवहार गर्छौं।' : 'We love polite, calm and honest guests. We treat every tenant as family — with respect, care and warmth.',
    warning: lang === 'np' ? 'महत्त्वपूर्ण: घर नियम उल्लंघन गर्नेलाई कोठा छाड्नु पर्नेछ — राम्रो पाठ र हाम्रो शुभकामनाका साथ।' : 'Important: Anyone found violating house rules will be required to vacate — with good lessons and good wishes.',
    charges: lang === 'np' ? '💰 मासिक शुल्कहरू' : '💰 Monthly Charges',
    chargesNote: lang === 'np' ? 'शुल्कहरू परिवर्तन हुन सक्छन् — घरधनीसँग पुष्टि गर्नुहोस्' : 'Charges may change — always confirm with owner',
    rules: lang === 'np' ? '📜 घरका नियमहरू' : '📜 House Rules',
    general: lang === 'np' ? '📢 सामान्य सूचनाहरू' : '📢 General Notices',
    complaintTitle: lang === 'np' ? '📝 उजुरी वा अनुरोध पठाउनुस्' : '📝 Submit a Complaint or Request',
    complaintDesc: lang === 'np' ? 'कुनै पनि समस्या भएमा — कृपया यहाँ शान्तरूपमा लेख्नुहोस्। हामी सकेसम्म चाँडो जवाफ दिनेछौं।' : 'If you have any problem — please write here calmly. We will respond as soon as possible.',
    name: lang === 'np' ? 'तपाईंको पूरा नाम *' : 'Your Full Name *',
    room: lang === 'np' ? 'कोठा नम्बर *' : 'Room Number *',
    phone: lang === 'np' ? 'फोन नम्बर' : 'Phone Number',
    type: lang === 'np' ? 'समस्याको प्रकार' : 'Type of Issue',
    desc: lang === 'np' ? 'समस्याको विवरण *' : 'Describe the Issue *',
    submit: lang === 'np' ? 'उजुरी पठाउनुस्' : 'Submit Complaint',
    successTitle: lang === 'np' ? 'सफलतापूर्वक पठाइयो!' : 'Submitted Successfully!',
    successMsg: lang === 'np' ? 'तपाईंको उजुरी घरधनीलाई पठाइयो। शान्तरूपमा जानकारी दिनुभएकोमा धन्यवाद।' : 'Your complaint has been sent to the owner. Thank you for letting us know calmly.',
    submitAnother: lang === 'np' ? 'अर्को उजुरी पठाउनुस्' : 'Submit Another',
    register: lang === 'np' ? '📝 दर्ता गर्न अगाडि बढ्नुस्' : '📝 Proceed to Register',
    registerDesc: lang === 'np' ? 'सबै नियम र शुल्कहरू पढेर बुझेपछि दर्ता गर्न सक्नुहुन्छ।' : 'If you have read and understood all house rules and charges, you can now register.',
    readyTitle: lang === 'np' ? 'दर्ता गर्न तयार हुनुहुन्छ?' : 'Ready to Register?',
  }

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

  const label = { fontWeight: 'bold', fontSize: '13px', color: '#333', display: 'block' }

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

      {/* Header with language toggle */}
      <div style={{ background: '#1a1a2e', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>{t.title}</div>
          <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>{t.subtitle}</div>
        </div>
        <button
          onClick={() => setLang(lang === 'np' ? 'en' : 'np')}
          style={{ background: 'rgba(201,168,76,0.3)', color: '#c9a84c', border: '1px solid #c9a84c', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
        >
          {lang === 'np' ? 'English' : 'नेपाली'}
        </button>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>

        {/* Welcome message */}
        <div style={{ background: 'rgba(201,168,76,0.1)', borderRadius: '14px', padding: '1.2rem', marginBottom: '1.5rem', border: '1px solid rgba(201,168,76,0.3)', textAlign: 'center' }}>
          <p style={{ color: '#c9a84c', fontSize: '15px', fontWeight: '700', margin: '0 0 8px', fontStyle: 'italic' }}>{t.quote}</p>
          <p style={{ color: '#555', fontSize: '13px', margin: '0 0 8px', lineHeight: '1.7' }}>{t.welcome}</p>
          <p style={{ color: '#e03030', fontSize: '13px', fontWeight: '600', margin: 0, lineHeight: '1.7' }}>{t.warning}</p>
        </div>

        {/* Monthly Charges */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 0.5rem', color: '#1a1a2e', fontSize: '16px' }}>{t.charges}</h2>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '1rem' }}>{t.chargesNote}</p>
          {charges.map(notice => (
            <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', marginBottom: '8px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <span style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>{notice.title}</span>
              <span style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '14px', background: '#fff8e1', padding: '3px 10px', borderRadius: '8px', border: '1px solid #ffd54f' }}>{notice.content}</span>
            </div>
          ))}
          {charges.length === 0 && <p style={{ color: '#888', fontSize: '13px' }}>{lang === 'np' ? 'शुल्क सूची छैन।' : 'No charges listed yet.'}</p>}
        </div>

        {/* House Rules */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '16px' }}>{t.rules}</h2>
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
          {rules.length === 0 && <p style={{ color: '#888', fontSize: '13px' }}>{lang === 'np' ? 'नियमहरू छैनन्।' : 'No rules listed yet.'}</p>}
        </div>

        {/* General Notices */}
        {general.length > 0 && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 1rem', color: '#1a1a2e', fontSize: '16px' }}>{t.general}</h2>
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
          <h2 style={{ margin: '0 0 0.5rem', color: '#1a1a2e', fontSize: '16px' }}>{t.complaintTitle}</h2>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '1.2rem', lineHeight: '1.6' }}>{t.complaintDesc}</p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#e5ffe5', borderRadius: '10px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
              <h3 style={{ color: '#060', margin: '0 0 8px' }}>{t.successTitle}</h3>
              <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>{t.successMsg}</p>
              <button onClick={() => { setSubmitted(false); setComplaint({ tenant_name: '', room_number: '', phone: '', complaint_type: 'General', description: '' }) }} style={{ marginTop: '1rem', background: '#1a1a2e', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                {t.submitAnother}
              </button>
            </div>
          ) : (
            <>
              <label style={label}>{t.name}</label>
              <input style={input} name="tenant_name" value={complaint.tenant_name} onChange={handleChange} placeholder={lang === 'np' ? 'जस्तै: राम बहादुर थापा' : 'e.g. Ram Bahadur Thapa'} />

              <label style={label}>{t.room}</label>
              <input style={input} name="room_number" value={complaint.room_number} onChange={handleChange} placeholder={lang === 'np' ? 'जस्तै: ०५ वा Shop-1' : 'e.g. 05 or Shop-1'} />

              <label style={label}>{t.phone}</label>
              <input style={input} name="phone" value={complaint.phone} onChange={handleChange} placeholder={lang === 'np' ? 'जस्तै: ९८४१२३४५६७' : 'e.g. 9841234567'} />

              <label style={label}>{t.type}</label>
              <select style={input} name="complaint_type" value={complaint.complaint_type} onChange={handleChange}>
                <option>{lang === 'np' ? 'सामान्य' : 'General'}</option>
                <option>{lang === 'np' ? 'मर्मत / मर्मतसम्भार' : 'Maintenance / Repair'}</option>
                <option>{lang === 'np' ? 'पानी समस्या' : 'Water Problem'}</option>
                <option>{lang === 'np' ? 'बिजुली समस्या' : 'Electricity Problem'}</option>
                <option>{lang === 'np' ? 'आवाज / छिमेकी समस्या' : 'Noise / Neighbour Issue'}</option>
                <option>{lang === 'np' ? 'सरसफाई' : 'Cleanliness'}</option>
                <option>{lang === 'np' ? 'सुरक्षा' : 'Security'}</option>
                <option>{lang === 'np' ? 'बिल प्रश्न' : 'Billing Question'}</option>
                <option>{lang === 'np' ? 'अन्य' : 'Other'}</option>
              </select>

              <label style={label}>{t.desc}</label>
              <textarea
                name="description"
                value={complaint.description}
                onChange={handleChange}
                placeholder={lang === 'np' ? 'कृपया आफ्नो समस्या शान्तरूपमा र स्पष्टरूपमा लेख्नुहोस्...' : 'Please describe your problem calmly and clearly...'}
                rows={5}
                style={{ ...input, resize: 'vertical', lineHeight: '1.6' }}
              />

              {message && (
                <div style={{ padding: '10px', borderRadius: '8px', background: '#ffe5e5', color: '#c00', marginBottom: '1rem', fontSize: '13px' }}>
                  {message}
                </div>
              )}

              <button onClick={handleSubmit} style={{ background: '#1a1a2e', color: 'white', padding: '12px 32px', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', width: '100%', fontWeight: '700' }}>
                {t.submit}
              </button>
            </>
          )}
        </div>

        {/* Register button */}
        <div style={{ background: '#1a1a2e', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'white', margin: '0 0 8px' }}>{t.readyTitle}</h3>
          <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 1rem' }}>{t.registerDesc}</p>
          <a href="/register" style={{ display: 'inline-block', background: '#c9a84c', color: '#1a1a2e', padding: '12px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
            {t.register}
          </a>
        </div>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', paddingBottom: '2rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '16px', marginBottom: '4px' }}>ॐ अतिथि देवो भव</div>
          <div>HNRM Family — Human Nature Reality Movement</div>
          <a href="https://www.yubarajtimilsina.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c' }}>www.yubarajtimilsina.com.np</a>
        </div>

      </div>
    </main>
  )
}
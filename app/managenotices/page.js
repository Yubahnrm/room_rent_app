'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function ManageNotices() {
  const [notices, setNotices] = useState([])
  const [complaints, setComplaints] = useState([])
  const [editing, setEditing] = useState(null)
  const [newNotice, setNewNotice] = useState({ title: '', content: '', notice_type: 'general' })
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState('notices')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: n } = await supabase.from('notices').select('*').order('notice_type')
    const { data: c } = await supabase.from('complaints').select('*').order('created_at', { ascending: false })
    setNotices(n || [])
    setComplaints(c || [])
  }

  async function addNotice() {
    if (!newNotice.title || !newNotice.content) {
      setMessage('Please fill title and content.')
      return
    }
    await supabase.from('notices').insert([{ ...newNotice, is_active: true }])
    setMessage('Notice added!')
    setNewNotice({ title: '', content: '', notice_type: 'general' })
    fetchAll()
  }

  async function saveEdit() {
    await supabase.from('notices').update({
      title: editing.title,
      content: editing.content,
      notice_type: editing.notice_type,
      is_active: editing.is_active,
    }).eq('id', editing.id)
    setMessage('Notice updated!')
    setEditing(null)
    fetchAll()
  }

  async function deleteNotice(id) {
    if (!confirm('Delete this notice?')) return
    await supabase.from('notices').delete().eq('id', id)
    fetchAll()
  }

  async function updateComplaintStatus(id, status) {
    await supabase.from('complaints').update({ status }).eq('id', id)
    fetchAll()
  }

  async function deleteComplaint(id) {
    if (!confirm('Delete this complaint?')) return
    await supabase.from('complaints').delete().eq('id', id)
    fetchAll()
  }

  const input = {
    width: '100%',
    padding: '8px',
    marginTop: '4px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  }

  const pendingComplaints = complaints.filter(c => c.status === 'pending').length

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>📋 Manage Notices and Complaints</h1>

      {message && (
        <div style={{ padding: '10px', borderRadius: '8px', background: '#e5ffe5', color: '#060', marginBottom: '1rem', fontWeight: '600' }}>
          ✅ {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <button onClick={() => setTab('notices')} style={{ padding: '8px 20px', borderRadius: '8px', border: '2px solid', borderColor: tab === 'notices' ? '#1a1a2e' : '#ddd', background: tab === 'notices' ? '#1a1a2e' : 'white', color: tab === 'notices' ? 'white' : '#555', cursor: 'pointer', fontWeight: '600' }}>
          📋 Notices
        </button>
        <button onClick={() => setTab('complaints')} style={{ padding: '8px 20px', borderRadius: '8px', border: '2px solid', borderColor: tab === 'complaints' ? '#1a1a2e' : '#ddd', background: tab === 'complaints' ? '#1a1a2e' : 'white', color: tab === 'complaints' ? 'white' : '#555', cursor: 'pointer', fontWeight: '600', position: 'relative' }}>
          📝 Complaints {pendingComplaints > 0 && <span style={{ background: '#e03030', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', marginLeft: '6px' }}>{pendingComplaints}</span>}
        </button>
      </div>

      {tab === 'notices' && (
        <>
          {/* Add new notice */}
          <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem', border: '1px solid #eee' }}>
            <h2 style={{ marginTop: 0, fontSize: '16px' }}>➕ Add New Notice</h2>
            <label style={{ fontWeight: '600', fontSize: '13px' }}>Type</label>
            <select style={input} value={newNotice.notice_type} onChange={e => setNewNotice({ ...newNotice, notice_type: e.target.value })}>
              <option value="charge">Charge (Monthly fee)</option>
              <option value="rule">House Rule</option>
              <option value="general">General Notice</option>
            </select>
            <label style={{ fontWeight: '600', fontSize: '13px' }}>Title</label>
            <input style={input} value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} placeholder="e.g. Electricity Rate" />
            <label style={{ fontWeight: '600', fontSize: '13px' }}>Content</label>
            <input style={input} value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })} placeholder="e.g. Rs. 17 per unit" />
            <button onClick={addNotice} style={{ background: '#1a1a2e', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              Add Notice
            </button>
          </div>

          {/* Existing notices */}
          {['charge', 'rule', 'general'].map(type => (
            <div key={type} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1a1a2e', fontSize: '15px', marginBottom: '8px' }}>
                {type === 'charge' ? '💰 Charges' : type === 'rule' ? '📜 Rules' : '📢 General'}
              </h3>
              {notices.filter(n => n.notice_type === type).map(notice => (
                <div key={notice.id} style={{ background: 'white', borderRadius: '10px', padding: '1rem', marginBottom: '8px', border: '1px solid #eee', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  {editing?.id === notice.id ? (
                    <div>
                      <input style={input} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
                      <input style={input} value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} />
                      <select style={input} value={editing.notice_type} onChange={e => setEditing({ ...editing, notice_type: e.target.value })}>
                        <option value="charge">Charge</option>
                        <option value="rule">Rule</option>
                        <option value="general">General</option>
                      </select>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={saveEdit} style={{ background: '#1a1a2e', color: 'white', padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Save</button>
                        <button onClick={() => setEditing(null)} style={{ background: '#eee', padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>{notice.title}</div>
                        <div style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>{notice.content}</div>
                        <div style={{ fontSize: '11px', color: notice.is_active ? '#22bb66' : '#e03030', marginTop: '2px' }}>
                          {notice.is_active ? '● Active' : '● Hidden'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setEditing({ ...notice })} style={{ background: '#f4f6fb', color: '#1a1a2e', padding: '5px 12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>✏️ Edit</button>
                        <button onClick={() => supabase.from('notices').update({ is_active: !notice.is_active }).eq('id', notice.id).then(fetchAll)} style={{ background: notice.is_active ? '#fff8e1' : '#e5ffe5', color: '#555', padding: '5px 12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          {notice.is_active ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => deleteNotice(notice.id)} style={{ background: '#fff0f0', color: '#c00', padding: '5px 12px', border: '1px solid #ffaaaa', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {tab === 'complaints' && (
        <>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '1rem' }}>
            {complaints.length} total complaint(s) — {pendingComplaints} pending
          </p>

          {complaints.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '12px', color: '#888' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>📝</div>
              <p>No complaints submitted yet.</p>
            </div>
          )}

          {complaints.map(c => (
            <div key={c.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.2rem',
              marginBottom: '1rem',
              border: '2px solid',
              borderColor: c.status === 'pending' ? '#ffd54f' : c.status === 'resolved' ? '#ccffdd' : '#eee',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>{c.tenant_name}</div>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                    Room {c.room_number} — {c.phone || '—'} — {new Date(c.created_at).toLocaleDateString('en-GB')}
                  </div>
                </div>
                <span style={{
                  padding: '3px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  background: c.status === 'pending' ? '#fff8e1' : c.status === 'resolved' ? '#e5ffe5' : '#f0f0f0',
                  color: c.status === 'pending' ? '#f0a500' : c.status === 'resolved' ? '#22bb66' : '#888',
                }}>
                  {c.status === 'pending' ? '⏳ Pending' : c.status === 'resolved' ? '✅ Resolved' : '📁 Closed'}
                </span>
              </div>

              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px', fontWeight: '600' }}>{c.complaint_type}</div>
                <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>{c.description}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {c.status === 'pending' && (
                  <button onClick={() => updateComplaintStatus(c.id, 'resolved')} style={{ background: '#e5ffe5', color: '#22bb66', padding: '6px 14px', border: '1px solid #ccffdd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                    ✅ Mark Resolved
                  </button>
                )}
                {c.status !== 'closed' && (
                  <button onClick={() => updateComplaintStatus(c.id, 'closed')} style={{ background: '#f0f0f0', color: '#555', padding: '6px 14px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    📁 Close
                  </button>
                )}
                <button onClick={() => deleteComplaint(c.id)} style={{ background: '#fff0f0', color: '#c00', padding: '6px 14px', border: '1px solid #ffaaaa', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </main>
  )
}
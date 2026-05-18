'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function ManageRooms() {
  const [rooms, setRooms] = useState([])
  const [buildings, setBuildings] = useState([])
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: r } = await supabase.from('rooms').select('*').order('building_id')
    const { data: b } = await supabase.from('buildings').select('*')
    setRooms(r || [])
    setBuildings(b || [])
  }

  function getBuildingName(building_id) {
    const b = buildings.find(b => b.id === building_id)
    return b ? b.name : ''
  }

  function getRoomTypeLabel(type) {
    if (type === 'shop') return '🏪 Shop'
    if (type === 'flat') return '🏠 Flat'
    return '🛏️ Room'
  }

  async function handlePhotoUpload(e, room) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setMessage('')
    const fileExt = file.name.split('.').pop()
    const fileName = `room-${room.id}-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('room-photos')
      .upload(fileName, file, { upsert: true })
    if (uploadError) {
      setMessage('Upload error: ' + uploadError.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('room-photos').getPublicUrl(fileName)
    await supabase.from('rooms').update({ photo_url: data.publicUrl }).eq('id', room.id)
    setMessage('Photo uploaded for Room ' + room.room_number)
    setUploading(false)
    fetchAll()
  }

  async function saveDescription(room) {
    await supabase.from('rooms').update({
      description: editing.description,
    }).eq('id', room.id)
    setMessage('Room ' + room.room_number + ' updated!')
    setEditing(null)
    fetchAll()
  }

  async function removePhoto(room) {
    await supabase.from('rooms').update({ photo_url: null }).eq('id', room.id)
    setMessage('Photo removed from Room ' + room.room_number)
    fetchAll()
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>📸 Manage Room Photos</h1>
      <p style={{ color: 'gray' }}>Upload photos and add descriptions for each room</p>

      <div style={{ background: '#fff8e1', border: '1px solid #ffd54f', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '13px' }}>
        <strong>📤 Share this link with potential tenants:</strong>
        <div style={{ marginTop: '4px', color: '#0070f3', fontFamily: 'monospace' }}>
          https://room-rent-app-ecru.vercel.app/rooms
        </div>
      </div>

      {message && (
        <div style={{ padding: '10px', borderRadius: '8px', background: message.includes('error') ? '#ffe5e5' : '#e5ffe5', color: message.includes('error') ? '#c00' : '#060', marginBottom: '1rem', fontWeight: '600' }}>
          {message}
        </div>
      )}

      {rooms.map(room => (
        <div key={room.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

            <div style={{ width: '120px', height: '100px', background: '#f4f6fb', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
              {room.photo_url ? (
                <img src={room.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '32px' }}>
                  {room.room_type === 'shop' ? '🏪' : room.room_type === 'flat' ? '🏠' : '🛏️'}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>
                {getRoomTypeLabel(room.room_type)} {room.room_number} — {getBuildingName(room.building_id)}
              </div>
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>
                Floor: {room.floor} — {room.is_occupied ? '🔴 Occupied' : '🟢 Vacant'}
              </div>

              {editing?.id === room.id ? (
                <div>
                  <textarea
                    value={editing.description || ''}
                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Room description — size, features, what is included..."
                    rows={3}
                    style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button onClick={() => saveDescription(room)} style={{ background: '#1a1a2e', color: 'white', padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Save</button>
                    <button onClick={() => setEditing(null)} style={{ background: '#eee', padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  {room.description && <p style={{ color: '#555', fontSize: '13px', margin: '0 0 6px' }}>{room.description}</p>}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    <button onClick={() => setEditing({ id: room.id, description: room.description || '' })} style={{ background: '#f4f6fb', color: '#1a1a2e', padding: '5px 12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      ✏️ Edit Description
                    </button>
                    <label style={{ background: uploading ? '#eee' : '#0070f3', color: 'white', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                      📸 {uploading ? 'Uploading...' : 'Upload Photo'}
                      <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e, room)} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                    {room.photo_url && (
                      <button onClick={() => removePhoto(room)} style={{ background: '#fff0f0', color: '#c00', padding: '5px 12px', border: '1px solid #ffaaaa', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                        🗑️ Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </main>
  )
}
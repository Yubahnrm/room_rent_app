'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

async function handleLogin() {
    if (!email || !password) {
      setMessage('Please enter email and password.')
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage('Wrong email or password. Try again.')
    } else if (data.session) {
      window.location.href = '/'
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f4ff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '380px',
      }}>
        <h1 style={{ textAlign: 'center', marginTop: 0 }}>🏠</h1>
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Rental Management</h2>
        <p style={{ textAlign: 'center', color: 'gray', marginBottom: '1.5rem' }}>Sign in to continue</p>

        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '4px',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '15px',
            boxSizing: 'border-box',
          }}
        />

        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '4px',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '15px',
            boxSizing: 'border-box',
          }}
        />

        {message && (
          <p style={{
            padding: '10px',
            borderRadius: '6px',
            background: '#ffe5e5',
            color: '#c00',
            marginBottom: '1rem',
            fontSize: '14px'
          }}>{message}</p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            background: '#0070f3',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Sign In
        </button>
      </div>
    </main>
  )
}
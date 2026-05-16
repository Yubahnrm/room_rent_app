'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { useLang } from '../providers'

export default function Summary() {
  const { lang } = useLang()
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState([])
  const [payments, setPayments] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: t } = await supabase.from('tenants').select('*').eq('is_active', true)
    const { data: r } = await supabase.from('rooms').select('*')
    const { data: p } = await supabase.from('payments').select('*').order('created_at', { ascending: false })
    setTenants(t || [])
    setRooms(r || [])
    setPayments(p || [])
  }

  function getRoom(room_id) {
    return rooms.find(r => r.id === Number(room_id))
  }

  function getTenantPayments(tenant_id) {
    return payments.filter(p => p.tenant_id === tenant_id)
  }

  function getLastPayment(tenant_id) {
    const tp = getTenantPayments(tenant_id)
    return tp.length > 0 ? tp[0] : null
  }

  function getTotalDue(tenant_id) {
    return getTenantPayments(tenant_id)
      .filter(p => !p.is_paid)
      .reduce((sum, p) => sum + (p.balance || 0), 0)
  }

  function getTotalPaid(tenant_id) {
    return getTenantPayments(tenant_id)
      .filter(p => p.is_paid)
      .reduce((sum, p) => sum + (p.paid_amount || 0), 0)
  }

  function getStatus(tenant) {
    const due = getTotalDue(tenant.id)
    const last = getLastPayment(tenant.id)
    if (due > 0) return 'due'
    if (!last) return 'no-bill'
    return 'paid'
  }

  const filtered = tenants.filter(t => {
    if (filter === 'all') return true
    if (filter === 'due') return getTotalDue(t.id) > 0
    if (filter === 'paid') return getTotalDue(t.id) === 0 && getLastPayment(t.id)
    if (filter === 'advance') return (t.advance_amount || 0) > 0
    if (filter === 'nobill') return !getLastPayment(t.id)
    return true
  })

  const totalDueAll = tenants.reduce((sum, t) => sum + getTotalDue(t.id), 0)
  const totalPaidAll = tenants.reduce((sum, t) => sum + getTotalPaid(t.id), 0)
  const totalAdvance = tenants.reduce((sum, t) => sum + (t.advance_amount || 0), 0)
  const tenantsWithDue = tenants.filter(t => getTotalDue(t.id) > 0).length
  const tenantsNoBill = tenants.filter(t => !getLastPayment(t.id)).length

  const filterBtn = (key, label, color) => (
    <button
      onClick={() => setFilter(key)}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        border: '2px solid',
        borderColor: filter === key ? color : '#ddd',
        background: filter === key ? color : 'white',
        color: filter === key ? 'white' : '#555',
        fontWeight: filter === key ? '700' : '400',
        cursor: 'pointer',
        fontSize: '13px',
      }}
    >
      {label}
    </button>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'sans-serif' }}>

      {/* Navigation */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '1rem 2rem', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginRight: '0.5rem' }}>🏠 RentApp</span>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontWeight: '600', fontSize: '14px' }}>📊 Dashboard</Link>
        <Link href="/tenants" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontWeight: '600', fontSize: '14px' }}>➕ Add Tenant</Link>
        <Link href="/tenants/list" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontWeight: '600', fontSize: '14px' }}>👥 Tenants</Link>
        <Link href="/billing" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontWeight: '600', fontSize: '14px' }}>🧾 Billing</Link>
        <Link href="/payments" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontWeight: '600', fontSize: '14px' }}>💰 Payments</Link>
        <Link href="/summary" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', background: 'rgba(201,168,76,0.4)', fontWeight: '600', fontSize: '14px', border: '1px solid rgba(201,168,76,0.6)' }}>📋 Summary</Link>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

        <h1 style={{ margin: '0 0 0.3rem', color: '#1a1a2e' }}>📋 Tenant Summary</h1>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>
          {lang === 'np' ? 'सबै भाडावालाहरूको एकैठाउँमा पूरा विवरण' : 'Complete overview of all tenants at a glance'}
        </p>

        {/* Top Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #1a1a2e', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e' }}>{tenants.length}</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
              {lang === 'np' ? 'जम्मा भाडावाला' : 'Total Tenants'}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #e03030', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#e03030' }}>{tenantsWithDue}</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
              {lang === 'np' ? 'बाँकी तिर्नेहरू' : 'Have Due Amount'}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #e03030', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#e03030' }}>Rs.{totalDueAll}</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
              {lang === 'np' ? 'जम्मा बाँकी रकम' : 'Total Due Amount'}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #22bb66', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#22bb66' }}>Rs.{totalPaidAll}</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
              {lang === 'np' ? 'जम्मा संकलन' : 'Total Collected'}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #f0a500', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#f0a500' }}>Rs.{totalAdvance}</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
              {lang === 'np' ? 'जम्मा अग्रिम रकम' : 'Total Advance Held'}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid #888', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#888' }}>{tenantsNoBill}</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
              {lang === 'np' ? 'बिल नभएका' : 'No Bill Yet'}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {filterBtn('all', lang === 'np' ? '👥 सबै' : '👥 All Tenants', '#1a1a2e')}
          {filterBtn('due', lang === 'np' ? '❌ बाँकी छ' : '❌ Has Due', '#e03030')}
          {filterBtn('paid', lang === 'np' ? '✅ तिरिसकेका' : '✅ Fully Paid', '#22bb66')}
          {filterBtn('advance', lang === 'np' ? '💰 अग्रिम छ' : '💰 Has Advance', '#f0a500')}
          {filterBtn('nobill', lang === 'np' ? '📋 बिल छैन' : '📋 No Bill Yet', '#888')}
        </div>

        <p style={{ color: '#888', fontSize: '13px', marginBottom: '1rem' }}>
          {lang === 'np' ? `${filtered.length} भाडावाला देखाइँदैछ` : `Showing ${filtered.length} tenant(s)`}
        </p>

        {/* Tenant Cards */}
        {filtered.map(tenant => {
          const room = getRoom(tenant.room_id)
          const lastPay = getLastPayment(tenant.id)
          const due = getTotalDue(tenant.id)
          const paid = getTotalPaid(tenant.id)
          const allBills = getTenantPayments(tenant.id)
          const advance = tenant.advance_amount || 0
          const status = getStatus(tenant)

          const statusColor = status === 'due' ? '#e03030' : status === 'paid' ? '#22bb66' : '#888'
          const statusBg = status === 'due' ? '#fff0f0' : status === 'paid' ? '#f0fff4' : '#f5f5f5'
          const statusLabel = status === 'due'
            ? (lang === 'np' ? '❌ बाँकी छ' : '❌ Has Due')
            : status === 'paid'
              ? (lang === 'np' ? '✅ तिरिसक्यो' : '✅ Paid Up')
              : (lang === 'np' ? '📋 बिल छैन' : '📋 No Bill Yet')

          return (
            <div key={tenant.id} style={{
              background: 'white',
              borderRadius: '14px',
              padding: '1.2rem 1.5rem',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '2px solid',
              borderColor: status === 'due' ? '#ffcccc' : status === 'paid' ? '#ccffdd' : '#eee',
            }}>

              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a2e' }}>
                    {tenant.full_name}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                    {lang === 'np' ? 'कोठा' : 'Room'}: <strong>{room ? room.room_number : tenant.room_id}</strong>
                    {room ? ` — ${lang === 'np' ? 'तला' : 'Floor'}: ${room.floor}` : ''}
                    {' — '}{lang === 'np' ? 'फोन' : 'Phone'}: <strong>{tenant.phone || '—'}</strong>
                  </div>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                    {lang === 'np' ? 'पेशा' : 'Profession'}: {tenant.profession || '—'}
                    {' — '}{lang === 'np' ? 'मान्छे' : 'People'}: {tenant.number_of_people || 1}
                  </div>
                </div>
                <div style={{
                  background: statusBg,
                  color: statusColor,
                  border: `1px solid ${statusColor}`,
                  borderRadius: '20px',
                  padding: '4px 14px',
                  fontWeight: '700',
                  fontSize: '13px',
                }}>
                  {statusLabel}
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #f0f0f0', margin: '10px 0' }}></div>

              {/* Financial Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>

                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>
                    {lang === 'np' ? '🏠 मासिक भाडा' : '🏠 Monthly Rent'}
                  </div>
                  <div style={{ fontWeight: '700', color: '#1a1a2e' }}>
                    Rs. {room ? room.rent_amount : '—'}
                  </div>
                </div>

                <div style={{ background: due > 0 ? '#fff0f0' : '#f9f9f9', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>
                    {lang === 'np' ? '❌ बाँकी रकम' : '❌ Due Amount'}
                  </div>
                  <div style={{ fontWeight: '700', color: due > 0 ? '#e03030' : '#22bb66' }}>
                    Rs. {due > 0 ? due : 0}
                  </div>
                </div>

                <div style={{ background: '#f0fff4', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>
                    {lang === 'np' ? '✅ जम्मा तिरेको' : '✅ Total Paid'}
                  </div>
                  <div style={{ fontWeight: '700', color: '#22bb66' }}>
                    Rs. {paid}
                  </div>
                </div>

                <div style={{ background: advance > 0 ? '#fffbf0' : '#f9f9f9', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>
                    {lang === 'np' ? '💰 अग्रिम रकम बाँकी' : '💰 Advance Remaining'}
                  </div>
                  <div style={{ fontWeight: '700', color: advance > 0 ? '#f0a500' : '#888' }}>
                    Rs. {advance}
                  </div>
                </div>

                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>
                    {lang === 'np' ? '📋 जम्मा बिलहरू' : '📋 Total Bills'}
                  </div>
                  <div style={{ fontWeight: '700', color: '#1a1a2e' }}>
                    {allBills.length} {lang === 'np' ? 'महिना' : 'month(s)'}
                  </div>
                </div>

                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>
                    {lang === 'np' ? '🗓️ अन्तिम बिल' : '🗓️ Last Bill'}
                  </div>
                  <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '12px' }}>
                    {lastPay ? `${lastPay.month} ${lastPay.year}` : (lang === 'np' ? 'छैन' : 'None')}
                  </div>
                </div>

              </div>

              {/* Last bill detail */}
              {lastPay && (
                <div style={{ marginTop: '8px', background: '#f4f6fb', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#555' }}>
                  <strong>{lang === 'np' ? 'अन्तिम बिल विवरण' : 'Last Bill Detail'}:</strong>
                  {' '}{lang === 'np' ? 'भाडा' : 'Rent'}: Rs.{lastPay.rent_amount}
                  {' | '}{lang === 'np' ? 'बिजुली' : 'Elec'}: Rs.{lastPay.electricity_charge}
                  {' | '}{lang === 'np' ? 'पानी' : 'Water'}: Rs.{lastPay.water_charge}
                  {' | '}{lang === 'np' ? 'फोहोर' : 'Dustbin'}: Rs.{lastPay.dustbin_charge}
                  {lastPay.internet_charge > 0 ? ` | ${lang === 'np' ? 'इन्टरनेट' : 'Internet'}: Rs.${lastPay.internet_charge}` : ''}
                  {' | '}<strong>{lang === 'np' ? 'जम्मा' : 'Total'}: Rs.{lastPay.total_bill}</strong>
                  {' | '}{lang === 'np' ? 'तिरिएको' : 'Paid'}: Rs.{lastPay.paid_amount}
                  {' | '}{lang === 'np' ? 'विधि' : 'Method'}: {lastPay.payment_method}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Link href="/billing" style={{ padding: '6px 14px', borderRadius: '6px', background: '#1a1a2e', color: 'white', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                  🧾 {lang === 'np' ? 'बिल बनाउनुस्' : 'Create Bill'}
                </Link>
                <Link href="/tenants/list" style={{ padding: '6px 14px', borderRadius: '6px', background: '#f4f6fb', color: '#1a1a2e', textDecoration: 'none', fontSize: '12px', fontWeight: '600', border: '1px solid #ddd' }}>
                  ✏️ {lang === 'np' ? 'सम्पादन' : 'Edit Info'}
                </Link>
                <Link href="/payments" style={{ padding: '6px 14px', borderRadius: '6px', background: '#f4f6fb', color: '#1a1a2e', textDecoration: 'none', fontSize: '12px', fontWeight: '600', border: '1px solid #ddd' }}>
                  💰 {lang === 'np' ? 'सबै बिल' : 'All Bills'}
                </Link>
              </div>

            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🔍</div>
            <p>{lang === 'np' ? 'कुनै भाडावाला फेला परेन' : 'No tenants found for this filter'}</p>
          </div>
        )}

      </div>
    </main>
  )
}
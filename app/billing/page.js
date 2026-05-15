'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Billing() {
  const [tenants, setTenants] = useState([])
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [message, setMessage] = useState('')

  const currentDate = new Date()
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const [bill, setBill] = useState({
    month: months[currentDate.getMonth()],
    year: currentDate.getFullYear(),
    rent_amount: 0,
    electricity_units: 0,
    electricity_rate: 17,
    water_charge: 0,
    dustbin_charge: 100,
    damage_charge: 0,
    advance_used: 0,
    paid_amount: 0,
    payment_method: 'Cash',
    notes: '',
  })

  useEffect(() => {
    fetchTenants()
  }, [])

  async function fetchTenants() {
    const { data } = await supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true)
    setTenants(data || [])
  }

  function handleBillChange(e) {
    const updated = { ...bill, [e.target.name]: e.target.value }
    setBill(updated)
  }

  function selectTenant(tenant) {
    setSelectedTenant(tenant)
    setBill(prev => ({
      ...prev,
      rent_amount: tenant.rent_amount || 0,
      water_charge: (tenant.number_of_people || 1) * 100,
    }))
    setMessage('')
  }

  // Calculate all amounts
  const electricityCharge = bill.electricity_units * bill.electricity_rate
  const totalBill = 
    Number(bill.rent_amount) + 
    Number(electricityCharge) + 
    Number(bill.water_charge) + 
    Number(bill.dustbin_charge) + 
    Number(bill.damage_charge)
  const balance = totalBill - Number(bill.advance_used) - Number(bill.paid_amount)

  async function handleSaveBill() {
    if (!selectedTenant) {
      setMessage('Please select a tenant first.')
      return
    }

    const { error } = await supabase.from('payments').insert([{
      tenant_id: selectedTenant.id,
      room_id: selectedTenant.room_id,
      month: bill.month,
      year: Number(bill.year),
      rent_amount: Number(bill.rent_amount),
      electricity_units: Number(bill.electricity_units),
      electricity_rate: Number(bill.electricity_rate),
      electricity_charge: Number(electricityCharge),
      water_charge: Number(bill.water_charge),
      dustbin_charge: Number(bill.dustbin_charge),
      damage_charge: Number(bill.damage_charge),
      total_bill: Number(totalBill),
      advance_used: Number(bill.advance_used),
      paid_amount: Number(bill.paid_amount),
      balance: Number(balance),
      payment_method: bill.payment_method,
      is_paid: balance <= 0,
      notes: bill.notes,
    }])

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Bill saved successfully!')
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

  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid #eee',
    fontSize: '15px',
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🧾 Monthly Billing</h1>
      <p style={{ color: 'gray' }}>Select tenant and fill monthly charges</p>

      {/* Select Tenant */}
      <div style={section}>
        <h2 style={{ marginTop: 0 }}>Select Tenant (भाडावाला छान्नुहोस्)</h2>
        {tenants.length === 0 && <p style={{ color: 'gray' }}>No active tenants found.</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tenants.map(t => (
            <button
              key={t.id}
              onClick={() => selectTenant(t)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '2px solid',
                borderColor: selectedTenant?.id === t.id ? '#0070f3' : '#ddd',
                background: selectedTenant?.id === t.id ? '#e8f0fe' : 'white',
                cursor: 'pointer',
                fontWeight: selectedTenant?.id === t.id ? 'bold' : 'normal',
              }}
            >
              {t.full_name} — Room {t.room_id}
            </button>
          ))}
        </div>
      </div>

      {selectedTenant && (
        <>
          {/* Month and Year */}
          <div style={section}>
            <h2 style={{ marginTop: 0 }}>Billing Period (महिना र साल)</h2>
            <label style={label}>Month (महिना)</label>
            <select style={input} name="month" value={bill.month} onChange={handleBillChange}>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <label style={label}>Year (साल)</label>
            <input style={input} type="number" name="year" value={bill.year} onChange={handleBillChange} />
          </div>

          {/* Charges */}
          <div style={section}>
            <h2 style={{ marginTop: 0 }}>Monthly Charges (शुल्कहरू)</h2>

            <label style={label}>Rent Amount — Rs. (भाडा)</label>
            <input style={input} type="number" name="rent_amount" value={bill.rent_amount} onChange={handleBillChange} />

            <label style={label}>Electricity Units Used (बिजुली युनिट)</label>
            <input style={input} type="number" name="electricity_units" value={bill.electricity_units} onChange={handleBillChange} placeholder="e.g. 45" />

            <label style={label}>Electricity Rate per Unit — Rs. (प्रति युनिट दर)</label>
            <input style={input} type="number" name="electricity_rate" value={bill.electricity_rate} onChange={handleBillChange} />

            <label style={label}>
              Electricity Charge (बिजुली शुल्क) = Rs. {electricityCharge}
            </label>
            <input style={{ ...input, background: '#eee' }} value={`Rs. ${electricityCharge}`} readOnly />

            <label style={label}>Water Charge per Person — Rs. (पानी शुल्क)</label>
            <input style={input} type="number" name="water_charge" value={bill.water_charge} onChange={handleBillChange} />

            <label style={label}>Dustbin Cleaning Charge — Rs. (फोहोर शुल्क)</label>
            <input style={input} type="number" name="dustbin_charge" value={bill.dustbin_charge} onChange={handleBillChange} />

            <label style={label}>Damage Charge — Rs. (क्षति शुल्क)</label>
            <input style={input} type="number" name="damage_charge" value={bill.damage_charge} onChange={handleBillChange} placeholder="0 if no damage" />
          </div>

          {/* Bill Summary */}
          <div style={{ ...section, background: '#fff8e1' }}>
            <h2 style={{ marginTop: 0 }}>Bill Summary (बिल सारांश)</h2>
            <div style={row}><span>Rent</span><span>Rs. {bill.rent_amount}</span></div>
            <div style={row}><span>Electricity ({bill.electricity_units} units × Rs.{bill.electricity_rate})</span><span>Rs. {electricityCharge}</span></div>
            <div style={row}><span>Water</span><span>Rs. {bill.water_charge}</span></div>
            <div style={row}><span>Dustbin</span><span>Rs. {bill.dustbin_charge}</span></div>
            <div style={row}><span>Damage</span><span>Rs. {bill.damage_charge}</span></div>
            <div style={{ ...row, fontWeight: 'bold', fontSize: '17px', borderBottom: 'none' }}>
              <span>Total Bill</span><span>Rs. {totalBill}</span>
            </div>
          </div>

          {/* Payment */}
          <div style={section}>
            <h2 style={{ marginTop: 0 }}>Payment Details (भुक्तानी विवरण)</h2>

            <label style={label}>Advance Used — Rs. (अग्रिम रकम प्रयोग)</label>
            <input style={input} type="number" name="advance_used" value={bill.advance_used} onChange={handleBillChange} />

            <label style={label}>Paid Amount — Rs. (तिरेको रकम)</label>
            <input style={input} type="number" name="paid_amount" value={bill.paid_amount} onChange={handleBillChange} />

            <label style={label}>Payment Method (भुक्तानी तरिका)</label>
            <select style={input} name="payment_method" value={bill.payment_method} onChange={handleBillChange}>
              <option>Cash</option>
              <option>Mobile Banking</option>
              <option>QR Code</option>
            </select>

            <label style={label}>Notes (कैफियत)</label>
            <input style={input} name="notes" value={bill.notes} onChange={handleBillChange} placeholder="Any extra notes..." />

            {/* Balance */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: balance > 0 ? '#ffe5e5' : '#e5ffe5',
              marginTop: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
            }}>
              {balance > 0
                ? `Due Balance: Rs. ${balance} ❌`
                : `Fully Paid ✅ (Extra: Rs. ${Math.abs(balance)})`}
            </div>
          </div>

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
            onClick={handleSaveBill}
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
            Save Bill (बिल सेभ गर्नुहोस्)
          </button>
        </>
      )}

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#0070f3' }}>← Back to Dashboard</a>
      </p>
    </main>
  )
}
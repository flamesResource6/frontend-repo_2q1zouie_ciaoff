import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Stats from './components/Stats'
import TransactionsTable from './components/TransactionsTable'
import Alerts from './components/Alerts'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

function App() {
  const [loading, setLoading] = useState(true)
  const [tx, setTx] = useState([])
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const [txRes, alertsRes] = await Promise.all([
        fetchJSON(`${API_BASE}/api/transactions?limit=50`),
        fetchJSON(`${API_BASE}/api/alerts?limit=50`),
      ])
      setTx(txRes.items || [])
      setAlerts(alertsRes.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const summary = useMemo(() => {
    const total = tx.length
    const high = tx.filter(t => t.risk_level === 'high').length
    const avg = total ? tx.reduce((s, t) => s + (t.risk_score || 0), 0) / total : 0
    const sorted = [...tx].sort((a,b)=> (a.risk_score||0) - (b.risk_score||0))
    const p95 = total ? sorted[Math.floor(0.95 * (total-1))]?.risk_score || 0 : 0
    const confirmed = tx.filter(t => t.is_fraud).length
    return { totalTx: total, highRisk: high, avgRisk: avg, p95Risk: p95, confirmed, txChange: 0, alertRate: total ? Math.round((high/total)*100) : 0 }
  }, [tx])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Header onRefresh={load} />

        {error && (
          <div className="mb-4 p-3 rounded border border-rose-200 bg-rose-50 text-rose-700 text-sm">{error}</div>
        )}

        <Stats summary={summary} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              {loading && <span className="text-xs text-gray-500">Loading…</span>}
            </div>
            <TransactionsTable items={tx} />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Alerts</h2>
            <Alerts items={alerts} />

            <div className="mt-4 p-4 bg-white rounded border">
              <h3 className="font-semibold text-gray-900 mb-2">Simulate Transaction</h3>
              <Simulator onCreated={load} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Simulator({ onCreated }) {
  const [form, setForm] = useState({ user_id: 'u-1001', amount: 120.25, currency: 'USD', merchant: 'ShopCo', merchant_category: 'retail', country: 'US', channel: 'card', device_id: 'dev-1', ip_address: '10.0.0.1' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setResult(data)
      onCreated?.()
    } catch (e) {
      setResult({ error: e.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded px-2 py-1" placeholder="User ID" value={form.user_id} onChange={e=>setForm({...form, user_id:e.target.value})} />
        <input className="border rounded px-2 py-1" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:parseFloat(e.target.value)})} />
        <input className="border rounded px-2 py-1" placeholder="Currency" value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder="Merchant" value={form.merchant} onChange={e=>setForm({...form, merchant:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder="Category" value={form.merchant_category} onChange={e=>setForm({...form, merchant_category:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder="Country" value={form.country} onChange={e=>setForm({...form, country:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder="Channel" value={form.channel} onChange={e=>setForm({...form, channel:e.target.value})} />
        <input className="border rounded px-2 py-1" placeholder="Device ID" value={form.device_id} onChange={e=>setForm({...form, device_id:e.target.value})} />
        <input className="border rounded px-2 py-1 col-span-2" placeholder="IP Address" value={form.ip_address} onChange={e=>setForm({...form, ip_address:e.target.value})} />
      </div>
      <button disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded py-2">
        {submitting ? 'Submitting…' : 'Create Transaction'}
      </button>
      {result && (
        <div className="text-sm bg-gray-50 border rounded p-2">
          {result.error ? (
            <div className="text-rose-600">{result.error}</div>
          ) : (
            <div>Risk Score: <span className="font-semibold">{Math.round(result.risk_score)}</span> • {result.risk_level}</div>
          )}
        </div>
      )}
    </form>
  )
}

export default App

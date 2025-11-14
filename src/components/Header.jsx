import { useMemo } from 'react'

function Header({ onRefresh }) {
  const now = useMemo(() => new Date().toLocaleString(), [])
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fraud Detection Dashboard</h1>
        <p className="text-gray-500 text-sm">Realtime view of transactions, risk scoring, and alerts • {now}</p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="/test"
          className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
        >
          Connection Test
        </a>
        <button
          onClick={onRefresh}
          className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

export default Header

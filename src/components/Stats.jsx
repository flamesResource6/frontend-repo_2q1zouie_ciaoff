function StatCard({ label, value, trend, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700'
  }
  return (
    <div className={`p-4 rounded-lg border bg-white`}> 
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 flex items-end gap-2">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {trend != null && (
          <span className={`text-xs px-2 py-0.5 rounded ${colorMap[color]}`}>{trend}</span>
        )}
      </div>
    </div>
  )
}

function Stats({ summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Transactions" value={summary.totalTx || 0} trend={`+${summary.txChange || 0}%`} color="blue" />
      <StatCard label="High-Risk Alerts" value={summary.highRisk || 0} trend={`${summary.alertRate || 0}% of tx`} color="red" />
      <StatCard label="Avg Risk Score" value={summary.avgRisk?.toFixed?.(1) ?? 0} trend={`p95 ${summary.p95Risk?.toFixed?.(0) ?? 0}`} color="amber" />
      <StatCard label="Confirmed Fraud" value={summary.confirmed || 0} trend={`last 24h`} color="green" />
    </div>
  )
}

export default Stats

function AlertItem({ alert }) {
  const color = alert.risk_level === 'high' ? 'border-rose-200 bg-rose-50' : alert.risk_level === 'medium' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'
  return (
    <div className={`p-3 rounded border ${color}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-gray-900">{alert.reason}</div>
          <div className="text-xs text-gray-600 mt-1">
            Score {Math.round(alert.risk_score)} • {alert.risk_level}
            {alert.tags?.length ? ` • ${alert.tags.join(', ')}` : ''}
          </div>
        </div>
        <div className="text-xs text-gray-500">{new Date(alert.created_at || Date.now()).toLocaleString()}</div>
      </div>
    </div>
  )
}

function Alerts({ items }) {
  return (
    <div className="space-y-2">
      {items?.length ? items.map(a => (
        <AlertItem key={a._id} alert={a} />
      )) : (
        <div className="p-6 text-center text-gray-500 bg-white rounded border">No alerts</div>
      )}
    </div>
  )
}

export default Alerts

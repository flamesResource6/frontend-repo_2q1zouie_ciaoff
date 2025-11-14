function classNames(...c){return c.filter(Boolean).join(' ')}

function RiskPill({ score, level }) {
  const color = level === 'high' ? 'bg-rose-100 text-rose-700' : level === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
  return (
    <span className={classNames('px-2 py-0.5 rounded text-xs font-medium', color)}>
      {level || 'low'} • {Math.round(score ?? 0)}
    </span>
  )
}

function TransactionsTable({ items }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-3">Time</th>
            <th className="text-left p-3">User</th>
            <th className="text-left p-3">Amount</th>
            <th className="text-left p-3">Merchant</th>
            <th className="text-left p-3">Country</th>
            <th className="text-left p-3">Channel</th>
            <th className="text-left p-3">Risk</th>
          </tr>
        </thead>
        <tbody>
          {items?.length ? items.map(tx => (
            <tr key={tx._id} className="border-t">
              <td className="p-3 text-gray-700">{new Date(tx.timestamp || tx.created_at).toLocaleString()}</td>
              <td className="p-3 text-gray-700">{tx.user_id}</td>
              <td className="p-3 font-medium text-gray-900">${tx.amount?.toFixed?.(2)} {tx.currency}</td>
              <td className="p-3 text-gray-700">{tx.merchant || '—'}</td>
              <td className="p-3 text-gray-700">{tx.country || '—'}</td>
              <td className="p-3 text-gray-700">{tx.channel || '—'}</td>
              <td className="p-3"><RiskPill score={tx.risk_score} level={tx.risk_level} /></td>
            </tr>
          )) : (
            <tr>
              <td className="p-6 text-center text-gray-500" colSpan={7}>No transactions yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionsTable

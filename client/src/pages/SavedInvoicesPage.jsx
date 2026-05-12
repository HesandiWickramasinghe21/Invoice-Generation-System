import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { lsGetAll, lsDelete, formatCurrency, formatDate } from '../utils/invoiceUtils.js'
import { invoiceAPI } from '../utils/api.js'

const STATUS_STYLES = {
  draft:   { bg: '#f3f4f6', color: '#6b7280' },
  sent:    { bg: '#dbeafe', color: '#1d4ed8' },
  paid:    { bg: '#dcfce7', color: '#15803d' },
  overdue: { bg: '#fee2e2', color: '#b91c1c' }
}

export default function SavedInvoicesPage() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    invoiceAPI.getAll()
      .then(res => {
        const apiInvs = res.data || []
        const localInvs = lsGetAll()
        const apiNums = new Set(apiInvs.map(i => i.invoiceNumber))
        setInvoices([...apiInvs, ...localInvs.filter(i => !apiNums.has(i.invoiceNumber))])
      })
      .catch(() => setInvoices(lsGetAll()))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = (inv) => {
    if (!window.confirm(`Delete invoice ${inv.invoiceNumber}?`)) return
    lsDelete(inv._id)
    invoiceAPI.remove(inv._id).catch(() => {})
    setInvoices(prev => prev.filter(i => i._id !== inv._id))
    toast.success('Invoice deleted')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-gray-400">
        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-medium">Loading invoices…</span>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#f0ebe0' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl text-ink">Saved Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">
              {invoices.length === 0 ? 'No invoices yet' : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button onClick={() => navigate('/invoice/new')}
            style={{ background: '#e8a020', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            + New Invoice
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
            <div className="text-6xl mb-5">📄</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-2xl text-ink mb-2">No invoices yet</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">Create your first invoice and it will appear here for easy access.</p>
            <button onClick={() => navigate('/invoice/new')}
              style={{ background: '#e8a020', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              + Create Invoice
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#fafaf8', borderBottom: '1px solid #f0ece4' }}>
                    {['Invoice #', 'Client', 'Issue Date', 'Due Date', 'Total', 'Status', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-400 ${i >= 2 && i <= 3 ? 'hidden sm:table-cell' : ''} ${i === 5 ? 'text-center hidden sm:table-cell' : ''} ${i >= 4 ? 'text-right' : 'text-left'} ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => {
                    const st = STATUS_STYLES[inv.status] || STATUS_STYLES.draft
                    return (
                      <tr key={inv._id || i} className="border-b border-gray-50 hover:bg-amber-50/40 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-ink font-semibold">{inv.invoiceNumber}</td>
                        <td className="px-5 py-4 font-medium text-ink">{inv.client?.name || '—'}</td>
                        <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">{formatDate(inv.issueDate)}</td>
                        <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">{formatDate(inv.dueDate)}</td>
                        <td className="px-5 py-4 text-right font-bold text-ink">{formatCurrency(inv.total)}</td>
                        <td className="px-5 py-4 text-center hidden sm:table-cell">
                          <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize' }}>
                            {inv.status || 'draft'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => navigate('/invoice/edit/' + inv._id)}
                              className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-semibold transition-colors">Edit</button>
                            <button onClick={() => handleDelete(inv)}
                              className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg font-semibold transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

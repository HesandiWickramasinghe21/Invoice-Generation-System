import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { lsGetAll, lsDelete, formatCurrency, formatDate } from '../utils/invoiceUtils.js'
import { invoiceAPI } from '../utils/api.js'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-50 text-blue-600',
  paid: 'bg-green-50 text-green-600',
  overdue: 'bg-red-50 text-red-600'
}

export default function SavedInvoicesPage() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  const loadInvoices = () => {
    setLoading(true)
    invoiceAPI.getAll()
      .then(res => {
        const apiInvs = res.data || []
        const localInvs = lsGetAll()
        const apiNumbers = new Set(apiInvs.map(i => i.invoiceNumber))
        const localOnly = localInvs.filter(i => !apiNumbers.has(i.invoiceNumber))
        setInvoices([...apiInvs, ...localOnly])
      })
      .catch(() => {
        setInvoices(lsGetAll())
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const handleDelete = (inv) => {
    if (!window.confirm(`Delete invoice ${inv.invoiceNumber}?`)) return
    lsDelete(inv._id)
    invoiceAPI.remove(inv._id).catch(() => {})
    setInvoices(prev => prev.filter(i => i._id !== inv._id))
    toast.success('Invoice deleted')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 font-medium animate-pulse">Loading invoices…</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Saved Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} found</p>
        </div>
        <button onClick={() => navigate('/invoice/new')}
          style={{ background: '#e8a020', color: 'white', border: 'none', padding: '9px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          + New Invoice
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="font-display text-xl text-ink mb-2">No invoices yet</h2>
          <p className="text-gray-500 text-sm mb-6">Create your first invoice to get started.</p>
          <button onClick={() => navigate('/invoice/new')}
            style={{ background: '#e8a020', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', margin: '0 auto', display: 'block' }}>
            Create Invoice
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Invoice #</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Issue Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Due Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr
                    key={inv._id || i}
                    className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-ink font-medium">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3.5 font-medium text-ink">{inv.client?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{formatDate(inv.issueDate)}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{formatDate(inv.dueDate)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-ink">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[inv.status] || STATUS_COLORS.draft}`}>
                        {inv.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/invoice/edit/${inv._id}`)}
                          className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(inv)}
                          className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

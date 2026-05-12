import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useInvoice } from '../hooks/useInvoice.js'
import { emptyInvoice, lsSave, lsGetById } from '../utils/invoiceUtils.js'
import { invoiceAPI } from '../utils/api.js'
import InvoiceForm from '../components/InvoiceForm.jsx'
import InvoicePreview from '../components/InvoicePreview.jsx'
import ExportToolbar from '../components/ExportToolbar.jsx'

export default function InvoiceEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const previewRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('form')

  const { invoice, setInvoice, updateField, updateNestedField, addLineItem, removeLineItem, updateLineItem, totals } =
    useInvoice(emptyInvoice())

  useEffect(() => {
    if (!id) return
    const local = lsGetById(id)
    if (local) { setInvoice(local); return }
    invoiceAPI.getById(id)
      .then(res => setInvoice(res.data))
      .catch(() => { toast.error('Invoice not found'); navigate('/invoices') })
  }, [id])

  const validate = () => {
    if (!invoice.biller.name.trim()) return 'Biller name is required.'
    if (!invoice.client.name.trim()) return 'Client name is required.'
    if (!invoice.invoiceNumber.trim()) return 'Invoice number is required.'
    if (!invoice.issueDate) return 'Issue date is required.'
    if (!invoice.dueDate) return 'Due date is required.'
    if (new Date(invoice.dueDate) < new Date(invoice.issueDate)) return 'Due date must be after issue date.'
    if (invoice.lineItems.length === 0) return 'Add at least one line item.'
    for (const item of invoice.lineItems) {
      if (!item.description.trim()) return 'All line items must have a description.'
      if (Number(item.quantity) <= 0) return 'All quantities must be greater than 0.'
    }
    return null
  }

  const handleSave = async () => {
    const error = validate()
    if (error) { toast.error(error); return }
    setSaving(true)
    try {
      const saved = lsSave({ ...invoice, ...totals })
      setInvoice(saved)
      try {
        if (id) {
          await invoiceAPI.update(id, { ...invoice, ...totals })
        } else {
          await invoiceAPI.create({ ...invoice, ...totals })
        }
      } catch { /* API unavailable — localStorage only */ }
      toast.success(id ? 'Invoice updated!' : 'Invoice saved!')
      if (!id) navigate('/invoice/edit/' + saved._id, { replace: true })
    } catch { toast.error('Failed to save invoice.') }
    finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Top bar */}
      <div className="no-print shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 transition-colors text-sm">← Back</button>
          <div className="w-px h-4 bg-gray-200" />
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-lg text-ink">{id ? 'Edit Invoice' : 'New Invoice'}</h1>
          <span className="hidden sm:inline text-xs text-gray-400 font-mono bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <ExportToolbar previewRef={previewRef} invoice={invoice} totals={totals} />
          <button onClick={handleSave} disabled={saving}
            style={{ background: '#e8a020', color: 'white', border: 'none', padding: '9px 22px', borderRadius: '9px', fontWeight: 600, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.75 : 1 }}>
            {saving ? 'Saving…' : id ? '✓ Update' : '✓ Save Invoice'}
          </button>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="sm:hidden no-print shrink-0 flex bg-white border-b border-gray-100">
        <button onClick={() => setActiveTab('form')} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === 'form' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-500'}`}>Edit Form</button>
        <button onClick={() => setActiveTab('preview')} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-500'}`}>Preview</button>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden" style={{ background: '#e8e2d6' }}>
        {/* Form panel */}
        <div className={(activeTab === 'preview' ? 'hidden ' : '') + 'sm:flex flex-col overflow-y-auto border-r border-stone-200'} style={{ width: '100%', maxWidth: '480px', background: '#fafaf8', flexShrink: 0 }}>
          <InvoiceForm invoice={invoice} updateField={updateField} updateNestedField={updateNestedField} addLineItem={addLineItem} removeLineItem={removeLineItem} updateLineItem={updateLineItem} totals={totals} />
        </div>

        {/* Preview panel */}
        <div className={(activeTab === 'form' ? 'hidden ' : '') + 'sm:flex flex-1 overflow-y-auto'} style={{ padding: '32px 24px' }}>
          <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
            <InvoicePreview ref={previewRef} invoice={invoice} totals={totals} />
          </div>
        </div>
      </div>
    </div>
  )
}

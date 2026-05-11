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

  // Load existing invoice if editing
  useEffect(() => {
    if (!id) return

    const local = lsGetById(id)
    if (local) {
      setInvoice(local)
      return
    }

    invoiceAPI.getById(id)
      .then(res => setInvoice(res.data))
      .catch(() => {
        toast.error('Invoice not found')
        navigate('/invoices')
      })
  }, [id])

  // Validate required fields
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
      if (item.quantity <= 0) return 'Quantity must be greater than 0.'
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
        if (id && !invoice._id?.length === 36) {
          await invoiceAPI.update(id, invoice)
        } else if (!id) {
          await invoiceAPI.create({ ...invoice, ...totals })
        }
      } catch {
        // API unavailable 
      }

      toast.success('Invoice saved!')
      if (!id) navigate(`/invoice/edit/${saved._id}`, { replace: true })
    } catch (err) {
      toast.error('Failed to save invoice.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Top bar */}
      <div className="border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between no-print shrink-0" style={{ background: 'white' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
          <h1 className="font-display text-lg text-ink">
            {id ? 'Edit Invoice' : 'New Invoice'}
          </h1>
          <span className="hidden sm:inline text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">
            {invoice.invoiceNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ExportToolbar previewRef={previewRef} invoice={invoice} totals={totals} />
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: '#e8a020', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '9px', fontWeight: 600, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : id ? 'Update' : 'Save Invoice'}
          </button>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="sm:hidden bg-white border-b border-gray-100 flex no-print shrink-0">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === 'form' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-500'}`}
        >
          Edit Form
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-500'}`}
        >
          Preview
        </button>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden" style={{ background: '#f0ebe0' }}>
        {/* Form panel */}
        <div className={`${activeTab === 'preview' ? 'hidden' : 'flex'} sm:flex flex-col w-full sm:w-1/2 lg:w-2/5 border-r border-stone-200 overflow-y-auto bg-white`}>
          <InvoiceForm
            invoice={invoice}
            updateField={updateField}
            updateNestedField={updateNestedField}
            addLineItem={addLineItem}
            removeLineItem={removeLineItem}
            updateLineItem={updateLineItem}
            totals={totals}
          />
        </div>

        {/* Preview panel */}
        <div className={`${activeTab === 'form' ? 'hidden' : 'flex'} sm:flex flex-1 overflow-y-auto p-4 sm:p-8`} style={{ background: '#e8e2d6' }}>
          <div className="w-full max-w-2xl mx-auto">
            <InvoicePreview ref={previewRef} invoice={invoice} totals={totals} />
          </div>
        </div>
      </div>
    </div>
  )
}

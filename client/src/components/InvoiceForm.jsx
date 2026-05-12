import LineItemsTable from './LineItemsTable.jsx'

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-600">{children}</p>
      <div className="flex-1 h-px bg-amber-100" />
    </div>
  )
}

export default function InvoiceForm({ invoice, updateField, updateNestedField, addLineItem, removeLineItem, updateLineItem, totals }) {
  return (
    <div className="p-5 space-y-4">

      {/* Invoice Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <SectionHeader>Invoice Details</SectionHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <FieldLabel required>Invoice Number</FieldLabel>
            <input className="input-field font-mono" value={invoice.invoiceNumber}
              onChange={e => updateField('invoiceNumber', e.target.value)} placeholder="INV-202401-0001" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <FieldLabel>Status</FieldLabel>
            <select className="input-field" value={invoice.status} onChange={e => updateField('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <FieldLabel required>Issue Date</FieldLabel>
            <input type="date" className="input-field" value={invoice.issueDate} onChange={e => updateField('issueDate', e.target.value)} />
          </div>
          <div>
            <FieldLabel required>Due Date</FieldLabel>
            <input type="date" className="input-field" value={invoice.dueDate} onChange={e => updateField('dueDate', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Biller */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <SectionHeader>Your Details (Biller)</SectionHeader>
        <div className="space-y-3">
          <div>
            <FieldLabel required>Company / Name</FieldLabel>
            <input className="input-field" value={invoice.biller.name} onChange={e => updateNestedField('biller', 'name', e.target.value)} placeholder="Your Company Ltd." />
          </div>
          <div>
            <FieldLabel>Address</FieldLabel>
            <textarea className="input-field resize-none" rows={2} value={invoice.biller.address} onChange={e => updateNestedField('biller', 'address', e.target.value)} placeholder="123 Main Street, City, Country" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Email</FieldLabel>
              <input type="email" className="input-field" value={invoice.biller.email} onChange={e => updateNestedField('biller', 'email', e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <input type="tel" className="input-field" value={invoice.biller.phone} onChange={e => updateNestedField('biller', 'phone', e.target.value)} placeholder="+1 555 000 0000" />
            </div>
          </div>
        </div>
      </div>

      {/* Client */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <SectionHeader>Bill To (Client)</SectionHeader>
        <div className="space-y-3">
          <div>
            <FieldLabel required>Client Name</FieldLabel>
            <input className="input-field" value={invoice.client.name} onChange={e => updateNestedField('client', 'name', e.target.value)} placeholder="Client Company or Person" />
          </div>
          <div>
            <FieldLabel>Address</FieldLabel>
            <textarea className="input-field resize-none" rows={2} value={invoice.client.address} onChange={e => updateNestedField('client', 'address', e.target.value)} placeholder="456 Client Ave, City, Country" />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <input type="email" className="input-field" value={invoice.client.email} onChange={e => updateNestedField('client', 'email', e.target.value)} placeholder="client@company.com" />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <SectionHeader>Line Items</SectionHeader>
        <LineItemsTable lineItems={invoice.lineItems} updateLineItem={updateLineItem} removeLineItem={removeLineItem} addLineItem={addLineItem} />
      </div>

      {/* Tax & Discount */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <SectionHeader>Tax &amp; Discount</SectionHeader>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <FieldLabel>Discount (%)</FieldLabel>
            <input type="number" min="0" max="100" step="0.1" className="input-field" value={invoice.discountRate} onChange={e => updateField('discountRate', e.target.value)} placeholder="0" />
          </div>
          <div>
            <FieldLabel>Tax Rate (%)</FieldLabel>
            <input type="number" min="0" max="100" step="0.1" className="input-field" value={invoice.taxRate} onChange={e => updateField('taxRate', e.target.value)} placeholder="0" />
          </div>
        </div>
        {/* Totals summary */}
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-4 py-2.5 flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-mono font-medium">${Number(totals.subtotal).toFixed(2)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="px-4 py-2.5 flex justify-between text-sm border-t border-gray-100">
              <span className="text-red-500">Discount ({invoice.discountRate}%)</span>
              <span className="font-mono font-medium text-red-500">−${Number(totals.discountAmount).toFixed(2)}</span>
            </div>
          )}
          {totals.taxAmount > 0 && (
            <div className="px-4 py-2.5 flex justify-between text-sm border-t border-gray-100 text-gray-600">
              <span>Tax ({invoice.taxRate}%)</span>
              <span className="font-mono font-medium">${Number(totals.taxAmount).toFixed(2)}</span>
            </div>
          )}
          <div className="px-4 py-3 flex justify-between border-t border-gray-200 bg-ink">
            <span className="text-sm font-bold text-amber-400 uppercase tracking-wide">Total Due</span>
            <span className="font-mono font-bold text-white text-base">${Number(totals.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <SectionHeader>Notes &amp; Payment Terms</SectionHeader>
        <div className="space-y-3">
          <div>
            <FieldLabel>Payment Terms</FieldLabel>
            <input className="input-field" value={invoice.paymentTerms} onChange={e => updateField('paymentTerms', e.target.value)} placeholder="e.g. Payment due within 30 days" />
          </div>
          <div>
            <FieldLabel>Notes</FieldLabel>
            <textarea className="input-field resize-none" rows={3} value={invoice.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Any additional notes or instructions for the client…" />
          </div>
        </div>
      </div>

      <div className="h-6" />
    </div>
  )
}

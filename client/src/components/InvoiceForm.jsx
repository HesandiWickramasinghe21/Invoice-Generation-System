import LineItemsTable from './LineItemsTable.jsx'

export default function InvoiceForm({
  invoice,
  updateField,
  updateNestedField,
  addLineItem,
  removeLineItem,
  updateLineItem,
  totals
}) {
  return (
    <div className="p-4 sm:p-5 space-y-5 font-body">

      {/* Invoice Metadata */}
      <div className="section-card">
        <p className="section-title">Invoice Details</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number *</label>
            <input
              className="input-field font-mono"
              value={invoice.invoiceNumber}
              onChange={e => updateField('invoiceNumber', e.target.value)}
              placeholder="INV-202401-0001"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              className="input-field"
              value={invoice.status}
              onChange={e => updateField('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Issue Date *</label>
            <input
              type="date"
              className="input-field"
              value={invoice.issueDate}
              onChange={e => updateField('issueDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Due Date *</label>
            <input
              type="date"
              className="input-field"
              value={invoice.dueDate}
              onChange={e => updateField('dueDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Biller Details */}
      <div className="section-card">
        <p className="section-title">Your Details (Biller)</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name / Company *</label>
            <input
              className="input-field"
              value={invoice.biller.name}
              onChange={e => updateNestedField('biller', 'name', e.target.value)}
              placeholder="Your Company Ltd."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={invoice.biller.address}
              onChange={e => updateNestedField('biller', 'address', e.target.value)}
              placeholder="123 Main Street, City, Country"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={invoice.biller.email}
                onChange={e => updateNestedField('biller', 'email', e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                className="input-field"
                value={invoice.biller.phone}
                onChange={e => updateNestedField('biller', 'phone', e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="section-card">
        <p className="section-title">Bill To (Client)</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Client Name *</label>
            <input
              className="input-field"
              value={invoice.client.name}
              onChange={e => updateNestedField('client', 'name', e.target.value)}
              placeholder="Client Company or Person"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={invoice.client.address}
              onChange={e => updateNestedField('client', 'address', e.target.value)}
              placeholder="456 Client Ave, City, Country"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              value={invoice.client.email}
              onChange={e => updateNestedField('client', 'email', e.target.value)}
              placeholder="client@company.com"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="section-card">
        <p className="section-title">Line Items</p>
        <LineItemsTable
          lineItems={invoice.lineItems}
          updateLineItem={updateLineItem}
          removeLineItem={removeLineItem}
          addLineItem={addLineItem}
        />
      </div>

      {/* Tax & Discount */}
      <div className="section-card">
        <p className="section-title">Tax &amp; Discount</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="input-field"
              value={invoice.taxRate}
              onChange={e => updateField('taxRate', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="input-field"
              value={invoice.discountRate}
              onChange={e => updateField('discountRate', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Totals summary in form */}
        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm space-y-1">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-mono">${Number(totals.subtotal).toFixed(2)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Discount ({invoice.discountRate}%)</span>
              <span className="font-mono">−${Number(totals.discountAmount).toFixed(2)}</span>
            </div>
          )}
          {totals.taxAmount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tax ({invoice.taxRate}%)</span>
              <span className="font-mono">${Number(totals.taxAmount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-ink border-t border-gray-200 pt-1 mt-1">
            <span>Total</span>
            <span className="font-mono text-amber-600">${Number(totals.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Payment Terms */}
      <div className="section-card">
        <p className="section-title">Notes &amp; Terms</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Terms</label>
            <input
              className="input-field"
              value={invoice.paymentTerms}
              onChange={e => updateField('paymentTerms', e.target.value)}
              placeholder="e.g. Payment due within 30 days"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={invoice.notes}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="Any additional notes or instructions for the client…"
            />
          </div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  )
}

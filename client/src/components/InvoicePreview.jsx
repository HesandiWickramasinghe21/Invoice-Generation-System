import { forwardRef } from 'react'
import { formatDate, formatCurrency } from '../utils/invoiceUtils.js'

const STATUS_BADGE = {
  draft:   { bg: '#f3f4f6', color: '#6b7280', label: 'DRAFT' },
  sent:    { bg: '#eff6ff', color: '#3b82f6', label: 'SENT' },
  paid:    { bg: '#f0fdf4', color: '#16a34a', label: 'PAID' },
  overdue: { bg: '#fef2f2', color: '#dc2626', label: 'OVERDUE' }
}

const InvoicePreview = forwardRef(function InvoicePreview({ invoice, totals }, ref) {
  const status = STATUS_BADGE[invoice.status] || STATUS_BADGE.draft

  return (
    <div
      ref={ref}
      id="invoice-preview-root"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: '#ffffff',
        width: '100%',
        minHeight: '1100px',
        padding: '48px 52px',
        boxShadow: '0 4px 40px rgba(0,0,0,0.10)',
        borderRadius: '12px',
        color: '#1a1a2e',
        position: 'relative'
      }}
    >
      {/* Gold accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '5px',
        background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)',
        borderRadius: '12px 12px 0 0'
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', paddingTop: '12px' }}>
        {/* Biller */}
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', fontWeight: 400, color: '#1a1a2e', marginBottom: '6px' }}>
            {invoice.biller.name || <span style={{ color: '#d1d5db' }}>Your Company Name</span>}
          </div>
          {invoice.biller.address && (
            <div style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {invoice.biller.address}
            </div>
          )}
          {invoice.biller.email && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{invoice.biller.email}</div>
          )}
          {invoice.biller.phone && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{invoice.biller.phone}</div>
          )}
        </div>

        {/* Invoice label + status */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '36px', color: '#c9a84c', letterSpacing: '-1px', lineHeight: 1 }}>
            INVOICE
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            {invoice.invoiceNumber}
          </div>
          <div style={{
            display: 'inline-block',
            marginTop: '8px',
            padding: '3px 10px',
            borderRadius: '99px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            background: status.bg,
            color: status.color
          }}>
            {status.label}
          </div>
        </div>
      </div>

      {/* Dates + Bill To */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '36px' }}>
        {/* Bill To */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '6px' }}>
            Bill To
          </div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a2e' }}>
            {invoice.client.name || <span style={{ color: '#d1d5db' }}>Client Name</span>}
          </div>
          {invoice.client.address && (
            <div style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'pre-line', lineHeight: '1.6', marginTop: '3px' }}>
              {invoice.client.address}
            </div>
          )}
          {invoice.client.email && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{invoice.client.email}</div>
          )}
        </div>

        {/* Issue Date */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '6px' }}>
            Issue Date
          </div>
          <div style={{ fontSize: '13px', color: '#374151' }}>
            {formatDate(invoice.issueDate) || '—'}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '6px' }}>
            Due Date
          </div>
          <div style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>
            {formatDate(invoice.dueDate) || '—'}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#f3f0e8', marginBottom: '24px' }} />

      {/* Line Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ background: '#1a1a2e' }}>
            <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#c9a84c', textTransform: 'uppercase', borderRadius: '6px 0 0 6px' }}>
              Description
            </th>
            <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#c9a84c', textTransform: 'uppercase', width: '80px' }}>
              Qty
            </th>
            <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#c9a84c', textTransform: 'uppercase', width: '110px' }}>
              Unit Price
            </th>
            <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#c9a84c', textTransform: 'uppercase', width: '110px', borderRadius: '0 6px 6px 0' }}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, idx) => (
            <tr
              key={item.id || idx}
              style={{ borderBottom: '1px solid #f3f0e8', background: idx % 2 === 0 ? '#fff' : '#faf7f0' }}
            >
              <td style={{ padding: '11px 14px', fontSize: '13px', color: '#374151' }}>
                {item.description || <span style={{ color: '#d1d5db' }}>—</span>}
              </td>
              <td style={{ padding: '11px 14px', fontSize: '13px', color: '#374151', textAlign: 'right', fontFamily: 'monospace' }}>
                {item.quantity}
              </td>
              <td style={{ padding: '11px 14px', fontSize: '13px', color: '#374151', textAlign: 'right', fontFamily: 'monospace' }}>
                ${Number(item.unitPrice).toFixed(2)}
              </td>
              <td style={{ padding: '11px 14px', fontSize: '13px', color: '#1a1a2e', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                ${Number(item.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '36px' }}>
        <div style={{ width: '240px' }}>
          <TotalRow label="Subtotal" value={`$${Number(totals.subtotal).toFixed(2)}`} />
          {totals.discountAmount > 0 && (
            <TotalRow
              label={`Discount (${invoice.discountRate}%)`}
              value={`−$${Number(totals.discountAmount).toFixed(2)}`}
              valueColor="#dc2626"
            />
          )}
          {totals.taxAmount > 0 && (
            <TotalRow
              label={`Tax (${invoice.taxRate}%)`}
              value={`$${Number(totals.taxAmount).toFixed(2)}`}
            />
          )}
          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 14px',
            marginTop: '6px',
            background: '#1a1a2e',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Due
            </span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
              ${Number(totals.total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#f3f0e8', marginBottom: '24px' }} />

      {/* Notes & Payment Terms */}
      {(invoice.paymentTerms || invoice.notes) && (
        <div style={{ display: 'grid', gridTemplateColumns: invoice.notes ? '1fr 1fr' : '1fr', gap: '24px' }}>
          {invoice.paymentTerms && (
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '6px' }}>
                Payment Terms
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                {invoice.paymentTerms}
              </div>
            </div>
          )}
          {invoice.notes && (
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '6px' }}>
                Notes
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                {invoice.notes}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        paddingTop: '16px',
        borderTop: '1px solid #f3f0e8',
        textAlign: 'center',
        fontSize: '11px',
        color: '#9ca3af'
      }}>
        Thank you for your business! · Generated with InvoiceFlow
      </div>
    </div>
  )
})

function TotalRow({ label, value, valueColor = '#374151' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 14px', fontSize: '12px' }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ fontFamily: 'monospace', color: valueColor, fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export default InvoicePreview

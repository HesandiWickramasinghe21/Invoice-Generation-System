import { forwardRef } from 'react'
import { formatDate } from '../utils/invoiceUtils.js'

const STATUS_BADGE = {
  draft:   { bg: '#f3f4f6', color: '#6b7280', label: 'DRAFT' },
  sent:    { bg: '#dbeafe', color: '#1d4ed8', label: 'SENT' },
  paid:    { bg: '#dcfce7', color: '#15803d', label: 'PAID' },
  overdue: { bg: '#fee2e2', color: '#b91c1c', label: 'OVERDUE' }
}

const InvoicePreview = forwardRef(function InvoicePreview({ invoice, totals }, ref) {
  const status = STATUS_BADGE[invoice.status] || STATUS_BADGE.draft

  const s = {
    wrap: { fontFamily: "'DM Sans', sans-serif", background: '#fff', width: '100%', minHeight: '1050px', padding: '52px 56px', boxShadow: '0 8px 48px rgba(0,0,0,0.12)', borderRadius: '14px', color: '#1a1a2e', position: 'relative', overflow: 'hidden' },
    accentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #b8860b, #e8c04a, #c9a84c, #e8c04a, #b8860b)', borderRadius: '14px 14px 0 0' },
    brandName: { fontFamily: "'DM Serif Display', serif", fontSize: '23px', fontWeight: 400, color: '#1a1a2e', marginBottom: '5px' },
    billerMeta: { fontSize: '12px', color: '#6b7280', lineHeight: '1.65', whiteSpace: 'pre-line' },
    invoiceLabel: { fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: '#c9a84c', letterSpacing: '-1.5px', lineHeight: 1 },
    invNum: { fontFamily: 'monospace', fontSize: '13px', color: '#9ca3af', marginTop: '6px' },
    statusBadge: { display: 'inline-block', marginTop: '10px', padding: '3px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', background: status.bg, color: status.color },
    sectionLabel: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '7px' },
    sectionValue: { fontSize: '13px', color: '#374151', lineHeight: '1.6' },
    sectionValueBold: { fontSize: '14px', fontWeight: 600, color: '#1a1a2e', lineHeight: '1.6' },
    divider: { height: '1px', background: '#f0ece0', margin: '28px 0' },
    th: { textAlign: 'left', padding: '11px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#c9a84c', textTransform: 'uppercase' },
    thR: { textAlign: 'right', padding: '11px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#c9a84c', textTransform: 'uppercase' },
    td: { padding: '11px 16px', fontSize: '13px', color: '#374151', verticalAlign: 'top' },
    tdR: { padding: '11px 16px', fontSize: '13px', color: '#374151', textAlign: 'right', fontFamily: 'monospace' },
    tdRBold: { padding: '11px 16px', fontSize: '13px', fontWeight: 700, color: '#1a1a2e', textAlign: 'right', fontFamily: 'monospace' },
    totalBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', marginTop: '8px', background: '#1a1a2e', borderRadius: '10px' },
    footer: { marginTop: '44px', paddingTop: '18px', borderTop: '1px solid #f0ece0', textAlign: 'center', fontSize: '11px', color: '#9ca3af' }
  }

  return (
    <div ref={ref} id="invoice-preview-root" style={s.wrap}>
      <div style={s.accentBar} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', paddingTop: '14px' }}>
        <div>
          <div style={s.brandName}>{invoice.biller.name || <span style={{ color: '#d1d5db' }}>Your Company Name</span>}</div>
          <div style={s.billerMeta}>
            {invoice.biller.address && invoice.biller.address + '\n'}
            {invoice.biller.email}{invoice.biller.email && invoice.biller.phone ? ' · ' : ''}{invoice.biller.phone}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={s.invoiceLabel}>INVOICE</div>
          <div style={s.invNum}>{invoice.invoiceNumber}</div>
          <div style={s.statusBadge}>{status.label}</div>
        </div>
      </div>

      {/* Bill To / Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '28px', marginBottom: '32px' }}>
        <div>
          <div style={s.sectionLabel}>Bill To</div>
          <div style={s.sectionValueBold}>{invoice.client.name || <span style={{ color: '#d1d5db' }}>Client Name</span>}</div>
          {invoice.client.address && <div style={{ ...s.sectionValue, whiteSpace: 'pre-line', marginTop: '3px' }}>{invoice.client.address}</div>}
          {invoice.client.email && <div style={{ ...s.sectionValue, marginTop: '2px' }}>{invoice.client.email}</div>}
        </div>
        <div>
          <div style={s.sectionLabel}>Issue Date</div>
          <div style={s.sectionValue}>{formatDate(invoice.issueDate) || '—'}</div>
        </div>
        <div>
          <div style={s.sectionLabel}>Due Date</div>
          <div style={{ ...s.sectionValue, fontWeight: 600, color: '#1a1a2e' }}>{formatDate(invoice.dueDate) || '—'}</div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Line Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ background: '#1a1a2e', borderRadius: '8px' }}>
            <th style={{ ...s.th, borderRadius: '8px 0 0 8px' }}>Description</th>
            <th style={{ ...s.thR, width: '70px' }}>Qty</th>
            <th style={{ ...s.thR, width: '110px' }}>Unit Price</th>
            <th style={{ ...s.thR, width: '110px', borderRadius: '0 8px 8px 0' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, idx) => (
            <tr key={item.id || idx} style={{ borderBottom: '1px solid #f3f0e8', background: idx % 2 === 0 ? '#fff' : '#fdfcf8' }}>
              <td style={s.td}>{item.description || <span style={{ color: '#d1d5db' }}>—</span>}</td>
              <td style={s.tdR}>{item.quantity}</td>
              <td style={s.tdR}>${Number(item.unitPrice).toFixed(2)}</td>
              <td style={s.tdRBold}>${Number(item.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '36px' }}>
        <div style={{ width: '260px' }}>
          <TotalRow label="Subtotal" value={`$${Number(totals.subtotal).toFixed(2)}`} />
          {totals.discountAmount > 0 && <TotalRow label={`Discount (${invoice.discountRate}%)`} value={`−$${Number(totals.discountAmount).toFixed(2)}`} valueColor="#dc2626" />}
          {totals.taxAmount > 0 && <TotalRow label={`Tax (${invoice.taxRate}%)`} value={`$${Number(totals.taxAmount).toFixed(2)}`} />}
          <div style={s.totalBox}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Due</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>${Number(totals.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Notes & Terms */}
      {(invoice.paymentTerms || invoice.notes) && (
        <div style={{ display: 'grid', gridTemplateColumns: invoice.paymentTerms && invoice.notes ? '1fr 1fr' : '1fr', gap: '28px' }}>
          {invoice.paymentTerms && (
            <div>
              <div style={s.sectionLabel}>Payment Terms</div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.65' }}>{invoice.paymentTerms}</div>
            </div>
          )}
          {invoice.notes && (
            <div>
              <div style={s.sectionLabel}>Notes</div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.65' }}>{invoice.notes}</div>
            </div>
          )}
        </div>
      )}

      <div style={s.footer}>Thank you for your business! · Generated with InvoiceGenerator</div>
    </div>
  )
})

function TotalRow({ label, value, valueColor = '#374151' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 18px', fontSize: '12px', borderBottom: '1px solid #f5f3ee' }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ fontFamily: 'monospace', color: valueColor, fontWeight: 600 }}>{value}</span>
    </div>
  )
}

export default InvoicePreview

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ExportToolbar({ previewRef, invoice }) {
  const [exporting, setExporting] = useState(false)

  const handlePrint = () => window.print()

  const handleDownloadPDF = async () => {
    if (!previewRef?.current) { toast.error('Preview not ready.'); return }
    setExporting(true)
    const toastId = toast.loading('Generating PDF…')
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])
      const el = previewRef.current
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pw = pdf.internal.pageSize.getWidth()
      const ph = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pw) / canvas.width
      let left = imgH, pos = 0
      pdf.addImage(imgData, 'PNG', 0, pos, pw, imgH)
      left -= ph
      while (left > 0) { pos = left - imgH; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, pos, pw, imgH); left -= ph }
      const clientSlug = invoice.client?.name?.replace(/\s+/g, '-') || 'client'
      pdf.save(`${invoice.invoiceNumber || 'invoice'}-${clientSlug}.pdf`)
      toast.success('PDF downloaded!', { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error('PDF failed — try Print instead.', { id: toastId })
    } finally { setExporting(false) }
  }

  const btnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
    fontWeight: 500, cursor: 'pointer', border: '1px solid #e5e7eb',
    background: 'white', color: '#374151', transition: 'background 0.15s'
  }

  return (
    <div className="flex items-center gap-2 no-print">
      <button onClick={handlePrint} style={btnStyle} title="Print invoice"
        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span className="hidden sm:inline">Print</span>
      </button>
      <button onClick={handleDownloadPDF} disabled={exporting} style={{ ...btnStyle, background: exporting ? '#f9fafb' : 'white' }} title="Download PDF"
        onMouseEnter={e => !exporting && (e.currentTarget.style.background = '#f9fafb')}
        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">{exporting ? 'Exporting…' : 'PDF'}</span>
      </button>
    </div>
  )
}

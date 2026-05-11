import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ExportToolbar({ previewRef, invoice, totals }) {
  const [exporting, setExporting] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!previewRef?.current) {
      toast.error('Preview not ready.')
      return
    }

    setExporting(true)
    const toastId = toast.loading('Generating PDF…')

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])

      const element = previewRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const filename = `${invoice.invoiceNumber || 'invoice'}-${invoice.client?.name?.replace(/\s+/g, '-') || 'client'}.pdf`
      pdf.save(filename)

      toast.success('PDF downloaded!', { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error('PDF generation failed. Try the Print option.', { id: toastId })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex items-center gap-2 no-print">
      <button
        onClick={handlePrint}
        className="btn-secondary"
        title="Print invoice"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span className="hidden sm:inline">Print</span>
      </button>

      <button
        onClick={handleDownloadPDF}
        disabled={exporting}
        className="btn-secondary"
        title="Download as PDF"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">{exporting ? 'Exporting…' : 'Download PDF'}</span>
      </button>
    </div>
  )
}

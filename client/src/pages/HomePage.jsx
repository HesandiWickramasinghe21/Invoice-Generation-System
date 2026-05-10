import { useNavigate } from 'react-router-dom'

const features = [
  {
    title: 'Live Preview',
    desc: 'See your invoice update in real-time as you type, no refresh needed.'
  },
  {
    title: 'Auto - Save',
    desc: 'Invoices are saved locally, so you never lose your work mid-draft.'
  },
  {
    title: 'PDF Export',
    desc: 'Download a pixel-perfect PDF or send directly to your printer.'
  }
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-[calc(100vh-56px)] w-full"
      style={{ background: '#f0ebe0' }}
    >
      <div className="max-w-screen-xl mx-auto px-8 sm:px-12 lg:px-20 flex items-center min-h-[calc(100vh-56px)]">

        {/* Left column */}
        <div className="flex-1 pr-0 lg:pr-16 py-16 flex flex-col justify-center">

          <h1 style={{ fontFamily: "'DM Serif Display', serif", lineHeight: 1.05 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-normal text-ink mb-7 tracking-tight"
          >
            PROFESSIONAL<br />
            <span style={{ color: '#c9a84c' }}>INVOICE</span><br />
            <span style={{ color: '#c9a84c' }}>GENERATOR</span>
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            Build Professional invoices with real-time preview, automatic calculations,
            and one-click PDF export, Your clients will be impressed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/invoice/new')}
              style={{ background: '#e8a020', border: 'none' }}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-base hover:opacity-90 transition-opacity cursor-pointer"
            >
              + Create New Invoice
            </button>
            <button
              onClick={() => navigate('/invoices')}
              style={{ background: 'white', border: '1.5px solid #d1ccc0' }}
              className="flex items-center justify-center px-7 py-3.5 rounded-xl text-ink font-semibold text-base hover:bg-gray-50 transition-colors cursor-pointer"
            >
              View Saved Invoices
            </button>
          </div>
        </div>

        {/* Right column */}
        <div
          className="hidden lg:flex flex-col gap-4 py-16"
          style={{ width: '320px', flexShrink: 0 }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-7 shadow-sm"
              style={{
                marginLeft: i === 1 ? '-32px' : '0px',
                boxShadow: '0 2px 20px rgba(0,0,0,0.07)'
              }}
            >
              <h3
                style={{ fontFamily: "'DM Serif Display', serif" }}
                className="text-lg font-normal text-ink mb-2"
              >
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile feature cards*/}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 flex gap-4 overflow-x-auto px-8 pb-6 pt-2 no-scrollbar">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-5 shadow-sm flex-shrink-0 w-56"
              style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}
            >
              <h3 className="font-semibold text-ink text-sm mb-1">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

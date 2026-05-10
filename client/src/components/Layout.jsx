import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0ebe0' }}>
      {/* Navbar */}
      <header
        className="no-print sticky top-0 z-50"
        style={{ background: '#1a1a2e', height: '60px' }}
      >
        <div className="max-w-screen-xl mx-auto px-8 sm:px-12 lg:px-20 flex items-center justify-between h-full">

          {/* Brand */}
          <button
            onClick={() => navigate('/')}
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: 'white', letterSpacing: '-0.3px' }}
            className="hover:opacity-80 transition-opacity"
          >
            InvoiceGenerator
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? '' : ''}
              style={({ isActive }) => ({
                padding: '7px 18px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'white',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none',
                transition: 'background 0.15s'
              })}
            >
              Home
            </NavLink>

            <NavLink
              to="/invoices"
              style={({ isActive }) => ({
                padding: '7px 18px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s'
              })}
            >
              Saved Invoices
            </NavLink>

            <button
              onClick={() => navigate('/invoice/new')}
              style={{
                marginLeft: '6px',
                padding: '8px 20px',
                borderRadius: '10px',
                background: '#e8a020',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.15s'
              }}
              onMouseEnter={e => e.target.style.opacity = '0.88'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              + New Invoice
            </button>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

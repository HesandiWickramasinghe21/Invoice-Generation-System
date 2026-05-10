import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import InvoiceEditorPage from './pages/InvoiceEditorPage.jsx'
import SavedInvoicesPage from './pages/SavedInvoicesPage.jsx'
import Layout from './components/Layout.jsx'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="invoice/new" element={<InvoiceEditorPage />} />
                <Route path="invoice/edit/:id" element={<InvoiceEditorPage />} />
                <Route path="invoices" element={<SavedInvoicesPage />} />
            </Route>
        </Routes>
    )
}
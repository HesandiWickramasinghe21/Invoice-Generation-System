import { v4 as uuidv4 } from 'uuid'

// Generate a unique invoice number
export const generateInvoiceNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `INV-${year}${month}-${random}`
}

// Create a blank line item
export const createLineItem = () => ({
  id: uuidv4(),
  description: '',
  quantity: 1,
  unitPrice: 0,
  amount: 0
})

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

// Format date for display
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Today's date as YYYY-MM-DD
export const todayISO = () => {
  return new Date().toISOString().split('T')[0]
}

// Due date 30 days from now as YYYY-MM-DD
export const dueDateISO = (daysFromNow = 30) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}

// Calculate invoice totals
export const calculateTotals = (lineItems, taxRate = 0, discountRate = 0) => {
  const subtotal = lineItems.reduce((sum, item) => {
    const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)
    return sum + amount
  }, 0)
  const discountAmount = (subtotal * (parseFloat(discountRate) || 0)) / 100
  const afterDiscount = subtotal - discountAmount
  const taxAmount = (afterDiscount * (parseFloat(taxRate) || 0)) / 100
  const total = afterDiscount + taxAmount
  return { subtotal, discountAmount, taxAmount, total }
}

// Empty invoice state
export const emptyInvoice = () => ({
  invoiceNumber: generateInvoiceNumber(),
  issueDate: todayISO(),
  dueDate: dueDateISO(30),
  status: 'draft',
  biller: {
    name: '',
    address: '',
    email: '',
    phone: ''
  },
  client: {
    name: '',
    address: '',
    email: ''
  },
  lineItems: [createLineItem()],
  taxRate: 0,
  discountRate: 0,
  notes: '',
  paymentTerms: 'Payment due within 30 days of invoice date.'
})

// LocalStorage helpers
const LS_KEY = 'invoiceflow_invoices'

export const lsGetAll = () => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const lsSave = (invoice) => {
  const all = lsGetAll()
  const idx = all.findIndex(inv => inv._id === invoice._id)
  const toSave = { ...invoice, updatedAt: new Date().toISOString() }
  if (!toSave._id) toSave._id = uuidv4()
  if (!toSave.createdAt) toSave.createdAt = new Date().toISOString()
  if (idx >= 0) {
    all[idx] = toSave
  } else {
    all.unshift(toSave)
  }
  localStorage.setItem(LS_KEY, JSON.stringify(all))
  return toSave
}

export const lsDelete = (id) => {
  const all = lsGetAll().filter(inv => inv._id !== id)
  localStorage.setItem(LS_KEY, JSON.stringify(all))
}

export const lsGetById = (id) => {
  return lsGetAll().find(inv => inv._id === id) || null
}


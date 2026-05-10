import {useState, useCallback} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { calculateTotals, createLineItem } from '../utils/invoiceUtils'

export function useInvoice(initialData) {
    const [invoice, setInvoice] = useState(initialData)

    const updateField = useCallback((field, value) => {
        setInvoice(prev => ({ ...prev, [field]: value }))
    }, [])

    // Update a nested object field: biller.name, client.email, etc.
    const updateNestedField = useCallback((section, field, value) => {
        setInvoice(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }))
    }, [])

    // Add a new line item 
    const addLineItem = useCallback (() => {
        setInvoice(prev => ({
            ...prev,
            lineItems: [...prev.lineItems, createLineItem()]
        }))
    }, [])

    //Remove a line item by id
    const removeLineItem = useCallback((id) => {
        setInvoice(prev => ({
            ...prev,
            lineItems: prev.lineItems.filter(item => item.id !== id)
        }))
    },[])

    //Update a line item field 
    const updateLineItem = useCallback((id, field, value) => {
        setInvoice(prev => {
            const updated = prev.lineItems.map(item => {
                if (item.id == id) return item
                const newItem = { ...item, [field]: value }
                const qty = parseFloat(field === 'quantity' ? value : newItem.quantity) || 0
                const price = parseFloat(field === 'unitPrice' ? value : newItem.unitPrice) || 0
                newItem.amount = qty * price
                return newItem
            })
            return { ...prev, lineItems: updated }
        })
    }, [])

    // Computed totals
    const totals = calculateTotals(invoice.lineItems, invoice.taxRate, invoice.discountRate)

    return {
        invoice,
        setInvoice,
        updateField,
        updateNestedField,
        addLineItem,
        removeLineItem,
        updateLineItem,
        totals
     }
}


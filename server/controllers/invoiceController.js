const Invoice = require('../models/Invoice');
const { v4: uuidv4 } = require('uuid');

// Generate a unique invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}-${random}`;
};

// GET /api/invoices — list all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/invoices/:id — get single invoice
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/invoices — create invoice
const createInvoice = async (req, res) => {
  try {
    const body = req.body;
    if (!body.invoiceNumber) {
      body.invoiceNumber = generateInvoiceNumber();
    }
    const invoice = new Invoice(body);
    await invoice.save();
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Invoice number already exists' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT /api/invoices/:id — update invoice
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /api/invoices/:id — delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/invoices/generate-number — get a fresh invoice number
const getNewInvoiceNumber = (req, res) => {
  res.json({ success: true, invoiceNumber: generateInvoiceNumber() });
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getNewInvoiceNumber
};

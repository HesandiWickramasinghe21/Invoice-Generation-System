const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0},
    unitPrice: { type: Number, required: true, min: 0},
    amount: { type: Number, required: true}
}, {_id: false});

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue'],
        default: 'draft'
    },
    issueDate: { type: Date, required: true},
    dueDate: { type: Date, required: true},

    //Biller Details
    biller: {
        name: { type: String, required: true, trim: true },
        address: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true }
    },

    // Client details
    client: {
        name: { type: String, required: true, trim: true },
        address: { type: String, trim: true },
        email: { type: String, trim: true }
    },

    //Line items
    lineItems: [lineItemSchema],

    // Financials
    subtotal: { type: Number, required: true, default: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, default: 0 },
    discountRate: { type: Number, default: 0, min: 0, max: 100 },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },    

    // Notes
    notes: { type: String, trim: true },
    paymentTerms: { type: String, trim: true }
}, {
    timestamps: true
});

// Auto-compute amounts before save
invoiceSchema.pre('save', function () {
  this.subtotal = this.lineItems.reduce((sum, item) => sum + item.amount, 0);
  this.discountAmount = (this.subtotal * this.discountRate) / 100;
  const afterDiscount = this.subtotal - this.discountAmount;
  this.taxAmount = (afterDiscount * this.taxRate) / 100;
  this.total = afterDiscount + this.taxAmount;
});

module.exports = mongoose.model('Invoice', invoiceSchema);


export default function LineItemsTable({ lineItems, updateLineItem, removeLineItem, addLineItem }) {
  return (
    <div>
      {/* Header */}
      <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
        <div className="col-span-5">Description</div>
        <div className="col-span-2 text-right">Qty</div>
        <div className="col-span-2 text-right">Unit Price</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-1" />
      </div>

      <div className="space-y-2">
        {lineItems.map((item, idx) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center group">
            <div className="col-span-12 sm:col-span-5">
              {idx === 0 && <label className="block sm:hidden text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</label>}
              <input className="input-field text-sm" placeholder="Item or service description"
                value={item.description} onChange={e => updateLineItem(item.id, 'description', e.target.value)} />
            </div>
            <div className="col-span-4 sm:col-span-2">
              {idx === 0 && <label className="block sm:hidden text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Qty</label>}
              <input type="number" min="0" step="1" className="input-field text-sm text-right"
                value={item.quantity} onChange={e => updateLineItem(item.id, 'quantity', e.target.value)} />
            </div>
            <div className="col-span-4 sm:col-span-2">
              {idx === 0 && <label className="block sm:hidden text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Unit Price</label>}
              <input type="number" min="0" step="0.01" className="input-field text-sm text-right"
                value={item.unitPrice} onChange={e => updateLineItem(item.id, 'unitPrice', e.target.value)} />
            </div>
            <div className="col-span-3 sm:col-span-2 text-right pr-1">
              {idx === 0 && <label className="block sm:hidden text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Amount</label>}
              <span className="text-sm font-semibold text-ink font-mono">${Number(item.amount).toFixed(2)}</span>
            </div>
            <div className="col-span-1 flex justify-end">
              <button type="button" onClick={() => removeLineItem(item.id)} disabled={lineItems.length === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-base"
                title="Remove row">✕</button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addLineItem}
        className="mt-4 text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-colors group">
        <span className="w-5 h-5 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-xs transition-colors">+</span>
        Add Line Item
      </button>
    </div>
  )
}

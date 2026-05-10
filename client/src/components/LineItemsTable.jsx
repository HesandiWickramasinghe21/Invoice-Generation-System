import { formatCurrency } from '../utils/invoiceUtils.js'

export default function LineItemsTable({ lineItems, updateLineItem, removeLineItem, addLineItem }) {
    return (
        <div>
            {/*Header row*/}
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1"></div>
            </div>

            <div className="space-y-2">
                {lineItems.map((item, idx) => (
                    <div 
                        key={item.id}
                        className="grid grid-cols-12 gap-2 items-center slide-in"
                    >
                        {/*Description*/}
                        <div className="col-span-12 sm:col-span-5">
                            {idx === 0 && (
                                <label className="block sm:hidden text-xs font-medium text-gray-500 mb-1">Description</label>
                            )}
                            <input
                                className="input-field text-sm"
                                placeholder="Item description"
                                value={item.description}
                                onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                            />
                        </div>

                        {/*Qty*/}
                        <div className="col-span-4 sm:col-span-2">
                            <input
                                type="number"
                                min="0"
                                step="1"
                                className="input-field text-sm text-right"
                                value={item.quantity}
                                onChange={e => updateLineItem(item.id, 'quantity', e.target.value)}
                            />
                        </div>

                        {/*Unit Price*/}
                        <div className="col-span-4 sm:col-span-2">
                            {idx === 0 && (
                                <label className="block sm:hidden text-xs font-medium text-gray-500 mb-1">Unit Price</label>
                            )}
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="input-field text-sm text-right"
                                value={item.unitPrice}
                                onChange={e => updateLineItem(item.id, 'unitPrice', e.target.value)}
                            />
                        </div>

                        {/*Amount*/}
                        <div className="col-span-3 sm:col-span-2 text right">
                            {idx === 0 && (
                                <label className="block sm:hidden text-xs font-medium text-gray-500 mb-1">Amount</label>
                            )}
                            <span className="text-sm font-medium text-ink font-mono">
                                ${Number(item.amount).toFixed(2)}
                            </span>
                        </div>

                        {/*Remove Button*/}
                        <div className="col-span-1 flex justify-end">
                            <button
                                type="button"
                                onClick={() => removeLineItem(item.id)}
                                disabled={lineItems.length === 1}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remove item"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addLineItem}
                className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1.5 transition-colors">
                <span className="text-base leading-none">+</span> Add Line Item
            </button>
        </div>
    )
}
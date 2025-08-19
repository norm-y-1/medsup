import { useUnit } from 'effector-react'
import { $isCartOpen, $cart, closeCart, removeItem, changeQty, checkoutFx } from '../model/cart'
import { useEffect, useState } from 'react'
import { api } from '../../../entities/product/api/mockApi'
import { formatCents } from '../../../shared/lib/money'

export function CartDrawer() {
  const isOpen = useUnit($isCartOpen)
  const cart = useUnit($cart)

  const [products, setProducts] = useState<Record<string, { name: string; priceCents: number }> | null>(null)
  useEffect(() => {
    api.listProducts({ limit: 1000 }).then(res => {
      const map = Object.fromEntries(res.items.map(p => [p.id, { name: p.name, priceCents: p.priceCents }]))
      setProducts(map)
    })
  }, [])

  return (
    <div
      className={`fixed inset-0 z-20 ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={() => closeCart()}
        className={`absolute inset-0 bg-black/30 transition ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cart</h2>
          <button onClick={() => closeCart()} className="text-slate-500 hover:text-slate-700">Close</button>
        </div>
        <div className="p-4 space-y-4">
          {cart.items.length === 0 && <div className="text-slate-500">Your cart is empty.</div>}
          {cart.items.map(item => {
            const product = products?.[item.productId]
            return (
              <div key={item.productId} className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium">{product?.name ?? 'Product'}</div>
                  <div className="text-sm text-slate-500">{formatCents(product?.priceCents ?? 0)} ×</div>
                </div>
                <input
                  aria-label="Quantity"
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={e => changeQty({ productId: item.productId, qty: Number(e.target.value) })}
                  className="w-16 rounded-lg border p-2"
                />
                <button className="text-red-600" onClick={() => removeItem({ productId: item.productId })}>Remove</button>
              </div>
            )
          })}
        </div>
        <div className="p-4 border-t mt-auto">
          <button
            data-testid="checkout"
            className="btn btn-primary w-full"
            disabled={cart.items.length === 0}
            onClick={() => checkoutFx()}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  )
}

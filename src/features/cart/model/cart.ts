import { createEffect, createEvent, createStore } from 'effector'
import type { CartItem, Order, Product } from '../../../shared/types'
import { readJSON, writeJSON } from '../../../shared/lib/storage'
import { api } from '../../../entities/product/api/mockApi'
import { formatCents } from '../../../shared/lib/money'
import { createGate, useUnit } from 'effector-react'

const CART_KEY = 'cart'

export type CartState = {
  items: CartItem[]
}

const loadCart = (): CartState => readJSON<CartState>(CART_KEY, { items: [] })
const saveCart = (state: CartState) => writeJSON<CartState>(CART_KEY, state)

export const $cart = createStore<CartState>(loadCart())
$cart.watch(saveCart)

export const $cartCount = $cart.map(s => s.items.reduce((acc, i) => acc + i.qty, 0))

export const addItem = createEvent<{ productId: string; qty?: number }>()
export const removeItem = createEvent<{ productId: string }>()
export const changeQty = createEvent<{ productId: string; qty: number }>()
export const clearCart = createEvent()

$cart.on(addItem, (state, { productId, qty = 1 }) => {
  const existing = state.items.find(i => i.productId === productId)
  if (existing) existing.qty += qty
  else state.items.push({ productId, qty })
  return { ...state, items: [...state.items] }
})
.on(removeItem, (state, { productId }) => ({ ...state, items: state.items.filter(i => i.productId !== productId) }))
.on(changeQty, (state, { productId, qty }) => ({ ...state, items: state.items.map(i => i.productId === productId ? { ...i, qty } : i) }))
.on(clearCart, () => ({ items: [] }))

export const checkoutFx = createEffect(async () => {
  const cart = $cart.getState()
  if (cart.items.length === 0) return null

  const products = (await api.listProducts({ limit: 1000 })).items
  const items = cart.items.map(i => {
    const product = products.find(p => p.id === i.productId)
    if (!product) throw new Error('Product not found')
    return { productId: i.productId, qty: i.qty, priceCents: product.priceCents }
  })
  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.qty, 0)
  const order: Order = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    items,
    subtotalCents
  }
  const orders = readJSON<Order[]>('orders', [])
  orders.push(order)
  writeJSON('orders', orders)
  clearCart()
  return order
})

/** Lightweight UI state for drawer */
export const openCart = createEvent()
export const closeCart = createEvent()
export const $isCartOpen = createStore(false).on(openCart, () => true).on(closeCart, () => false)

export function useCartProducts(products: Product[]) {
  const state = useUnit($cart)
  const map = new Map(products.map(p => [p.id, p]))
  const enriched = state.items
    .map(i => ({ ...i, product: map.get(i.productId)! }))
    .filter(i => i.product !== undefined)
  const total = enriched.reduce((sum, i) => sum + i.qty * i.product.priceCents, 0)
  return { items: enriched, totalText: formatCents(total), isEmpty: enriched.length === 0 }
}

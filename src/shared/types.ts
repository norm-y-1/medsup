/** Domain types kept small but precise & extensible. */

export type CategoryId =
  | 'advanced-wound-care'
  | 'anesthesia'
  | 'apparel'
  | 'beds-mattresses'
  | 'diagnostics'
  | 'gloves'
  | ''

export interface Category {
  id: CategoryId
  name: string
  description: string
  icon?: string
}

export interface Product {
  id: string
  name: string
  description: string
  categoryId: CategoryId
  priceCents: number
  sku: string
  uom: 'ea' | 'box' | 'case'
  stock: number
  image?: string
}

export interface ProductFilter {
  search?: string
  categoryId?: CategoryId
  sort?: 'name' | 'price'
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface Paginated<T> {
  items: T[]
  total: number
}

export interface CartItem {
  productId: string
  qty: number
}

export interface Order {
  id: string
  createdAt: string
  items: Array<CartItem & { priceCents: number }>
  subtotalCents: number
}

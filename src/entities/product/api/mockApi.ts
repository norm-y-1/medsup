import { Category, Paginated, Product, ProductFilter } from '../../../shared/types'
import { readJSON, writeJSON } from '../../../shared/lib/storage'
import { newId } from '../../../shared/lib/id'

const DB_KEYS = {
  products: 'products',
  categories: 'categories',
  orders: 'orders'
} as const

const LATENCY_MS = 360

function delay<T>(value: T, ms: number = LATENCY_MS): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

function seed() {
  const seeded = readJSON<boolean>('seeded', false)
  if (seeded) return
  const categories: Category[] = [
    { id: 'advanced-wound-care', name: 'Advanced Wound Care', description: 'Dressings, gels, and more.' },
    { id: 'anesthesia', name: 'Anesthesia', description: 'Masks and circuits.' },
    { id: 'apparel', name: 'Apparel', description: 'Professional scrubs and gowns.' },
    { id: 'beds-mattresses', name: 'Beds & Mattresses', description: 'Hospital-grade frames and toppers.' },
    { id: 'diagnostics', name: 'Diagnostics', description: 'Meters, cuffs, and thermometers.' },
    { id: 'gloves', name: 'Gloves', description: 'Nitrile and latex exam gloves.' }
  ]
  const products: Product[] = [
    {
      id: newId('p'),
      name: 'Digital Thermometer',
      description: 'Fast-reading digital thermometer with flexible tip.',
      categoryId: 'diagnostics',
      priceCents: 145,
      sku: 'DTH-100',
      uom: 'ea',
      stock: 75,
      image: 'https://www.medline.com/media/catalog/CA21/CA21_17/PF139130/D1200012663415122_040220240936.jpg'
    },
    {
      id: newId('p'),
      name: 'Nitrile Exam Gloves (200 ct)',
      description: 'Powder-free nitrile gloves with textured fingertips.',
      categoryId: 'gloves',
      priceCents: 621,
      sku: 'NGL-200',
      uom: 'box',
      stock: 120,
      image: 'https://www.medline.com/media/catalog/CA02/CA02_06/PF21882/D1200012663292664_100420250738.jpg'
    },
    {
      id: newId('p'),
      name: 'Standard Scrub Top',
      description: 'Breathable fabric, unisex fit.',
      categoryId: 'apparel',
      priceCents: 2499,
      sku: 'SST-01',
      uom: 'ea',
      stock: 90,
      image: 'https://www.medline.com/media/catalog/MasterDataCatalog/CA07/CA07_02/CA07_02_09/CA07_02_09_04/CA07_02_09_04_02/PF76521/D1200012884670_210720250210.jpg'
    },
    {
      id: newId('p'),
      name: 'EQUOS Calcium Alginate Wound Dressings with Silver',
      description: "Will convert to a soft and cohesive gel when moistened to help maintain a moist environment and help with autolytic debridement, removing nonviable tissue",
      categoryId: 'advanced-wound-care',
      priceCents: 1899,
      sku: 'HCD-4040',
      uom: 'box',
      stock: 42,
      image: 'https://www.medline.com/media/catalog/sku/EQX/D1200012663328258_130320240535.jpg'
    },
    {
      id: newId('p'),
      name: 'Anesthesia Mask (small)',
      description: 'Soft cushion for improved patient comfort.',
      categoryId: 'anesthesia',
      priceCents: 1123,
      sku: 'ANM-S',
      uom: 'ea',
      stock: 50,
      image: 'https://www.medline.com/media/catalog/sku/DYN/D1200012663319509_270520240808.jpg'
    }
  ]
  writeJSON(DB_KEYS.categories, categories)
  writeJSON(DB_KEYS.products, products)
  writeJSON('seeded', true)
}
seed()

export type ListProductsResult = Paginated<Product>

export const api = {
  async categories(): Promise<Category[]> {
    return delay(readJSON<Category[]>(DB_KEYS.categories, []))
  },
  async listProducts(filter: ProductFilter = {}): Promise<ListProductsResult> {
    const all = readJSON<Product[]>(DB_KEYS.products, [])
    const { search, categoryId, sort = 'name', order = 'asc', limit = 24, offset = 0 } = filter

    let items = all.slice()
    if (categoryId) items = items.filter(p => p.categoryId === categoryId)
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    const total = items.length
    const paged = items.slice(offset, offset + limit)
    paged.sort((a, b) => {
      const dir = order === 'asc' ? 1 : -1
      if (sort === 'name') return a.name.localeCompare(b.name) * dir
      return (a.priceCents - b.priceCents) * dir
    })
    return delay({ items: paged, total })
  },
  
  async getProduct(id: string): Promise<Product | null> {
    const all = readJSON<Product[]>(DB_KEYS.products, [])
    return delay(all.find(p => p.id === id) ?? null)
  },
  async upsertProduct(input: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const all = readJSON<Product[]>(DB_KEYS.products, [])
    const product: Product = { ...input, id: input.id ?? newId('p') }
    const idx = all.findIndex(p => p.id === product.id)
    if (idx >= 0) all[idx] = product
    else all.push(product)
    writeJSON(DB_KEYS.products, all)
    return delay(product)
  },
  async reset(): Promise<void> {
    writeJSON('seeded', false)
    seed()
    await delay(undefined)
  },
  async createProduct(input: Omit<Product, 'id'>): Promise<Product> {
    const product: Product = { ...input, id: newId('p') }
    const all = readJSON<Product[]>(DB_KEYS.products, [])
    all.push(product)
    writeJSON(DB_KEYS.products, all)
    return delay(product)
  }
}

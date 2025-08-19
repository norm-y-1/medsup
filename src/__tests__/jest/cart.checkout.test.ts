/**
 * Tests checkout effect: aggregates priced items, writes an order, and clears cart.
 * API listProducts is mocked for deterministic pricing.
 */
import { $cart, addItem, checkoutFx } from '../../features/cart/model/cart';
import { readJSON } from '../../shared/lib/storage';
import { Product } from '../../shared/types';

const mockProducts: Product[] = [
  {
    id: 'p-ck-1',
    name: 'Scrub Top',
    description: 'Unisex fit',
    categoryId: 'apparel',
    priceCents: 2500,
    sku: 'SST-01',
    uom: 'ea',
    stock: 10,
  },
];

jest.mock('../../entities/product/api/mockApi', () => ({
  api: {
    listProducts: jest.fn(async () => ({ items: mockProducts, total: mockProducts.length })),
  },
}));

describe('cart checkout', () => {
  beforeEach(() => {
    localStorage.clear();
    ($cart as any).setState({ items: [] });
  });

  it('creates an order and clears the cart', async () => {
    // Arrange: add item to cart
    addItem({ productId: 'p-ck-1', qty: 2 });

    // Act
    const order = await checkoutFx();

    // Assert: order totals and persistence
    expect(order).not.toBeNull();
    expect(order!.items).toEqual([{ productId: 'p-ck-1', qty: 2, priceCents: 2500 }]);
    expect(order!.subtotalCents).toBe(5000);

    // Order persisted
    const orders = readJSON('orders', [] as unknown[]);
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);

    // Cart cleared
    expect($cart.getState().items).toHaveLength(0);
  });
});



/**
 * Component test with RTL: verifies rendering and cart mutation via Effector event.
 * We isolate localStorage between tests to avoid cross-test state leakage.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { $cart } from '../../features/cart/model/cart';
import { ProductCard } from '../../entities/product/ui/ProductCard';
import { Product } from '../../shared/types';

const product: Product = {
  id: 'p-ui-1',
  name: 'Digital Thermometer',
  description: 'Fast-reading, flexible tip',
  categoryId: 'diagnostics',
  priceCents: 1299,
  sku: 'DTH-100',
  uom: 'ea',
  stock: 10,
};

describe('ProductCard', () => {
  beforeEach(() => {
    // reset cart & storage
    localStorage.clear();
    ($cart as any).setState({ items: [] });
  });

  it('renders product data and adds to cart', () => {
    render(<ProductCard product={product} />);

    // Basic content smoke
    expect(screen.getByText('Digital Thermometer')).toBeInTheDocument();
    expect(screen.getByText('DTH-100')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();

    // Add to cart
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    // Assert Effector cart store mutated as expected
    const state = $cart.getState();
    expect(state.items).toEqual([{ productId: 'p-ui-1', qty: 1 }]);

    // And persisted (localStorage namespace key begins with `medsup.v1:`)
    const persistedKeys = Object.keys(localStorage);
    const cartKey = persistedKeys.find((k) => k.includes(':cart'));
    expect(cartKey).toBeTruthy();
    const persisted = JSON.parse(localStorage.getItem(cartKey!) as string);
    expect(persisted.items).toHaveLength(1);
  });
});

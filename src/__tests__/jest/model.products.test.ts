/**
 * Effector model tests for products filter & fetching.
 * We mock the API to assert integration without touching the network or localStorage.
 */
import { waitFor } from '@testing-library/react';

// Mock the API used by the effect handler
const mockItems: Product[] = [
  {
    id: 'p-1',
    name: 'Nitrile Exam Gloves',
    description: 'Powder-free nitrile gloves',
    categoryId: 'gloves',
    priceCents: 2299,
    sku: 'NGL-200',
    uom: 'box',
    stock: 100,
  },
  {
    id: 'p-2',
    name: 'Hydrocolloid Dressing 4x4',
    description: 'Absorbent wound dressing',
    categoryId: 'advanced-wound-care',
    priceCents: 1899,
    sku: 'HCD-4040',
    uom: 'box',
    stock: 42,
  },
];

jest.mock('../../entities/product/api/mockApi', () => {
  return {
    api: {
      categories: jest.fn(async () => []),
      listProducts: jest.fn(async (filter: unknown) => ({
        items: mockItems,
        total: mockItems.length,
        _filterEcho: filter,
      })),
      getProduct: jest.fn(),
      upsertProduct: jest.fn(),
      reset: jest.fn(),
    },
  };
});

import { Product } from '../../shared/types';
import { $filter, $products, $total, filterChanged } from '../../entities/product/model/products';
import { api } from '../../entities/product/api/mockApi';

describe('products model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('merges filter patches and triggers fetch with the merged state', async () => {
    // Initial filter has limit: 24 (from the store default).
    expect($filter.getState().limit).toBe(24);

    // Send a patch
    filterChanged({ search: 'gloves' });

    // Effect is triggered by sample; wait until it runs & stores update
    await waitFor(() => {
      expect((api.listProducts as jest.Mock).mock.calls.length).toBeGreaterThan(0);
    });

    // The API received the merged filter (limit + our search)
    expect(api.listProducts).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 24, search: 'gloves' })
    );

    // Stores reflect the effect result
    await waitFor(() => {
      expect($products.getState()).toHaveLength(mockItems.length);
      expect($total.getState()).toBe(mockItems.length);
    });
  });

  it('subsequent patches preserve earlier properties', async () => {
    // First patch sets sort
    filterChanged({ sort: 'price' });
    // Second patch sets order; the merged state should contain both
    filterChanged({ order: 'desc' });

    await waitFor(() => {
      expect(api.listProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({ sort: 'price', order: 'desc', limit: 24 })
      );
    });
  });
});

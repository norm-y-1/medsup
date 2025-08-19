import { createEffect, createEvent, createStore, sample } from 'effector';
import { api } from '../api/mockApi';
import type { Category, Product, ProductFilter } from '../../../shared/types';

export const fetchCategoriesFx = createEffect<void, Category[]>(api.categories);
export const fetchProductsFx = createEffect<ProductFilter | void, { items: Product[]; total: number }>(
  (filter) => api.listProducts(filter ?? {})
);
export const createProductFx = createEffect<Omit<Product, 'id'> & { id?: string }, Product>(api.createProduct);

// 👇 accept partial patches & merge into current filter
export const filterChanged = createEvent<Partial<ProductFilter>>();

export const $filter = createStore<ProductFilter>({ limit: 24 })
  .on(filterChanged, (state, patch) => ({ ...state, ...patch }));

export const $categories = createStore<Category[]>([]).on(fetchCategoriesFx.doneData, (_, v) => v);
export const $products   = createStore<Product[]>([]).on(fetchProductsFx.doneData, (_, v) => v.items);
export const $total      = createStore<number>(0).on(fetchProductsFx.doneData, (_, v) => v.total);

// when a patch arrives, fetch using the merged filter
sample({
  clock: filterChanged,
  source: $filter,
  fn: (state) => state,
  target: fetchProductsFx,
});
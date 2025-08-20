import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $categories, $products, $total, createProductFx, fetchCategoriesFx, fetchProductsFx, filterChanged } from '../entities/product/model/products';
import { ProductCard } from '../entities/product/ui/ProductCard';
import { CategoryId, Product } from '../shared/types';
import { useDebouncedValue } from '../shared/hooks/useDebouncedValue';
import Dropdown from '../shared/ui/Dropdown';
import Popup from '../shared/ui/Popup';
import { ProductForm } from '../entities/product/ui/ProductForm';

export function CatalogPage() {
  const [products, total, categories] = useUnit([$products, $total, $categories]);
  // local search state + debounce
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    fetchCategoriesFx();
    fetchProductsFx({ limit: 24 });
  }, []);

  // when the debounced value changes, patch the filter
  useEffect(() => {
    // send undefined to clear the search in the filter
    filterChanged({ search: debouncedSearch === '' ? '' : debouncedSearch });
  }, [debouncedSearch]);

  const convertedDropdownOptionsWithAll = [{
    id: '',
    text: 'All',
    value: '',
  }, ...categories.map(c => ({
    id: c.id,
    text: c.name,
    value: c.id,
  }))];

  const sortOptionsByNameAndPriceWithAscDesc = [
    { id: 'name-asc', text: 'Name (A-Z)', value: 'name-asc' },
    { id: 'name-desc', text: 'Name (Z-A)', value: 'name-desc' },
    { id: 'price-asc', text: 'Price (Low to High)', value: 'price-asc' },
    { id: 'price-desc', text: 'Price (High to Low)', value: 'price-desc' },
  ];

  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* <button className='btn btn-primary' onClick={() => setIsCreateMode(!isCreateMode)}>
        Create
      </button> */}
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="text-xs text-slate-500">Search</label>
          <input
            data-testid="search"
            placeholder="Thermometer, gloves, HCD-4040..."
            className="w-full rounded-xl border p-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='flex flex-col'>
          <Dropdown
            text="Category"
            options={convertedDropdownOptionsWithAll}
            onChange={(option) => filterChanged({ categoryId: option.id as CategoryId })}
            label="Select Category"
            classN="w-56"
            dataTestId="category-dropdown"
          />
        </div>

        <div className='flex flex-col'>
          <Dropdown
            text="Sort by"
            options={sortOptionsByNameAndPriceWithAscDesc}
            onChange={(option) => {
              const [sort, order] = String(option.value).split('-');
              filterChanged({ sort: sort as 'name' | 'price', order: order as 'asc' | 'desc' });
            }}
            label="Sort by"
            classN="w-40"
            defaultValue={'Name (A-Z)'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      <div className="text-sm text-slate-500">{total} products</div>
      {isCreateMode && (
        <Popup isOpen={isCreateMode} onClose={() => setIsCreateMode(false)}>
          <h2>Create Product</h2>
          {/* Form for creating a product */}
          <ProductForm
            onSubmit={(product) => {
              // Handle product creation
              console.log('Creating product:', product);
              createProductFx(product)
              fetchProductsFx()
              setIsCreateMode(false);
            }} onCancel={() => setIsCreateMode(false)} />
        </Popup>
      )}
    </div>
  );
}
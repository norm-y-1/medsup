import React, { useState, useEffect } from 'react';
import { Product, CategoryId, Category } from '../../../shared/types';
import { $categories, fetchCategoriesFx } from '../model/products';
import { useStore } from 'effector-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'> | Product) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const categories = useStore($categories);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '' as CategoryId,
    priceCents: 0,
    sku: '',
    uom: 'ea' as 'ea' | 'box' | 'case',
    stock: 0,
    image: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategoriesFx();
    }
  }, [categories.length]);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        priceCents: product.priceCents,
        sku: product.sku,
        uom: product.uom,
        stock: product.stock,
        image: product.image || ''
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (formData.priceCents <= 0) {
      newErrors.priceCents = 'Price must be greater than 0';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData: Omit<Product, 'id'> = {
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      priceCents: formData.priceCents,
      sku: formData.sku,
      uom: formData.uom,
      stock: formData.stock,
      ...(formData.image && { image: formData.image })
    };

    if (product) {
      // Editing existing product
      const updatedProduct: Product = { ...productData, id: product.id };
      onSubmit(updatedProduct);
    } else {
      // Creating new product
      onSubmit(productData);
    }
  };

  const formatPrice = (cents: number): string => {
    return (cents / 100).toFixed(2);
  };

  const parsePrice = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => handleInputChange('categoryId', e.target.value as CategoryId)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
        </div>

        {/* Price and SKU Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              step="0.05"
              min="0"
              value={formatPrice(formData.priceCents)}
              onChange={(e) => handleInputChange('priceCents', parsePrice(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.priceCents ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.priceCents && <p className="mt-1 text-sm text-red-600">{errors.priceCents}</p>}
          </div>

          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <input
              type="text"
              id="sku"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value.toUpperCase())}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.sku ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ABC-123"
            />
            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
          </div>
        </div>

        {/* UOM and Stock Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unit of Measure */}
          <div>
            <label htmlFor="uom" className="block text-sm font-medium text-gray-700 mb-2">
              Unit of Measure
            </label>
            <select
              id="uom"
              value={formData.uom}
              onChange={(e) => handleInputChange('uom', e.target.value as 'ea' | 'box' | 'case')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ea">Each (ea)</option>
              <option value="box">Box</option>
              <option value="case">Case</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL (optional)
          </label>
          <input
            type="url"
            id="image"
            value={formData.image}
            onChange={(e) => handleInputChange('image', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

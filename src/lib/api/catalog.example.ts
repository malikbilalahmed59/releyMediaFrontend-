/**
 * Example usage of the Catalog API
 * 
 * This file demonstrates how to use the catalog API functions.
 * You can delete this file once you've integrated the API into your components.
 */

import {
  searchProducts,
  getProductsByCategory,
  getCategories,
  getProductDetail,
  getProducts,
  type SearchQueryParams,
} from './catalog';

// Example 1: Search for products
export async function exampleSearch() {
  const params: SearchQueryParams = {
    q: 'pen',
    min_price: 10,
    max_price: 100,
    min_quantity: 100,
    ordering: 'price_low_high',
    page: 1,
    page_size: 24,
  };

  try {
    const response = await searchProducts(params);
    console.log('Search results:', response);
    return response;
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Example 2: Get products by category
export async function exampleCategoryProducts() {
  try {
    const response = await getProductsByCategory(5, {
      subcategory_id: 12,
      min_price: 50,
      max_quantity: 500,
      page: 1,
    });
    console.log('Category products:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch category products:', error);
  }
}

// Example 3: Get all categories
export async function exampleGetCategories() {
  try {
    const response = await getCategories();
    console.log('Categories:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
}

// Example 4: Get product details
export async function exampleProductDetail() {
  try {
    const product = await getProductDetail('PEN-001');
    console.log('Product details:', product);
    return product;
  } catch (error) {
    console.error('Failed to fetch product detail:', error);
  }
}

// Example 5: Client-side usage in a React component
/*
'use client';

import { useState, useEffect } from 'react';
import { searchProducts, type SearchResponse } from '@/lib/api/catalog';

export function ProductSearchComponent() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchProducts({
        q: query,
        page: 1,
        page_size: 24,
        ordering: 'best_match',
      });
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {results && (
        <div>
          <p>Found {results.count} products</p>
          {results.results.map((product) => (
            <div key={product.id}>
              <h3>{product.product_name}</h3>
              <p>Price: ${product.min_price} - ${product.max_price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/







/**
 * Catalog API Service
 * 
 * Base URL can be easily updated here for different environments
 * For client-side calls, we use Next.js API routes as proxy to avoid CORS issues
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';
const USE_PROXY = typeof window !== 'undefined'; // Use proxy for client-side, direct for server-side

/**
 * Type definitions for Catalog API
 */
export interface SearchQueryParams {
  q?: string;
  brand?: string;
  closeout?: boolean;
  usa_made?: boolean;
  best_selling?: boolean;
  rush_service?: boolean;
  eco_friendly?: boolean;
  min_price?: number;
  max_price?: number;
  min_quantity?: number;
  max_quantity?: number;
  ordering?: 'best_match' | 'newest' | 'most_popular' | 'price_low_high' | 'price_high_low';
  page?: number;
  page_size?: number;
}

export interface Product {
  id: number;
  product_id: string;
  product_name: string;
  description?: string;
  product_brand?: string;
  primary_image_url?: string;
  primary_image?: string;
  image_count?: number;
  is_closeout?: boolean;
  ai_category?: string;
  ai_subcategory?: string;
  min_price: number;
  max_price: number;
  min_quantity: number;
  max_quantity: number | null;
  total_inventory?: number;
  in_stock?: boolean;
  usa_made?: boolean;
  last_sync_date?: string;
  [key: string]: any; // Allow for additional fields
}

export interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  current_page: number;
  total_pages: number;
  results: Product[];
  meta: {
    query?: string;
    total_results: number;
    filters_applied?: Record<string, string>;
    seo?: {
      title: string;
      description: string;
      canonical_url: string;
    };
    ordering?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  subcategories?: Array<{
    id: number;
    name: string;
  }>;
}

export interface CategoriesResponse {
  count: number;
  categories: Category[];
}

export interface CategoryProductsResponse extends SearchResponse {
  category: {
    id: number;
    name: string;
    subcategories: Array<{
      id: number;
      name: string;
    }>;
  };
  meta: SearchResponse['meta'] & {
    category_id: number;
    subcategory_id?: number;
  };
}

export interface PriceTier {
  quantity_min: number;
  quantity_max: number | null;
  price: string;
  discount_code: string;
}

export interface PriceGroup {
  id: number;
  group_name: string;
  currency: string;
  min_price: number;
  max_price: number;
  prices: PriceTier[];
}

export interface Color {
  id: number;
  color_name: string;
  hex_code?: string;
}

export interface Part {
  id: number;
  part_id: string;
  part_name: string;
  description?: string;
  country_of_origin?: string;
  primary_material?: string;
  shape?: string;
  is_closeout?: boolean;
  is_on_demand?: boolean | null;
  is_caution?: boolean;
  caution_comment?: string;
  is_hazmat?: boolean | null;
  lead_time?: number | null;
  is_rush_service?: boolean | null;
  gtin?: string;
  unspsc?: string;
  primary_color?: Color;
  colors?: Color[];
  apparel_size?: string;
  apparel_style?: string;
  label_size?: string;
  custom_size?: string;
  dimension?: string;
  specifications?: any;
  quantity_available?: number;
  min_price?: number;
  max_price?: number;
}

export interface Media {
  id: number;
  url: string;
  media_type: string;
  width?: number;
  height?: number;
}

export interface PriceTier {
  quantity_min: number;
  quantity_max: number | null;
  price: string;
  discount_code?: string;
}

export interface PriceGroup {
  id: number;
  group_name: string;
  currency: string;
  min_price: number;
  max_price: number;
  prices: PriceTier[];
}

export interface AICategory {
  id: number;
  name: string;
  subcategories?: Array<{
    id: number;
    name: string;
  }>;
}

export interface AISubcategory {
  id: number;
  name: string;
  category?: string;
}

export interface Keyword {
  keyword: string;
}

export interface MarketingPoint {
  point_type: string;
  point_copy: string;
}

export interface RelevantProduct extends Product {
  // Already has all Product fields
}

export interface ProductDetail extends Product {
  description: string;
  distributor_only_info?: string;
  is_caution?: boolean | null;
  caution_comment?: string;
  categories?: any[];
  parts: Part[];
  media: Media[];
  price_groups: PriceGroup[];
  ai_category?: AICategory;
  ai_subcategory?: AISubcategory;
  keywords?: Keyword[];
  marketing_points?: MarketingPoint[];
  relevant_products?: RelevantProduct[];
  [key: string]: any;
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'boolean') {
        searchParams.append(key, value.toString());
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

/**
 * Search Products API
 * 
 * @param params - Search query parameters
 * @returns Promise with search results
 */
export async function searchProducts(
  params: SearchQueryParams = {}
): Promise<SearchResponse> {
  const queryString = buildQueryString(params);
  
  // Use Next.js API route as proxy for client-side calls to avoid CORS
  const url = USE_PROXY 
    ? `/api/catalog/search${queryString ? `?${queryString}` : ''}`
    : `${API_BASE_URL}/api/catalog/search/${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

/**
 * Get Products by Category
 * 
 * @param categoryId - AI Category ID
 * @param params - Additional query parameters
 * @returns Promise with category products
 */
export async function getProductsByCategory(
  categoryId: number,
  params: SearchQueryParams & { subcategory_id?: number } = {}
): Promise<CategoryProductsResponse> {
  const queryString = buildQueryString(params);
  
  // Use Next.js API route as proxy for client-side calls to avoid CORS
  // Note: You'll need to create this API route if using category filtering
  const url = USE_PROXY 
    ? `/api/catalog/categories/${categoryId}/products${queryString ? `?${queryString}` : ''}`
    : `${API_BASE_URL}/api/catalog/categories/${categoryId}/products/${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching category products:', error);
    throw error;
  }
}

/**
 * List All Categories
 * 
 * @returns Promise with all categories
 */
export async function getCategories(): Promise<CategoriesResponse> {
  // Use Next.js API route as proxy for client-side calls to avoid CORS
  const url = USE_PROXY 
    ? `/api/catalog/categories`
    : `${API_BASE_URL}/api/catalog/categories/`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get Category by Slug/Name
 * Finds a category by matching its name (case-insensitive) to a slug
 * 
 * @param slug - The category slug to find
 * @returns Promise with the matching category or null
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categoriesData = await getCategories();
    const categories = categoriesData.categories || [];
    
    // Normalize the slug for comparison
    const normalizedSlug = slug.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    
    // Find category by matching normalized name to slug
    const category = categories.find(cat => {
      const categorySlug = cat.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');
      return categorySlug === normalizedSlug;
    });
    
    return category || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Get Product Detail
 * 
 * @param productId - Product ID
 * @returns Promise with product details
 */
export async function getProductDetail(productId: string): Promise<ProductDetail> {
  // Use Next.js API route as proxy for client-side calls to avoid CORS
  const url = USE_PROXY 
    ? `/api/catalog/products/${productId}/detail`
    : `${API_BASE_URL}/api/catalog/products/${productId}/detail/`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Product not found: ${productId}`);
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        const errorText = await response.text();
        errorData = { error: response.statusText, details: errorText };
      }
      
      const errorMessage = errorData.error || errorData.details || `API Error: ${response.status} ${response.statusText}`;
      console.error('Product detail API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url
      });
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
}

/**
 * Get Products (Standard DRF ViewSet)
 * 
 * @param params - Query parameters
 * @returns Promise with products
 */
export async function getProducts(
  params: SearchQueryParams = {}
): Promise<SearchResponse> {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/api/catalog/products/${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Export the base URL for easy updates
 */
export const CATALOG_API_BASE_URL = API_BASE_URL;


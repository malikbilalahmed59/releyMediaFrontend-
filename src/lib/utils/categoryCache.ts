/**
 * Category Cache Utility
 * Stores category data with counts in localStorage for persistence across page loads
 */

import { CategoryWithCount } from '@/lib/api/catalog';

const CACHE_KEY = 'relymedia_category_counts';
const CACHE_VERSION = '1.0';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData {
  version: string;
  timestamp: number;
  categories: CategoryWithCount[];
}

/**
 * Get cached category counts from localStorage
 */
export function getCachedCategoryCounts(): CategoryWithCount[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CachedData = JSON.parse(cached);
    
    // Check version compatibility
    if (data.version !== CACHE_VERSION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    // Check if cache is expired
    const now = Date.now();
    if (now - data.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data.categories || null;
  } catch (error) {
    console.error('Error reading category cache:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

/**
 * Save category counts to localStorage
 */
export function setCachedCategoryCounts(categories: CategoryWithCount[]): void {
  if (typeof window === 'undefined') return;
  
  const data: CachedData = {
    version: CACHE_VERSION,
    timestamp: Date.now(),
    categories,
  };
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving category cache:', error);
    // If quota exceeded, try to clear old cache
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (retryError) {
      console.error('Failed to save category cache after retry:', retryError);
    }
  }
}

/**
 * Get product count for a specific category by ID
 */
export function getCategoryCountById(categoryId: number): number | null {
  const cached = getCachedCategoryCounts();
  if (!cached) return null;
  
  const category = cached.find(cat => cat.id === categoryId);
  return category?.product_count ?? null;
}

/**
 * Get product count for a specific category by name
 */
export function getCategoryCountByName(categoryName: string): number | null {
  const cached = getCachedCategoryCounts();
  if (!cached) return null;
  
  const category = cached.find(cat => cat.name === categoryName);
  return category?.product_count ?? null;
}

/**
 * Get product count for a specific category by slug
 * Matches category name to slug (normalized comparison)
 */
export function getCategoryCountBySlug(slug: string): number | null {
  const cached = getCachedCategoryCounts();
  if (!cached) return null;
  
  // Normalize the slug for comparison
  const normalizedSlug = slug.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  
  // Find category by matching normalized name to slug
  const category = cached.find(cat => {
    const categorySlug = cat.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');
    return categorySlug === normalizedSlug;
  });
  
  return category?.product_count ?? null;
}

/**
 * Clear the category cache
 */
export function clearCategoryCache(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Check if cache exists and is valid
 */
export function hasValidCache(): boolean {
  return getCachedCategoryCounts() !== null;
}


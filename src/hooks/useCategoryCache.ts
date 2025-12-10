/**
 * Hook to fetch and cache categories with counts on first load
 */

import { useEffect, useState } from 'react';
import { getCategoriesWithCounts, CategoryWithCount } from '@/lib/api/catalog';
import { 
  getCachedCategoryCounts, 
  setCachedCategoryCounts, 
  hasValidCache 
} from '@/lib/utils/categoryCache';

let isFetching = false;
let fetchPromise: Promise<CategoryWithCount[]> | null = null;
let hasFetchedInSession = false; // Track if we've fetched in this browser session

/**
 * Hook to ensure categories with counts are fetched and cached
 * This should be called on the home page or app initialization
 * On first load, always hits the endpoint to get exact results
 */
export function useCategoryCache() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // On first page load, always hit the endpoint to get exact results
    // This ensures we have the most up-to-date counts from the server
    // If we've already fetched in this session, skip to avoid duplicate requests
    if (hasFetchedInSession) {
      return;
    }

    // If already fetching, wait for that promise
    if (isFetching && fetchPromise) {
      fetchPromise
        .then(() => {
          setIsLoading(false);
          setHasFetched(true);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
      return;
    }

    // Start fetching - always hit the endpoint on first load to get exact results
    setIsLoading(true);
    isFetching = true;
    
    console.log('Fetching categories with counts from endpoint to get exact results...');
    
    // Force fresh fetch on first load to ensure exact results from endpoint
    fetchPromise = getCategoriesWithCounts(true)
      .then((response) => {
        const categories = response.categories || [];
        console.log(`Fetched ${categories.length} categories with exact counts from endpoint`);
        setCachedCategoryCounts(categories);
        isFetching = false;
        fetchPromise = null;
        setIsLoading(false);
        hasFetchedInSession = true; // Mark as fetched in this session
        return categories;
      })
      .catch((err) => {
        isFetching = false;
        fetchPromise = null;
        setError(err);
        setIsLoading(false);
        console.error('Error fetching categories with counts:', err);
        throw err;
      });
  }, []);

  return { isLoading, error };
}

/**
 * Function to prefetch categories with counts (can be called manually)
 */
export async function prefetchCategoryCounts(): Promise<CategoryWithCount[]> {
  // Check cache first
  const cached = getCachedCategoryCounts();
  if (cached) {
    return cached;
  }

  // If already fetching, return that promise
  if (isFetching && fetchPromise) {
    return fetchPromise;
  }

  // Start new fetch
  isFetching = true;
  fetchPromise = getCategoriesWithCounts()
    .then((response) => {
      const categories = response.categories || [];
      setCachedCategoryCounts(categories);
      isFetching = false;
      fetchPromise = null;
      return categories;
    })
    .catch((err) => {
      isFetching = false;
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}


/**
 * Client-side API Cache with Request Deduplication
 * Provides fast responses by caching and preventing duplicate requests
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, PendingRequest<any>>();
  
  // Default cache times (in milliseconds)
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly LONG_TTL = 60 * 60 * 1000; // 1 hour
  private readonly SHORT_TTL = 30 * 1000; // 30 seconds
  
  // Cleanup interval
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * Get cache TTL based on endpoint type
   */
  private getTTL(url: string): number {
    // Static data - cache longer
    if (url.includes('/categories') || url.includes('/filter-options')) {
      return this.LONG_TTL;
    }
    // Product detail - cache medium
    if (url.includes('/products/') && url.includes('/detail')) {
      return this.DEFAULT_TTL;
    }
    // Search results - cache short
    return this.SHORT_TTL;
  }

  /**
   * Generate cache key from URL and params
   */
  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Check if entry is still valid
   */
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() < entry.expiresAt;
  }

  /**
   * Get cached data if available and valid
   */
  get<T>(url: string, options?: RequestInit): T | null {
    const key = this.getCacheKey(url, options);
    const entry = this.cache.get(key);
    
    if (entry && this.isValid(entry)) {
      return entry.data as T;
    }
    
    // Remove expired entry
    if (entry) {
      this.cache.delete(key);
    }
    
    return null;
  }

  /**
   * Set cache entry
   */
  set<T>(url: string, data: T, options?: RequestInit, customTTL?: number): void {
    const key = this.getCacheKey(url, options);
    const ttl = customTTL || this.getTTL(url);
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Check if request is pending (for deduplication)
   */
  getPendingRequest<T>(url: string, options?: RequestInit): Promise<T> | null {
    const key = this.getCacheKey(url, options);
    const pending = this.pendingRequests.get(key);
    
    // Remove stale pending requests (older than 30 seconds)
    if (pending && Date.now() - pending.timestamp > 30000) {
      this.pendingRequests.delete(key);
      return null;
    }
    
    return pending?.promise || null;
  }

  /**
   * Set pending request (for deduplication)
   */
  setPendingRequest<T>(url: string, promise: Promise<T>, options?: RequestInit): void {
    const key = this.getCacheKey(url, options);
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });
    
    // Clean up after promise resolves/rejects
    promise.finally(() => {
      setTimeout(() => {
        this.pendingRequests.delete(key);
      }, 1000); // Keep for 1 second after completion
    });
  }

  /**
   * Invalidate cache entry
   */
  invalidate(url: string, options?: RequestInit): void {
    const key = this.getCacheKey(url, options);
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching pattern
   */
  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
    };
  }
}

// Singleton instance
export const apiCache = new APICache();

/**
 * Optimized fetch with caching and deduplication
 */
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  useCache: boolean = true
): Promise<T> {
  // Check cache first
  if (useCache) {
    const cached = apiCache.get<T>(url, options);
    if (cached !== null) {
      return cached;
    }

    // Check for pending request (deduplication)
    const pending = apiCache.getPendingRequest<T>(url, options);
    if (pending) {
      return pending;
    }
  }

  // Make request
  const fetchPromise = fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      ...options?.headers,
    },
  }).then(async (response) => {
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails: any = null;
      
      try {
        // Read response body once
        const contentType = response.headers.get('content-type');
        const text = await response.text();
        
        if (text) {
          if (contentType && contentType.includes('application/json')) {
            try {
              errorDetails = JSON.parse(text);
              // Extract error message from API response
              if (errorDetails?.error) {
                errorMessage = errorDetails.error;
              } else if (errorDetails?.details) {
                errorMessage = errorDetails.details;
              } else if (errorDetails?.message) {
                errorMessage = errorDetails.message;
              }
            } catch {
              // If JSON parsing fails, use text (limit length)
              if (text.length < 500) {
                errorMessage = text;
              }
            }
          } else {
            // Try to parse as JSON anyway (some APIs don't set content-type correctly)
            try {
              errorDetails = JSON.parse(text);
              if (errorDetails?.error || errorDetails?.details || errorDetails?.message) {
                errorMessage = errorDetails.error || errorDetails.details || errorDetails.message;
              } else if (text.length < 500) {
                errorMessage = text;
              }
            } catch {
              // If not JSON, use the text as error message (limit length)
              if (text.length < 500) {
                errorMessage = text;
              }
            }
          }
        }
      } catch (parseError) {
        // If we can't parse the error, use the status code
        console.warn('Error parsing error response:', parseError);
      }
      
      const error = new Error(errorMessage) as any;
      error.status = response.status;
      error.statusText = response.statusText;
      error.details = errorDetails;
      error.url = url;
      throw error;
    }
    return response.json() as Promise<T>;
  }).catch((error) => {
    // Handle network errors or other fetch failures
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network'))) {
      const networkError = new Error(`Network error: Failed to fetch ${url}`) as any;
      networkError.url = url;
      networkError.originalError = error;
      networkError.isNetworkError = true;
      throw networkError;
    }
    // If error already has status, it's an HTTP error - re-throw as is
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    // For other errors, wrap them
    const wrappedError = new Error(error?.message || String(error)) as any;
    wrappedError.url = url;
    wrappedError.originalError = error;
    throw wrappedError;
  });

  // Register pending request
  if (useCache) {
    apiCache.setPendingRequest(url, fetchPromise, options);
  }

  // Wait for response and cache it
  try {
    const data = await fetchPromise;
    if (useCache) {
      apiCache.set(url, data, options);
    }
    return data;
  } catch (error: any) {
    // Don't cache errors
    // Log error details for debugging (safely handle missing properties)
    const errorInfo: any = {
      url,
      method: options?.method || 'GET',
    };
    
    if (error && typeof error === 'object') {
      if ('status' in error) errorInfo.status = error.status;
      if ('statusText' in error) errorInfo.statusText = error.statusText;
      if ('message' in error) errorInfo.message = error.message;
      if ('details' in error) errorInfo.details = error.details;
      if (error.stack) errorInfo.stack = error.stack;
    } else if (error) {
      errorInfo.error = String(error);
    }
    
    console.error('API Request Failed:', errorInfo);
    throw error;
  }
}

/**
 * Parallel fetch multiple URLs
 */
export async function parallelFetch<T>(
  requests: Array<{ url: string; options?: RequestInit; useCache?: boolean }>
): Promise<T[]> {
  return Promise.all(
    requests.map(({ url, options, useCache = true }) =>
      cachedFetch<T>(url, options, useCache)
    )
  );
}



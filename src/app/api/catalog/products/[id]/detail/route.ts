import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://backend.relymedia.com';

/**
 * Check if the ID parameter is a Django primary key (numeric) or product_id (string)
 * Django IDs are typically smaller numbers, while product_ids are often longer alphanumeric strings
 */
function isProductId(id: string): boolean {
  // If it's not a pure number, it's definitely a product_id
  if (!/^\d+$/.test(id)) {
    return true;
  }
  // If it's a very large number (likely a product_id that happens to be numeric)
  // Django auto-increment IDs are typically smaller, but we'll be conservative
  // and only treat it as Django ID if it's a reasonable size (< 1 million)
  // Otherwise, try as Django ID first, then fall back to product_id search
  return false;
}

/**
 * Search for product by product_id to get the Django primary key
 * Uses the search API with the product_id as query string
 */
async function findProductByProductId(productId: string): Promise<number | null> {
  try {
    // Try searching with product_id as query parameter (backend might support it)
    // First try direct product_id parameter
    let searchUrl = `${API_BASE_URL}/api/catalog/search/?product_id=${encodeURIComponent(productId)}`;
    let response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok || response.status === 404) {
      // If that doesn't work, try using q parameter to search for exact product_id
      searchUrl = `${API_BASE_URL}/api/catalog/search/?q=${encodeURIComponent(productId)}&page_size=100`;
      response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 },
      });
    }

    if (response.ok) {
      const data = await response.json();
      // Check if we found a product with matching product_id
      if (data.results && Array.isArray(data.results)) {
        const product = data.results.find((p: any) => p.product_id === productId);
        if (product && product.id) {
          return product.id;
        }
      }
    }
  } catch (error) {
    console.error('Error searching for product by product_id:', error);
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let djangoId = id;
    
    // Check if this is a product_id (string) rather than Django primary key (numeric)
    if (isProductId(id)) {
      console.log(`ID "${id}" appears to be a product_id, searching for Django primary key...`);
      const foundId = await findProductByProductId(id);
      if (foundId) {
        djangoId = foundId.toString();
        console.log(`Found Django ID ${djangoId} for product_id ${id}`);
      } else {
        // If we can't find it by product_id, try the original ID as Django ID anyway
        // (in case it's actually a numeric Django ID that's just large)
        console.log(`Could not find product by product_id "${id}", trying as Django ID...`);
      }
    }
    
    // Try to fetch by Django primary key
    const url = `${API_BASE_URL}/api/catalog/products/${djangoId}/detail/`;
    console.log('Proxying product detail request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      // Cache product details for 5 minutes, revalidate in background
      next: { revalidate: 300 },
    });
    
    if (!response.ok) {
      // If 404 and we tried the original ID as Django ID, and it looked like a product_id,
      // try one more time to search by product_id
      if (response.status === 404 && isProductId(id) && djangoId === id) {
        console.log(`404 with ID "${id}", attempting product_id search...`);
        const foundId = await findProductByProductId(id);
        if (foundId) {
          // Retry with the found Django ID
          const retryUrl = `${API_BASE_URL}/api/catalog/products/${foundId}/detail/`;
          const retryResponse = await fetch(retryUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Accept-Encoding': 'gzip, deflate, br',
            },
            next: { revalidate: 300 },
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return NextResponse.json(data);
          }
        }
      }
      
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = response.statusText;
      }
      
      console.error(`Backend API Error (${response.status}):`, errorText);
      
      return NextResponse.json(
        { 
          error: `API Error: ${response.status} ${response.statusText}`, 
          details: errorText,
          url: url 
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying product detail request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch product details', 
        details: errorMessage,
        stack: errorStack
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';

function getAuthHeader(request: NextRequest): string | null {
  return request.headers.get('authorization');
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = `${API_BASE_URL}/accounts/cart/`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to fetch cart: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    const cartData = await response.json();
    
    // Handle paginated response - extract cart from results array
    let cart = cartData;
    if (cartData.results && Array.isArray(cartData.results) && cartData.results.length > 0) {
      cart = cartData.results[0];
    } else if (cartData.items && Array.isArray(cartData.items)) {
      // Response is already a cart object (has items array directly)
      cart = cartData;
    }
    
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Cart API: Exception:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


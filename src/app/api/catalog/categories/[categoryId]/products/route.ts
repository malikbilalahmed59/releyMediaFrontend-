import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://backend.relymedia.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const searchParams = request.nextUrl.searchParams;
    
    // Build query string from all search params
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/catalog/categories/${categoryId}/products/${queryString ? `?${queryString}` : ''}`;
    
    console.log('Proxying category products request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying category products request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}





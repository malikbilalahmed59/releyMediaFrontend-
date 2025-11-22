import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://backend.relymedia.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const url = `${API_BASE_URL}/api/catalog/categories/${categoryId}/subcategories/`;
    
    console.log('Proxying category subcategories request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      // Cache for 1 hour as per API documentation
      next: { revalidate: 3600 },
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
    console.error('Error proxying category subcategories request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category subcategories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


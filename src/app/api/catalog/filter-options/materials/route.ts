import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://backend.relymedia.com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Build query string from all search params
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/catalog/filter-options/materials/${queryString ? `?${queryString}` : ''}`;
    
    console.log('Proxying filter materials request to:', url);
    
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
    console.error('Error proxying filter materials request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter materials', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


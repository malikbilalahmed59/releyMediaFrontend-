import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://backend.relymedia.com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Build query string from all search params
    const queryString = searchParams.toString();
    // Remove trailing slash to avoid redirect issues
    const url = `${API_BASE_URL}/api/catalog/products/best-selling${queryString ? `?${queryString}` : ''}`;
    
    console.log('Proxying best-selling products request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      redirect: 'follow', // Follow redirects automatically
      // Cache best-selling products for 1 minute
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Best-selling API response data type:', typeof data, 'Is array:', Array.isArray(data), 'Keys:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
    
    // Ensure we return the data as-is (backend should return array directly)
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying best-selling products request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch best-selling products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


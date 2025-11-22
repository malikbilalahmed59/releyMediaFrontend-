import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://backend.relymedia.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // id is the Django primary key (id), not the product_id field
    const url = `${API_BASE_URL}/api/catalog/products/${id}/detail/`;
    
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


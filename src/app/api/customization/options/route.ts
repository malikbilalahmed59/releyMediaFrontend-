import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';

export async function GET(request: NextRequest) {
  try {
    const url = `${API_BASE_URL}/api/customization/options/`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache customization options
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to fetch customization options: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying customization options request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customization options', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}



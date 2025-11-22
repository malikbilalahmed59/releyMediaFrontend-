import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let url = `${API_BASE_URL}/accounts/register/`;
    
    console.log('Attempting registration to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // If 404, try without trailing slash
    if (response.status === 404) {
      url = `${API_BASE_URL}/accounts/register`;
      console.log('404 received, trying without trailing slash:', url);
      const retryResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!retryResponse.ok) {
        const errorText = await retryResponse.text();
        return NextResponse.json(
          { 
            error: `Registration failed: ${retryResponse.statusText}`, 
            details: errorText,
            attempted_url: url
          },
          { status: retryResponse.status }
        );
      }
      
      const data = await retryResponse.json();
      return NextResponse.json(data);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: `Registration failed: ${response.statusText}`, 
          details: errorText,
          attempted_url: url
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying registration request:', error);
    return NextResponse.json(
      { error: 'Failed to register', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


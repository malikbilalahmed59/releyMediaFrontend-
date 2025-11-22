import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Try with trailing slash first (Django convention)
    let url = `${API_BASE_URL}/accounts/login/`;
    
    console.log('Attempting login to:', url);
    console.log('Request body:', { username_or_email: body.username_or_email, password: '***' });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // If 404, try without trailing slash
    if (response.status === 404) {
      url = `${API_BASE_URL}/accounts/login`;
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
        console.error('Login failed (retry):', retryResponse.status, errorText);
        return NextResponse.json(
          { 
            error: `Login failed: ${retryResponse.statusText}`, 
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
      console.error('Login failed:', response.status, errorText);
      return NextResponse.json(
        { 
          error: `Login failed: ${response.statusText}`, 
          details: errorText,
          attempted_url: url
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying login request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to login', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}


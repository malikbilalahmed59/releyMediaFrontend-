import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';

function getAuthHeader(request: NextRequest): string | null {
  return request.headers.get('authorization');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = getAuthHeader(request);
    
    // Clean up the payload: remove empty strings and only include valid values
    const cleanedBody: any = {};
    
    // Copy all fields, but skip empty strings
    Object.keys(body).forEach(key => {
      const value = body[key];
      // Only include if value is not an empty string
      // Allow null, undefined, 0, false, but not empty strings
      if (value !== '' && value !== undefined) {
        cleanedBody[key] = value;
      }
    });
    
    let url = `${API_BASE_URL}/accounts/quote-requests/`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if present (user is logged in)
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(cleanedBody),
    });
    
    // If 404, try without trailing slash
    if (response.status === 404) {
      url = `${API_BASE_URL}/accounts/quote-requests`;
      const retryResponse = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(cleanedBody),
      });
      
      if (!retryResponse.ok) {
        const errorText = await retryResponse.text();
        return NextResponse.json(
          { 
            error: `Quote request failed: ${retryResponse.statusText}`, 
            details: errorText,
            attempted_url: url
          },
          { status: retryResponse.status }
        );
      }
      
      return NextResponse.json(await retryResponse.json());
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: `Quote request failed: ${response.statusText}`, 
          details: errorText,
          attempted_url: url
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error proxying quote request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit quote request', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}



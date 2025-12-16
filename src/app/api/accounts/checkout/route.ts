import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';

function getAuthHeader(request: NextRequest): string | null {
  return request.headers.get('authorization');
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if request is multipart/form-data (FormData)
    // Note: When FormData is sent, browser sets Content-Type: multipart/form-data; boundary=...
    const contentType = request.headers.get('content-type') || '';
    const isFormData = contentType.includes('multipart/form-data');
    
    const url = `${API_BASE_URL}/accounts/checkout/`;
    
    let body: BodyInit;
    let headers: HeadersInit = {
      'Authorization': authHeader,
    };
    
    if (isFormData) {
      // For FormData, forward the FormData directly
      // Don't set Content-Type - fetch will set it with boundary automatically
      body = await request.formData();
      // Don't set Content-Type header - let fetch set it automatically with boundary
    } else {
      // For JSON, parse and stringify
      // IMPORTANT: Only call request.json() if we're sure it's JSON
      // The request body can only be read once, so we must be certain
      const jsonBody = await request.json();
      body = JSON.stringify(jsonBody);
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to checkout: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to checkout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


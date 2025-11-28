import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';

function getAuthHeader(request: NextRequest): string | null {
  return request.headers.get('authorization');
}

export async function POST(request: NextRequest) {
  try {
    console.log('[PROXY] Add to cart request received');
    const authHeader = getAuthHeader(request);
    if (!authHeader) {
      console.error('[PROXY] No authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body with error handling
    let body;
    try {
      const text = await request.text();
      if (!text) {
        console.error('[PROXY] Empty request body');
        return NextResponse.json(
          { error: 'Request body is required' },
          { status: 400 }
        );
      }
      body = JSON.parse(text);
      console.log('[PROXY] Request body parsed:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('[PROXY] Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: parseError instanceof Error ? parseError.message : 'Unknown error' },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}/accounts/cart/add-item/`;
    console.log('[PROXY] Forwarding to Django:', url);
    console.log('[PROXY] Request data:', JSON.stringify(body, null, 2));
    console.log('[PROXY] Auth header present:', !!authHeader);
    console.log('[PROXY] Auth header preview:', authHeader ? authHeader.substring(0, 20) + '...' : 'none');
    
    let response;
    try {
      // Log the exact request we're sending to Django
      console.log('[PROXY] Sending to Django:', {
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader ? `${authHeader.substring(0, 20)}...` : 'none',
        },
        body: JSON.stringify(body, null, 2),
      });
      
      const requestBody = JSON.stringify(body);
      console.log('[PROXY] Request body string:', requestBody);
      
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: requestBody,
      });
      console.log('[PROXY] Django response status:', response.status);
      console.log('[PROXY] Django response headers:', Object.fromEntries(response.headers.entries()));
      
      // Log response body preview even for errors
      const responseTextPreview = await response.clone().text();
      console.log('[PROXY] Django response body preview (first 1000 chars):', responseTextPreview.substring(0, 1000));
    } catch (fetchError) {
      console.error('[PROXY] Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to connect to backend', details: fetchError instanceof Error ? fetchError.message : 'Unknown error' },
        { status: 503 }
      );
    }
    
    // Clone response so we can read it multiple times if needed
    const responseClone = response.clone();
    
    if (!response.ok) {
      let errorText;
      let errorDetails: any = null;
      try {
        errorText = await response.text();
        
        // Try to extract error details from HTML response
        if (errorText.includes('<!doctype html>') || errorText.includes('<html')) {
          // HTML error page - try to extract meaningful info
          const titleMatch = errorText.match(/<title>([\s\S]*?)<\/title>/i);
          const h1Match = errorText.match(/<h1>([\s\S]*?)<\/h1>/i);
          const exceptionMatch = errorText.match(/Exception Value:\s*([\s\S]*?)(?:\n|<)/i);
          const exceptionTypeMatch = errorText.match(/Exception Type:\s*([\s\S]*?)(?:\n|<)/i);
          const tracebackMatch = errorText.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
          
          errorDetails = {
            message: titleMatch ? titleMatch[1] : `Server Error (${response.status})`,
            exceptionType: exceptionTypeMatch ? exceptionTypeMatch[1].trim() : null,
            exceptionValue: exceptionMatch ? exceptionMatch[1].trim() : null,
            traceback: tracebackMatch ? tracebackMatch[1].substring(0, 1000) : null,
            htmlTitle: titleMatch ? titleMatch[1] : null,
            htmlH1: h1Match ? h1Match[1] : null,
          };
          
          console.error(`[PROXY] Django HTML Error (${response.status}):`, {
            exceptionType: errorDetails.exceptionType,
            exceptionValue: errorDetails.exceptionValue,
            traceback: errorDetails.traceback?.substring(0, 500)
          });
          
          // Log the FULL HTML error response for debugging
          console.error('[PROXY] FULL Django HTML Error Response:', errorText);
        } else {
          // Try to parse as JSON
          try {
            errorDetails = JSON.parse(errorText);
            console.error(`[PROXY] Django JSON Error (${response.status}):`, errorDetails);
          } catch {
            errorDetails = { message: errorText };
          }
        }
      } catch {
        errorText = response.statusText;
        errorDetails = { message: response.statusText };
      }
      
      // Build comprehensive error message
      let errorMessage = `Failed to add item to cart: ${response.statusText}`;
      if (errorDetails?.exceptionValue) {
        errorMessage = errorDetails.exceptionValue;
      } else if (errorDetails?.message) {
        errorMessage = errorDetails.message;
      }
      
      console.error(`[PROXY] Django error (${response.status}):`, errorText.substring(0, 500));
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: errorDetails || errorText,
          status: response.status
        },
        { status: response.status }
      );
    }
    
    // Parse response with error handling
    let responseData;
    try {
      // Use the cloned response since we may have already read the original
      const responseText = await responseClone.text();
      if (!responseText) {
        console.error('[PROXY] Empty response from Django');
        return NextResponse.json(
          { error: 'Empty response from backend' },
          { status: 500 }
        );
      }
      responseData = JSON.parse(responseText);
      console.log('[PROXY] Successfully received response from Django');
    } catch (parseError) {
      console.error('[PROXY] Failed to parse Django response:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON response from backend', details: parseError instanceof Error ? parseError.message : 'Unknown error' },
        { status: 500 }
      );
    }
    
    console.log('[PROXY] Returning success response to client');
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Unexpected error in add-item route:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://backend.relymedia.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  let categoryId: string = 'unknown';
  try {
    const resolvedParams = await params;
    categoryId = resolvedParams.categoryId;
    const searchParams = request.nextUrl.searchParams;
    
    // Build query string from all search params
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/catalog/categories/${categoryId}/products/${queryString ? `?${queryString}` : ''}`;
    
    console.log('Proxying category products request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      // Cache category products for 1 minute
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      // Enhanced error logging for debugging
      const errorDetails: any = {
        status: response.status,
        statusText: response.statusText,
        url: url,
        categoryId: categoryId,
        queryString: queryString,
        timestamp: new Date().toISOString(),
      };
      
      // Try to extract error details from HTML response (Django error pages)
      if (errorText.includes('<!doctype html>') || errorText.includes('<html')) {
        const titleMatch = errorText.match(/<title>([\s\S]*?)<\/title>/i);
        const h1Match = errorText.match(/<h1>([\s\S]*?)<\/h1>/i);
        const exceptionMatch = errorText.match(/Exception Value:\s*([\s\S]*?)(?:\n|<)/i);
        const exceptionTypeMatch = errorText.match(/Exception Type:\s*([\s\S]*?)(?:\n|<)/i);
        const tracebackMatch = errorText.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
        
        errorDetails.exceptionType = exceptionTypeMatch ? exceptionTypeMatch[1].trim() : null;
        errorDetails.exceptionValue = exceptionMatch ? exceptionMatch[1].trim() : null;
        errorDetails.traceback = tracebackMatch ? tracebackMatch[1].substring(0, 2000) : null;
        errorDetails.htmlTitle = titleMatch ? titleMatch[1] : null;
        errorDetails.htmlH1 = h1Match ? h1Match[1] : null;
        
        console.error('[API ERROR] Backend returned HTML error page:', JSON.stringify(errorDetails, null, 2));
        console.error('[API ERROR] Full error response (first 2000 chars):', errorText.substring(0, 2000));
      } else {
        // Try to parse as JSON
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails.errorJson = errorJson;
          console.error('[API ERROR] Backend returned JSON error:', JSON.stringify(errorDetails, null, 2));
        } catch {
          errorDetails.errorText = errorText.substring(0, 1000);
          console.error('[API ERROR] Backend returned text error:', JSON.stringify(errorDetails, null, 2));
        }
      }
      
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Enhanced error logging for network/parsing errors
    const errorInfo: any = {
      message: error instanceof Error ? error.message : String(error),
      categoryId: categoryId,
      url: `${API_BASE_URL}/api/catalog/categories/${categoryId}/products/`,
      timestamp: new Date().toISOString(),
    };
    
    if (error instanceof Error) {
      errorInfo.stack = error.stack;
      errorInfo.name = error.name;
    }
    
    // Check if it's a network error
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network'))) {
      errorInfo.type = 'network_error';
      console.error('[API ERROR] Network error fetching category products:', JSON.stringify(errorInfo, null, 2));
    } else {
      errorInfo.type = 'unknown_error';
      console.error('[API ERROR] Error proxying category products request:', JSON.stringify(errorInfo, null, 2));
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch category products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}





/**
 * Accounts API Service
 * 
 * Handles authentication, profile, addresses, cart, and orders
 * Uses Next.js API routes as proxy for client-side calls
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';
const USE_PROXY = typeof window !== 'undefined';

/**
 * Type definitions for Accounts API
 */

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone_number?: string;
  business_name?: string;
  business_display_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  business_name?: string;
}

export interface LoginRequest {
  username_or_email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ProfileSummary {
  user: {
    email: string;
    business_name: string;
  };
  addresses: {
    total: number;
    billing_addresses: number;
    shipping_addresses: number;
  };
}

// Address Types
export interface UserAddress {
  id: number;
  address_type: 'billing' | 'shipping';
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface CreateAddressRequest {
  address_type: 'billing' | 'shipping';
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

// Cart Types
export interface CartItemCustomization {
  id: number;
  customization_type: string;
  customization_type_display: string;
  color_count?: number;
  stitch_count?: number;
  imprint_size_id?: number;
  unit_price: string;
  total_price: string;
}

export interface CartItem {
  id: number;
  product: number;
  part?: number;
  product_id: string;
  product_name: string;
  part_id?: string;
  part_name?: string;
  quantity: number;
  price_per_unit: string;
  primary_image?: string;
  total_price: number;
  customizations?: CartItemCustomization[];
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: string;
  part_id?: string;
  quantity: number;
  customizations?: Array<{
    customization_type: 'screen_print' | 'embroidery' | 'digital_print';
    color_count?: number;
    stitch_count?: number;
    imprint_size_id?: number;
  }>;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Order Types
export interface OrderItem {
  id: number;
  product_id: string;
  part_id?: string;
  product_name: string;
  part_name?: string;
  quantity: number;
  price_per_unit: string;
  total_price: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: string;
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  billing_address: number;
  shipping_address: number;
  items: OrderItem[];
  user_email: string;
  created_at: string;
  notes?: string;
}

export interface CheckoutRequest {
  billing_address_id: number;
  shipping_address_id: number;
  notes?: string;
}

// Quote Request Types
export interface QuoteRequest {
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone?: string;
  quantity?: string;
  product_type?: string;
  specifications?: string;
  message?: string;
  product_id?: string;
}

export interface QuoteRequestResponse {
  id: number;
  message: string;
}

/**
 * Get auth headers with token
 */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }
  
  return headers;
}

/**
 * Make authenticated API request
 */
async function authFetch<T>(
  url: string,
  options: RequestInit = {},
  retryCount: number = 0
): Promise<T> {
  const maxRetries = 1; // Only retry once after token refresh
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - token expired
    if (response.status === 401 && retryCount < maxRetries) {
      // Try to refresh token
      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (storedRefreshToken) {
        try {
          console.log('Access token expired, attempting to refresh...');
          const newAccessToken = await refreshToken(storedRefreshToken);
          if (newAccessToken) {
            console.log('Token refreshed successfully, retrying request...');
            // Retry original request with new token (recursive call with retry count)
            return authFetch<T>(url, options, retryCount + 1);
          } else {
            console.error('Token refresh failed: No new access token received');
            // Refresh failed, clear tokens and redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              window.location.href = '/signin';
            }
            throw new Error('Session expired. Please login again.');
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          // Refresh failed, clear tokens and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
          }
          throw new Error('Session expired. Please login again.');
        }
      } else {
        // No refresh token available, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/signin';
        }
        throw new Error('Session expired. Please login again.');
      }
    }
    
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Authentication Endpoints
 */

export async function register(data: RegisterRequest): Promise<User> {
  const url = USE_PROXY 
    ? '/api/accounts/register'
    : `${API_BASE_URL}/accounts/register/`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Registration failed: ${errorText}`);
  }

  return response.json();
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const url = USE_PROXY 
    ? '/api/accounts/login'
    : `${API_BASE_URL}/accounts/login/`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Login failed: ${errorText}`);
  }

  const result = await response.json();
  
  // Store tokens and user in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', result.access);
    localStorage.setItem('refresh_token', result.refresh);
    localStorage.setItem('user', JSON.stringify(result.user));
  }

  return result;
}

export async function refreshToken(refresh: string): Promise<string | null> {
  const url = USE_PROXY 
    ? '/api/accounts/token/refresh'
    : `${API_BASE_URL}/accounts/token/refresh/`;
  
  try {
    console.log('Sending token refresh request to:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error('Token refresh failed:', response.status, errorText);
      return null;
    }

    const result: TokenRefreshResponse = await response.json();
    
    if (!result.access) {
      console.error('Token refresh response missing access token');
      return null;
    }
    
    // Update access token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', result.access);
      console.log('Access token updated in localStorage');
    }

    return result.access;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export async function logout(refresh: string): Promise<LogoutResponse> {
  const url = USE_PROXY 
    ? '/api/accounts/logout'
    : `${API_BASE_URL}/accounts/logout/`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Logout failed: ${errorText}`);
  }

  // Clear tokens and user from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  return response.json();
}

/**
 * Profile Endpoints
 */

export async function getProfile(): Promise<User> {
  const url = USE_PROXY 
    ? '/api/accounts/profile'
    : `${API_BASE_URL}/accounts/profile/`;
  
  return authFetch<User>(url, { method: 'GET' });
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const url = USE_PROXY 
    ? '/api/accounts/profile'
    : `${API_BASE_URL}/accounts/profile/`;
  
  return authFetch<User>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  const url = USE_PROXY 
    ? '/api/accounts/change-password'
    : `${API_BASE_URL}/accounts/change-password/`;
  
  await authFetch<void>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProfileSummary(): Promise<ProfileSummary> {
  const url = USE_PROXY 
    ? '/api/accounts/profile/summary'
    : `${API_BASE_URL}/accounts/profile/summary/`;
  
  return authFetch<ProfileSummary>(url, { method: 'GET' });
}

/**
 * Address Endpoints
 */

export async function getAddresses(): Promise<UserAddress[]> {
  const url = USE_PROXY 
    ? '/api/accounts/addresses'
    : `${API_BASE_URL}/accounts/addresses/`;
  
  return authFetch<UserAddress[]>(url, { method: 'GET' });
}

export async function createAddress(data: CreateAddressRequest): Promise<UserAddress> {
  const url = USE_PROXY 
    ? '/api/accounts/addresses'
    : `${API_BASE_URL}/accounts/addresses/`;
  
  return authFetch<UserAddress>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAddress(id: number): Promise<UserAddress> {
  const url = USE_PROXY 
    ? `/api/accounts/addresses/${id}`
    : `${API_BASE_URL}/accounts/addresses/${id}/`;
  
  return authFetch<UserAddress>(url, { method: 'GET' });
}

export async function updateAddress(id: number, data: Partial<CreateAddressRequest>): Promise<UserAddress> {
  const url = USE_PROXY 
    ? `/api/accounts/addresses/${id}`
    : `${API_BASE_URL}/accounts/addresses/${id}/`;
  
  return authFetch<UserAddress>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(id: number): Promise<void> {
  const url = USE_PROXY 
    ? `/api/accounts/addresses/${id}`
    : `${API_BASE_URL}/accounts/addresses/${id}/`;
  
  try {
    await authFetch<void>(url, { method: 'DELETE' });
  } catch (error: any) {
    // Re-throw with more context
    const errorMessage = error.message || 'Failed to delete address';
    throw new Error(errorMessage);
  }
}

/**
 * Cart Endpoints
 */

export async function getCart(): Promise<Cart> {
  const url = USE_PROXY 
    ? '/api/accounts/cart'
    : `${API_BASE_URL}/accounts/cart/`;
  
  const response = await authFetch<any>(url, { method: 'GET' });
  
  // Handle paginated response - extract cart from results array
  if (response.results && Array.isArray(response.results) && response.results.length > 0) {
    return response.results[0] as Cart;
  }
  
  // If response has items directly, it's already a cart object
  if (response.items && Array.isArray(response.items)) {
    return response as Cart;
  }
  
  return response as Cart;
}

export async function addToCart(data: AddToCartRequest): Promise<Cart> {
  const url = USE_PROXY 
    ? '/api/accounts/cart/add-item'
    : `${API_BASE_URL}/accounts/cart/add-item/`;
  
  return authFetch<Cart>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCartItem(itemId: number, data: UpdateCartItemRequest): Promise<Cart> {
  const url = USE_PROXY 
    ? `/api/accounts/cart/items/${itemId}`
    : `${API_BASE_URL}/accounts/cart/items/${itemId}/`;
  
  return authFetch<Cart>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function removeCartItem(itemId: number): Promise<Cart> {
  const url = USE_PROXY 
    ? `/api/accounts/cart/items/${itemId}`
    : `${API_BASE_URL}/accounts/cart/items/${itemId}/`;
  
  return authFetch<Cart>(url, { method: 'DELETE' });
}

export async function clearCart(): Promise<Cart> {
  const url = USE_PROXY 
    ? '/api/accounts/cart/clear'
    : `${API_BASE_URL}/accounts/cart/clear/`;
  
  return authFetch<Cart>(url, { method: 'DELETE' });
}

/**
 * Order Endpoints
 */

export async function checkout(data: CheckoutRequest): Promise<Order> {
  const url = USE_PROXY 
    ? '/api/accounts/checkout'
    : `${API_BASE_URL}/accounts/checkout/`;
  
  return authFetch<Order>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrders(): Promise<Order[]> {
  const url = USE_PROXY 
    ? '/api/accounts/orders'
    : `${API_BASE_URL}/accounts/orders/`;
  
  return authFetch<Order[]>(url, { method: 'GET' });
}

export async function getOrder(orderNumber: string): Promise<Order> {
  const url = USE_PROXY 
    ? `/api/accounts/orders/${orderNumber}`
    : `${API_BASE_URL}/accounts/orders/${orderNumber}/`;
  
  return authFetch<Order>(url, { method: 'GET' });
}

/**
 * Helper function to check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

/**
 * Quote Request Endpoints
 */

export async function submitQuoteRequest(data: QuoteRequest): Promise<QuoteRequestResponse> {
  const url = USE_PROXY 
    ? '/api/accounts/quote-requests'
    : `${API_BASE_URL}/accounts/quote-requests/`;
  
  // If user is authenticated, use authFetch, otherwise regular fetch
  if (isAuthenticated()) {
    return authFetch<QuoteRequestResponse>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } else {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Quote request failed: ${errorText}`);
    }

    return response.json();
  }
}

/**
 * Helper function to get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Helper function to get access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}


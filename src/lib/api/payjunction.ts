/**
 * PayJunction API Service
 * 
 * Handles payment processing via PayJunction API
 */

const PAYJUNCTION_SANDBOX_URL = 'https://api.payjunctionlabs.com';
const PAYJUNCTION_PRODUCTION_URL = 'https://api.payjunction.com';

// Environment variables for PayJunction credentials
const PAYJUNCTION_USERNAME = process.env.PAYJUNCTION_USERNAME || 'relymedia';
const PAYJUNCTION_PASSWORD = process.env.PAYJUNCTION_PASSWORD || 'Bilal(00)Ahmed';
const PAYJUNCTION_APP_KEY = process.env.PAYJUNCTION_APP_KEY || '83ef9f5a-b3da-43ba-97fd-2044c45751d5';
const USE_SANDBOX = process.env.PAYJUNCTION_USE_SANDBOX !== 'false'; // Default to sandbox

const BASE_URL = USE_SANDBOX ? PAYJUNCTION_SANDBOX_URL : PAYJUNCTION_PRODUCTION_URL;

/**
 * Type definitions for PayJunction API
 */

export interface CreditCardPaymentRequest {
  cardNumber: string;
  cardExpMonth: string; // MM format (01-12)
  cardExpYear: string; // YYYY format
  amountBase: string; // Decimal string (e.g., "1.00")
  cvv?: string;
  action?: 'CHARGE' | 'REFUND'; // Default: CHARGE
  status?: 'CAPTURE' | 'HOLD'; // Default: CAPTURE
  amountShipping?: string; // Optional shipping amount
  amountTax?: string; // Optional tax amount
}

export interface ACHPaymentRequest {
  achRoutingNumber: string;
  achAccountNumber: string;
  achAccountType: 'CHECKING' | 'SAVINGS';
  achType: 'PPD' | 'WEB' | 'TEL' | 'CCD';
  amountBase: string;
  action?: 'CHARGE' | 'REFUND'; // Default: CHARGE
  status?: 'CAPTURE' | 'HOLD'; // Default: CAPTURE
}

export interface TransactionUpdateRequest {
  status?: 'VOID' | 'HOLD' | 'CAPTURE';
  amountBase?: string;
  amountShipping?: string;
  amountTax?: string;
}

export interface PayJunctionResponse {
  transactionId?: string;
  status?: string;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  [key: string]: any; // Allow for additional response fields
}

/**
 * Create Basic Auth header
 */
function getAuthHeader(): string {
  // Ensure credentials are properly encoded
  const username = PAYJUNCTION_USERNAME;
  const password = PAYJUNCTION_PASSWORD;
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${credentials}`;
}

/**
 * Make request to PayJunction API
 */
async function payJunctionRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  data?: Record<string, string>
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'X-PJ-Application-Key': PAYJUNCTION_APP_KEY,
    'Authorization': getAuthHeader(),
  };

  const options: RequestInit = {
    method,
    headers,
  };

  // Add form data for POST/PUT requests
  if (data && (method === 'POST' || method === 'PUT')) {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    options.body = formData.toString();
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  try {
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    if (!response.ok) {
      let errorMessage = `PayJunction API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
        if (errorData.errors) {
          errorMessage += ` - ${JSON.stringify(errorData.errors)}`;
        }
      } catch {
        errorMessage += ` - ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    // Parse response
    try {
      return JSON.parse(responseText) as T;
    } catch {
      // If response is not JSON, return as text
      return { message: responseText } as T;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while processing payment');
  }
}

/**
 * Charge a credit card (default action: CHARGE, default status: CAPTURE)
 */
export async function chargeCreditCard(
  request: CreditCardPaymentRequest
): Promise<PayJunctionResponse> {
  const data: Record<string, string> = {
    cardNumber: request.cardNumber.replace(/\s/g, ''), // Remove spaces
    cardExpMonth: request.cardExpMonth.padStart(2, '0'), // Ensure 2 digits
    cardExpYear: request.cardExpYear,
    amountBase: parseFloat(request.amountBase).toFixed(2),
  };

  // Add optional fields
  if (request.action) {
    data.action = request.action;
  }
  if (request.status) {
    data.status = request.status;
  }
  if (request.amountShipping) {
    data.amountShipping = parseFloat(request.amountShipping).toFixed(2);
  }
  if (request.amountTax) {
    data.amountTax = parseFloat(request.amountTax).toFixed(2);
  }
  if (request.cvv) {
    data.cardCvv = request.cvv;
  }

  return payJunctionRequest<PayJunctionResponse>('/transactions', 'POST', data);
}

/**
 * Refund a credit card
 */
export async function refundCreditCard(
  request: CreditCardPaymentRequest
): Promise<PayJunctionResponse> {
  return chargeCreditCard({
    ...request,
    action: 'REFUND',
  });
}

/**
 * Authorize a credit card (hold funds without capturing)
 */
export async function authorizeCreditCard(
  request: CreditCardPaymentRequest
): Promise<PayJunctionResponse> {
  return chargeCreditCard({
    ...request,
    status: 'HOLD',
  });
}

/**
 * Charge a checking account (ACH)
 */
export async function chargeACH(
  request: ACHPaymentRequest
): Promise<PayJunctionResponse> {
  const data: Record<string, string> = {
    achRoutingNumber: request.achRoutingNumber,
    achAccountNumber: request.achAccountNumber,
    achAccountType: request.achAccountType,
    achType: request.achType,
    amountBase: parseFloat(request.amountBase).toFixed(2),
  };

  if (request.action) {
    data.action = request.action;
  }
  if (request.status) {
    data.status = request.status;
  }

  return payJunctionRequest<PayJunctionResponse>('/transactions', 'POST', data);
}

/**
 * Refund a checking account (ACH)
 */
export async function refundACH(
  request: ACHPaymentRequest
): Promise<PayJunctionResponse> {
  return chargeACH({
    ...request,
    action: 'REFUND',
  });
}

/**
 * Update a transaction (void, hold, or capture)
 */
export async function updateTransaction(
  transactionId: string,
  request: TransactionUpdateRequest
): Promise<PayJunctionResponse> {
  const data: Record<string, string> = {};

  if (request.status) {
    data.status = request.status;
  }
  if (request.amountBase) {
    data.amountBase = parseFloat(request.amountBase).toFixed(2);
  }
  if (request.amountShipping) {
    data.amountShipping = parseFloat(request.amountShipping).toFixed(2);
  }
  if (request.amountTax) {
    data.amountTax = parseFloat(request.amountTax).toFixed(2);
  }

  return payJunctionRequest<PayJunctionResponse>(
    `/transactions/${transactionId}`,
    'PUT',
    data
  );
}

/**
 * Void a transaction
 */
export async function voidTransaction(transactionId: string): Promise<PayJunctionResponse> {
  return updateTransaction(transactionId, { status: 'VOID' });
}

/**
 * Capture a held transaction
 */
export async function captureTransaction(
  transactionId: string,
  amountBase?: string,
  amountShipping?: string
): Promise<PayJunctionResponse> {
  const request: TransactionUpdateRequest = { status: 'CAPTURE' };
  if (amountBase) {
    request.amountBase = amountBase;
  }
  if (amountShipping) {
    request.amountShipping = amountShipping;
  }
  return updateTransaction(transactionId, request);
}

/**
 * Get transaction details
 */
export async function getTransaction(transactionId: string): Promise<PayJunctionResponse> {
  return payJunctionRequest<PayJunctionResponse>(
    `/transactions/${transactionId}`,
    'GET'
  );
}


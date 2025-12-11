/**
 * PayJunction API Service
 * 
 * Handles payment processing via PayJunction API
 * Supports credit card and ACH payments with billing/shipping addresses
 */

// Production API endpoint (use sandbox only if explicitly set to 'true')
const PAYJUNCTION_BASE_URL = process.env.PAYJUNCTION_USE_SANDBOX === 'true'
  ? 'https://api.payjunctionlabs.com'
  : 'https://api.payjunction.com';

const PAYJUNCTION_USERNAME = process.env.PAYJUNCTION_USERNAME || '';
const PAYJUNCTION_PASSWORD = process.env.PAYJUNCTION_PASSWORD || '';
// Production API Key: ccf3f9f4-8c42-4bbe-924c-7176d163cd10
// Development API Key: 83ef9f5a-b3da-43ba-97fd-2044c45751d5
const PAYJUNCTION_APP_KEY = process.env.PAYJUNCTION_APP_KEY || 'ccf3f9f4-8c42-4bbe-924c-7176d163cd10';

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
  // Billing address fields
  billingFirstName?: string;
  billingLastName?: string;
  billingCompanyName?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  // Shipping address fields
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
}

export interface PayJunctionResponse {
  transactionId?: string;
  transaction_id?: string;
  status?: 'CAPTURE' | 'HOLD' | 'REFUND' | 'DECLINED' | 'VOID';
  message?: string;
  errors?: Array<{
    message: string;
    parameter?: string;
  }>;
  response?: {
    approved?: boolean;
    code?: string;
    message?: string;
    statusMessage?: string;
    processor?: any;
  };
  [key: string]: any;
}

/**
 * Create Basic Auth header for PayJunction
 */
function getAuthHeader(): string {
  const credentials = Buffer.from(`${PAYJUNCTION_USERNAME}:${PAYJUNCTION_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
}

/**
 * Charge a credit card via PayJunction
 */
export async function chargeCreditCard(data: CreditCardPaymentRequest): Promise<PayJunctionResponse> {
  // Validate amountBase
  const amountBase = parseFloat(data.amountBase);
  if (isNaN(amountBase) || amountBase <= 0) {
    throw new Error('Amount Base must be a positive number');
  }

  // Format amountBase to 2 decimal places
  const formattedAmountBase = amountBase.toFixed(2);

  // Build form data
  const formData = new URLSearchParams();
  formData.append('cardNumber', data.cardNumber);
  formData.append('cardExpMonth', data.cardExpMonth.padStart(2, '0'));
  formData.append('cardExpYear', data.cardExpYear);
  formData.append('amountBase', formattedAmountBase);
  
  if (data.cvv) {
    formData.append('cardCvv', data.cvv);
  }
  
  if (data.action) {
    formData.append('action', data.action);
  } else {
    formData.append('action', 'CHARGE');
  }
  
  if (data.status) {
    formData.append('status', data.status);
  } else {
    formData.append('status', 'CAPTURE');
  }

  // Add shipping and tax amounts if provided
  if (data.amountShipping) {
    const shippingAmount = parseFloat(data.amountShipping);
    if (!isNaN(shippingAmount) && shippingAmount >= 0) {
      formData.append('amountShipping', shippingAmount.toFixed(2));
    }
  }

  if (data.amountTax) {
    const taxAmount = parseFloat(data.amountTax);
    if (!isNaN(taxAmount) && taxAmount >= 0) {
      formData.append('amountTax', taxAmount.toFixed(2));
    }
  }

  // Add billing address fields if provided
  if (data.billingFirstName) {
    formData.append('billingFirstName', data.billingFirstName);
  }
  if (data.billingLastName) {
    formData.append('billingLastName', data.billingLastName);
  }
  if (data.billingCompanyName) {
    formData.append('billingCompanyName', data.billingCompanyName);
  }
  if (data.billingAddress) {
    formData.append('billingAddress', data.billingAddress);
  }
  if (data.billingCity) {
    formData.append('billingCity', data.billingCity);
  }
  if (data.billingState) {
    formData.append('billingState', data.billingState);
  }
  if (data.billingZip) {
    formData.append('billingZip', data.billingZip);
  }

  // Add shipping address fields if provided
  if (data.shippingAddress) {
    formData.append('shippingAddress', data.shippingAddress);
  }
  if (data.shippingCity) {
    formData.append('shippingCity', data.shippingCity);
  }
  if (data.shippingState) {
    formData.append('shippingState', data.shippingState);
  }
  if (data.shippingZip) {
    formData.append('shippingZip', data.shippingZip);
  }

  const response = await fetch(`${PAYJUNCTION_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-PJ-Application-Key': PAYJUNCTION_APP_KEY,
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorMessage = responseData.errors?.[0]?.message || responseData.message || `PayJunction API error: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return responseData;
}

/**
 * Refund a credit card transaction
 */
export async function refundCreditCard(data: Omit<CreditCardPaymentRequest, 'action'> & { action?: 'REFUND' }): Promise<PayJunctionResponse> {
  return chargeCreditCard({
    ...data,
    action: 'REFUND',
  });
}

/**
 * Refund an ACH transaction (placeholder - not implemented)
 */
export async function refundACH(data: any): Promise<PayJunctionResponse> {
  throw new Error('ACH refunds are not currently supported');
}

/**
 * Void a transaction (placeholder - not implemented)
 */
export async function voidTransaction(transactionId: string): Promise<PayJunctionResponse> {
  throw new Error('Transaction voiding is not currently supported');
}

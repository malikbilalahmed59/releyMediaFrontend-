# PayJunction Payment Integration

## Overview
This project has been integrated with PayJunction payment processing API. The integration supports:
- Credit card payments (charge, authorize, refund)
- ACH/Checking account payments (charge, refund)
- Transaction management (void, capture, hold)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
PAYJUNCTION_USERNAME=relymedia
PAYJUNCTION_PASSWORD=Bilal(00)Ahmed
PAYJUNCTION_APP_KEY=83ef9f5a-b3da-43ba-97fd-2044c45751d5
PAYJUNCTION_USE_SANDBOX=true
```

**Note:** The `.env.local` file is gitignored and should not be committed to version control.

## Files Created

### 1. PayJunction Service (`src/lib/api/payjunction.ts`)
- Core service for PayJunction API interactions
- Functions for credit card and ACH payments
- Transaction management (void, capture, hold)

### 2. Payment API Routes
- `src/app/api/payments/process/route.ts` - Process payments
- `src/app/api/payments/refund/route.ts` - Process refunds
- `src/app/api/payments/void/route.ts` - Void transactions

### 3. Updated Checkout Form (`src/components/Site/CheckoutForm.tsx`)
- Added credit card form fields
- Integrated payment processing into checkout flow
- Payment validation and error handling

## API Endpoints

### Process Payment
```
POST /api/payments/process
Body: {
  paymentMethod: "credit" | "ach",
  paymentData: {
    // For credit cards:
    cardNumber: string,
    cardExpMonth: string,
    cardExpYear: string,
    cvv: string,
    // For ACH:
    achRoutingNumber: string,
    achAccountNumber: string,
    achAccountType: "CHECKING" | "SAVINGS",
    achType: "PPD" | "WEB" | "TEL" | "CCD"
  },
  amount: string,
  amountShipping?: string,
  amountTax?: string
}
```

### Refund Payment
```
POST /api/payments/refund
Body: {
  paymentMethod: "credit" | "ach",
  paymentData: { ... },
  amount: string
}
```

### Void Transaction
```
POST /api/payments/void
Body: {
  transactionId: string
}
```

## Testing

### Test Scripts
Two test scripts are available:
1. `test-payjunction.js` - Node.js test script
2. `test-payjunction.ps1` - PowerShell test script

Run with:
```bash
node test-payjunction.js
# or
powershell -ExecutionPolicy Bypass -File test-payjunction.ps1
```

## Authentication Issue

**Current Status:** The API is returning 401 authentication errors when testing with the provided credentials.

**Possible Causes:**
1. Credentials may need to be verified/activated in PayJunction dashboard
2. API key may not be properly associated with the account
3. Account may need to be activated for API access
4. Sandbox account may need additional setup

**Next Steps:**
1. Verify credentials in PayJunction dashboard
2. Ensure API access is enabled for the account
3. Check if the API key is correctly associated with the username/password
4. Contact PayJunction support if credentials are confirmed correct

## Integration Status

✅ **Completed:**
- PayJunction service implementation
- Payment API routes
- Checkout form integration
- Credit card form fields
- Payment processing flow
- Error handling

⚠️ **Pending:**
- Successful API authentication (credentials need verification)
- End-to-end testing with valid credentials
- Production environment setup

## Usage in Checkout

The checkout flow now:
1. Collects billing and shipping addresses
2. Collects credit card information (when credit card is selected)
3. Processes payment via PayJunction API
4. Creates order after successful payment
5. Redirects to order confirmation page

## Security Notes

- Payment credentials are stored in environment variables (server-side only)
- Credit card data is sent directly to PayJunction (not stored locally)
- All API calls are made server-side through Next.js API routes
- Client-side code never directly accesses PayJunction credentials

## Support

For PayJunction API documentation:
- Sandbox: https://developer.payjunction.com/
- Support: Contact PayJunction support for credential verification












import { NextRequest, NextResponse } from 'next/server';
import * as payJunction from '@/lib/api/payjunction';

/**
 * POST /api/payments/process
 * Process a payment via PayJunction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      paymentMethod, 
      paymentData, 
      amount, 
      amountShipping, 
      amountTax,
      billingAddress,
      shippingAddress
    } = body;

    // Validate required fields
    if (!paymentMethod || !paymentData || !amount) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: paymentMethod, paymentData, and amount are required' 
        },
        { status: 400 }
      );
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Amount must be a positive number' 
        },
        { status: 400 }
      );
    }

    let result;

    if (paymentMethod === 'credit' || paymentMethod === 'credit_card') {
      // Validate credit card data
      const { cardNumber, cardExpMonth, cardExpYear, cvv } = paymentData;
      
      // Validate that fields are not empty strings
      if (!cardNumber || !cardNumber.trim() || !cardExpMonth || !cardExpMonth.toString().trim() || !cardExpYear || !cardExpYear.toString().trim()) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Missing credit card fields: cardNumber, cardExpMonth, and cardExpYear are required' 
          },
          { status: 400 }
        );
      }

      // Build payment request with billing and shipping addresses
      const paymentRequest: payJunction.CreditCardPaymentRequest = {
        cardNumber,
        cardExpMonth: cardExpMonth.toString().padStart(2, '0'),
        cardExpYear: cardExpYear.toString(),
        amountBase: amountNum.toFixed(2),
        action: 'CHARGE',
        status: 'CAPTURE',
      };

      if (cvv) {
        paymentRequest.cvv = cvv;
      }

      if (amountShipping) {
        paymentRequest.amountShipping = parseFloat(amountShipping).toFixed(2);
      }

      if (amountTax) {
        paymentRequest.amountTax = parseFloat(amountTax).toFixed(2);
      }

      // Add billing address if provided
      if (billingAddress) {
        paymentRequest.billingFirstName = billingAddress.first_name || billingAddress.firstName;
        paymentRequest.billingLastName = billingAddress.last_name || billingAddress.lastName;
        paymentRequest.billingCompanyName = billingAddress.company_name || billingAddress.companyName || billingAddress.company;
        paymentRequest.billingAddress = billingAddress.address_line1 || billingAddress.addressLine1 || billingAddress.address;
        paymentRequest.billingCity = billingAddress.city;
        paymentRequest.billingState = billingAddress.state;
        paymentRequest.billingZip = billingAddress.postal_code || billingAddress.postalCode || billingAddress.zip || billingAddress.zipCode;
        // Note: Phone and email are stored in billingAddress but PayJunction may not support them directly
        // They are included in the request for potential future use or logging
      }

      // Add shipping address if provided
      if (shippingAddress) {
        paymentRequest.shippingAddress = shippingAddress.address_line1 || shippingAddress.addressLine1 || shippingAddress.address;
        paymentRequest.shippingCity = shippingAddress.city;
        paymentRequest.shippingState = shippingAddress.state;
        paymentRequest.shippingZip = shippingAddress.postal_code || shippingAddress.postalCode || shippingAddress.zip;
      }

      // Process credit card payment
      try {
        result = await payJunction.chargeCreditCard(paymentRequest);
      } catch (payJunctionError: any) {
        return NextResponse.json(
          {
            success: false,
            error: payJunctionError.message || 'PayJunction payment processing failed',
            message: payJunctionError.message || 'PayJunction payment processing failed',
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: `Unsupported payment method: ${paymentMethod}` 
        },
        { status: 400 }
      );
    }

    // Verify payment success - must have status CAPTURE or HOLD AND transactionId
    const isSuccessful = result && 
      (result.status === 'CAPTURE' || result.status === 'HOLD') &&
      (result.transactionId || result.transaction_id);

    if (isSuccessful) {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId || result.transaction_id,
        status: result.status,
        message: result.message || 'Payment processed successfully',
        data: result,
      });
    } else {
      // Handle different failure scenarios
      let errorMessage = 'Payment processing failed';
      
      if (result?.status === 'DECLINED') {
        // Payment was declined by the card issuer
        const declineMessage = result.response?.message || 
                              result.response?.statusMessage ||
                              result.message ||
                              'Your payment was declined. Please check your card details or try a different payment method.';
        errorMessage = `Payment declined: ${declineMessage}`;
      } else if (result?.errors && result.errors.length > 0) {
        errorMessage = result.errors[0].message;
      } else if (result?.message) {
        errorMessage = result.message;
      } else if (result?.response?.message) {
        errorMessage = result.response.message;
      } else if (result?.response?.statusMessage) {
        errorMessage = result.response.statusMessage;
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          message: errorMessage,
          status: result?.status,
          data: result,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process payment',
        message: error.message || 'Failed to process payment',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

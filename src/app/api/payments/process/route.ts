import { NextRequest, NextResponse } from 'next/server';
import * as payJunction from '@/lib/api/payjunction';

/**
 * POST /api/payments/process
 * Process a payment via PayJunction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentMethod, paymentData, amount, amountShipping, amountTax } = body;

    // Validate required fields
    if (!paymentMethod || !paymentData || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentMethod, paymentData, and amount are required' },
        { status: 400 }
      );
    }

    let result;

    if (paymentMethod === 'credit' || paymentMethod === 'credit_card') {
      // Validate credit card data
      const { cardNumber, cardExpMonth, cardExpYear, cvv } = paymentData;
      
      if (!cardNumber || !cardExpMonth || !cardExpYear) {
        return NextResponse.json(
          { error: 'Missing credit card fields: cardNumber, cardExpMonth, and cardExpYear are required' },
          { status: 400 }
        );
      }

      // Process credit card payment
      result = await payJunction.chargeCreditCard({
        cardNumber,
        cardExpMonth: cardExpMonth.toString().padStart(2, '0'),
        cardExpYear: cardExpYear.toString(),
        amountBase: parseFloat(amount).toFixed(2),
        cvv,
        status: 'CAPTURE', // Capture immediately
        amountShipping: amountShipping ? parseFloat(amountShipping).toFixed(2) : undefined,
        amountTax: amountTax ? parseFloat(amountTax).toFixed(2) : undefined,
      });
    } else if (paymentMethod === 'ach' || paymentMethod === 'checking') {
      // Validate ACH data
      const { achRoutingNumber, achAccountNumber, achAccountType, achType } = paymentData;
      
      if (!achRoutingNumber || !achAccountNumber || !achAccountType || !achType) {
        return NextResponse.json(
          { error: 'Missing ACH fields: achRoutingNumber, achAccountNumber, achAccountType, and achType are required' },
          { status: 400 }
        );
      }

      // Process ACH payment
      result = await payJunction.chargeACH({
        achRoutingNumber,
        achAccountNumber,
        achAccountType,
        achType,
        amountBase: parseFloat(amount).toFixed(2),
        status: 'CAPTURE',
      });
    } else {
      return NextResponse.json(
        { error: `Unsupported payment method: ${paymentMethod}` },
        { status: 400 }
      );
    }

    // Check if transaction was successful
    if (result.status === 'CAPTURE' || result.status === 'HOLD' || result.transactionId) {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId || result.transaction_id,
        status: result.status,
        message: result.message || 'Payment processed successfully',
        data: result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'Payment processing failed',
          data: result,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process payment',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}


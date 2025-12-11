import { NextRequest, NextResponse } from 'next/server';
import * as payJunction from '@/lib/api/payjunction';

/**
 * POST /api/payments/refund
 * Process a refund via PayJunction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentMethod, paymentData, amount } = body;

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
      const { cardNumber, cardExpMonth, cardExpYear } = paymentData;
      
      if (!cardNumber || !cardExpMonth || !cardExpYear) {
        return NextResponse.json(
          { error: 'Missing credit card fields: cardNumber, cardExpMonth, and cardExpYear are required' },
          { status: 400 }
        );
      }

      // Process credit card refund
      result = await payJunction.refundCreditCard({
        cardNumber,
        cardExpMonth: cardExpMonth.toString().padStart(2, '0'),
        cardExpYear: cardExpYear.toString(),
        amountBase: parseFloat(amount).toFixed(2),
        action: 'REFUND',
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

      // Process ACH refund
      result = await payJunction.refundACH({
        achRoutingNumber,
        achAccountNumber,
        achAccountType,
        achType,
        amountBase: parseFloat(amount).toFixed(2),
        action: 'REFUND',
      });
    } else {
      return NextResponse.json(
        { error: `Unsupported payment method: ${paymentMethod}` },
        { status: 400 }
      );
    }

    // Check if refund was successful
    if (result.status === 'CAPTURE' || result.transactionId) {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId || result.transaction_id,
        status: result.status,
        message: result.message || 'Refund processed successfully',
        data: result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'Refund processing failed',
          data: result,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Refund processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process refund',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}



























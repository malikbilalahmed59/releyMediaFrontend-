import { NextRequest, NextResponse } from 'next/server';
import * as payJunction from '@/lib/api/payjunction';

/**
 * POST /api/payments/void
 * Void a transaction via PayJunction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing required field: transactionId' },
        { status: 400 }
      );
    }

    const result = await payJunction.voidTransaction(transactionId);

    if (result.status === 'VOID' || result.transactionId) {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId || transactionId,
        status: result.status,
        message: result.message || 'Transaction voided successfully',
        data: result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'Failed to void transaction',
          data: result,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Void transaction error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to void transaction',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}


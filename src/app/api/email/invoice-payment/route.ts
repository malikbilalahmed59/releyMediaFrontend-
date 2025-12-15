import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
    host: process.env.EMAIL_HOST || "mail.relymedia.com",
    port: parseInt(process.env.EMAIL_PORT || "465"),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_HOST_USER || "nobody@relymedia.com",
        pass: process.env.EMAIL_HOST_PASSWORD || "Bilal(00)",
    },
};

const SALES_EMAIL = process.env.SALES_EMAIL || "Sales@relymedia.com";
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || "nobody@relymedia.com";

/**
 * Generate HTML email template for invoice payment notification
 */
function generateInvoicePaymentEmail(paymentData: {
    invoiceNumber: string;
    amount: string;
    transactionId: string;
    firstName: string;
    lastName: string;
    company?: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    cardLast4?: string;
    paymentDate: string;
}) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Payment Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #66beda;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .details {
            background-color: white;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            border-left: 4px solid #66beda;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
        }
        .detail-value {
            color: #333;
        }
        .amount {
            font-size: 24px;
            font-weight: bold;
            color: #66beda;
            text-align: center;
            padding: 20px;
            background-color: white;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Invoice Payment Notification</h1>
    </div>
    <div class="content">
        <p>Dear Sales Team,</p>
        <p>A new invoice payment has been successfully processed. Please find the details below:</p>
        
        <div class="amount">
            Amount Paid: $${paymentData.amount}
        </div>
        
        <div class="details">
            <h3 style="margin-top: 0; color: #66beda;">Payment Information</h3>
            <div class="detail-row">
                <span class="detail-label">Invoice Number:</span>
                <span class="detail-value">${paymentData.invoiceNumber}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Transaction ID:</span>
                <span class="detail-value">${paymentData.transactionId}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Date:</span>
                <span class="detail-value">${paymentData.paymentDate}</span>
            </div>
            ${paymentData.cardLast4 ? `
            <div class="detail-row">
                <span class="detail-label">Card (Last 4):</span>
                <span class="detail-value">****${paymentData.cardLast4}</span>
            </div>
            ` : ''}
        </div>
        
        <div class="details">
            <h3 style="margin-top: 0; color: #66beda;">Billing Information</h3>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${paymentData.firstName} ${paymentData.lastName}</span>
            </div>
            ${paymentData.company ? `
            <div class="detail-row">
                <span class="detail-label">Company:</span>
                <span class="detail-value">${paymentData.company}</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${paymentData.email}</span>
            </div>
            ${paymentData.phone ? `
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${paymentData.phone}</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${paymentData.address}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">City, State ZIP:</span>
                <span class="detail-value">${paymentData.city}, ${paymentData.state} ${paymentData.zipCode}</span>
            </div>
        </div>
        
        <p style="margin-top: 20px;">This is an automated notification. Please process this payment accordingly.</p>
    </div>
    <div class="footer">
        <p>RELYmedia - Invoice Payment System</p>
        <p>This email was sent automatically. Please do not reply to this email.</p>
    </div>
</body>
</html>
    `.trim();
}

/**
 * POST /api/email/invoice-payment
 * Send invoice payment notification email
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            invoiceNumber,
            amount,
            transactionId,
            firstName,
            lastName,
            company,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            cardLast4,
        } = body;

        // Validate required fields
        if (!invoiceNumber || !amount || !transactionId || !firstName || !lastName || !email || !address || !city || !state || !zipCode) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields',
                },
                { status: 400 }
            );
        }

        // Get current date/time
        const paymentDate = new Date().toLocaleString('en-US', {
            timeZone: 'America/Chicago',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        // Generate HTML email
        const html = generateInvoicePaymentEmail({
            invoiceNumber,
            amount,
            transactionId,
            firstName,
            lastName,
            company,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            cardLast4,
            paymentDate,
        });

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: EMAIL_CONFIG.host,
            port: EMAIL_CONFIG.port,
            secure: EMAIL_CONFIG.secure,
            auth: EMAIL_CONFIG.auth,
        });

        // Send email to sales
        const info = await transporter.sendMail({
            from: DEFAULT_FROM_EMAIL,
            to: SALES_EMAIL,
            subject: 'Invoice Payments',
            html: html,
            text: html.replace(/<[^>]*>/g, ''), // Plain text fallback
        });

        return NextResponse.json({
            success: true,
            messageId: info.messageId,
            message: 'Invoice payment notification email sent successfully',
        });
    } catch (error: any) {
        console.error('Error sending invoice payment email:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to send email',
            },
            { status: 500 }
        );
    }
}

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
 * POST /api/email/send
 * Send an email
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, subject, html, text } = body;

        // Validate required fields
        if (!to || !subject || !html) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: to, subject, and html are required',
                },
                { status: 400 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: EMAIL_CONFIG.host,
            port: EMAIL_CONFIG.port,
            secure: EMAIL_CONFIG.secure,
            auth: EMAIL_CONFIG.auth,
        });

        // Send email
        const info = await transporter.sendMail({
            from: DEFAULT_FROM_EMAIL,
            to: to,
            subject: subject,
            html: html,
            text: text || html.replace(/<[^>]*>/g, ''), // Plain text fallback
        });

        return NextResponse.json({
            success: true,
            messageId: info.messageId,
            message: 'Email sent successfully',
        });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to send email',
            },
            { status: 500 }
        );
    }
}

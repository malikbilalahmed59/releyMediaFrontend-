'use client';
import React, { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import MainBanner from "@/components/Site/Main_Banner";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";

export const dynamic = 'force-dynamic';

function PaymentContent() {
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [company, setCompany] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpMonth, setCardExpMonth] = useState("");
    const [cardExpYear, setCardExpYear] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [processing, setProcessing] = useState(false);
    const { addToast } = useToast();
    const router = useRouter();

    const formatCardNumber = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Add spaces every 4 digits
        return digits.match(/.{1,4}/g)?.join(' ') || digits;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
    };

    const handleExpMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 2) {
            setCardExpMonth(value);
        }
    };

    const handleExpYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setCardExpYear(value);
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setCardCvv(value);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow numbers and one decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const validateForm = () => {
        if (!invoiceNumber.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter an invoice number',
            });
            return false;
        }

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter a valid amount greater than 0',
            });
            return false;
        }

        if (!agreedToTerms) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'You must agree to the terms and conditions to proceed',
            });
            return false;
        }

        if (!firstName.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter your first name',
            });
            return false;
        }

        if (!lastName.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter your last name',
            });
            return false;
        }

        if (!email.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter your email address',
            });
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter a valid email address',
            });
            return false;
        }

        if (!address.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter your address',
            });
            return false;
        }

        if (!city.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter your city',
            });
            return false;
        }

        if (!state.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter your state',
            });
            return false;
        }

        if (!zipCode.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter your ZIP code',
            });
            return false;
        }

        if (!cardholderName.trim()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter the cardholder name',
            });
            return false;
        }

        const cardNumberDigits = cardNumber.replace(/\s/g, '');
        if (cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter a valid card number',
            });
            return false;
        }

        if (!cardExpMonth || cardExpMonth.length !== 2) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter a valid expiration month (MM)',
            });
            return false;
        }

        const month = parseInt(cardExpMonth);
        if (month < 1 || month > 12) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter a valid expiration month (01-12)',
            });
            return false;
        }

        if (!cardExpYear || cardExpYear.length !== 4) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter a valid expiration year (YYYY)',
            });
            return false;
        }

        const currentYear = new Date().getFullYear();
        const year = parseInt(cardExpYear);
        if (year < currentYear) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Card expiration year cannot be in the past',
            });
            return false;
        }

        if (!cardCvv || cardCvv.length < 3 || cardCvv.length > 4) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please enter a valid CVV',
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setProcessing(true);

        try {
            const amountNum = parseFloat(amount);
            const cardNumberDigits = cardNumber.replace(/\s/g, '');

            const paymentResponse = await fetch('/api/payments/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethod: 'credit',
                    paymentData: {
                        cardNumber: cardNumberDigits,
                        cardExpMonth: cardExpMonth.padStart(2, '0'),
                        cardExpYear: cardExpYear,
                        cvv: cardCvv,
                    },
                    amount: amountNum.toFixed(2),
                    amountShipping: '0.00',
                    amountTax: '0.00',
                    billingAddress: {
                        first_name: firstName,
                        last_name: lastName,
                        company_name: company,
                        phone: phone,
                        email: email,
                        address: address,
                        city: city,
                        state: state,
                        zip: zipCode,
                    },
                }),
            });

            const paymentData = await paymentResponse.json();

            if (!paymentData.success || !paymentData.transactionId) {
                const errorMessage = paymentData.error || paymentData.message || 'Payment processing failed';
                addToast({
                    type: 'error',
                    title: 'Payment Failed',
                    description: errorMessage,
                });
                setProcessing(false);
                return;
            }

            // Verify payment status is successful
            if (paymentData.status && paymentData.status !== 'CAPTURE' && paymentData.status !== 'HOLD') {
                addToast({
                    type: 'error',
                    title: 'Payment Failed',
                    description: 'Payment was not successfully captured',
                });
                setProcessing(false);
                return;
            }

            // Payment successful
            addToast({
                type: 'success',
                title: 'Payment Successful',
                description: `Payment processed successfully. Transaction ID: ${paymentData.transactionId}`,
            });

            // Redirect to success page or clear form
            setTimeout(() => {
                router.push('/success/order');
            }, 2000);

        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Payment Failed',
                description: error.message || 'Failed to process payment. Please check your card details and try again.',
            });
            setProcessing(false);
        }
    };

    return (
        <div className="py-[50px] pb-[75px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">Invoice Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Invoice Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                                    <Input
                                        id="invoiceNumber"
                                        type="text"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                        placeholder="Enter invoice number"
                                        required
                                        disabled={processing}
                                    />
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount to Pay *</Label>
                                    <Input
                                        id="amount"
                                        type="text"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="0.00"
                                        required
                                        disabled={processing}
                                    />
                                </div>

                                {/* Personal Information Section */}
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="text-lg font-semibold">Billing Information</h3>
                                    
                                    {/* First Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="First Name"
                                            required
                                            disabled={processing}
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Last Name"
                                            required
                                            disabled={processing}
                                        />
                                    </div>

                                    {/* Company */}
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company</Label>
                                        <Input
                                            id="company"
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            placeholder="Company"
                                            disabled={processing}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Phone"
                                            disabled={processing}
                                        />
                                    </div>

                                    {/* Email Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                            required
                                            disabled={processing}
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address *</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Address"
                                            required
                                            disabled={processing}
                                        />
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="City"
                                            required
                                            disabled={processing}
                                        />
                                    </div>

                                    {/* State and ZIP Code */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State *</Label>
                                            <Input
                                                id="state"
                                                type="text"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                placeholder="State"
                                                required
                                                disabled={processing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode">ZIP Code *</Label>
                                            <Input
                                                id="zipCode"
                                                type="text"
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                                placeholder="ZIP Code"
                                                required
                                                disabled={processing}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox
                                            id="terms"
                                            checked={agreedToTerms}
                                            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                                            disabled={processing}
                                            className="mt-1"
                                        />
                                        <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                                            By checking this box, I agree to the following: All orders are non-cancelable, non-returnable, and non-refundable. RELYmedia will be notified of any defective or non-conforming products within 2 business days after delivery. There are no refunds for defective or non-conforming products. RELYmedia will repair or replace defective or non-conforming products within 3 weeks after receipt of the defective or non-conforming products. All non-consumable electronics will be repaired or replaced if defective within 1 year after delivery. All flash drives are only guaranteed to work in modern computers unless otherwise noted. RELYmedia will not be responsible for delays in transit outside its control and no refunds will be issued for any such delays. Under no circumstances will the liability of RELYmedia exceed the total amount listed on the invoice. Order changes are subject to additional costs. If the change results in an overpayment, a merchant processing fee of 3.5% will be subtracted from any refund issued on any credit card.
                                        </Label>
                                    </div>
                                </div>

                                {/* Cardholder Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                                    <Input
                                        id="cardholderName"
                                        type="text"
                                        value={cardholderName}
                                        onChange={(e) => setCardholderName(e.target.value)}
                                        placeholder="Name on card"
                                        required
                                        disabled={processing}
                                    />
                                </div>

                                {/* Card Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number *</Label>
                                    <Input
                                        id="cardNumber"
                                        type="text"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        required
                                        disabled={processing}
                                    />
                                </div>

                                {/* Expiry and CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expMonth">Expiration Month *</Label>
                                        <Input
                                            id="expMonth"
                                            type="text"
                                            value={cardExpMonth}
                                            onChange={handleExpMonthChange}
                                            placeholder="MM"
                                            maxLength={2}
                                            required
                                            disabled={processing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="expYear">Expiration Year *</Label>
                                        <Input
                                            id="expYear"
                                            type="text"
                                            value={cardExpYear}
                                            onChange={handleExpYearChange}
                                            placeholder="YYYY"
                                            maxLength={4}
                                            required
                                            disabled={processing}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV *</Label>
                                    <Input
                                        id="cvv"
                                        type="text"
                                        value={cardCvv}
                                        onChange={handleCvvChange}
                                        placeholder="123"
                                        maxLength={4}
                                        required
                                        disabled={processing}
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? 'Processing Payment...' : 'Process Payment'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function PaymentPage() {
    return (
        <>
            <Suspense fallback={
                <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading header...</div>
                    </div>
                </div>
            }>
                <Header/>
            </Suspense>
            <MainBanner/>
            <PaymentContent/>
            <Customer_Feedback/>
            <Client_Logo/>
            <Footer/>
        </>
    );
}

export default PaymentPage;

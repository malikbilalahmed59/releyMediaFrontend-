"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import * as accountsAPI from '@/lib/api/accounts';
import type { Cart, UserAddress, CreateAddressRequest } from '@/lib/api/accounts';
import pen from "../../../public/images/pen.png";
import { useToast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import AddressForm from "@/components/Site/AddressForm";

function CheckoutFormContent() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [billingAddressId, setBillingAddressId] = useState<number | null>(null);
    const { addToast } = useToast();
    const [shippingAddressId, setShippingAddressId] = useState<number | null>(null);
    const [notes, setNotes] = useState("");
    const [uploadArtwork, setUploadArtwork] = useState<File | null>(null);
    const [dateOrderNeeded, setDateOrderNeeded] = useState("");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [sameAsBilling, setSameAsBilling] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [cardholderName, setCardholderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpMonth, setCardExpMonth] = useState("");
    const [cardExpYear, setCardExpYear] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [cartData, addressesResponse] = await Promise.all([
                accountsAPI.getCart(),
                accountsAPI.getAddresses(),
            ]);
            
            setCart(cartData);
            
            // Handle different response formats
            let addressesData: UserAddress[] = [];
            if (Array.isArray(addressesResponse)) {
                addressesData = addressesResponse;
            } else if (addressesResponse && typeof addressesResponse === 'object') {
                const addressesObj = addressesResponse as any;
                if ('results' in addressesObj && Array.isArray(addressesObj.results)) {
                    addressesData = addressesObj.results;
                } else if ('data' in addressesObj && Array.isArray(addressesObj.data)) {
                    addressesData = addressesObj.data;
                } else if ('addresses' in addressesObj && Array.isArray(addressesObj.addresses)) {
                    addressesData = addressesObj.addresses;
                }
            }
            
            setAddresses(addressesData);
            
            // Set default addresses
            const defaultBilling = addressesData.find(a => a.address_type === 'billing' && a.is_default);
            const defaultShipping = addressesData.find(a => a.address_type === 'shipping' && a.is_default);
            
            if (defaultBilling) setBillingAddressId(defaultBilling.id);
            else {
                const firstBilling = addressesData.find(a => a.address_type === 'billing');
                if (firstBilling) setBillingAddressId(firstBilling.id);
            }
            
            if (defaultShipping) setShippingAddressId(defaultShipping.id);
            else {
                const firstShipping = addressesData.find(a => a.address_type === 'shipping');
                if (firstShipping) setShippingAddressId(firstShipping.id);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSaved = () => {
        loadData();
    };

    // Function to manually sync addresses
    const handleSyncAddresses = async () => {
        if (!billingAddressId) {
            addToast({
                type: 'warning',
                title: 'No Billing Address',
                description: 'Please select or create a billing address first',
            });
            return;
        }

        const billingAddress = addresses.find(a => a.id === billingAddressId);
        if (!billingAddress) {
            addToast({
                type: 'error',
                title: 'Error',
                description: 'Billing address not found',
            });
            return;
        }

        try {
            setProcessing(true);
            
            // Get all addresses to find existing shipping address
            const allAddresses = await accountsAPI.getAddresses();
            let addressesArray: UserAddress[] = [];
            
            if (Array.isArray(allAddresses)) {
                addressesArray = allAddresses;
            } else if (allAddresses && typeof allAddresses === 'object') {
                const addressesObj = allAddresses as any;
                if ('results' in addressesObj && Array.isArray(addressesObj.results)) {
                    addressesArray = addressesObj.results;
                } else if ('data' in addressesObj && Array.isArray(addressesObj.data)) {
                    addressesArray = addressesObj.data;
                } else if ('addresses' in addressesObj && Array.isArray(addressesObj.addresses)) {
                    addressesArray = addressesObj.addresses;
                }
            }

            // Find existing shipping address
            const existingShipping = addressesArray.find(a => a.address_type === 'shipping');
            
            const shippingData: CreateAddressRequest = {
                address_type: 'shipping',
                address_line1: billingAddress.address_line1,
                address_line2: billingAddress.address_line2,
                city: billingAddress.city,
                state: billingAddress.state,
                postal_code: billingAddress.postal_code,
                country: billingAddress.country,
                is_default: billingAddress.is_default,
            };

            let shippingId: number;
            
            if (existingShipping) {
                // Update existing shipping address via PUT
                const updated = await accountsAPI.updateAddress(existingShipping.id, shippingData);
                shippingId = updated.id;
            } else {
                // Create new shipping address via POST
                const created = await accountsAPI.createAddress(shippingData);
                shippingId = created.id;
            }

            setShippingAddressId(shippingId);
            await loadData();
            
            addToast({
                type: 'success',
                title: 'Addresses Synced!',
                description: 'Shipping address has been synced with billing address',
            });
        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Sync Failed',
                description: error.message || 'Failed to sync addresses. Please try again.',
            });
        } finally {
            setProcessing(false);
        }
    };

    // Note: We don't auto-sync in useEffect to avoid infinite loops
    // Sync happens when checkbox is checked via onCheckedChange handler

    const handleCheckout = async () => {
        // Always use the actual shipping address ID (which should be different from billing ID even if same data)
        // If sameAsBilling is true, handleSyncAddresses should have already created a separate shipping address
        if (!billingAddressId || !shippingAddressId) {
            addToast({
                type: 'warning',
                title: 'Address Required',
                description: 'Please select both billing and shipping addresses',
            });
            return;
        }
        
        // Ensure billing and shipping have different IDs (even if same data)
        if (billingAddressId === shippingAddressId) {
            // If they're the same ID, we need to sync to create separate shipping address
            if (sameAsBilling) {
                addToast({
                    type: 'warning',
                    title: 'Syncing Addresses',
                    description: 'Please wait while we sync your addresses...',
                });
                await handleSyncAddresses();
                // Reload addresses to get the new shipping address ID
                await loadData();
                if (!shippingAddressId || billingAddressId === shippingAddressId) {
                    addToast({
                        type: 'error',
                        title: 'Address Sync Required',
                        description: 'Please ensure shipping address is synced. Shipping and billing must have different IDs.',
                    });
                    return;
                }
            } else {
                addToast({
                    type: 'error',
                    title: 'Invalid Address',
                    description: 'Billing and shipping addresses must be different. Please select different addresses.',
                });
                return;
            }
        }
        
        const finalShippingAddressId = shippingAddressId;

        if (!cart || cart.items.length === 0) {
            addToast({
                type: 'warning',
                title: 'Empty Cart',
                description: 'Your cart is empty',
            });
            return;
        }

        if (!agreedToTerms) {
            addToast({
                type: 'warning',
                title: 'Agreement Required',
                description: 'Please read and agree to the terms and conditions before placing your order',
            });
            return;
        }

        // Validate credit card fields
        if (!cardholderName.trim() || !cardNumber.trim() || !cardExpMonth || !cardExpYear || !cardCvv.trim()) {
            addToast({
                type: 'warning',
                title: 'Payment Information Required',
                description: 'Please fill in all credit card fields including cardholder name, card number, expiration month, expiration year, and CVV',
            });
            return;
        }

        // Additional validation for card number (must be at least 13 digits)
        const cleanedCardNumber = cardNumber.replace(/\s/g, '');
        if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
            addToast({
                type: 'warning',
                title: 'Invalid Card Number',
                description: 'Please enter a valid credit card number',
            });
            return;
        }

        setProcessing(true);
        let paymentResult: any = null;

        try {
            // Get billing and shipping address objects
            const billingAddress = addresses.find(a => a.id === billingAddressId);
            const shippingAddress = addresses.find(a => a.id === finalShippingAddressId);

            if (!billingAddress || !shippingAddress) {
                throw new Error('Billing or shipping address not found');
            }

            // Calculate totals
            const originalSubtotal = parseFloat(cart.total_price) || 0;
            const DISCOUNT_PERCENTAGE = 20;
            const discountAmount = originalSubtotal * (DISCOUNT_PERCENTAGE / 100);
            const subtotal = originalSubtotal - discountAmount;
            
            // Calculate shipping fee per product (if discounted price * quantity < $500, add $100 per product)
            const calculateShippingFee = (): number => {
                if (!cart || !cart.items || cart.items.length === 0) {
                    return 0;
                }
                
                let totalFee = 0;
                
                // Check each product individually
                cart.items.forEach((item) => {
                    const pricePerUnit = typeof item.price_per_unit === 'string' 
                        ? parseFloat(item.price_per_unit) 
                        : (item.price_per_unit || 0);
                    
                    // Calculate discounted price * quantity for this product
                    const productTotal = pricePerUnit * item.quantity;
                    const discountedProductTotal = productTotal * (1 - DISCOUNT_PERCENTAGE / 100);
                    
                    // If discounted product total is less than $500, add $100 fee for this product
                    if (discountedProductTotal < 500) {
                        totalFee += 100;
                    }
                });
                
                return totalFee;
            };
            
            const shippingFee = calculateShippingFee();
            const total = subtotal + shippingFee;

            // Step 1: Process payment via PayJunction first
            try {
                const paymentResponse = await fetch('/api/payments/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentMethod: 'credit',
                        paymentData: {
                            cardNumber: cardNumber.replace(/\s/g, ''),
                            cardExpMonth,
                            cardExpYear,
                            cvv: cardCvv,
                        },
                        amount: total.toFixed(2),
                        amountShipping: shippingFee.toFixed(2),
                        amountTax: '0.00',
                        billingAddress: {
                            first_name: user?.first_name || '',
                            last_name: user?.last_name || '',
                            address_line1: billingAddress.address_line1,
                            city: billingAddress.city,
                            state: billingAddress.state,
                            postal_code: billingAddress.postal_code,
                        },
                        shippingAddress: {
                            address_line1: shippingAddress.address_line1,
                            city: shippingAddress.city,
                            state: shippingAddress.state,
                            postal_code: shippingAddress.postal_code,
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
                    return; // Stop here - don't proceed to Django checkout
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

                paymentResult = paymentData;
            } catch (paymentError: any) {
                addToast({
                    type: 'error',
                    title: 'Payment Failed',
                    description: paymentError.message || 'Failed to process payment. Please check your card details and try again.',
                });
                setProcessing(false);
                return; // Stop here - don't create order if payment fails
            }

            // Step 2: Create order in Django ONLY after successful payment with payment_status='paid'
            // Convert file to base64 if present
            let artworkBase64: string | undefined = undefined;
            if (uploadArtwork) {
                try {
                    artworkBase64 = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64String = reader.result as string;
                            resolve(base64String);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(uploadArtwork);
                    });
                } catch (error) {
                    console.error('Error converting artwork to base64:', error);
                }
            }

            const order = await accountsAPI.checkout({
                billing_address_id: billingAddressId,
                shipping_address_id: finalShippingAddressId,
                notes: notes || undefined,
                upload_artwork: artworkBase64 || undefined,
                date_order_needed: dateOrderNeeded || undefined,
                payment_status: 'paid',
                transaction_id: paymentResult?.transactionId || undefined,
            });
            
            addToast({
                type: 'success',
                title: 'Order Placed',
                description: paymentResult 
                    ? `Your order has been placed successfully! Transaction ID: ${paymentResult.transactionId}`
                    : 'Your order has been placed successfully!',
            });
            
            // Redirect to order confirmation page
            router.push('/success/order');
        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Checkout Failed',
                description: error.message || 'Checkout failed. Please try again.',
            });
        } finally {
            setProcessing(false);
        }
    };

    const getProductImage = (item: any): string => {
        return item.primary_image || pen.src;
    };

    const isExternalImage = (image: string): boolean => {
        return image.startsWith('http://') || image.startsWith('https://') || image.startsWith('//');
    };

    if (loading) {
        return (
            <div className="py-[50px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="text-center">Loading checkout...</div>
                </div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <>
                <div className="sm:pt-[40px] pt-[20px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <ul className="flex gap-[5px] items-center">
                            <li className="flex items-center gap-1">
                                <Link href="/" className="text-[16px] leading-[16px] font-semibold text-[#111111CC] hover:text-accent">Home</Link> <span>-</span>
                            </li>
                            <li className="flex items-center gap-1 text-[#111111] font-black">Checkout</li>
                        </ul>
                    </div>
                </div>
                <div className="sm:pt-[50px] pt-[30px] lg:pb-[80px] pb-[50px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center py-[50px]">
                            <p className="text-[18px] text-[#666] mb-4">Your cart is empty</p>
                            <Link href="/products">
                                <Button variant="secondary">Continue Shopping</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const billingAddresses = addresses.filter(a => a.address_type === 'billing');
    const shippingAddresses = addresses.filter(a => a.address_type === 'shipping');
    const originalSubtotal = parseFloat(cart.total_price) || 0;
    
    // Calculate 20% discount
    const DISCOUNT_PERCENTAGE = 20;
    const discountAmount = originalSubtotal * (DISCOUNT_PERCENTAGE / 100);
    const subtotal = originalSubtotal - discountAmount;
    
    // Calculate shipping fee per product (if discounted price * quantity < $500, add $100 per product)
    const calculateShippingFee = (): number => {
        if (!cart || !cart.items || cart.items.length === 0) {
            return 0;
        }
        
        let totalFee = 0;
        
        // Check each product individually
        cart.items.forEach((item) => {
            const pricePerUnit = typeof item.price_per_unit === 'string' 
                ? parseFloat(item.price_per_unit) 
                : (item.price_per_unit || 0);
            
            // Calculate discounted price * quantity for this product
            const productTotal = pricePerUnit * item.quantity;
            const discountedProductTotal = productTotal * (1 - DISCOUNT_PERCENTAGE / 100);
            
            // If discounted product total is less than $500, add $100 fee for this product
            if (discountedProductTotal < 500) {
                totalFee += 100;
            }
        });
        
        return totalFee;
    };
    
    const shippingFee = calculateShippingFee();
    // Check if all products have free shipping (each discounted product >= $500)
    const hasFreeShipping = cart.items.every((item) => {
        const pricePerUnit = typeof item.price_per_unit === 'string' 
            ? parseFloat(item.price_per_unit) 
            : (item.price_per_unit || 0);
        const productTotal = pricePerUnit * item.quantity;
        const discountedProductTotal = productTotal * (1 - DISCOUNT_PERCENTAGE / 100);
        return discountedProductTotal >= 500;
    });
    const total = subtotal + shippingFee;
    
    // Calculate total quantity for display
    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <div className="sm:pt-[40px] pt-[20px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <ul className="flex gap-[5px] items-center">
                        <li className="flex items-center gap-1">
                            <Link href="/" className="text-[16px] leading-[16px] font-semibold text-[#111111CC] hover:text-accent">Home</Link> <span>-</span>
                        </li>
                        <li className="flex items-center gap-1 text-[#111111] font-black">Checkout</li>
                    </ul>
                </div>
            </div>
            <div className="sm:pt-[50px] pt-[30px] lg:pb-[80px] pb-[50px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="grid xl:grid-cols-[62.8%_33.8%] md:grid-cols-[55.8%_40.8%] xl:gap-[42px] lg:gap-[34px] gap-[20px]">
                        {/* Left Section - Addresses + Order Summary */}
                        <div className="space-y-6">
                            {/* Billing Address Selection */}
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] pb-[30px]">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[34px] font-semibold h-auto gap-0">
                                    <CardTitle className="text-white font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px]">Billing Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-[16px] px-[20px]">
                                    {billingAddresses.length > 0 ? (
                                        <div className="space-y-3">
                                            <Label className="form-label">Select Billing Address</Label>
                                            <Select
                                                value={billingAddressId?.toString() || ""}
                                                onValueChange={(value) => setBillingAddressId(parseInt(value))}
                                            >
                                                <SelectTrigger className="form-input">
                                                    <SelectValue placeholder="Select billing address" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {billingAddresses.map((address) => (
                                                        <SelectItem key={address.id} value={address.id.toString()}>
                                                            {address.address_line1}, {address.city}, {address.state} {address.postal_code}
                                                            {address.is_default && " (Default)"}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : null}
                                    <AddressForm 
                                        addressType="billing"
                                        showExisting={billingAddresses.length > 0}
                                        onAddressSaved={handleAddressSaved}
                                        onSelect={setBillingAddressId}
                                        selectedAddressId={billingAddressId}
                                        syncWithType={sameAsBilling ? 'shipping' : null}
                                        onSyncAddress={(addressId) => {
                                            setShippingAddressId(addressId);
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Shipping Address Selection */}
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] pb-[30px]">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[34px] font-semibold h-auto gap-0">
                                    <CardTitle className="text-white font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px]">Shipping Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-[16px] px-[20px]">
                                    <div className="flex items-center justify-between pb-2 border-b">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="same_as_billing"
                                                checked={sameAsBilling}
                                                onCheckedChange={async (checked) => {
                                                    const isChecked = checked as boolean;
                                                    setSameAsBilling(isChecked);
                                                    // Automatically sync when checkbox is checked to create separate shipping address
                                                    if (isChecked && billingAddressId) {
                                                        await handleSyncAddresses();
                                                        // Reload to get the new shipping address ID
                                                        await loadData();
                                                    } else if (!isChecked) {
                                                        // When unchecked, clear shipping selection so user can choose different address
                                                        setShippingAddressId(null);
                                                    }
                                                }}
                                            />
                                            <Label htmlFor="same_as_billing" className="text-[14px] cursor-pointer font-semibold">
                                                Same as billing address
                                            </Label>
                                        </div>
                                    </div>
                                    {!sameAsBilling && (
                                        <>
                                            {shippingAddresses.length > 0 ? (
                                                <div className="space-y-3">
                                                    <Label className="form-label">Select Shipping Address</Label>
                                                    <Select
                                                        value={shippingAddressId?.toString() || ""}
                                                        onValueChange={(value) => setShippingAddressId(parseInt(value))}
                                                    >
                                                        <SelectTrigger className="form-input">
                                                            <SelectValue placeholder="Select shipping address" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {shippingAddresses.map((address) => (
                                                                <SelectItem key={address.id} value={address.id.toString()}>
                                                                    {address.address_line1}, {address.city}, {address.state} {address.postal_code}
                                                                    {address.is_default && " (Default)"}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            ) : null}
                                            <AddressForm 
                                                addressType="shipping"
                                                showExisting={shippingAddresses.length > 0}
                                                onAddressSaved={handleAddressSaved}
                                                onSelect={setShippingAddressId}
                                                selectedAddressId={shippingAddressId}
                                                syncWithType={sameAsBilling ? 'billing' : null}
                                                onSyncAddress={(addressId) => {
                                                    setBillingAddressId(addressId);
                                                }}
                                            />
                                        </>
                                    )}
                                    {sameAsBilling && (
                                        <div className="space-y-3">
                                            <div className="text-center py-4 bg-accent/10 border-2 border-accent/30 rounded-lg">
                                                <p className="text-[14px] font-semibold text-foreground mb-2">
                                                    ✓ Shipping address synced with billing address
                                                </p>
                                                {billingAddressId && (
                                                    <div className="text-[12px] text-muted-foreground">
                                                        {(() => {
                                                            const selectedBilling = addresses.find(a => a.id === billingAddressId);
                                                            return selectedBilling ? (
                                                                <div className="mt-2 p-2 bg-white rounded text-left">
                                                                    <p className="font-semibold">{selectedBilling.address_line1}</p>
                                                                    {selectedBilling.address_line2 && <p>{selectedBilling.address_line2}</p>}
                                                                    <p>{selectedBilling.city}, {selectedBilling.state} {selectedBilling.postal_code}</p>
                                                                    <p>{selectedBilling.country}</p>
                                                                </div>
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Notes */}
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] pb-[30px]">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[34px] font-semibold h-auto gap-0">
                                    <CardTitle className="text-white font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px]">Order Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="px-[20px] space-y-4">
                                    <div>
                                        <Label className="form-label">Additional Notes (Optional)</Label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Please provide any additional information such as imprint instructions."
                                            className="w-full min-h-[100px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="uploadArtwork" className="form-label">Upload Artwork (Optional)</Label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative inline-block">
                                                <Input
                                                    id="uploadArtwork"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        setUploadArtwork(file);
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="border-2 border-accent bg-accent/10 hover:bg-accent/20 text-accent font-semibold py-6 px-12 rounded-lg cursor-pointer transition-colors text-[18px]"
                                                    onClick={() => document.getElementById('uploadArtwork')?.click()}
                                                >
                                                    Browse
                                                </Button>
                                            </div>
                                            {uploadArtwork && (
                                                <span className="text-[14px] text-foreground font-medium">
                                                    {uploadArtwork.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="dateOrderNeeded" className="form-label">Date Order Needed By (Optional)</Label>
                                        <Input
                                            id="dateOrderNeeded"
                                            type="text"
                                            value={dateOrderNeeded}
                                            onChange={(e) => setDateOrderNeeded(e.target.value)}
                                            placeholder="Please enter a date"
                                            className="form-input"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Summary */}
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] pb-[30px]">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[34px] font-semibold h-auto gap-0">
                                    <CardTitle className="text-white font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px]">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="px-[20px] space-y-4">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                                            <Link href={`/single-products/${item.product}`} className="flex-shrink-0">
                                                <figure className="relative w-[80px] h-[80px] bg-gradient rounded-[10px] p-[6px] flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                                                    <Image
                                                        src={getProductImage(item)}
                                                        alt={item.product_name}
                                                        width={80}
                                                        height={80}
                                                        className="w-full h-full object-contain"
                                                        style={isExternalImage(getProductImage(item)) ? { width: "auto", height: "auto" } : undefined}
                                                        unoptimized={isExternalImage(getProductImage(item))}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = pen.src;
                                                        }}
                                                    />
                                                </figure>
                                            </Link>
                                            <div className="flex-1">
                                                <Link href={`/single-products/${item.product}`}>
                                                    <p className="font-semibold hover:text-accent transition-colors cursor-pointer">{item.product_name}</p>
                                                </Link>
                                                {item.part_name && (
                                                    <p className="text-sm text-gray-600">{item.part_name}</p>
                                                )}
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold">${item.total_price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                    <div className="pt-4 space-y-2">
                                        {/* Discount Banner */}
                                        <div className="bg-accent/10 border-2 border-accent rounded-[12px] p-3 text-center mb-3">
                                            <div className="text-[18px] mb-1">🎉 {DISCOUNT_PERCENTAGE}% OFF</div>
                                            <div className="font-bold text-[14px] text-foreground">Special Discount Applied!</div>
                                        </div>

                                        {/* Original Price */}
                                        <div className="flex justify-between">
                                            <span className="font-bold">Original Price ({totalQuantity} units):</span>
                                            <span className="line-through text-muted-foreground">${originalSubtotal.toFixed(2)}</span>
                                        </div>

                                        {/* Discount */}
                                        <div className="flex justify-between border-t border-border pt-2">
                                            <span className="font-bold">Discount ({DISCOUNT_PERCENTAGE}%):</span>
                                            <span className="text-accent font-bold">-${discountAmount.toFixed(2)}</span>
                                        </div>

                                        {/* Final Price */}
                                        <div className="flex justify-between pt-2 border-t-2 border-border">
                                            <span className="font-bold">Final Price ({totalQuantity} units):</span>
                                            <span className="font-bold text-accent">${subtotal.toFixed(2)}</span>
                                        </div>

                                        {hasFreeShipping ? (
                                            <div className="flex justify-between bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                                                <span className="font-bold text-green-800">Less than Minimum Fee:</span>
                                                <span className="text-green-700 font-semibold">$0.00</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-200">
                                                <span className="font-bold text-yellow-800">Less than Minimum Fee:</span>
                                                <span className="text-yellow-700 font-semibold">+${shippingFee.toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        {!hasFreeShipping && (
                                            <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                                                <p className="text-[12px] text-blue-800 text-center">
                                                    💡 <strong>Less than Minimum Fee:</strong> Each product with a total of $500 or more has no less than minimum fee.
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between pt-2 border-t font-bold text-lg">
                                            <span>Total:</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Section - Payment Options */}
                        <div>
                            <Card className="bg-[#F5F5F5] border-transparent rounded-[20px] py-[20px] px-[14px] shadow-none">
                                <CardContent className="px-0">
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <Label htmlFor="cardholderName" className="form-label">Cardholder Name</Label>
                                            <Input
                                                id="cardholderName"
                                                type="text"
                                                value={cardholderName}
                                                onChange={(e) => setCardholderName(e.target.value)}
                                                placeholder="John Doe"
                                                className="form-input"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="cardNumber" className="form-label">Card Number</Label>
                                            <Input
                                                id="cardNumber"
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\s/g, '');
                                                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                                                    setCardNumber(formatted.substring(0, 19));
                                                }}
                                                placeholder="1234 5678 9012 3456"
                                                className="form-input"
                                                maxLength={19}
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="cardExpMonth" className="form-label">Month</Label>
                                                <Select value={cardExpMonth} onValueChange={setCardExpMonth}>
                                                    <SelectTrigger className="form-input">
                                                        <SelectValue placeholder="MM" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 12 }, (_, i) => {
                                                            const month = (i + 1).toString().padStart(2, '0');
                                                            return (
                                                                <SelectItem key={month} value={month}>
                                                                    {month}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="cardExpYear" className="form-label">Year</Label>
                                                <Select value={cardExpYear} onValueChange={setCardExpYear}>
                                                    <SelectTrigger className="form-input">
                                                        <SelectValue placeholder="YYYY" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 20 }, (_, i) => {
                                                            const year = (new Date().getFullYear() + i).toString();
                                                            return (
                                                                <SelectItem key={year} value={year}>
                                                                    {year}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="cardCvv" className="form-label">CVV</Label>
                                                <Input
                                                    id="cardCvv"
                                                    type="text"
                                                    value={cardCvv}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        setCardCvv(value.substring(0, 4));
                                                    }}
                                                    placeholder="123"
                                                    className="form-input"
                                                    maxLength={4}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Terms and Conditions Checkbox */}
                                    <div className="bg-white border-2 border-accent/30 rounded-[12px] p-4 mb-6">
                                        <div className="flex items-start space-x-3">
                                            <Checkbox
                                                id="terms_agreement"
                                                checked={agreedToTerms}
                                                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                                className="mt-1"
                                            />
                                            <Label htmlFor="terms_agreement" className="text-[14px] cursor-pointer font-semibold leading-[20px]">
                                                By checking this box, I agree to the following: All orders are custom made-to-order, non-cancelable, non-returnable, and non-refundable. RELYmedia will be notified of any defective or non-conforming products within 2 business days after delivery. There are no refunds for defective or non-conforming products. RELYmedia will repair or replace defective or non-conforming products within 3 weeks after receipt of the defective or non-conforming products. All non-consumable electronics will be repaired or replaced if defective within 1 year after delivery. All computer accessories are only guaranteed to work in modern computers unless otherwise noted. RELYmedia will not be responsible for delays in transit outside its control and no refunds will be issued for any such delays. Under no circumstances will the liability of RELYmedia exceed the total amount listed on the credit card charge. Order changes are subject to additional costs. If the change results in an overpayment, a merchant processing fee of 3.5% will be subtracted from any refund issued on any credit card.
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center items-center lg:gap-[16px] gap-[10px] mb-4">
                                        <Image src="/images/visa.png" alt="Visa" width={57} height={40} />
                                        <Image src="/images/mastercard.png" alt="MasterCard" width={57} height={40} />
                                        <Image src="/images/stripe.png" alt="Stripe" width={57} height={40} />
                                        <Image src="/images/discover.png" alt="Discover" width={57} height={40} />
                                    </div>

                                    <div className="text-center text-[16px] font-bold mt-[13px] mb-6">
                                        Guaranteed safe checkout 🔒
                                    </div>

                                    <Button
                                        onClick={handleCheckout}
                                        disabled={processing || !billingAddressId || !shippingAddressId || !agreedToTerms}
                                        variant="secondary"
                                        className="w-full h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] cursor-pointer bg-foreground text-white disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Place Order'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function CheckoutForm() {
    return (
        <ProtectedRoute>
            <CheckoutFormContent />
        </ProtectedRoute>
    );
}

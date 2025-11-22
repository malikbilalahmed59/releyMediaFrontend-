"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
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
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [sameAsBilling, setSameAsBilling] = useState(false);
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
            console.error('Error loading checkout data:', error);
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
            console.error('Error syncing addresses:', error);
            addToast({
                type: 'error',
                title: 'Sync Failed',
                description: error.message || 'Failed to sync addresses. Please try again.',
            });
        } finally {
            setProcessing(false);
        }
    };

    // Sync shipping with billing when "same as billing" is checked
    useEffect(() => {
        if (sameAsBilling && billingAddressId) {
            // When checkbox is checked, set shipping to use billing ID
            // User can click "Sync Now" button to actually create/update the shipping address via API
            setShippingAddressId(billingAddressId);
        } else if (!sameAsBilling && shippingAddressId === billingAddressId) {
            // When unchecked, if they were the same, clear shipping selection
            // User will need to select a different shipping address
            setShippingAddressId(null);
        }
    }, [sameAsBilling, billingAddressId]);

    const handleCheckout = async () => {
        const finalShippingAddressId = sameAsBilling ? billingAddressId : shippingAddressId;
        
        if (!billingAddressId || !finalShippingAddressId) {
            addToast({
                type: 'warning',
                title: 'Address Required',
                description: 'Please select both billing and shipping addresses',
            });
            return;
        }

        if (!cart || cart.items.length === 0) {
            addToast({
                type: 'warning',
                title: 'Empty Cart',
                description: 'Your cart is empty',
            });
            return;
        }

        setProcessing(true);
        try {
            const order = await accountsAPI.checkout({
                billing_address_id: billingAddressId,
                shipping_address_id: finalShippingAddressId,
                notes: notes || undefined,
            });
            
            addToast({
                type: 'success',
                title: 'Order Placed',
                description: 'Your order has been placed successfully!',
            });
            
            // Redirect to order confirmation page
            router.push(`/orders/${order.order_number}`);
        } catch (error: any) {
            console.error('Error during checkout:', error);
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
    
    // Calculate shipping fee (if base price < $500, add $100)
    const calculateShippingFee = (): number => {
        if (originalSubtotal < 500) {
            return 100;
        }
        return 0;
    };
    
    const shippingFee = calculateShippingFee();
    const hasFreeShipping = originalSubtotal >= 500;
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
                                                onCheckedChange={(checked) => {
                                                    setSameAsBilling(checked as boolean);
                                                }}
                                            />
                                            <Label htmlFor="same_as_billing" className="text-[14px] cursor-pointer font-semibold">
                                                Same as billing address
                                            </Label>
                                        </div>
                                        {sameAsBilling && billingAddressId && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleSyncAddresses}
                                                disabled={processing}
                                                className="h-8 text-xs font-semibold"
                                            >
                                                {processing ? 'Syncing...' : '🔄 Sync Now'}
                                            </Button>
                                        )}
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
                                            <p className="text-[12px] text-muted-foreground text-center">
                                                💡 Tip: When you create or edit a billing address, the shipping address will automatically sync
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Notes */}
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] pb-[30px]">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[34px] font-semibold h-auto gap-0">
                                    <CardTitle className="text-white font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px]">Order Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="px-[20px]">
                                    <Label className="form-label">Additional Notes (Optional)</Label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any special instructions for your order..."
                                        className="w-full min-h-[100px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                                    />
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
                                            <img
                                                src={getProductImage(item)}
                                                alt={item.product_name}
                                                className="w-16 h-16 object-contain rounded"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = pen.src;
                                                }}
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.product_name}</p>
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
                                                <span className="font-bold text-green-800">🚚 Shipping:</span>
                                                <span className="text-green-700 font-semibold">FREE</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-200">
                                                <span className="font-bold text-yellow-800">Shipping:</span>
                                                <span className="text-yellow-700 font-semibold">${shippingFee.toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        {!hasFreeShipping && (
                                            <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                                                <p className="text-[12px] text-blue-800 text-center">
                                                    💡 <strong>Free Shipping:</strong> Add ${(500 - originalSubtotal).toFixed(2)} more to qualify for free shipping!
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between">
                                            <span className="font-bold">Tax:</span>
                                            <span>$0.00</span>
                                        </div>
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
                                    <h3 className="text-[18px] leading-[18px] font-bold mb-[24px]">Choose Payment</h3>
                                    <RadioGroup
                                        value={paymentMethod}
                                        onValueChange={setPaymentMethod}
                                        className="space-y-4 lg:mb-[65px] mb-[55px]"
                                    >
                                        <div className="flex space-x-[15px]">
                                            <RadioGroupItem value="credit" id="credit" className="w-[21px] h-[21px] relative top-[6px]"/>
                                            <Label htmlFor="credit" className="inline-block font-semibold text-[16px]">
                                                Pay via credit card
                                                <p className="lg:text-[15px] text-[12px] text-foreground/80 mt-[3px] !font-Regular">
                                                    (MasterCard, Maestro, Visa, Visa Electron, JCB <br className="lg:block hidden"/> and American Express)
                                                </p>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-[15px]">
                                            <RadioGroupItem value="paypal" id="paypal" className="w-[21px] h-[21px]"/>
                                            <Label htmlFor="paypal" className="inline-block font-semibold text-[16px]">PayPal</Label>
                                        </div>
                                    </RadioGroup>

                                    <div className="flex flex-wrap justify-center items-center lg:gap-[16px] gap-[10px]">
                                        <Image src="/images/visa.png" alt="Visa" width={57} height={40} />
                                        <Image src="/images/mastercard.png" alt="MasterCard" width={57} height={40} />
                                        <Image src="/images/paypal.png" alt="PayPal" width={57} height={40} />
                                        <Image src="/images/stripe.png" alt="Stripe" width={57} height={40} />
                                        <Image src="/images/discover.png" alt="Discover" width={57} height={40} />
                                    </div>

                                    <div className="text-center text-[16px] font-bold mt-[13px]">
                                        Guaranteed safe checkout 🔒
                                    </div>

                                    <Button
                                        onClick={handleCheckout}
                                        disabled={processing || !billingAddressId || !shippingAddressId}
                                        variant="secondary"
                                        className="w-full h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] cursor-pointer bg-foreground text-white mt-6 disabled:opacity-50"
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

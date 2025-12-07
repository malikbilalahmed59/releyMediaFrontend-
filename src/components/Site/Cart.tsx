"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trash2 } from 'lucide-react';
import Link from "next/link";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import * as accountsAPI from '@/lib/api/accounts';
import type { Cart, CartItem, UserAddress } from '@/lib/api/accounts';
import pen from "../../../public/images/pen.png";
import { useToast } from "@/components/ui/toast";

function CartContent() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const handleProceedToCheckout = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            router.push(`/signin?returnUrl=${encodeURIComponent('/cart')}`);
            return;
        }

        router.push('/checkout');
    };

    useEffect(() => {
        console.log('CartContent useEffect - isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
            loadCart();
        } else {
            console.log('User not authenticated, setting cart to null');
            setCart(null);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const loadCart = async () => {
        try {
            setLoading(true);
            const cartData = await accountsAPI.getCart();
            // Ensure items is always an array
            if (cartData && !cartData.items) {
                cartData.items = [];
            }
            if (cartData && cartData.items && !Array.isArray(cartData.items)) {
                cartData.items = [];
            }
            setCart(cartData);
        } catch (error: any) {
            console.error('Error loading cart:', error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (itemId: number, delta: number) => {
        const item = cart?.items.find(i => i.id === itemId);
        if (!item) return;

        const newQuantity = Math.max(1, item.quantity + delta);
        setUpdating(itemId);
        try {
            const updatedCart = await accountsAPI.updateCartItem(itemId, { quantity: newQuantity });
            setCart(updatedCart);
            addToast({
                type: 'success',
                title: 'Cart Updated',
                description: 'Cart updated successfully!',
            });
        } catch (error: any) {
            console.error('Error updating cart item:', error);
            addToast({
                type: 'error',
                title: 'Update Failed',
                description: error.message || 'Failed to update item',
            });
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        if (!window.confirm('Are you sure you want to remove this item?')) return;

        setUpdating(itemId);
        try {
            const updatedCart = await accountsAPI.removeCartItem(itemId);
            setCart(updatedCart);
            addToast({
                type: 'success',
                title: 'Item Removed',
                description: 'Item has been removed from your cart',
            });
        } catch (error: any) {
            console.error('Error removing cart item:', error);
            addToast({
                type: 'error',
                title: 'Remove Failed',
                description: error.message || 'Failed to remove item',
            });
        } finally {
            setUpdating(null);
        }
    };

    const getProductImage = (item: CartItem): string => {
        return item.primary_image || pen.src;
    };

    if (loading) {
        return (
            <div className="py-[50px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="text-center">Loading cart...</div>
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
                                <Link href="/" className="text-[16px] leading-[16px] font-semibold text-foreground/80 hover:text-accent">Home</Link> <span>-</span>
                            </li>
                            <li className="flex items-center gap-1 text-foreground font-black">Cart</li>
                        </ul>
                    </div>
                </div>
                <div className="sm:pt-[50px] pt-[30px] xl:pb-[115px] lg:pb-[80px] pb-[50px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center py-[50px]">
                            <p className="text-[18px] text-muted-foreground mb-4">Your cart is empty</p>
                            <Link href="/products">
                                <Button variant="secondary" className="text-white">Continue Shopping</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const subtotal = typeof cart.total_price === 'string' 
        ? parseFloat(cart.total_price) 
        : (cart.total_price || 0);
    
    // Calculate subtotal from items if total_price is not available
    const calculatedSubtotal = cart.items && cart.items.length > 0
        ? cart.items.reduce((sum, item) => {
            const itemTotal = typeof item.total_price === 'number' 
                ? item.total_price 
                : (typeof item.total_price === 'string' 
                    ? parseFloat(item.total_price) 
                    : 0);
            return sum + itemTotal;
          }, 0)
        : 0;
    
    const originalSubtotal = subtotal > 0 ? subtotal : calculatedSubtotal;
    
    // Calculate 20% discount
    const DISCOUNT_PERCENTAGE = 20;
    const discountAmount = originalSubtotal * (DISCOUNT_PERCENTAGE / 100);
    const finalSubtotal = originalSubtotal - discountAmount;
    
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
    const grandTotal = finalSubtotal + shippingFee;
    
    // Calculate total quantity for display
    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <div className="sm:pt-[40px] pt-[20px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <ul className="flex gap-[5px] items-center">
                        <li className="flex items-center gap-1">
                            <Link href="/" className="text-[16px] leading-[16px] font-semibold text-foreground/80 hover:text-accent">Home</Link> <span>-</span>
                        </li>
                        <li className="flex items-center gap-1 text-foreground font-black">Cart</li>
                    </ul>
                </div>
            </div>
            <div className="sm:pt-[50px] pt-[30px] xl:pb-[115px] lg:pb-[80px] pb-[50px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="grid grid-cols-1 lg:grid-cols-[68%_30%] gap-[23px] w-full">
                        {/* Product List - Table */}
                        <Card className="shadow-none border-[#25252526] rounded-[20px] bg-white overflow-hidden !p-0">
                            <CardHeader className="bg-accent rounded-t-[20px] sm:py-[18px] py-[14px] px-[30px] font-semibold text-lg h-auto gap-0 !px-[30px] !py-[18px]">
                                <h2 className="text-white font-bold xl:text-[20px] text-[18px] uppercase">Shopping Cart</h2>
                            </CardHeader>
                            <CardContent className="!p-0 overflow-x-auto">
                                {cart.items && cart.items.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-muted/30 border-b border-border">
                                                    <th className="text-left py-[16px] px-[12px] font-bold text-[14px] uppercase text-foreground">Product</th>
                                                    <th className="text-center py-[16px] px-[8px] font-bold text-[13px] uppercase text-foreground hidden md:table-cell">Variant</th>
                                                    <th className="text-center py-[16px] px-[8px] font-bold text-[13px] uppercase text-foreground hidden xl:table-cell">SKU</th>
                                                    <th className="text-center py-[16px] px-[10px] font-bold text-[14px] uppercase text-foreground">Price</th>
                                                    <th className="text-center py-[16px] px-[10px] font-bold text-[14px] uppercase text-foreground">Quantity</th>
                                                    <th className="text-center py-[16px] px-[12px] font-bold text-[14px] uppercase text-foreground">Total</th>
                                                    <th className="text-center py-[16px] px-[10px] font-bold text-[14px] uppercase text-foreground w-[50px]">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.items.map((item, index) => {
                                                    const pricePerUnit = typeof item.price_per_unit === 'string' 
                                                        ? parseFloat(item.price_per_unit) 
                                                        : (item.price_per_unit || 0);
                                                    const totalPrice = typeof item.total_price === 'number' 
                                                        ? item.total_price 
                                                        : (typeof item.total_price === 'string' 
                                                            ? parseFloat(item.total_price) 
                                                            : (pricePerUnit * item.quantity));
                                                    
                                                    return (
                                                        <tr 
                                                            key={item.id}
                                                            className="border-b border-border hover:bg-muted/20 transition-colors"
                                                        >
                                                            {/* Product */}
                                                            <td className="py-[20px] px-[12px]">
                                                                <div className="flex items-center gap-[12px]">
                                                                    <Link href={`/single-products/${item.product}`} className="flex-shrink-0">
                                                                        <figure className="relative w-[70px] h-[70px] bg-gradient rounded-[10px] p-[6px] flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                                                                            <img
                                                                                src={getProductImage(item)}
                                                                                alt={item.product_name}
                                                                                className="w-full h-full object-contain"
                                                                                onError={(e) => {
                                                                                    (e.target as HTMLImageElement).src = pen.src;
                                                                                }}
                                                                            />
                                                                        </figure>
                                                                    </Link>
                                                                    <div className="flex-1 min-w-0">
                                                                        <Link href={`/single-products/${item.product}`}>
                                                                            <h3 className="text-[16px] font-semibold text-foreground line-clamp-2 mb-1 hover:text-accent transition-colors cursor-pointer">
                                                                                {item.product_name}
                                                                            </h3>
                                                                        </Link>
                                                                        {/* Customizations */}
                                                                        {item.customizations && item.customizations.length > 0 && (
                                                                            <div className="mt-2 space-y-1">
                                                                                {item.customizations.map((custom) => (
                                                                                    <div key={custom.id} className="text-[12px] text-accent font-semibold bg-accent/10 px-2 py-1 rounded inline-block mr-2">
                                                                                        {custom.customization_type_display}
                                                                                        {custom.color_count && ` (${custom.color_count} color${custom.color_count > 1 ? 's' : ''})`}
                                                                                        {custom.stitch_count && ` (${custom.stitch_count} stitches)`}
                                                                                        {custom.imprint_size_id && ` (Size ID: ${custom.imprint_size_id})`}
                                                                                        <span className="ml-2 text-foreground">+${parseFloat(custom.total_price).toFixed(2)}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {/* Mobile: Show variant and SKU */}
                                                                        <div className="md:hidden space-y-1 mt-2">
                                                                            {item.part_name && (
                                                                                <div className="text-[12px] text-muted-foreground">
                                                                                    <span className="font-semibold">Variant:</span> {item.part_name}
                                                                                </div>
                                                                            )}
                                                                            <div className="text-[12px] text-muted-foreground">
                                                                                <span className="font-semibold">SKU:</span> {item.product_id || '-'}
                                                                                {item.part_id && ` - ${item.part_id}`}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Variant - Desktop */}
                                                            <td className="py-[20px] px-[8px] text-center text-[13px] text-muted-foreground hidden md:table-cell">
                                                                {item.part_name || '-'}
                                                            </td>

                                                            {/* SKU - Desktop */}
                                                            <td className="py-[20px] px-[8px] text-center text-[11px] text-muted-foreground hidden xl:table-cell">
                                                                <div className="flex flex-col items-center">
                                                                    <span>{item.product_id || '-'}</span>
                                                                    {item.part_id && (
                                                                        <span className="text-[11px] mt-1">{item.part_id}</span>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Price */}
                                                            <td className="py-[20px] px-[10px] text-center">
                                                                <div className="text-[15px] md:text-[16px] font-semibold text-foreground">
                                                                    ${pricePerUnit.toFixed(2)}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Quantity */}
                                                            <td className="py-[20px] px-[10px] text-center">
                                                                <div className="flex items-center justify-center">
                                                                    <div className="flex items-center border border-border rounded-full px-2 py-1 bg-white">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-lg text-muted-foreground h-auto w-8 p-0 hover:bg-transparent cursor-pointer hover:text-foreground disabled:opacity-50"
                                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                                            disabled={updating === item.id}
                                                                        >
                                                                            −
                                                                        </Button>
                                                                        <span className="mx-3 font-black text-[16px] min-w-[40px] text-center text-foreground">
                                                                            {item.quantity.toLocaleString()}
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-lg text-foreground h-auto w-8 p-0 hover:bg-transparent cursor-pointer hover:text-foreground disabled:opacity-50"
                                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                                            disabled={updating === item.id}
                                                                        >
                                                                            +
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Total */}
                                                            <td className="py-[20px] px-[12px] text-center">
                                                                <div className="text-[15px] md:text-[16px] font-semibold text-foreground">
                                                                    ${totalPrice.toFixed(2)}
                                                                </div>
                                                            </td>

                                                            {/* Remove Action */}
                                                            <td className="py-[20px] px-[10px] text-center">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveItem(item.id)}
                                                                    disabled={updating === item.id}
                                                                    className="h-auto w-auto p-2 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                                                    title="Remove item"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground text-[16px]">No items in cart</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div>
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] !p-0">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[30px] font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px] text-white text-center gap-0 !px-[30px]">
                                    Payment Summary
                                </CardHeader>
                                <CardContent className="space-y-[20px] px-[24px] py-[20px] !px-[24px] !py-[20px]">
                                    {/* Discount Banner */}
                                    <div className="bg-accent/10 border-2 border-accent rounded-[12px] p-4 text-center">
                                        <div className="text-[20px] mb-2">🎉 {DISCOUNT_PERCENTAGE}% OFF</div>
                                        <div className="font-bold text-[16px] text-foreground">Special Discount Applied!</div>
                                    </div>

                                    {/* Original Price */}
                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-bold text-[16px] text-foreground">Original Price ({totalQuantity} units):</span>
                                        <span className="font-semibold sm:text-[16px] text-[14px] text-foreground line-through text-muted-foreground">${originalSubtotal.toFixed(2)}</span>
                                    </div>

                                    {/* Discount */}
                                    <div className="flex justify-between items-center py-2 border-t border-border">
                                        <span className="font-bold text-[16px] text-foreground">Discount ({DISCOUNT_PERCENTAGE}%):</span>
                                        <span className="font-semibold sm:text-[16px] text-[14px] text-accent">-${discountAmount.toFixed(2)}</span>
                                    </div>

                                    {/* Final Price */}
                                    <div className="flex justify-between items-center py-2 border-t-2 border-border pt-3">
                                        <span className="text-[18px] font-bold text-foreground">Final Price ({totalQuantity} units):</span>
                                        <span className="sm:text-[20px] text-[18px] font-bold text-accent">${finalSubtotal.toFixed(2)}</span>
                                    </div>

                                    {/* Less than Minimum Fee */}
                                    {hasFreeShipping ? (
                                        <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3 border border-green-200">
                                            <span className="font-bold text-[16px] text-green-800">Less than Minimum Fee:</span>
                                            <span className="font-semibold sm:text-[16px] text-[14px] text-green-700">$0.00</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center py-2 bg-yellow-50 rounded-lg px-3 border border-yellow-200">
                                            <span className="font-bold text-[16px] text-yellow-800">Less than Minimum Fee:</span>
                                            <span className="font-semibold sm:text-[16px] text-[14px] text-yellow-700">+${shippingFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    {!hasFreeShipping && (
                                        <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                                            <p className="text-[13px] text-blue-800 text-center">
                                                💡 <strong>Less than Minimum Fee:</strong> Each product with a total of $500 or more has no less than minimum fee.
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-bold text-[16px] text-foreground">Tax:</span>
                                        <span className="font-semibold sm:text-[16px] text-[14px] text-foreground">$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-t-2 border-border pt-3">
                                        <span className="text-[18px] font-bold text-foreground">Grand Total:</span>
                                        <span className="sm:text-[20px] text-[18px] font-bold text-accent">${grandTotal.toFixed(2)}</span>
                                    </div>

                                    <Button 
                                        onClick={handleProceedToCheckout}
                                        variant="secondary" 
                                        className="w-full h-auto font-bold text-white py-[12px] sm:text-[16px] text-[14px] cursor-pointer">
                                        Proceed to Checkout <ArrowRight />
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

export default function Cart() {
    return (
        <ProtectedRoute>
            <CartContent />
        </ProtectedRoute>
    );
}


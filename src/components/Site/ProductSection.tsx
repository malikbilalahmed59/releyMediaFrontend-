'use client'
import Link from "next/link"
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/thumbs'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { type ProductDetail, type Part, type PriceGroup, type PriceTier } from '@/lib/api/catalog';
import { createSlug } from '@/lib/utils/slug';
import { stripHtmlTags } from '@/lib/utils';
import { Truck } from 'lucide-react';
import pen from "../../../public/images/pen.png";
import { useAuth } from '@/contexts/AuthContext';
import * as accountsAPI from '@/lib/api/accounts';
import type { UserAddress } from '@/lib/api/accounts';
import type { CartCustomization } from '@/lib/api/customization';
import { useToast } from '@/components/ui/toast';
import CustomizationSelector from '@/components/Site/CustomizationSelector';

interface ProductSectionProps {
    product?: ProductDetail | null;
}

export default function ProductSection({ product }: ProductSectionProps = {}) {
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [selectedBasePriceTier, setSelectedBasePriceTier] = useState<PriceTier | null>(null);
    const [selectedSetupCharges, setSelectedSetupCharges] = useState<PriceGroup[]>([]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedCustomizations, setSelectedCustomizations] = useState<CartCustomization[]>([]);
    const [customizationTotalPrice, setCustomizationTotalPrice] = useState<number>(0);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    if (!product) {
        return (
            <section className="py-[40px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="text-center">Product not found</div>
                </div>
            </section>
        );
    }

    // Get images from media array
    const images = product.media && product.media.length > 0 
        ? product.media.filter(m => m.media_type === 'Image').map(m => m.url)
        : product.primary_image_url 
            ? [product.primary_image_url]
            : product.primary_image
                ? [product.primary_image]
                : [pen.src];

    // Get colors from parts - group by unique color
    // Only include parts that have actual color information (primary_color with color_name OR colors array)
    // DO NOT use part_name as a fallback - only show colors if they actually exist
    const uniqueColors = useMemo(() => {
        const colorMap = new Map<string, Part>();
        product.parts?.forEach(part => {
            // Only consider parts with actual color information
            // Check if primary_color exists and has a color_name
            const hasPrimaryColor = part.primary_color && part.primary_color.color_name;
            // Check if colors array exists and has items
            const hasColorsArray = part.colors && Array.isArray(part.colors) && part.colors.length > 0;
            
            if (hasPrimaryColor || hasColorsArray) {
                let colorKey: string | null = null;
                
                // Prefer primary_color.color_name
                if (hasPrimaryColor && part.primary_color?.color_name) {
                    colorKey = part.primary_color.color_name;
                } 
                // Fallback to first color in colors array
                else if (hasColorsArray && part.colors?.[0]?.color_name) {
                    colorKey = part.colors[0].color_name;
                }
                
                // Only add if we have a valid color key
                if (colorKey && !colorMap.has(colorKey)) {
                    colorMap.set(colorKey, part);
                }
            }
        });
        return Array.from(colorMap.values());
    }, [product.parts]);

    // Initialize selections when product loads
    useMemo(() => {
        if (product) {
            // Select first unique color part if available (only if there are actual colors)
            if (product.parts && product.parts.length > 0 && uniqueColors.length > 0) {
                const firstColor = uniqueColors[0];
                if (firstColor) {
                    setSelectedPart(firstColor);
                }
            } else if (product.parts && product.parts.length > 0 && uniqueColors.length === 0) {
                // If no colors but parts exist, don't auto-select any part
                setSelectedPart(null);
            }
            // Initialize quantity to minimum from first price tier
            if (product.price_groups && product.price_groups.length > 0) {
                const basePriceGroup = product.price_groups[0];
                if (basePriceGroup.prices && basePriceGroup.prices.length > 0) {
                    const firstTier = basePriceGroup.prices[0];
                    setSelectedQuantity(firstTier.quantity_min || 1);
                    setSelectedBasePriceTier(firstTier);
                }
            }
        }
    }, [product, uniqueColors]);

    // Get available sizes from parts (for selected color)
    const availableSizes = useMemo(() => {
        if (!selectedPart || !product.parts || product.parts.length === 0) return [];
        
        const colorName = selectedPart.primary_color?.color_name || selectedPart.part_name;
        // Get all parts that match the selected color
        const partsForColor = product.parts.filter(p => {
            const partColorName = p.primary_color?.color_name || p.part_name || '';
            // Match by color name or check if part_name contains the color
            return partColorName === colorName || 
                   (colorName && partColorName.toLowerCase().includes(colorName.toLowerCase())) ||
                   (colorName && colorName.toLowerCase().includes(partColorName.toLowerCase()));
        });
        
        // If no parts match by color, use all parts (maybe sizes are independent of color)
        const partsToCheck = partsForColor.length > 0 ? partsForColor : product.parts;
        
        const sizes = new Set<string>();
        partsToCheck.forEach(part => {
            // Check all size fields - ensure they're strings and not objects
            const apparelSize = part.apparel_size;
            if (apparelSize && typeof apparelSize === 'string' && apparelSize.trim() && typeof apparelSize !== 'object') {
                sizes.add(apparelSize.trim());
            }
            
            const labelSize = part.label_size;
            if (labelSize && typeof labelSize === 'string' && labelSize.trim() && typeof labelSize !== 'object') {
                sizes.add(labelSize.trim());
            }
            
            const customSize = part.custom_size;
            if (customSize && typeof customSize === 'string' && customSize.trim() && typeof customSize !== 'object') {
                sizes.add(customSize.trim());
            }
            
            // Also try to extract size from part_name if it contains size info (e.g., "XXS", "XS", etc.)
            if (part.part_name && typeof part.part_name === 'string') {
                const sizePattern = /\b(XXXL|XXL|XL|XXS|XS|S|M|L)\b/i;
                const match = part.part_name.match(sizePattern);
                if (match && match[1]) {
                    sizes.add(match[1].toUpperCase());
                }
            }
        });
        
        // Filter out any non-string values that might have slipped through
        const validSizes = Array.from(sizes).filter(s => typeof s === 'string' && s.length > 0);
        
        if (validSizes.length === 0) {
            console.log('No sizes found. Parts:', product.parts?.map(p => ({
                part_name: p.part_name,
                apparel_size: p.apparel_size,
                apparel_size_type: typeof p.apparel_size,
                label_size: p.label_size,
                label_size_type: typeof p.label_size,
                custom_size: p.custom_size,
                custom_size_type: typeof p.custom_size,
                color: p.primary_color?.color_name
            })));
        }
        
        return validSizes.sort((a, b) => {
            // Ensure both are strings before calling toUpperCase
            if (typeof a !== 'string' || typeof b !== 'string') {
                return String(a).localeCompare(String(b));
            }
            // Sort sizes logically (XS, S, M, L, XL, XXL, etc.)
            const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            const aUpper = a.toUpperCase();
            const bUpper = b.toUpperCase();
            const aIndex = sizeOrder.indexOf(aUpper);
            const bIndex = sizeOrder.indexOf(bUpper);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [selectedPart, product.parts]);

    // Auto-select first available size when sizes become available
    useMemo(() => {
        if (availableSizes.length > 0 && !selectedSize) {
            // Ensure we're selecting a string, not an object
            const firstSize = availableSizes[0];
            if (firstSize && typeof firstSize === 'string') {
                setSelectedSize(firstSize);
            } else if (firstSize) {
                setSelectedSize(String(firstSize));
            }
        }
    }, [availableSizes, selectedSize]);

    // Filter parts by selected color and size
    const filteredParts = useMemo(() => {
        if (!selectedPart) return product.parts || [];
        const colorName = selectedPart.primary_color?.color_name || selectedPart.part_name;
        let filtered = product.parts?.filter(p => 
            (p.primary_color?.color_name || p.part_name) === colorName
        ) || [];
        
        if (selectedSize) {
            filtered = filtered.filter(p => 
                p.apparel_size === selectedSize || 
                p.label_size === selectedSize || 
                p.custom_size === selectedSize
            );
        }
        return filtered;
    }, [selectedPart, selectedSize, product.parts]);

    // Update selected part when size changes
    useMemo(() => {
        if (selectedSize && typeof selectedSize === 'string' && filteredParts.length > 0) {
            const partForSize = filteredParts.find(p => {
                const apparelSize = p.apparel_size && typeof p.apparel_size === 'string' ? p.apparel_size : '';
                const labelSize = p.label_size && typeof p.label_size === 'string' ? p.label_size : '';
                const customSize = p.custom_size && typeof p.custom_size === 'string' ? p.custom_size : '';
                return apparelSize === selectedSize || labelSize === selectedSize || customSize === selectedSize;
            });
            if (partForSize) {
                setSelectedPart(partForSize);
            }
        }
    }, [selectedSize, filteredParts]);

    // Get colors from parts (use unique colors)
    const colors = uniqueColors;

    // Map color names to hex codes for common colors
    const colorNameToHex: Record<string, string> = {
        'red': '#FF0000',
        'blue': '#0000FF',
        'green': '#008000',
        'yellow': '#FFFF00',
        'orange': '#FFA500',
        'purple': '#800080',
        'pink': '#FFC0CB',
        'black': '#000000',
        'white': '#FFFFFF',
        'gray': '#808080',
        'grey': '#808080',
        'brown': '#A52A2A',
        'navy': '#000080',
        'teal': '#008080',
        'cyan': '#00FFFF',
        'lime': '#00FF00',
        'maroon': '#800000',
        'olive': '#808000',
        'silver': '#C0C0C0',
        'gold': '#FFD700',
        'beige': '#F5F5DC',
        'tan': '#D2B48C',
        'burgundy': '#800020',
        'coral': '#FF7F50',
        'turquoise': '#40E0D0',
        'lavender': '#E6E6FA',
        'ivory': '#FFFFF0',
        'cream': '#FFFDD0',
        'charcoal': '#36454F',
        'khaki': '#F0E68C',
    };

    // Get hex color for a part
    const getColorHex = (part: Part): string => {
        // First try to use the provided hex_code
        if (part.primary_color?.hex_code) {
            return part.primary_color.hex_code;
        }
        
        // If no hex_code, try to match color name
        const colorName = (part.primary_color?.color_name || part.part_name || '').toLowerCase().trim();
        
        // Direct match
        if (colorNameToHex[colorName]) {
            return colorNameToHex[colorName];
        }
        
        // Try partial matches (e.g., "dark blue" -> "blue")
        for (const [name, hex] of Object.entries(colorNameToHex)) {
            if (colorName.includes(name) || name.includes(colorName)) {
                return hex;
            }
        }
        
        // Fallback to a default color
        return '#F5F5F5';
    };

    // Separate base cost (first group) from setup charges (other groups)
    const basePriceGroup = product.price_groups && product.price_groups.length > 0 ? product.price_groups[0] : null;
    const setupChargeGroups = product.price_groups && product.price_groups.length > 1 
        ? product.price_groups.slice(1) 
        : [];

    // Get base pricing options
    const basePricingOptions = basePriceGroup?.prices || [];

    // Format price tier display (with discount)
    const formatPriceTier = (tier: PriceTier): string => {
        const minQty = tier.quantity_min;
        const maxQty = tier.quantity_max;
        const qtyText = maxQty ? `${minQty}-${maxQty}` : `${minQty}+`;
        const originalPrice = tier.price ? parseFloat(tier.price) : 0;
        const discountedPrice = (originalPrice || 0) * (1 - DISCOUNT_PERCENTAGE / 100);
        return `${qtyText} EA : $${(originalPrice || 0).toFixed(2)} → ${(discountedPrice || 0).toFixed(2)}`;
    };

    // Toggle setup charge selection
    const toggleSetupCharge = (setupGroup: PriceGroup) => {
        setSelectedSetupCharges(prev => {
            const isSelected = prev.some(g => g.id === setupGroup.id);
            if (isSelected) {
                return prev.filter(g => g.id !== setupGroup.id);
            } else {
                return [...prev, setupGroup];
            }
        });
    };

    // Discount percentage
    const DISCOUNT_PERCENTAGE = 20;

    // Find matching price tier based on quantity
    const findMatchingPriceTier = (quantity: number): PriceTier | null => {
        if (!basePriceGroup || !basePriceGroup.prices || basePriceGroup.prices.length === 0) {
            return null;
        }

        // Sort tiers by quantity_min in ascending order to find the highest applicable tier
        const sortedTiers = [...basePriceGroup.prices].sort((a, b) => a.quantity_min - b.quantity_min);

        let matchingTier: PriceTier | null = null;

        // Find the highest tier where quantity >= minQty
        for (const tier of sortedTiers) {
            const minQty = tier.quantity_min;
            const maxQty = tier.quantity_max;

            // Check if quantity qualifies for this tier
            if (quantity >= minQty) {
                // If tier has a max, check if quantity is within range
                if (maxQty !== null && maxQty !== undefined) {
                    if (quantity <= maxQty) {
                        matchingTier = tier;
                    }
                } else {
                    // No max means it's an open-ended tier (e.g., 20000+)
                    matchingTier = tier;
                }
            }
        }

        // If no match found, use the lowest tier as fallback
        return matchingTier || sortedTiers[0] || null;
    };

    // Update selected price tier when quantity changes
    useMemo(() => {
        if (basePriceGroup && basePriceGroup.prices && basePriceGroup.prices.length > 0) {
            const matchingTier = findMatchingPriceTier(selectedQuantity);
            if (matchingTier && matchingTier !== selectedBasePriceTier) {
                setSelectedBasePriceTier(matchingTier);
            }
        }
    }, [selectedQuantity, basePriceGroup, selectedBasePriceTier]);

    // Calculate total price (before discount) - multiplied by quantity
    const calculateTotalPrice = (): number => {
        let total = 0;
        if (selectedBasePriceTier && selectedBasePriceTier.price) {
            const price = parseFloat(selectedBasePriceTier.price);
            if (!isNaN(price)) {
                total += price * selectedQuantity;
            }
        }
        selectedSetupCharges.forEach(group => {
            if (group.prices && group.prices.length > 0 && group.prices[0].price) {
                // Setup charges are typically one-time, not multiplied by quantity
                const price = parseFloat(group.prices[0].price);
                if (!isNaN(price)) {
                    total += price;
                }
            }
        });
        return total || 0;
    };

    // Calculate discounted price
    const calculateDiscountedPrice = (): number => {
        const originalTotal = calculateTotalPrice();
        if (!originalTotal || isNaN(originalTotal)) return 0;
        const discountAmount = originalTotal * (DISCOUNT_PERCENTAGE / 100);
        return originalTotal - discountAmount;
    };

    // Calculate discount amount
    const calculateDiscountAmount = (): number => {
        const originalTotal = calculateTotalPrice();
        if (!originalTotal || isNaN(originalTotal)) return 0;
        return originalTotal * (DISCOUNT_PERCENTAGE / 100);
    };

    // Calculate shipping fee (if discounted price < $500, add $100)
    const calculateShippingFee = (): number => {
        const discountedTotal = calculateDiscountedPrice();
        if (!discountedTotal || isNaN(discountedTotal)) return 0;
        // Check if discounted price is below $500
        if (discountedTotal < 500) {
            return 100;
        }
        return 0;
    };

    // Check if order qualifies for free shipping
    const hasFreeShipping = (): boolean => {
        const discountedTotal = calculateDiscountedPrice();
        if (!discountedTotal || isNaN(discountedTotal)) return false;
        return discountedTotal >= 500;
    };

    // Get category slug for breadcrumb
    const categorySlug = product.ai_category ? createSlug(product.ai_category.name) : null;
    const categoryName = product.ai_category?.name || 'Products';
    
    // Check if product is in Technology & Flash Drives category (hide pricing for this category)
    const isTechnologyFlashDrives = categoryName === 'Technology & Flash Drives' || 
                                   categoryName === 'Technology Items & Flash Drives' ||
                                   product.categories?.some(cat => {
                                       const catName = typeof cat === 'string' ? cat : (cat?.name || '');
                                       return catName === 'Technology & Flash Drives' || catName === 'Technology Items & Flash Drives';
                                   }) || false;
    
    // Check if product is in Apparel category
    const isApparel = categoryName.toLowerCase() === 'apparel' || 
                     product.categories?.some(cat => {
                         const catName = typeof cat === 'string' ? cat : (cat?.name || '');
                         return catName.toLowerCase() === 'apparel';
                     }) || false;

    // Get minimum price from base cost
    const minPrice = basePriceGroup?.min_price ?? product.min_price ?? 0;
    const maxPrice = basePriceGroup?.max_price ?? product.max_price ?? minPrice ?? 0;
    
    // Check if product has no pricing (requires custom quote)
    // Also hide pricing for Technology & Flash Drives category
    const hasNoPricing = isTechnologyFlashDrives || 
                         ((minPrice === 0 || minPrice === null || minPrice === undefined) && 
                         (maxPrice === 0 || maxPrice === null || maxPrice === undefined) &&
                         (!basePriceGroup || !basePriceGroup.prices || basePriceGroup.prices.length === 0));

    // Handle Add to Cart
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push(`/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        if (!product || !selectedBasePriceTier) {
            addToast({
                type: 'warning',
                title: 'Selection Required',
                description: 'Please select quantity and options',
            });
            return;
        }

        setIsAddingToCart(true);
        try {
            const cartData: accountsAPI.AddToCartRequest = {
                product_id: product.id,
                part_id: selectedPart?.part_id,
                quantity: selectedQuantity,
            };
            
            // Add customizations if any are selected
            if (selectedCustomizations.length > 0) {
                cartData.customizations = selectedCustomizations;
            }
            
            await accountsAPI.addToCart(cartData);
            
            // Dispatch event to update cart in header
            window.dispatchEvent(new Event('cartUpdated'));
            
            // Mark as added to cart
            setAddedToCart(true);
            
            addToast({
                type: 'success',
                title: 'Added to Cart',
                description: 'Item has been added to your cart successfully!',
            });
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            addToast({
                type: 'error',
                title: 'Add to Cart Failed',
                description: error.message || 'Failed to add item to cart',
            });
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Handle View Cart button click
    const handleViewCart = () => {
        router.push('/cart');
    };

    // Reset addedToCart when quantity or selections change
    useEffect(() => {
        setAddedToCart(false);
    }, [selectedQuantity, selectedPart, selectedSize, selectedCustomizations]);

    // Check if user has both billing and shipping addresses
    const checkAddresses = async (): Promise<boolean> => {
        try {
            const addresses = await accountsAPI.getAddresses();
            // Handle different response formats
            let addressList: UserAddress[] = [];
            if (Array.isArray(addresses)) {
                addressList = addresses;
            } else if (addresses && typeof addresses === 'object') {
                if (Array.isArray((addresses as any).results)) {
                    addressList = (addresses as any).results;
                } else if (Array.isArray((addresses as any).data)) {
                    addressList = (addresses as any).data;
                } else if (Array.isArray((addresses as any).addresses)) {
                    addressList = (addresses as any).addresses;
                }
            }
            
            const hasBilling = addressList.some(addr => addr.address_type === 'billing');
            const hasShipping = addressList.some(addr => addr.address_type === 'shipping');
            
            return hasBilling && hasShipping;
        } catch (error) {
            console.error('Error checking addresses:', error);
            return false;
        }
    };

    // Handle Buy Now (adds to cart and redirects to checkout)
    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            router.push(`/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        if (!product || !selectedBasePriceTier) {
            addToast({
                type: 'warning',
                title: 'Selection Required',
                description: 'Please select quantity and options',
            });
            return;
        }

        // Check if user has both billing and shipping addresses
        const hasAddresses = await checkAddresses();
        
        if (!hasAddresses) {
            addToast({
                type: 'warning',
                title: 'Addresses Required',
                description: 'Please add both billing and shipping addresses in your profile before proceeding to checkout.',
            });
            router.push('/profile?tab=addresses');
            return;
        }

        setIsAddingToCart(true);
        try {
            const cartData: accountsAPI.AddToCartRequest = {
                product_id: product.id,
                part_id: selectedPart?.part_id,
                quantity: selectedQuantity,
            };
            
            // Add customizations if any are selected
            if (selectedCustomizations.length > 0) {
                cartData.customizations = selectedCustomizations;
            }
            
            await accountsAPI.addToCart(cartData);
            
            // Dispatch event to update cart in header
            window.dispatchEvent(new Event('cartUpdated'));
            
            // Redirect to checkout
            router.push('/checkout');
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            addToast({
                type: 'error',
                title: 'Add to Cart Failed',
                description: error.message || 'Failed to add item to cart',
            });
            setIsAddingToCart(false);
        }
    };

    return (
        <section className="py-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                {/* Breadcrumbs */}
                <ul className="flex gap-[5px] items-center mb-[11px]">
                    <li className="flex items-center gap-1">
                        <Link href="/" className="text-[16px] leading-[16px] font-semibold text-[#111111CC] hover:text-accent">Home</Link> <span>-</span>
                    </li>
                    {categorySlug && (
                        <>
                            <li className="flex items-center gap-1">
                                <Link href={`/products/category/${categorySlug}`} className="text-[16px] leading-[16px] font-semibold text-[#111111CC] hover:text-accent">
                                    {categoryName}
                                </Link> <span>-</span>
                    </li>
                        </>
                    )}
                    <li className="flex items-center gap-1 text-[#111111] font-black">{product.product_name}</li>
                </ul>

                <div className="grid grid-cols-1 xl:grid-cols-[55.83%_40.6%] md:grid-cols-[51.83%_43.6%] lg:gap-[43px] gap-[20px]">
                    {/* Image Slider with Thumbnails */}
                    <div>
                        <Swiper
                            modules={[Thumbs]}
                            thumbs={{swiper: thumbsSwiper}}
                            spaceBetween={10}
                            slidesPerView={1}
                            className="2xl:h-[598px] sm:h-[400px] h-[300px] overflow-hidden border-[#E1E1E1] border rounded-[20px]"
                        >
                            {images.map((src, i) => (
                                <SwiperSlide key={i} className="!flex items-center justify-center bg-white">
                                    {src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') ? (
                                        <img 
                                            src={src} 
                                            alt={`${product.product_name} ${i + 1}`} 
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = pen.src;
                                            }}
                                        />
                                    ) : (
                                        <img src={src} alt={`${product.product_name} ${i + 1}`} className="w-full h-full object-contain" />
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {images.length > 1 && (
                        <Swiper
                            modules={[Thumbs]}
                            onSwiper={setThumbsSwiper}
                            spaceBetween={8}
                            slidesPerView={5}
                            watchSlidesProgress
                            className="mt-3"
                        >
                            {images.map((src, i) => (
                                <SwiperSlide key={i}
                                                 className="border border-[#E1E1E1] sm:rounded-[20px] rounded-[10px] lg:!h-[101px] !h-[80px] !flex items-center justify-center bg-white">
                                        {src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') ? (
                                            <img
                                                src={src}
                                                alt={`thumb ${i}`}
                                                className="cursor-pointer w-[80px] h-full object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = pen.src;
                                                }}
                                            />
                                        ) : (
                                    <img
                                        src={src}
                                        alt={`thumb ${i}`}
                                                className="cursor-pointer w-[80px] h-full object-contain"
                                    />
                                        )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        )}

                        {/* Product Description - First */}
                        <div className="mt-6">
                            <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Product Description</h3>
                            <p className="sm:text-[16px] text-[14px] leading-[24px] whitespace-pre-line">
                                {stripHtmlTags(product.description) || 'No description available.'}
                            </p>
                        </div>

                        {/* Marketing Points */}
                        {product.marketing_points && product.marketing_points.length > 0 && (
                        <div className="mt-6">
                                <h3 className="text-[20px] leading-[20px] font-semibold sm:mb-[30px] mb-[10px]">Product Details</h3>
                                <ul className="list-disc pl-5 text-[16px] space-y-2">
                                    {product.marketing_points.map((point, index) => (
                                        <li key={index}>
                                            <strong>{point.point_type}:</strong> {point.point_copy}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        )}

                        {/* Categories */}
                        {product.categories && product.categories.length > 0 && (
                        <div className="mt-6">
                                    <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.categories.map((category: any, index: number) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 rounded-full text-[14px] text-foreground"
                                            >
                                                {category.name || category}
                                            </span>
                                        ))}
                                    </div>
                            </div>
                        )}

                        {/* Distributor Info - Below Marketing Points */}
                        {product.distributor_only_info && (
                        <div className="mt-6">
                                    <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Additional Information</h3>
                                    <p className="sm:text-[16px] text-[14px] leading-[24px]">
                                        {product.distributor_only_info}
                                </p>
                            </div>
                        )}

                        {/* Keywords */}
                        {product.keywords && product.keywords.length > 0 && (
                        <div className="mt-6">
                                    <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 rounded-full text-[14px] text-foreground"
                                            >
                                                {keyword.keyword}
                                            </span>
                                        ))}
                                    </div>
                            </div>
                        )}

                        {/* Caution */}
                        {product.is_caution && product.caution_comment && (
                            <div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 mt-6">
                                <h3 className="font-bold text-[18px] leading-[20px] mb-[5px] text-yellow-800">Caution</h3>
                                <p className="sm:text-[16px] text-[14px] leading-[24px] text-yellow-700">
                                    {product.caution_comment}
                                </p>
                            </div>
                        )}

                        {/* In Stock Info - Bottom Left */}
                        {!hasNoPricing && (
                            <div className="mt-6">
                                <p className="text-[16px]">
                                    <span className="font-semibold text-accent">✓ In Stock</span> • Customized with Your Logo • Fast Turnaround • Price Beat Guarantee
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div>
                        <div className="flex items-center justify-between mb-[10px]">
                            <span className="inline-block text-[16px] leading-[16px] text-[#252525E5]">
                                {product.ai_category?.name || product.product_brand || 'Product'}
                            </span>
                            {product.usa_made && (
                                <div className="relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 via-white to-blue-600 rounded-xl border-4 border-gray-900 shadow-2xl transform hover:scale-105 transition-transform">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-blue-500/20 rounded-xl"></div>
                                    <span className="relative text-[16px] font-black text-gray-900 flex items-center gap-2 tracking-wide">
                                        <span className="text-red-700 text-[20px] animate-pulse">★</span>
                                        <span className="font-black text-[18px] uppercase">MADE IN USA</span>
                                        <span className="text-blue-700 text-[20px] animate-pulse">★</span>
                                    </span>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                                </div>
                            )}
                        </div>
                        <h1 className="2xl:text-[40px] xl:text-[34px] sm:text-[28px] text-[26px] leading-[32px] xl:leading-[40px] 2xl:leading-[50px] font-semibold mb-[10px]">
                            {product.product_name}
                        </h1>

                        {/* Custom Quote Request Message - Continuously Moving */}
                        {hasNoPricing && (
                            <div className="mb-4 overflow-hidden bg-red-50 border-2 border-red-500 rounded-lg">
                                <div className="relative py-3">
                                    <div className="flex animate-scroll whitespace-nowrap" style={{ width: '200%' }}>
                                        <span className="text-red-600 font-bold text-[16px] md:text-[18px] px-4 inline-block">
                                            📋 Product ID: {product.id || product.product_id} — To order this product, please send us a custom quote request. Our team will provide you with pricing and availability information.
                                        </span>
                                        <span className="text-red-600 font-bold text-[16px] md:text-[18px] px-4 inline-block">
                                            📋 Product ID: {product.id || product.product_id} — To order this product, please send us a custom quote request. Our team will provide you with pricing and availability information.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {!hasNoPricing && (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="xl:text-[30px] sm:text-[28px] text-[24px] font-bold line-through text-gray-400">
                                            ${(minPrice || 0).toFixed(2)}
                                        </span>
                                        <span className="xl:text-[30px] sm:text-[28px] text-[24px] font-bold text-accent">
                                            ${((minPrice || 0) * 0.8).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-[14px] animate-pulse">
                                        {DISCOUNT_PERCENTAGE}% OFF
                                    </div>
                                </div>
                                <p className="text-[14px] text-accent font-semibold mb-0">
                                    You Save ${((minPrice || 0) * 0.2).toFixed(2)}!
                                    {maxPrice !== minPrice && ` - Save up to $${((maxPrice || 0) * 0.2).toFixed(2)}!`}
                                </p>
                            </>
                        )}

                        {/* Color Selection */}
                        {colors.length > 0 && (
                        <div className="xl:mb-6 mb-4">
                            <label className="block font-semibold mb-[8px] text-[16px] mb-1">Color <span className="text-red-500">*</span></label>
                                <div className="flex gap-[10px] flex-wrap">
                                    {colors.map((part) => {
                                        const colorName = part.primary_color?.color_name || part.part_name || 'Color';
                                        const isSelected = selectedPart && (
                                            (selectedPart.primary_color?.color_name || selectedPart.part_name) === colorName
                                        );
                                        const colorHex = getColorHex(part);
                                        // For white/light colors, add a border so they're visible
                                        const isLightColor = colorHex === '#FFFFFF' || colorHex === '#FFFFF0' || colorHex === '#FFFDD0' || colorHex === '#F5F5DC';
                                        
                                        return (
                                    <button
                                                key={part.id}
                                                onClick={() => {
                                                    setSelectedPart(part);
                                                    setSelectedSize(null); // Reset size when color changes
                                                }}
                                                className={`w-[50px] h-[50px] rounded-[8px] border-2 cursor-pointer transition-all hover:scale-110 ${
                                                    isSelected 
                                                        ? 'border-accent ring-4 ring-accent ring-offset-2 shadow-lg scale-110' 
                                                        : isLightColor
                                                            ? 'border-gray-400 hover:border-gray-600'
                                                            : 'border-gray-300 hover:border-gray-500'
                                                }`}
                                                style={{ 
                                                    backgroundColor: colorHex,
                                                    boxShadow: isSelected ? `0 0 0 2px ${colorHex}, 0 0 10px rgba(0,0,0,0.2)` : undefined
                                                }}
                                                title={colorName}
                                            >
                                                {isSelected && (
                                                    <span className="text-white text-[20px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">✓</span>
                                                )}
                                            </button>
                                        );
                                    })}
                            </div>
                                {selectedPart && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-[14px] text-[#666]">
                                            Selected: <span className="font-semibold text-foreground">
                                                {selectedPart.primary_color?.color_name || selectedPart.part_name}
                                            </span>
                                            {selectedPart.min_price != null && selectedPart.max_price != null && (
                                                <span className="ml-2">
                                                    (${(selectedPart.min_price || 0).toFixed(2)} - ${(selectedPart.max_price || 0).toFixed(2)})
                                                </span>
                                            )}
                                        </p>
                                        {selectedPart.description && (
                                            <p className="text-[13px] text-[#888] italic">{stripHtmlTags(selectedPart.description)}</p>
                                        )}
                                        {selectedPart.primary_material && (
                                            <p className="text-[13px] text-[#888]">
                                                Material: <span className="font-semibold">{selectedPart.primary_material}</span>
                                            </p>
                                        )}
                                        {selectedPart.country_of_origin && 
                                         (selectedPart.country_of_origin.toLowerCase().includes('usa') || 
                                          selectedPart.country_of_origin.toLowerCase().includes('united states') ||
                                          selectedPart.country_of_origin.toLowerCase() === 'us') && (
                                            <p className="text-[13px] text-[#888]">
                                                Origin: <span className="font-semibold">{selectedPart.country_of_origin}</span>
                                            </p>
                                        )}
                                        {selectedPart.lead_time !== null && selectedPart.lead_time !== undefined && (
                                            <p className="text-[13px] text-[#888]">
                                                Lead Time: <span className="font-semibold">{selectedPart.lead_time} day{selectedPart.lead_time !== 1 ? 's' : ''}</span>
                                            </p>
                                        )}
                                        {selectedPart.is_rush_service && (
                                            <p className="text-[13px] text-accent font-semibold">
                                                ✓ Rush Service Available
                                            </p>
                                        )}
                                        {selectedPart.is_caution && selectedPart.caution_comment && (
                                            <p className="text-[13px] text-yellow-700 bg-yellow-50 px-2 py-1 rounded mt-1">
                                                ⚠ {selectedPart.caution_comment}
                                            </p>
                                        )}
                                    </div>
                                )}
                        </div>
                        )}

                        {/* Size Selection */}
                        {availableSizes.length > 0 && (
                        <div className="xl:mb-6 mb-4">
                            <label className="block font-semibold mb-[8px] text-[16px] mb-1">
                                Size {selectedPart ? <span className="text-red-500">*</span> : ''}
                            </label>
                            <div className="flex gap-[10px] flex-wrap">
                                {availableSizes.map((size) => {
                                    const sizeStr = String(size);
                                    const isSelected = selectedSize === sizeStr;
                                    return (
                                        <Button
                                            key={sizeStr}
                                            variant={isSelected ? 'default' : 'outline'}
                                            onClick={() => setSelectedSize(sizeStr)}
                                            className={`min-w-[60px] h-[45px] rounded-lg transition-all duration-200 ${
                                                isSelected 
                                                    ? 'border-2 border-accent bg-accent text-white hover:bg-accent/90' 
                                                    : 'border border-gray-200 bg-white hover:bg-gray-50 hover:border-accent/50'
                                            }`}
                                        >
                                            {sizeStr}
                                        </Button>
                                    );
                                })}
                            </div>
                            {selectedSize && (
                                <p className="text-[14px] text-[#666] mt-2">
                                    Selected Size: <span className="font-semibold text-foreground">{String(selectedSize)}</span>
                                    {selectedPart && (
                                        <>
                                            {selectedPart.apparel_style && typeof selectedPart.apparel_style === 'string' && (
                                                <span className="ml-2 text-[13px] text-[#888]">
                                                    ({selectedPart.apparel_style})
                                                </span>
                                            )}
                                            {selectedPart.quantity_available !== undefined && selectedPart.quantity_available !== null && selectedPart.quantity_available > 0 && (
                                                <span className="ml-2 text-[13px] text-[#888]">
                                                    - {selectedPart.quantity_available} available
                                                </span>
                                            )}
                                        </>
                                    )}
                                </p>
                            )}
                        </div>
                        )}

                        {/* Quantity Selection */}
                        {!hasNoPricing && basePriceGroup && basePricingOptions.length > 0 && (
                        <div className="xl:mb-6 mb-4">
                                <div className="mb-2">
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-[12px] font-bold">
                                        {DISCOUNT_PERCENTAGE}% OFF Applied!
                                    </span>
                                </div>

                                {/* Price Tiers Table */}
                                {basePricingOptions.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-[16px] mb-3">Price Tiers & Discount</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                                                <thead>
                                                    <tr className="bg-accent text-white">
                                                        <th className="border border-gray-300 px-4 py-3 text-left text-[14px] font-semibold">Quantity</th>
                                                        <th className="border border-gray-300 px-4 py-3 text-left text-[14px] font-semibold">Original Price</th>
                                                        <th className="border border-gray-300 px-4 py-3 text-left text-[14px] font-semibold">Discounted Price</th>
                                                        <th className="border border-gray-300 px-4 py-3 text-left text-[14px] font-semibold">Discount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {basePricingOptions
                                                        .sort((a, b) => a.quantity_min - b.quantity_min)
                                                        .map((tier, index) => {
                                                            const minQty = tier.quantity_min;
                                                            const maxQty = tier.quantity_max;
                                                            const qtyText = maxQty 
                                                                ? `${minQty.toLocaleString()}-${maxQty.toLocaleString()}` 
                                                                : `${minQty.toLocaleString()}+`;
                                                            const originalPrice = tier.price ? parseFloat(tier.price) : 0;
                                                            const discountedPrice = (originalPrice || 0) * (1 - DISCOUNT_PERCENTAGE / 100);
                                                            const isActive = selectedBasePriceTier === tier;
                                                            
                                                            return (
                                                                <tr 
                                                                    key={index}
                                                                    className={`${
                                                                        isActive 
                                                                            ? 'bg-accent/10 border-2 border-accent' 
                                                                            : index % 2 === 0 
                                                                                ? 'bg-white' 
                                                                                : 'bg-gray-50'
                                                                    } hover:bg-accent/5 transition-colors cursor-pointer`}
                                                                    onClick={() => {
                                                                        setSelectedBasePriceTier(tier);
                                                                        setSelectedQuantity(minQty);
                                                                    }}
                                                                >
                                                                    <td className="border border-gray-300 px-4 py-3 text-[14px] font-semibold">
                                                                        {qtyText}
                                                                    </td>
                                                                    <td className="border border-gray-300 px-4 py-3 text-[14px]">
                                                                        <span className="line-through text-gray-400">
                                                                            ${(originalPrice || 0).toFixed(2)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="border border-gray-300 px-4 py-3 text-[14px] font-bold text-accent">
                                                                        ${(discountedPrice || 0).toFixed(2)}
                                                                    </td>
                                                                    <td className="border border-gray-300 px-4 py-3 text-[14px]">
                                                                        <span className="bg-red-500 text-white px-2 py-1 rounded text-[12px] font-bold">
                                                                            {DISCOUNT_PERCENTAGE}% OFF
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Quantity Input - Below Table */}
                                {basePricingOptions.length > 0 && (() => {
                                    const minQty = Math.min(...basePricingOptions.map(t => t.quantity_min));
                                    const maxQty = Math.max(...basePricingOptions.map(t => t.quantity_max || t.quantity_min));
                                    // Set inputMax to a very high value to allow users to enter any quantity
                                    const inputMax = 1000000; // Allow up to 1 million units
                                    const inputMin = minQty > 0 ? minQty : 1;
                                    
                                    return (
                                        <div className="mt-6">
                                            <label className="block font-semibold mb-2 text-[14px]">Quantity <span className="text-red-500">*</span></label>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="flex-1">
                                                    <input
                                                        type="number"
                                                        value={selectedQuantity || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Allow empty string for free typing
                                                            if (value === '') {
                                                                setSelectedQuantity(0);
                                                                return;
                                                            }
                                                            // Parse the value - allow any number to be typed (including negative, decimals, etc.)
                                                            const numValue = parseFloat(value);
                                                            if (!isNaN(numValue) && isFinite(numValue)) {
                                                                // Allow any number to be typed, even if outside min/max
                                                                // Use floor to handle decimals
                                                                const intValue = Math.floor(Math.abs(numValue));
                                                                setSelectedQuantity(intValue);
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            // Validate and clamp on blur only (no upper bound)
                                                            const value = parseFloat(e.target.value);
                                                            if (isNaN(value) || !isFinite(value) || value < inputMin) {
                                                                setSelectedQuantity(inputMin);
                                                            } else {
                                                                setSelectedQuantity(Math.floor(value));
                                                            }
                                                        }}
                                                        placeholder={`Min: ${inputMin}`}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-[16px] font-semibold focus:outline-none focus:border-accent transition-colors"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedQuantity(Math.max(inputMin, selectedQuantity - 1));
                                                        }}
                                                        className="w-10 h-10 rounded-lg text-[18px] font-bold"
                                                    >
                                                        -
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedQuantity(selectedQuantity + 1);
                                                        }}
                                                        className="w-10 h-10 rounded-lg text-[18px] font-bold"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Quantity Range Slider - Below Input (only show if maxQty is reasonable) */}
                                            {maxQty <= 10000 && (
                                                <div className="mt-4">
                                                    <input
                                                        type="range"
                                                        min={inputMin}
                                                        max={Math.max(maxQty, inputMin + 100)}
                                                        value={Math.min(selectedQuantity, Math.max(maxQty, inputMin + 100))}
                                                        onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                                                        style={{
                                                            background: `linear-gradient(to right, #987727 0%, #987727 ${((Math.min(selectedQuantity, Math.max(maxQty, inputMin + 100)) - inputMin) / (Math.max(maxQty, inputMin + 100) - inputMin)) * 100}%, #e5e7eb ${((Math.min(selectedQuantity, Math.max(maxQty, inputMin + 100)) - inputMin) / (Math.max(maxQty, inputMin + 100) - inputMin)) * 100}%, #e5e7eb 100%)`
                                                        }}
                                                    />
                                                    <div className="flex justify-between text-[12px] text-gray-500 mt-1">
                                                        <span>{inputMin.toLocaleString()}</span>
                                                        <span>{Math.floor((inputMin + Math.max(maxQty, inputMin + 100)) / 2).toLocaleString()}</span>
                                                        <span>{Math.max(maxQty, inputMin + 100).toLocaleString()}+</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Setup Charges (Other Price Groups) */}
                        {!hasNoPricing && setupChargeGroups.length > 0 && (
                            <div className="xl:mb-6 mb-4">
                                <label className="block font-semibold mb-[8px] text-[16px] mb-1">
                                    Setup Charges <span className="text-[14px] font-normal text-[#666]">(Optional)</span>
                                </label>
                                <p className="text-[14px] text-[#666] mb-3">
                                    Select additional setup options if needed
                                </p>
                                <div className="space-y-3">
                                    {setupChargeGroups.map((setupGroup) => {
                                        const isSelected = selectedSetupCharges.some(g => g.id === setupGroup.id);
                                        const setupPrice = setupGroup.prices && setupGroup.prices.length > 0 && setupGroup.prices[0].price
                                            ? parseFloat(setupGroup.prices[0].price) 
                                            : (setupGroup.min_price || 0);
                                        const safeSetupPrice = (setupPrice && !isNaN(setupPrice)) ? setupPrice : 0;
                                        return (
                                            <div
                                                key={setupGroup.id}
                                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                    isSelected 
                                                        ? 'border-accent bg-accent/10 shadow-md' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => toggleSetupCharge(setupGroup)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleSetupCharge(setupGroup)}
                                                            className="w-5 h-5 text-accent rounded cursor-pointer"
                                                        />
                                                        <div>
                                                            <h4 className="font-semibold text-[16px] text-foreground">
                                                                {setupGroup.group_name}
                                                            </h4>
                                                            {setupGroup.prices && setupGroup.prices.length > 0 && setupGroup.prices[0] && (
                                                                <p className="text-[14px] text-[#666] mt-1">
                                                                    {setupGroup.prices[0].quantity_min === 1 && !setupGroup.prices[0].quantity_max 
                                                                        ? 'One-time charge'
                                                                        : (setupGroup.prices[0].price ? formatPriceTier(setupGroup.prices[0]) : 'Price not available')
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-[18px] text-foreground">
                                                        ${safeSetupPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {selectedSetupCharges.length > 0 && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-[14px] text-[#666]">
                                            Selected Setup Charges:
                                        </p>
                                        <ul className="list-disc list-inside mt-1 space-y-1">
                                            {selectedSetupCharges.map((group) => {
                                                const price = group.prices && group.prices.length > 0 
                                                    ? parseFloat(group.prices[0].price) 
                                                    : group.min_price || 0;
                                                return (
                                                    <li key={group.id} className="text-[14px] text-foreground">
                                                        {group.group_name}: <span className="font-semibold">${(price || 0).toFixed(2)}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Customization Selector - Only for Apparel */}
                        {isApparel && (
                            <div className="xl:mb-6 mb-4">
                                <CustomizationSelector
                                    quantity={selectedQuantity}
                                    onCustomizationsChange={(customizations, totalPrice) => {
                                        setSelectedCustomizations(customizations);
                                        setCustomizationTotalPrice(totalPrice);
                                    }}
                                />
                            </div>
                        )}

                        {/* Total Price Display with Discount */}
                        {!hasNoPricing && selectedBasePriceTier && (
                            <div className="xl:mb-6 mb-4 p-5 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border-2 border-accent shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-[16px] animate-pulse">
                                        🎉 {DISCOUNT_PERCENTAGE}% OFF
                                    </div>
                                    <span className="text-[14px] text-accent font-semibold">Special Discount Applied!</span>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[16px] font-semibold text-gray-700">
                                            Original Price ({selectedQuantity} units):
                                        </span>
                                        <span className="text-[20px] font-bold text-gray-500 line-through">
                                            ${calculateTotalPrice().toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between bg-red-50 px-3 py-2 rounded">
                                        <span className="text-[16px] font-semibold text-red-700">Discount ({DISCOUNT_PERCENTAGE}%):</span>
                                        <span className="text-[18px] font-bold text-red-600">
                                            -${calculateDiscountAmount().toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    {customizationTotalPrice > 0 && (
                                        <div className="flex items-center justify-between bg-accent/10 px-3 py-2 rounded">
                                            <span className="text-[16px] font-semibold text-foreground">Customizations:</span>
                                            <span className="text-[18px] font-bold text-accent">
                                                +${customizationTotalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {calculateShippingFee() > 0 && (
                                        <div className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded border border-yellow-200">
                                            <span className="text-[16px] font-semibold text-yellow-800">Less than minimum fee:</span>
                                            <span className="text-[18px] font-bold text-yellow-700">
                                                +${calculateShippingFee().toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {hasFreeShipping() && (
                                        <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded border border-green-200">
                                            <span className="text-[16px] font-semibold text-green-800">🚚 Free Shipping!</span>
                                            <span className="text-[14px] text-green-700 font-semibold">
                                                Orders over $500 qualify
                                            </span>
                                        </div>
                                    )}
                                    
                                    {!hasFreeShipping() && (
                                        <div className="bg-blue-50 px-3 py-2 rounded border border-blue-200">
                                            <p className="text-[13px] text-blue-800 text-center">
                                                💡 <strong>Free Shipping:</strong> Add ${(500 - calculateDiscountedPrice()).toFixed(2)} more to qualify for free shipping!
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between pt-2 border-t-2 border-accent">
                                        <span className="text-[20px] font-bold text-gray-800">Final Price ({selectedQuantity} units):</span>
                                        <span className="text-[32px] font-black text-accent">
                                            ${(calculateDiscountedPrice() + customizationTotalPrice + calculateShippingFee()).toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="bg-accent/10 px-3 py-2 rounded mt-2 border border-accent/20">
                                        <p className="text-[14px] text-accent font-semibold text-center">
                                            💰 You Save ${calculateDiscountAmount().toFixed(2)} Today!
                                        </p>
                            </div>
                        </div>

                                {selectedSetupCharges.length > 0 && (
                                    <p className="text-[12px] text-[#666] mt-3 pt-3 border-t border-gray-300">
                                        Includes base cost + {selectedSetupCharges.length} setup charge{selectedSetupCharges.length > 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Shipping Policy Information */}
                        {!hasNoPricing && (
                            <div className="xl:mb-6 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="w-5 h-5 text-accent" />
                                    <h4 className="font-semibold text-[16px] text-foreground">Shipping Information</h4>
                                </div>
                                <p className="text-[14px] text-foreground leading-relaxed">
                                    Free ground shipping to the lower 48 states applies as long as the quantity of the item ordered multiplied by the per unit price is at least $500. Otherwise a flat $100 less than the minimum charge will apply for any such item. Additional charges may apply for shipping by air or to other locations. Certain items or customizations may incur additional costs not captured during checkout and will be quoted before processing the order. Unless exempt, sales tax will apply to orders shipped to Minnesota and will be added after checkout.
                                </p>
                            </div>
                        )}

                        {/* Add to Cart and Buy Now buttons - Only show if product has pricing */}
                        {!hasNoPricing && (
                            <div className="flex gap-3 xl:mb-6 mb-4">
                                <Button
                                    onClick={addedToCart ? handleViewCart : handleAddToCart}
                                    disabled={isAddingToCart}
                                    className="flex-1 bg-foreground md:text-[16px] text-[14px] font-bold rounded-[12px] h-auto xl:py-[14px] sm:py-[10px] py-[8px] cursor-pointer disabled:opacity-50"
                                    variant="secondary">
                                    {isAddingToCart ? 'Adding...' : addedToCart ? 'View Cart' : 'Add to Cart'}
                                </Button>
                                <Button 
                                    onClick={handleBuyNow}
                                    disabled={isAddingToCart}
                                    variant="outline"
                                    className="flex-1 md:text-[16px] text-[14px] font-bold rounded-[12px] h-auto xl:py-[14px] sm:py-[10px] py-[8px] cursor-pointer hover:text-white disabled:opacity-50">
                                    Buy Now
                                </Button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

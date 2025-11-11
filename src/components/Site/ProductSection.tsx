'use client'
import Link from "next/link"
import { useState, useMemo } from 'react'
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
import pen from "../../../public/images/pen.png";

interface ProductSectionProps {
    product?: ProductDetail | null;
}

export default function ProductSection({ product }: ProductSectionProps = {}) {
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [selectedBasePriceTier, setSelectedBasePriceTier] = useState<PriceTier | null>(null);
    const [selectedSetupCharges, setSelectedSetupCharges] = useState<PriceGroup[]>([]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

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
    const uniqueColors = useMemo(() => {
        const colorMap = new Map<string, Part>();
        product.parts?.forEach(part => {
            const colorKey = part.primary_color?.color_name || part.part_name || 'default';
            if (!colorMap.has(colorKey)) {
                colorMap.set(colorKey, part);
            }
        });
        return Array.from(colorMap.values());
    }, [product.parts]);

    // Initialize selections when product loads
    useMemo(() => {
        if (product) {
            // Select first unique color part if available
            if (product.parts && product.parts.length > 0) {
                const firstColor = uniqueColors[0];
                if (firstColor) {
                    setSelectedPart(firstColor);
                }
            }
            // Select first price tier from base cost (first price group)
            if (product.price_groups && product.price_groups.length > 0) {
                const basePriceGroup = product.price_groups[0];
                if (basePriceGroup.prices && basePriceGroup.prices.length > 0) {
                    setSelectedBasePriceTier(basePriceGroup.prices[0]);
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
        const originalPrice = parseFloat(tier.price);
        const discountedPrice = originalPrice * (1 - DISCOUNT_PERCENTAGE / 100);
        return `${qtyText} EA : $${originalPrice.toFixed(2)} → $${discountedPrice.toFixed(2)}`;
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

    // Calculate total price (before discount)
    const calculateTotalPrice = (): number => {
        let total = 0;
        if (selectedBasePriceTier) {
            total += parseFloat(selectedBasePriceTier.price);
        }
        selectedSetupCharges.forEach(group => {
            if (group.prices && group.prices.length > 0) {
                total += parseFloat(group.prices[0].price);
            }
        });
        return total;
    };

    // Calculate discounted price
    const calculateDiscountedPrice = (): number => {
        const originalTotal = calculateTotalPrice();
        const discountAmount = originalTotal * (DISCOUNT_PERCENTAGE / 100);
        return originalTotal - discountAmount;
    };

    // Calculate discount amount
    const calculateDiscountAmount = (): number => {
        const originalTotal = calculateTotalPrice();
        return originalTotal * (DISCOUNT_PERCENTAGE / 100);
    };

    // Get category slug for breadcrumb
    const categorySlug = product.ai_category ? createSlug(product.ai_category.name) : null;
    const categoryName = product.ai_category?.name || 'Products';

    // Get minimum price from base cost
    const minPrice = basePriceGroup?.min_price || product.min_price || 0;
    const maxPrice = basePriceGroup?.max_price || product.max_price || minPrice;

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

                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="xl:text-[30px] sm:text-[28px] text-[24px] font-bold line-through text-gray-400">
                                    ${minPrice.toFixed(2)}
                                </span>
                                <span className="xl:text-[30px] sm:text-[28px] text-[24px] font-bold text-accent">
                                    ${(minPrice * 0.8).toFixed(2)}
                                </span>
                            </div>
                            <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-[14px] animate-pulse">
                                {DISCOUNT_PERCENTAGE}% OFF
                            </div>
                        </div>
                        <p className="text-[14px] text-accent font-semibold mb-0">
                            You Save ${(minPrice * 0.2).toFixed(2)}!
                            {maxPrice !== minPrice && ` - Save up to $${(maxPrice * 0.2).toFixed(2)}!`}
                        </p>
                        <p className="text-[14px] text-gray-600 mt-1">
                            <span className="text-[16px] font-Regular"> (Inclusive of taxes)</span>
                        </p>
                        <p className="text-[16px] mb-[10px]">
                            <span className="font-semibold text-accent">✓ Ready to Order</span> — Customize with your logo • Fast turnaround • Free returns within 7 days
                        </p>

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
                                            {selectedPart.min_price && selectedPart.max_price && (
                                                <span className="ml-2">
                                                    (${selectedPart.min_price.toFixed(2)} - ${selectedPart.max_price.toFixed(2)})
                                                </span>
                                            )}
                                        </p>
                                        {selectedPart.description && (
                                            <p className="text-[13px] text-[#888] italic">{selectedPart.description}</p>
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

                        {/* Base Cost Pricing (First Price Group) */}
                        {basePriceGroup && basePricingOptions.length > 0 && (
                        <div className="xl:mb-6 mb-4">
                                <label className="block font-semibold mb-[8px] text-[16px] mb-1">
                                    Base Cost <span className="text-red-500">*</span>
                                </label>
                                <p className="text-[14px] text-[#666] mb-2">
                                    Select quantity for base product pricing
                                </p>
                                <div className="mb-2">
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-[12px] font-bold">
                                        {DISCOUNT_PERCENTAGE}% OFF Applied!
                                    </span>
                                </div>
                            <div className="flex gap-[12px] flex-wrap">
                                    {basePricingOptions.map((tier, index) => {
                                        const isSelected = selectedBasePriceTier === tier;
                                        const originalPrice = parseFloat(tier.price);
                                        const discountedPrice = originalPrice * (1 - DISCOUNT_PERCENTAGE / 100);
                                        const minQty = tier.quantity_min;
                                        const maxQty = tier.quantity_max;
                                        const qtyText = maxQty ? `${minQty}-${maxQty}` : `${minQty}+`;
                                        return (
                                    <Button
                                                key={index}
                                                variant={isSelected ? 'default' : 'outline'}
                                                onClick={() => setSelectedBasePriceTier(tier)}
                                                className={`text-[14px] leading-[16px] rounded-lg cursor-pointer flex flex-col items-start justify-center py-3 px-4 min-h-[70px] transition-all duration-200 shadow-sm
                                                    ${isSelected 
                                                        ? 'border-2 border-accent bg-accent text-white hover:bg-accent/90 hover:shadow-md hover:scale-[1.02]' 
                                                        : 'border border-gray-200 bg-white hover:bg-gray-50 hover:border-accent/50 hover:shadow-sm'}`}
                                            >
                                                <span className={`font-semibold text-[15px] mb-1 ${isSelected ? 'text-white' : 'text-foreground'}`}>{qtyText} EA</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`line-through text-[12px] ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>${originalPrice.toFixed(2)}</span>
                                                    <span className={`font-bold text-[14px] ${isSelected ? 'text-white' : 'text-accent'}`}>${discountedPrice.toFixed(2)}</span>
                                                </div>
                                    </Button>
                                        );
                                    })}
                                </div>
                                {selectedBasePriceTier && (
                                    <div className="text-[14px] text-[#666] mt-2">
                                        <p>
                                            Base Cost: 
                                            <span className="line-through text-gray-400 ml-1">${parseFloat(selectedBasePriceTier.price).toFixed(2)}</span>
                                            <span className="font-semibold text-accent ml-2">
                                                ${(parseFloat(selectedBasePriceTier.price) * (1 - DISCOUNT_PERCENTAGE / 100)).toFixed(2)}
                                            </span>
                                            <span className="text-accent ml-1">({DISCOUNT_PERCENTAGE}% off)</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Setup Charges (Other Price Groups) */}
                        {setupChargeGroups.length > 0 && (
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
                                        const setupPrice = setupGroup.prices && setupGroup.prices.length > 0 
                                            ? parseFloat(setupGroup.prices[0].price) 
                                            : setupGroup.min_price || 0;
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
                                                            {setupGroup.prices && setupGroup.prices.length > 0 && (
                                                                <p className="text-[14px] text-[#666] mt-1">
                                                                    {setupGroup.prices[0].quantity_min === 1 && !setupGroup.prices[0].quantity_max 
                                                                        ? 'One-time charge'
                                                                        : formatPriceTier(setupGroup.prices[0])
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-[18px] text-foreground">
                                                        ${setupPrice.toFixed(2)}
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
                                                        {group.group_name}: <span className="font-semibold">${price.toFixed(2)}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Total Price Display with Discount */}
                        {selectedBasePriceTier && (
                            <div className="xl:mb-6 mb-4 p-5 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border-2 border-accent shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-[16px] animate-pulse">
                                        🎉 {DISCOUNT_PERCENTAGE}% OFF
                                    </div>
                                    <span className="text-[14px] text-accent font-semibold">Special Discount Applied!</span>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[16px] font-semibold text-gray-700">Original Price:</span>
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
                                    
                                    <div className="flex items-center justify-between pt-2 border-t-2 border-accent">
                                        <span className="text-[20px] font-bold text-gray-800">Final Price:</span>
                                        <span className="text-[32px] font-black text-accent">
                                            ${calculateDiscountedPrice().toFixed(2)}
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

                        <div className="flex gap-3 xl:mb-6 mb-4">
                            <Link href="/cart">
                                <Button
                                    className="flex-1 bg-foreground md:text-[16px] text-[14px] font-bold rounded-[12px] h-auto xl:py-[14px] sm:py-[10px] py-[8px] cursor-pointer"
                                    variant="secondary">Add to Cart</Button>
                            </Link>
                            <Link href="/checkout">
                                <Button variant="outline"
                                        className="flex-1 md:text-[16px] text-[14px] font-bold rounded-[12px] h-auto xl:py-[14px] sm:py-[10px] py-[8px] cursor-pointer hover:text-white">Buy Now</Button>
                            </Link>
                        </div>

                        <div className="space-y-[25px]">
                            {/* Product Description */}
                            <div>
                                <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Product Description</h3>
                                <p className="sm:text-[16px] text-[14px] leading-[24px] whitespace-pre-line">
                                    {product.description || 'No description available.'}
                                </p>
                            </div>

                            {/* Keywords */}
                            {product.keywords && product.keywords.length > 0 && (
                            <div>
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

                            {/* Distributor Info */}
                            {product.distributor_only_info && (
                            <div>
                                    <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Additional Information</h3>
                                    <p className="sm:text-[16px] text-[14px] leading-[24px]">
                                        {product.distributor_only_info}
                                </p>
                            </div>
                            )}

                            {/* Caution */}
                            {product.is_caution && product.caution_comment && (
                                <div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3">
                                    <h3 className="font-bold text-[18px] leading-[20px] mb-[5px] text-yellow-800">Caution</h3>
                                    <p className="sm:text-[16px] text-[14px] leading-[24px] text-yellow-700">
                                        {product.caution_comment}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

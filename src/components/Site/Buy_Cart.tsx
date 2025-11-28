'use client';
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import pen from "../../../public/images/pen.png";
import { Button } from "@/components/ui/button";
import { MoveRight, ShoppingCart } from "lucide-react";
import { type Product } from '@/lib/api/catalog';
import { stripHtmlTags } from '@/lib/utils';

interface BuyCartProps {
    products?: Product[];
    totalCount?: number;
}

// Helper function to truncate description
// Show more description for products without pricing to fill space
const truncateDescription = (text: string, maxLength: number = 100, hasNoPricing: boolean = false): string => {
    if (!text) return '';
    // Strip HTML tags first
    const plainText = stripHtmlTags(text);
    // Show more description (200 chars) for products without pricing
    const length = hasNoPricing ? 200 : maxLength;
    if (plainText.length <= length) return plainText;
    return plainText.substring(0, length).trim() + '...';
};

// Helper function to get product image
const getProductImage = (product: Product): string | any => {
    // Check for primary_image_url first (from API response)
    if (product.primary_image_url) return product.primary_image_url;
    if (product.primary_image) return product.primary_image;
    // Check for other image fields
    if (product.image_url) return product.image_url;
    if (product.image) return product.image;
    if (product.media && Array.isArray(product.media) && product.media.length > 0) {
        const firstMedia = product.media[0];
        if (typeof firstMedia === 'string') return firstMedia;
        if (firstMedia.url) return firstMedia.url;
        if (firstMedia.image_url) return firstMedia.image_url;
    }
    // Fallback to placeholder (return the imported image object)
    return pen;
};

// Helper to check if image is external URL
const isExternalImage = (image: string | any): boolean => {
    if (typeof image !== 'string') return false;
    // Check if it's a URL (starts with http:// or https://)
    return image.startsWith('http://') || image.startsWith('https://') || image.startsWith('//');
};

// Helper to check if product has no pricing (requires custom quote)
const hasNoPricing = (product: Product): boolean => {
    const minPrice = product.min_price != null ? Number(product.min_price) : null;
    const maxPrice = product.max_price != null ? Number(product.max_price) : null;
    return (minPrice === 0 || minPrice === null) && (maxPrice === 0 || maxPrice === null);
};

function BuyCart({ products = [], totalCount = 0 }: BuyCartProps) {
    const router = useRouter();

    // Handle Add to Cart - Redirect to detail page
    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/single-products/${product.id}`);
    };

    // Handle Buy Now - Redirect to detail page
    const handleBuyNow = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/single-products/${product.id}`);
    };

    // Map API products to display format
    const content = products.map((product) => {
        const fullDescription = product.description || `${product.product_name} - Quality product for your needs`;
        const productImage = getProductImage(product);
        
        // Format price with null checks - hide price if product has no pricing
        const productHasNoPricing = hasNoPricing(product);
        let priceDisplay = 'Price on request';
        
        if (!productHasNoPricing) {
            const minPrice = product.min_price != null ? Number(product.min_price) : null;
            const maxPrice = product.max_price != null ? Number(product.max_price) : null;
            
            if (minPrice != null && maxPrice != null && !isNaN(minPrice) && !isNaN(maxPrice)) {
                if (maxPrice !== minPrice) {
                    priceDisplay = `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
                } else {
                    priceDisplay = `$${minPrice.toFixed(2)}`;
                }
            } else if (minPrice != null && !isNaN(minPrice)) {
                priceDisplay = `$${minPrice.toFixed(2)}+`;
            } else if (maxPrice != null && !isNaN(maxPrice)) {
                priceDisplay = `Up to $${maxPrice.toFixed(2)}`;
            }
        }
        
        return {
            id: product.id,
            product_id: product.product_id,
            title: product.product_name,
            description: truncateDescription(fullDescription, 100, productHasNoPricing),
            price: priceDisplay,
            minPrice: product.min_price,
            maxPrice: product.max_price,
            image: productImage,
            isExternalImage: isExternalImage(productImage),
            hasNoPricing: productHasNoPricing,
            product: product, // Keep reference to original product
        };
    });

    if (content.length === 0) {
        return (
            <div className="col-span-full text-center py-[50px]">
                <p className="text-[18px] text-[#666]">No products found. Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <>
            {totalCount > 0 && (
                <div className="mb-[20px] text-[16px] text-[#666]">
                    Found {totalCount} product{totalCount !== 1 ? 's' : ''}
                </div>
            )}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(245px,1fr))] gap-[20px]">
                {content.map((item) => (
                <div key={item.id || item.product_id} className="bg-gradient px-[10px] pt-[10px] pb-[23px] rounded-[12px] buy_cart h-full flex flex-col">
                    <Link href={`/single-products/${item.id}`} className="flex-shrink-0">
                        <figure className="w-full h-[208px] flex items-center justify-center rounded-[6px] bg-white mb-[24px] overflow-hidden cursor-pointer">
                            {item.isExternalImage ? (
                                <img 
                                    src={item.image as string} 
                                    alt={item.title} 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        (e.target as HTMLImageElement).src = pen.src;
                                    }}
                                />
                            ) : (
                                <Image src={item.image} alt={item.title} className="w-full h-full object-contain" />
                            )}
                        </figure>
                    </Link>
                    <Link href={`/single-products/${item.id}`} className="block flex-shrink-0">
                        <h3 className="text-[18px] leading-[18px] mb-[10px] font-semibold hover:text-accent cursor-pointer line-clamp-2 min-h-[36px]">{item.title}</h3>
                        <span className={`text-[15px] leading-[20px] block text-[#666] ${item.hasNoPricing ? 'line-clamp-4 min-h-[60px] mb-[8px]' : 'line-clamp-2 min-h-[40px] mb-[10px]'}`}>
                            {item.description}
                        </span>
                    </Link>
                    {/* Price section - always reserve space for consistent layout */}
                    <div className={`font-black text-[22px] leading-[22px] flex-shrink-0 ${item.hasNoPricing ? 'mb-[8px] min-h-0' : 'mb-[28px] min-h-[28px]'}`}>
                        {!item.hasNoPricing && item.price}
                    </div>
                    <div className="flex gap-[10px] mt-auto flex-shrink-0">
                        {item.hasNoPricing ? (
                            // For products without pricing, redirect to detail page
                            <Link href={`/single-products/${item.id}`} className="flex-1">
                                <Button className="w-full sm:text-[16px] text-[14px] leading-[16px] font-bold cursor-pointer h-auto md:py-[17px] py-[10px] rounded-[12px]">
                                    Request Quote <MoveRight size={24} />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Button 
                                    onClick={(e) => handleBuyNow(item.product, e)}
                                    className="flex-1 w-full sm:text-[16px] text-[14px] leading-[16px] font-bold cursor-pointer h-auto md:py-[17px] py-[10px] rounded-[12px]">
                                    Buy Now <MoveRight size={24} />
                                </Button>
                                <Button
                                    onClick={(e) => handleAddToCart(item.product, e)}
                                    variant="outline"
                                    className="text-[16px] leading-[16px] font-bold cursor-pointer rounded-[12px] border-foreground md:h-[50px] h-[46px] w-[46px] md:w-[50px] bg-transparent hover:bg-transparent"
                                >
                                    <ShoppingCart className="text-foreground" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}

export default BuyCart;

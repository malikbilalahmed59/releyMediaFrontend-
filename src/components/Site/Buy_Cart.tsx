import React from 'react';
import Image from "next/image";
import Link from "next/link";
import pen from "../../../public/images/pen.png";
import { Button } from "@/components/ui/button";
import { MoveRight, ShoppingCart } from "lucide-react";
import { type Product } from '@/lib/api/catalog';

interface BuyCartProps {
    products?: Product[];
    totalCount?: number;
}

// Helper function to truncate description
const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
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

function BuyCart({ products = [], totalCount = 0 }: BuyCartProps) {
    // Map API products to display format
    const content = products.map((product) => {
        const fullDescription = product.description || `${product.product_name} - Quality product for your needs`;
        const productImage = getProductImage(product);
        return {
            id: product.id,
            product_id: product.product_id,
            title: product.product_name,
            description: truncateDescription(fullDescription, 100),
            price: `$${product.min_price.toFixed(2)}${product.max_price !== product.min_price ? ` - $${product.max_price.toFixed(2)}` : ''}`,
            minPrice: product.min_price,
            maxPrice: product.max_price,
            image: productImage,
            isExternalImage: isExternalImage(productImage),
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
                <div key={item.id || item.product_id} className="bg-gradient px-[10px] pt-[10px] pb-[23px] rounded-[12px] buy_cart">
                    <Link href={`/single-products/${item.product_id}`}>
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
                    <Link href={`/single-products/${item.product_id}`} className="block">
                        <h3 className="text-[18px] leading-[18px] mb-[10px] font-semibold hover:text-accent cursor-pointer line-clamp-2">{item.title}</h3>
                        <span className="text-[15px] leading-[20px] block mb-[10px] line-clamp-2 text-[#666]">{item.description}</span>
                    </Link>
                    <div className="font-black text-[22px] leading-[22px] mb-[28px]">{item.price}</div>
                    <div className="flex gap-[10px]">
                        <Link href="/checkout">
                            <Button className="sm:text-[16px] text-[14px] leading-[16px] font-bold cursor-pointer h-auto md:py-[17px] py-[10px] 2xl:!px-[61px] !px-[40px] rounded-[12px]">
                                Buy Now <MoveRight size={24} />
                            </Button>
                        </Link>
                        <Link href="/cart">
                            <Button
                                variant="outline"
                                className="text-[16px] leading-[16px] font-bold cursor-pointer rounded-[12px] border-foreground md:h-[50px] h-[46px] w-[46px] md:w-[50px] bg-transparent hover:bg-transparent"
                            >
                                <ShoppingCart className="text-foreground" />
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}

export default BuyCart;

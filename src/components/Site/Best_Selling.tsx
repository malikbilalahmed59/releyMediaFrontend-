'use client';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button } from "@/components/ui/button";
import { MoveRight, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { searchProducts, type Product } from '@/lib/api/catalog';
import { stripHtmlTags } from '@/lib/utils';
import pen from "../../../public/images/pen.png";

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
    if (product.primary_image_url) return product.primary_image_url;
    if (product.primary_image) return product.primary_image;
    if (product.image_url) return product.image_url;
    if (product.image) return product.image;
    if (product.media && Array.isArray(product.media) && product.media.length > 0) {
        const firstMedia = product.media[0];
        if (typeof firstMedia === 'string') return firstMedia;
        if (firstMedia.url) return firstMedia.url;
        if (firstMedia.image_url) return firstMedia.image_url;
    }
    return pen;
};

// Helper to check if image is external URL
const isExternalImage = (image: string | any): boolean => {
    if (typeof image !== 'string') return false;
    return image.startsWith('http://') || image.startsWith('https://') || image.startsWith('//');
};

// Helper to check if product has no pricing (requires custom quote)
const hasNoPricing = (product: Product): boolean => {
    const minPrice = product.min_price != null ? Number(product.min_price) : null;
    const maxPrice = product.max_price != null ? Number(product.max_price) : null;
    return (minPrice === 0 || minPrice === null) && (maxPrice === 0 || maxPrice === null);
};

function BestSelling() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBestSelling = async () => {
            setLoading(true);
            setError(null);
            try {
                const results = await searchProducts({
                    best_selling: true,
                    page_size: 12, // Fetch 12 best selling products
                    ordering: 'most_popular',
                });
                setProducts(results.results || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch best selling products');
                console.error('Error fetching best selling products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSelling();
    }, []);

    if (loading) {
        return (
            <section className="2xl:pb-[80px] xl:py-[60px] sm:py-[50px] py-[40px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold 2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">On Sale Now</h2>
                    <div className="text-center py-[50px]">
                        <p className="text-[18px]">Loading best selling products...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="2xl:pb-[80px] xl:py-[60px] sm:py-[50px] py-[40px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold 2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">On Sale Now</h2>
                    <div className="text-center py-[50px]">
                        <p className="text-red-500 text-[18px]">Error: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    const ProductCard = ({ product }: { product: Product }) => {
        const productImage = getProductImage(product);
        const fullDescription = product.description || `${product.product_name} - Quality product for your needs`;
        const productHasNoPricing = hasNoPricing(product);
        
        // Safely handle null/undefined prices - hide price if product has no pricing
        let price = '';
        if (!productHasNoPricing) {
            const minPrice = product.min_price != null ? Number(product.min_price) : 0;
            const maxPrice = product.max_price != null ? Number(product.max_price) : 0;
            price = minPrice > 0 
                ? `$${minPrice.toFixed(2)}${maxPrice !== minPrice && maxPrice > 0 ? ` - $${maxPrice.toFixed(2)}` : ''}`
                : 'Price on request';
        }
        
        return (
            <div className="bg-white px-[10px] pt-[10px] pb-[23px] rounded-[12px] buy_cart h-full flex flex-col">
                <Link href={`/single-products/${product.id}`} className="flex-shrink-0">
                    <figure className="w-full h-[208px] flex items-center justify-center rounded-[6px] bg-white mb-[24px] overflow-hidden cursor-pointer">
                        {isExternalImage(productImage) ? (
                            <img 
                                src={productImage as string} 
                                alt={product.product_name} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = pen.src;
                                }}
                            />
                        ) : (
                            <Image src={productImage} alt={product.product_name} className="w-full h-full object-contain" />
                        )}
                    </figure>
                </Link>
                <Link href={`/single-products/${product.id}`} className="block flex-shrink-0">
                    <h3 className="text-[18px] leading-[18px] mb-[10px] font-semibold hover:text-accent cursor-pointer line-clamp-2 min-h-[36px]">
                        {product.product_name}
                    </h3>
                    <span className={`text-[15px] leading-[20px] block text-[#666] ${productHasNoPricing ? 'line-clamp-4 min-h-[60px] mb-[8px]' : 'line-clamp-2 min-h-[40px] mb-[10px]'}`}>
                        {truncateDescription(fullDescription, 100, productHasNoPricing)}
                    </span>
                </Link>
                {/* Hide price for products without pricing */}
                {!productHasNoPricing && price && (
                    <div className="font-black text-[22px] leading-[22px] mb-[28px] flex-shrink-0">{price}</div>
                )}
                {productHasNoPricing && (
                    <div className="mb-[8px] flex-shrink-0"></div>
                )}
                <div className="flex gap-[10px] mt-auto flex-shrink-0">
                    {productHasNoPricing ? (
                        // For products without pricing, redirect to detail page
                        <Link href={`/single-products/${product.id}`} className="flex-1">
                            <Button className="w-full sm:text-[16px] text-[14px] leading-[16px] font-bold cursor-pointer h-auto md:py-[17px] py-[10px] rounded-[12px]">
                                Request Quote <MoveRight size={24} />
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href={`/single-products/${product.id}`} className="flex-1">
                                <Button className="w-full sm:text-[16px] text-[14px] leading-[16px] font-bold cursor-pointer h-auto md:py-[17px] py-[10px] rounded-[12px]">
                                    Buy Now <MoveRight size={24} />
                                </Button>
                            </Link>
                            <Link href={`/single-products/${product.id}`}>
                                <Button
                                    variant="outline"
                                    className="text-[16px] leading-[16px] font-bold cursor-pointer rounded-[12px] border-foreground md:h-[50px] h-[46px] w-[46px] md:w-[50px] bg-transparent hover:bg-transparent"
                                >
                                    <ShoppingCart className="text-foreground" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className="2xl:pb-[80px] xl:pt-[30px] xl:pb-[60px] sm:pt-[25px] sm:pb-[50px] pt-[20px] pb-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold 2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">On Sale Now</h2>
                
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                            1280: {
                                slidesPerView: 5,
                            },
                        }}
                        navigation={{
                            prevEl: '.swiper-button-prev-best-selling',
                            nextEl: '.swiper-button-next-best-selling',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination-best-selling',
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={products.length > 5}
                        className="best-selling-swiper"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id || product.product_id} className="h-auto">
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    {/* Custom Navigation Buttons - Outside product boundary */}
                    <button className="swiper-button-prev-best-selling absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors -translate-x-2">
                        <ChevronLeft className="w-6 h-6 text-foreground" />
                    </button>
                    <button className="swiper-button-next-best-selling absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors translate-x-2">
                        <ChevronRight className="w-6 h-6 text-foreground" />
                    </button>
                    
                    {/* Pagination */}
                    <div className="swiper-pagination-best-selling flex justify-center mt-8 gap-2"></div>
                </div>
            </div>
        </section>
    );
}

export default BestSelling;
'use client';
import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button } from "@/components/ui/button";
import { MoveRight, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { type RelevantProduct } from '@/lib/api/catalog';
import pen from "../../../public/images/pen.png"; // Placeholder image

interface RelatedProductsProps {
    products?: RelevantProduct[];
}

const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

const getProductImage = (product: RelevantProduct): string | any => {
    if (product.primary_image_url) return product.primary_image_url;
    if (product.primary_image) return product.primary_image;
    if (product.image_url) return product.image_url;
    if (product.image) return product.image;
    return pen;
};

const isExternalImage = (image: string | any): boolean => {
    if (typeof image !== 'string') return false;
    return image.startsWith('http://') || image.startsWith('https://') || image.startsWith('//');
};

function RelatedProducts({ products = [] }: RelatedProductsProps) {
    if (!products || products.length === 0) {
        return null;
    }

    const useSlider = products.length > 4;

    const ProductCard = ({ product }: { product: RelevantProduct }) => {
        const productImage = getProductImage(product);
        const fullDescription = product.description || `${product.product_name} - Quality product for your needs`;
        const price = `$${product.min_price.toFixed(2)}${product.max_price !== product.min_price ? ` - $${product.max_price.toFixed(2)}` : ''}`;
        
        return (
            <div className="bg-white px-[10px] pt-[10px] pb-[23px] rounded-[12px] buy_cart h-full flex flex-col">
                <Link href={`/single-products/${product.product_id}`} className="flex-shrink-0">
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
                <Link href={`/single-products/${product.product_id}`} className="block flex-shrink-0">
                    <h3 className="text-[18px] leading-[18px] mb-[10px] font-semibold hover:text-accent cursor-pointer line-clamp-2 min-h-[36px]">
                        {product.product_name}
                    </h3>
                    <span className="text-[15px] leading-[20px] block mb-[10px] line-clamp-2 text-[#666] min-h-[40px]">
                        {truncateDescription(fullDescription, 100)}
                    </span>
                </Link>
                <div className="font-black text-[22px] leading-[22px] mb-[28px] flex-shrink-0">{price}</div>
                <div className="flex gap-[10px] mt-auto flex-shrink-0">
                    <Link href="/checkout" className="flex-1">
                        <Button className="w-full sm:text-[16px] text-[14px] leading-[16px] font-bold cursor-pointer h-auto md:py-[17px] py-[10px] rounded-[12px]">
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
        );
    };

    return (
        <section className="py-[80px] bg-gradient">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="text-[36px] leading-[36px] font-bold mb-[40px] text-center">
                    Related Products
                </h2>
                
                {useSlider ? (
                    <div className="relative px-12">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            loop={products.length > 4}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                                1280: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next-related',
                                prevEl: '.swiper-button-prev-related',
                            }}
                            pagination={{
                                clickable: true,
                                el: '.swiper-pagination-related',
                            }}
                            className="related-products-swiper"
                        >
                            {products.map((product) => (
                                <SwiperSlide key={product.id || product.product_id} className="h-auto">
                                    <ProductCard product={product} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        {/* Custom Navigation Buttons - Outside product boundary */}
                        <button className="swiper-button-prev-related absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors -translate-x-2">
                            <ChevronLeft className="w-6 h-6 text-foreground" />
                        </button>
                        <button className="swiper-button-next-related absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors translate-x-2">
                            <ChevronRight className="w-6 h-6 text-foreground" />
                        </button>
                        
                        {/* Custom Pagination */}
                        <div className="swiper-pagination-related mt-8 flex justify-center gap-2"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(245px,1fr))] gap-[20px]">
                        {products.map((product) => (
                            <ProductCard key={product.id || product.product_id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default RelatedProducts;


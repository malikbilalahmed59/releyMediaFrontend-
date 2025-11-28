'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import MainBanner from "@/components/Site/Main_Banner";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import ProductSection from "@/components/Site/ProductSection";
import RelatedProducts from "@/components/Site/RelatedProducts";
import SEOHead from "@/components/Site/SEOHead";
import { getProductDetail, type ProductDetail } from '@/lib/api/catalog';
import { stripHtmlTags } from '@/lib/utils';

function ProductDetailContent() {
    const params = useParams();
    const pathname = usePathname();
    const idParam = params.id as string;
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!idParam) return;
            
            // Convert id to number (Django primary key)
            const productId = parseInt(idParam, 10);
            if (isNaN(productId)) {
                setError('Invalid product ID');
                setLoading(false);
                return;
            }
            
            setLoading(true);
            setError(null);
            try {
                const productData = await getProductDetail(productId);
                console.log('Product detail API response:', productData);
                console.log('Available fields:', Object.keys(productData));
                setProduct(productData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch product');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [idParam]);

    // Generate SEO metadata
    const keywords = product?.keywords?.map(k => k.keyword).join(', ') || '';
    const plainDescription = product?.description ? stripHtmlTags(product.description) : '';
    const metaDescription = plainDescription
        ? plainDescription.substring(0, 155).trim() + (plainDescription.length > 155 ? '...' : '')
        : `${product?.product_name || 'Product'} - Browse our catalog at RELYmedia`;
    
    // Enhanced title with brand/category if available
    const seoTitle = product?.product_name 
        ? `${product.product_name}${product.product_brand ? ` by ${product.product_brand}` : ''} | RELYmedia`
        : 'Product Details | RELYmedia';

    return (
        <>
            {product && (
                <SEOHead
                    title={seoTitle}
                    description={metaDescription}
                    keywords={keywords}
                    ogImage={product.primary_image_url || product.primary_image}
                    canonicalUrl={pathname ? `${typeof window !== 'undefined' ? window.location.origin : ''}${pathname}` : undefined}
                />
            )}
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
            {loading && (
                <div className="py-[50px] pb-[75px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading product...</div>
                    </div>
                </div>
            )}
            {error && (
                <div className="py-[50px] pb-[75px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center text-red-500">Error: {error}</div>
                    </div>
                </div>
            )}
            {!loading && !error && product && (
                <>
                    <ProductSection product={product} />
                    {product.relevant_products && product.relevant_products.length > 0 && (
                        <RelatedProducts products={product.relevant_products} />
                    )}
                </>
            )}
            <Customer_Feedback/>
            <Client_Logo/>
            <Footer/>
        </>
    );
}

function Page() {
    return (
        <Suspense fallback={
            <>
                <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading header...</div>
                    </div>
                </div>
                <MainBanner/>
                <div className="py-[50px] pb-[75px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
                <Footer/>
            </>
        }>
            <ProductDetailContent />
        </Suspense>
    );
}

export default Page;


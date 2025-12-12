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
import { getProductDetail, getProductsByCategory, type ProductDetail } from '@/lib/api/catalog';
import { stripHtmlTags } from '@/lib/utils';
import { getCategoryCountByName } from '@/lib/utils/categoryCache';

function ProductDetailContent() {
    const params = useParams();
    const pathname = usePathname();
    const idParam = params.id as string;
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [categoryCount, setCategoryCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Preserve category name from sessionStorage to prevent banner flashing
    const [preservedCategoryName, setPreservedCategoryName] = useState<string | null>(null);

    useEffect(() => {
        // Get preserved category name from sessionStorage on mount (synchronously to prevent flash)
        if (typeof window !== 'undefined') {
            const storedCategoryName = sessionStorage.getItem('currentCategoryName');
            if (storedCategoryName) {
                setPreservedCategoryName(storedCategoryName);
                // Try to get count from cache immediately
                const cachedCount = getCategoryCountByName(storedCategoryName);
                if (cachedCount !== null) {
                    setCategoryCount(cachedCount);
                }
            }
        }

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
                
                // Fetch category count if product has a category
                if (productData.ai_category?.id) {
                    // First try cache
                    const cachedCount = getCategoryCountByName(productData.ai_category.name);
                    if (cachedCount !== null) {
                        setCategoryCount(cachedCount);
                    } else {
                        // Fallback to API if not in cache
                        try {
                            const categoryResults = await getProductsByCategory(productData.ai_category.id, {
                                page: 1,
                                page_size: 1, // We only need the count
                            });
                            setCategoryCount(categoryResults.count);
                        } catch (categoryError) {
                            console.error('Error fetching category count:', categoryError);
                            // Don't fail the whole page if category count fails
                        }
                    }
                }
                
                // Update preserved category name if product has a category
                // This ensures banner stays consistent with the product's actual category
                if (productData.ai_category?.name) {
                    // If product category matches preserved, keep it
                    // If it doesn't match, use product category (more accurate)
                    if (preservedCategoryName && productData.ai_category.name !== preservedCategoryName) {
                        // Product category is more accurate, update sessionStorage
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('currentCategoryName', productData.ai_category.name);
                        }
                        setPreservedCategoryName(productData.ai_category.name);
                    } else if (!preservedCategoryName) {
                        // No preserved category, set product category
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('currentCategoryName', productData.ai_category.name);
                        }
                        setPreservedCategoryName(productData.ai_category.name);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch product');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [idParam, preservedCategoryName]);

    // Generate SEO metadata
    const keywords = product?.keywords?.map(k => k.keyword).join(', ') || '';
    const plainDescription = product?.description ? stripHtmlTags(product.description) : '';
    const metaDescription = plainDescription
        ? plainDescription.substring(0, 155).trim() + (plainDescription.length > 155 ? '...' : '')
        : `${product?.product_name || 'Product'} - Browse our catalog at RELYmedia`;
    
    // Enhanced title with brand/category if available
    const seoTitle = product?.product_name 
        ? `${product.product_name}${product.product_brand ? ` by ${product.product_brand}` : ''} - RELYmedia - Promotional Products`
        : 'Product Details - RELYmedia - Promotional Products';

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
            <MainBanner 
                productCount={categoryCount} 
                categoryName={preservedCategoryName || product?.ai_category?.name} 
            />
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


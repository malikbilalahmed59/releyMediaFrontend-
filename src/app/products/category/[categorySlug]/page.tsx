'use client';
import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import MainBanner from "@/components/Site/Main_Banner";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import ProductGrid from "@/components/Site/ProductGrid";
import SEOHead from "@/components/Site/SEOHead";
import { getCategoryBySlug, getProductsByCategory, type SearchResponse, type Category } from '@/lib/api/catalog';

function CategoryProductsContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const categorySlug = params.categorySlug as string;
    
    const [category, setCategory] = useState<Category | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [mainCategoryCount, setMainCategoryCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Memoize search params to prevent unnecessary refetches
    const searchParamsMemo = useMemo(() => {
        const page = parseInt(searchParams.get('page') || '1');
        const ordering = (searchParams.get('ordering') as 'best_match' | 'newest' | 'most_popular' | 'price_low_high' | 'price_high_low') || 'newest';
        const query = searchParams.get('q') || undefined;
        const minPrice = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined;
        const maxPrice = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined;
        const minQuantity = searchParams.get('min_quantity') ? parseInt(searchParams.get('min_quantity')!) : undefined;
        const maxQuantity = searchParams.get('max_quantity') ? parseInt(searchParams.get('max_quantity')!) : undefined;
        const material = searchParams.get('material') || undefined;
        const brand = searchParams.get('brand') || undefined;
        const color = searchParams.get('color') || undefined;
        const closeout = searchParams.get('closeout') === 'true' ? true : searchParams.get('closeout') === 'false' ? false : undefined;
        const usaMade = searchParams.get('usa_made') === 'true' ? true : searchParams.get('usa_made') === 'false' ? false : undefined;
        const bestSelling = searchParams.get('best_selling') === 'true' ? true : searchParams.get('best_selling') === 'false' ? false : undefined;
        const rushService = searchParams.get('rush_service') === 'true' ? true : searchParams.get('rush_service') === 'false' ? false : undefined;
        const ecoFriendly = searchParams.get('eco_friendly') === 'true' ? true : searchParams.get('eco_friendly') === 'false' ? false : undefined;
        const subcategoryId = searchParams.get('subcategory_id') ? parseInt(searchParams.get('subcategory_id')!) : undefined;
        
        return {
            page,
            ordering,
            query,
            minPrice,
            maxPrice,
            minQuantity,
            maxQuantity,
            material,
            brand,
            color,
            closeout,
            usaMade,
            bestSelling,
            rushService,
            ecoFriendly,
            subcategoryId,
        };
    }, [searchParams]);

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            if (!categorySlug) return;
            
            // Cancel previous request if it exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            
            // Create new AbortController for this request
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;
            
            setLoading(true);
            setError(null);
            
            try {
                // First, find the category by slug
                const foundCategory = await getCategoryBySlug(categorySlug);
                
                if (signal.aborted) return;
                
                if (!foundCategory) {
                    setError('Category not found');
                    setLoading(false);
                    return;
                }
                
                setCategory(foundCategory);
                
                // Parallelize: Fetch main category count and products simultaneously
                const [mainCategoryResults, productResults] = await Promise.all([
                    getProductsByCategory(foundCategory.id, {
                        page: 1,
                        page_size: 1, // We only need the count
                    }),
                    getProductsByCategory(foundCategory.id, {
                        q: searchParamsMemo.query,
                        page: searchParamsMemo.page,
                        ordering: searchParamsMemo.ordering,
                        min_price: searchParamsMemo.minPrice,
                        max_price: searchParamsMemo.maxPrice,
                        min_quantity: searchParamsMemo.minQuantity,
                        max_quantity: searchParamsMemo.maxQuantity,
                        material: searchParamsMemo.material,
                        brand: searchParamsMemo.brand,
                        color: searchParamsMemo.color,
                        closeout: searchParamsMemo.closeout,
                        usa_made: searchParamsMemo.usaMade,
                        best_selling: searchParamsMemo.bestSelling,
                        rush_service: searchParamsMemo.rushService,
                        eco_friendly: searchParamsMemo.ecoFriendly,
                        subcategory_id: searchParamsMemo.subcategoryId,
                        page_size: 24,
                    }),
                ]);
                
                if (signal.aborted) return;
                
                setMainCategoryCount(mainCategoryResults.count);
                setSearchResults(productResults);
            } catch (err) {
                if (signal.aborted) return;
                
                setError(err instanceof Error ? err.message : 'Failed to fetch category products');
                console.error('Error fetching category products:', err);
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchCategoryAndProducts();
        
        // Cleanup: abort request on unmount or when dependencies change
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [categorySlug, searchParamsMemo]);

    const page = parseInt(searchParams.get('page') || '1');
    const categoryName = category?.name || categorySlug;
    const seoTitle = searchResults?.meta?.seo?.title || 
        `${categoryName} Products` + 
        (page > 1 ? ` - Page ${page}` : '');
    const seoDescription = searchResults?.meta?.seo?.description || 
        (searchResults ? `Browse ${searchResults.count.toLocaleString('en-US')} ${categoryName} products` : `Browse our ${categoryName} product catalog`);
    const canonicalUrl = searchResults?.meta?.seo?.canonical_url || '';

    return (
        <>
            <SEOHead
                title={`${seoTitle} | RELYmedia`}
                description={seoDescription}
                canonicalUrl={canonicalUrl}
                nextUrl={searchResults?.next}
                prevUrl={searchResults?.previous}
            />
            <Suspense fallback={
                <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading header...</div>
                    </div>
                </div>
            }>
                <Header/>
            </Suspense>
            <MainBanner productCount={mainCategoryCount} categoryName={category?.name} />
            {loading && (
                <div className="py-[50px] pb-[75px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading category products...</div>
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
            {!loading && !error && (
                <ProductGrid 
                    searchResults={searchResults}
                    loading={false}
                    error={null}
                    category={category}
                />
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
            <CategoryProductsContent />
        </Suspense>
    );
}

export default Page;




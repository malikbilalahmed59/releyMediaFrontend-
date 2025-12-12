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
import { getCategoryCountById, getCategoryCountBySlug } from '@/lib/utils/categoryCache';

function CategoryProductsContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const categorySlug = params.categorySlug as string;
    
    const [category, setCategory] = useState<Category | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    // Start with null to ensure server/client hydration match
    const [mainCategoryCount, setMainCategoryCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Preserve category name to prevent banner flashing during loading
    const [categoryName, setCategoryName] = useState<string | null>(null);
    
    // Initialize count from cache after mount (client-side only) to prevent banner text change
    useEffect(() => {
        if (categorySlug && typeof window !== 'undefined') {
            const cachedCount = getCategoryCountBySlug(categorySlug);
            if (cachedCount !== null) {
                setMainCategoryCount(cachedCount);
            }
        }
    }, [categorySlug]);

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
            // Don't clear categoryName immediately - keep it until new category loads
            
            try {
                // First, find the category by slug
                const foundCategory = await getCategoryBySlug(categorySlug);
                
                if (signal.aborted) return;
                
                if (!foundCategory) {
                    setError('Category not found');
                    setLoading(false);
                    // Clear category name if category not found
                    setCategoryName(null);
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('currentCategoryName');
                    }
                    return;
                }
                
                setCategory(foundCategory);
                // Set category name immediately to prevent banner flashing
                setCategoryName(foundCategory.name);
                
                // Store category name in sessionStorage for banner preservation when navigating to product pages
                if (typeof window !== 'undefined' && foundCategory.name) {
                    sessionStorage.setItem('currentCategoryName', foundCategory.name);
                }
                
                // Get count from cache IMMEDIATELY and set it synchronously to prevent banner text change
                const cachedCount = getCategoryCountById(foundCategory.id);
                if (cachedCount !== null) {
                    // Set count immediately from cache - this prevents the banner from showing default count
                    setMainCategoryCount(cachedCount);
                }
                
                // Fetch products (always needed)
                const productResults = await getProductsByCategory(foundCategory.id, {
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
                });
                
                if (signal.aborted) return;
                
                // If we didn't have cached count, fetch it now (but don't update if we already set it from cache)
                if (cachedCount === null) {
                    // If no cached count, fetch it separately (for banner display)
                    try {
                        const countResults = await getProductsByCategory(foundCategory.id, {
                            page: 1,
                            page_size: 1, // We only need the count
                        });
                        if (!signal.aborted) {
                            setMainCategoryCount(countResults.count);
                        }
                    } catch (countError) {
                        // Use count from product results as fallback
                        if (!signal.aborted) {
                            setMainCategoryCount(productResults.count);
                        }
                    }
                }
                // If cachedCount was not null, we already set it above, so no need to update again
                
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

    // Cleanup: Clear sessionStorage when navigating away from category page
    useEffect(() => {
        return () => {
            // Only clear if we're actually leaving (component unmounting)
            // This will be called when navigating to a different route
            if (typeof window !== 'undefined') {
                // Use a small delay to allow navigation to complete, then check if we're still on category page
                const timer = setTimeout(() => {
                    // Check if we're still on a category page
                    const currentPath = window.location.pathname;
                    if (!currentPath.startsWith('/products/category/')) {
                        sessionStorage.removeItem('currentCategoryName');
                    }
                }, 100);
                
                // Store timer reference for cleanup
                // Note: This cleanup runs when component unmounts, so we need to clear the timer
                // But since we're in cleanup already, we'll let the timer run
                // The check inside will prevent clearing if we're still on a category page
            }
        };
    }, []);

    const page = parseInt(searchParams.get('page') || '1');
    // Use state categoryName if available, otherwise fall back to category?.name or slug
    const displayCategoryName = categoryName || category?.name || categorySlug;
    const seoTitle = searchResults?.meta?.seo?.title || 
        `${displayCategoryName} Products` + 
        (page > 1 ? ` - Page ${page}` : '');
    const seoDescription = searchResults?.meta?.seo?.description || 
        (searchResults ? `Browse ${searchResults.count.toLocaleString('en-US')} ${displayCategoryName} products` : `Browse our ${displayCategoryName} product catalog`);
    const canonicalUrl = searchResults?.meta?.seo?.canonical_url || '';

    return (
        <>
            <SEOHead
                title={`${seoTitle} - RELYmedia - Promotional Products`}
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
            <MainBanner productCount={mainCategoryCount} categoryName={categoryName || category?.name} />
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




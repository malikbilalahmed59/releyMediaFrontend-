'use client';
import React, { useEffect, useState, Suspense } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            if (!categorySlug) return;
            
            setLoading(true);
            setError(null);
            
            try {
                // First, find the category by slug
                const foundCategory = await getCategoryBySlug(categorySlug);
                
                if (!foundCategory) {
                    setError('Category not found');
                    setLoading(false);
                    return;
                }
                
                setCategory(foundCategory);
                
                // Now fetch products for this category
                const page = parseInt(searchParams.get('page') || '1');
                const ordering = (searchParams.get('ordering') as any) || 'newest';
                const minPrice = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined;
                const maxPrice = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined;
                const minQuantity = searchParams.get('min_quantity') ? parseInt(searchParams.get('min_quantity')!) : undefined;
                const maxQuantity = searchParams.get('max_quantity') ? parseInt(searchParams.get('max_quantity')!) : undefined;
                const brand = searchParams.get('brand') || undefined;
                const closeout = searchParams.get('closeout') === 'true' ? true : searchParams.get('closeout') === 'false' ? false : undefined;
                const usaMade = searchParams.get('usa_made') === 'true' ? true : searchParams.get('usa_made') === 'false' ? false : undefined;
                const bestSelling = searchParams.get('best_selling') === 'true' ? true : searchParams.get('best_selling') === 'false' ? false : undefined;
                const rushService = searchParams.get('rush_service') === 'true' ? true : searchParams.get('rush_service') === 'false' ? false : undefined;
                const ecoFriendly = searchParams.get('eco_friendly') === 'true' ? true : searchParams.get('eco_friendly') === 'false' ? false : undefined;
                const subcategoryId = searchParams.get('subcategory_id') ? parseInt(searchParams.get('subcategory_id')!) : undefined;
                
                const results = await getProductsByCategory(foundCategory.id, {
                    page,
                    ordering: ordering as any,
                    min_price: minPrice,
                    max_price: maxPrice,
                    min_quantity: minQuantity,
                    max_quantity: maxQuantity,
                    brand,
                    closeout,
                    usa_made: usaMade,
                    best_selling: bestSelling,
                    rush_service: rushService,
                    eco_friendly: ecoFriendly,
                    subcategory_id: subcategoryId,
                    page_size: 24,
                });
                
                setSearchResults(results);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch category products');
                console.error('Error fetching category products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndProducts();
    }, [categorySlug, searchParams]);

    const page = parseInt(searchParams.get('page') || '1');
    const categoryName = category?.name || categorySlug;
    const seoTitle = searchResults?.meta?.seo?.title || 
        `${categoryName} Products` + 
        (page > 1 ? ` - Page ${page}` : '');
    const seoDescription = searchResults?.meta?.seo?.description || 
        (searchResults ? `Browse ${searchResults.count} ${categoryName} products` : `Browse our ${categoryName} product catalog`);
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
            <Header/>
            <MainBanner/>
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
                <Header/>
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




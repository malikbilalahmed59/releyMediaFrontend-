'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import MainBanner from "@/components/Site/Main_Banner";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import ProductGrid from "@/components/Site/ProductGrid";
import SEOHead from "@/components/Site/SEOHead";
import { searchProducts, getCategories, type SearchResponse } from '@/lib/api/catalog';
import { createSlug } from '@/lib/utils/slug';

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        // Handle backward compatibility: redirect old category_id URLs to slug-based URLs
        const categoryId = searchParams.get('category_id');
        if (categoryId) {
            const redirectToSlug = async () => {
                setRedirecting(true);
                try {
                    const categoriesData = await getCategories();
                    const category = categoriesData.categories?.find(cat => cat.id.toString() === categoryId);
                    if (category) {
                        const slug = createSlug(category.name);
                        // Preserve other query params
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('category_id');
                        const queryString = params.toString();
                        router.replace(`/products/category/${slug}${queryString ? `?${queryString}` : ''}`);
                        return;
                    }
                } catch (err) {
                    console.error('Error redirecting category:', err);
                }
                setRedirecting(false);
            };
            redirectToSlug();
            return;
        }

        const query = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const ordering = (searchParams.get('ordering') as any) || 'best_match';
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

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Use search endpoint (category pages are now handled by /products/category/[slug])
                const results = await searchProducts({
                    q: query || undefined,
                    page,
                    ordering,
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
                    page_size: 24,
                });
                setSearchResults(results);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch products');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!redirecting) {
            fetchProducts();
        }
    }, [searchParams, redirecting, router]);

    // Generate SEO metadata from search results
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const seoTitle = searchResults?.meta?.seo?.title || 
        (query ? `Search Results for '${query}'` : 'Products') + 
        (page > 1 ? ` - Page ${page}` : '');
    const seoDescription = searchResults?.meta?.seo?.description || 
        (searchResults ? `Found ${searchResults.count} products` : 'Browse our product catalog');
    const canonicalUrl = searchResults?.meta?.seo?.canonical_url || '';

    if (redirecting) {
        return (
            <>
                <Header/>
                <MainBanner/>
                <div className="py-[50px] pb-[75px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Redirecting...</div>
                    </div>
                </div>
                <Footer/>
            </>
        );
    }

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
            <ProductGrid 
                searchResults={searchResults}
                loading={loading}
                error={error}
            />
            <Customer_Feedback/>
            <Client_Logo/>
            <Footer/>
        </>
    );
}

export const dynamic = 'force-dynamic';

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
            <ProductsContent />
        </Suspense>
    );
}

export default Page;
import React, { Suspense } from 'react';
import FilterSidebar from "@/components/Site/FilterSidebar";
import BuyCart from "@/components/Site/Buy_Cart";
import SortByFilter from "@/components/Site/SortByFilter";
import Pagination from "@/components/Site/Pagination";
import { type SearchResponse, type Category } from '@/lib/api/catalog';

interface ProductGridProps {
    searchResults?: SearchResponse | null;
    loading?: boolean;
    error?: string | null;
    category?: Category | null;
}

function ProductGrid({ searchResults, loading, error, category }: ProductGridProps) {
    // Extract category data if it's a CategoryProductsResponse, otherwise use passed category
    const categoryData = (searchResults as any)?.category || category;
    
    return (
        <div className="py-[50px] pb-[75px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="grid xl:grid-cols-[24.5%_74%] lg:grid-cols-[30.5%_67.5%] sm:grid-cols-[41.5%_55.5%] gap-[17px]">
                    <div><FilterSidebar categoryData={categoryData} /></div>
                    <div className="">
                        <div className="mb-[30px]">
                            <Suspense fallback={<div className="flex justify-end">Loading...</div>}>
                                <SortByFilter/>
                            </Suspense>
                        </div>
                        {loading && (
                            <div className="text-center py-[50px]">
                                <p className="text-[18px]">Loading products...</p>
                            </div>
                        )}
                        {error && (
                            <div className="text-center py-[50px]">
                                <p className="text-red-500 text-[18px]">Error: {error}</p>
                            </div>
                        )}
                        {!loading && !error && (
                            <>
                                <BuyCart products={searchResults?.results || []} totalCount={searchResults?.count || 0} category={categoryData} />
                                {searchResults && searchResults.total_pages > 1 && (
                                    <Pagination
                                        currentPage={searchResults.current_page}
                                        totalPages={searchResults.total_pages}
                                        totalCount={searchResults.count}
                                        pageSize={searchResults.page_size}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductGrid;
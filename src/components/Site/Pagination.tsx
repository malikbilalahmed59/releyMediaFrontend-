'use client';
import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}

export default function Pagination({ currentPage, totalPages, totalCount, pageSize }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const changePage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        // Preserve the current pathname (e.g., /products/category/apparel)
        router.push(`${pathname}?${params.toString()}`);
    };

    // Calculate page range to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="mt-[40px] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[14px] text-[#666]">
                Showing {startItem} to {endItem} of {totalCount} products
            </div>
            
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-[38px] px-4 border border-[#E5E5E5] rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={`ellipsis-${index}`} className="px-2 text-[#666]">
                                    ...
                                </span>
                            );
                        }
                        
                        const pageNum = page as number;
                        const isActive = pageNum === currentPage;
                        
                        return (
                            <Button
                                key={pageNum}
                                variant={isActive ? "default" : "outline"}
                                onClick={() => changePage(pageNum)}
                                className={`h-[38px] min-w-[38px] px-3 rounded-[10px] ${
                                    isActive 
                                        ? 'bg-accent text-white border-accent' 
                                        : 'border border-[#E5E5E5] hover:bg-gray-50'
                                }`}
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>
                
                <Button
                    variant="outline"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-[38px] px-4 border border-[#E5E5E5] rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}







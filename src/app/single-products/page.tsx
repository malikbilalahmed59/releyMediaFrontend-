'use client';
import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function RedirectContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productId = searchParams.get('product_id');

    useEffect(() => {
        // Redirect old query param format to new SEO-friendly format
        if (productId) {
            router.replace(`/single-products/${productId}`);
        } else {
            // If no product_id, redirect to products page
            router.replace('/products');
        }
    }, [productId, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">Redirecting...</div>
        </div>
    );
}

export const dynamic = 'force-dynamic';

function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        }>
            <RedirectContent />
        </Suspense>
    );
}

export default Page;
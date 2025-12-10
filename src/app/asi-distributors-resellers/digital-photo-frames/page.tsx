'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Redirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/products/digital-photo-frames');
    }, [router]);
    
    return null;
}

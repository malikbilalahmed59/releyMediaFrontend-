'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Redirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/products/mp3-players');
    }, [router]);
    
    return null;
}

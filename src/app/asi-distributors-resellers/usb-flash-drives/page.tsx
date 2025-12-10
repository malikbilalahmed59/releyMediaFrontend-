'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Redirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/products/usb-flash-drives-2');
    }, [router]);
    
    return null;
}

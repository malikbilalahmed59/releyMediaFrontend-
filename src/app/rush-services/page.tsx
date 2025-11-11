'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Redirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/24-hour-rush-service');
    }, [router]);
    
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
}




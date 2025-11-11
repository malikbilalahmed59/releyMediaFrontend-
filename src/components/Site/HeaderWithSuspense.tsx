'use client';
import React, { Suspense } from 'react';
import Header from './Header';

export default function HeaderWithSuspense() {
    return (
        <Suspense fallback={
            <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="text-center">Loading header...</div>
                </div>
            </div>
        }>
            <Header />
        </Suspense>
    );
}


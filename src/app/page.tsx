import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import HomeContent from './HomeContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'RELYmedia - Promotional Products',
  description: 'RELYmedia offers innovative promotional products and exceptional service. Browse our catalog of custom promotional items.',
};

export default function Home() {
  return (
    <Suspense fallback={
      <>
        <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="text-center">Loading header...</div>
            </div>
        </div>
        <div className="py-[50px]">
          <div className="wrapper 2xl:px-0 px-[15px]">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </>
    }>
      <HomeContent />
    </Suspense>
  );
}


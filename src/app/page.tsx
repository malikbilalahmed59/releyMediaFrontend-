'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import MainBanner from "@/components/Site/Main_Banner";
import Product_Categories from "@/components/Site/Product_Categories";
import BestSelling from "@/components/Site/Best_Selling";
import Services from "@/components/Site/Services";
import Search_Terms from "@/components/Site/Search_Terms";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import Client_Logo from "@/components/Site/Client_Logo";
import Footer from "@/components/Site/Footer";
import { useCategoryCache } from "@/hooks/useCategoryCache";

export const dynamic = 'force-dynamic';

function HomeContent() {
  // Fetch and cache categories with counts on first page load
  useCategoryCache();

  return (
      <>
          <Suspense fallback={
              <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                  <div className="wrapper 2xl:px-0 px-[15px]">
                      <div className="text-center">Loading header...</div>
                  </div>
              </div>
          }>
              <Header/>
          </Suspense>
          <MainBanner/>
          <Product_Categories/>
          <BestSelling/>
          <Services/>
          {/* <Search_Terms/> */}
          <Customer_Feedback/>
          <Client_Logo/>
          <Footer/>
      </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <>
        <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="text-center">Loading header...</div>
            </div>
        </div>
        <MainBanner/>
        <div className="py-[50px]">
          <div className="wrapper 2xl:px-0 px-[15px]">
            <div className="text-center">Loading...</div>
          </div>
        </div>
        <Footer/>
      </>
    }>
      <HomeContent />
    </Suspense>
  );
}


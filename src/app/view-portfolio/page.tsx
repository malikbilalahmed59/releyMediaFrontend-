'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import Portfolio_Items from "@/components/Site/Portfolio_Items";

export const dynamic = 'force-dynamic';

function PortfolioContent() {
    return (
        <>
            <Header/>
            <MainBanner/>
            <Portfolio_Items/>
            <Customer_Feedback/>
            <Client_Logo/>
            <Footer/>
        </>

    );
}

function Page() {
    return (
        <Suspense fallback={
            <>
                <Header/>
                <MainBanner/>
                <div className="py-[50px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
                <Footer/>
            </>
        }>
            <PortfolioContent />
        </Suspense>
    );
}

export default Page;
'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import MainBanner from "@/components/Site/Main_Banner";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import Checkout from "@/components/Site/Checkout";
import CheckoutForm from "@/components/Site/CheckoutForm";

export const dynamic = 'force-dynamic';

function CheckoutContent() {
    return (
        <>
            <Header/>
            <MainBanner/>
            <CheckoutForm/>
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
            <CheckoutContent />
        </Suspense>
    );
}

export default Page;
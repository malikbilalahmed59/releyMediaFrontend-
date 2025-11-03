'use client';
import React from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import MainBanner from "@/components/Site/Main_Banner";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import ProductGrid from "@/components/Site/ProductGrid";

function Page() {
    return (
        <>
            <Header/>
            <MainBanner/>
            <ProductGrid/>
            <Customer_Feedback/>
            <Client_Logo/>
            <Footer/>
        </>

    );
}

export default Page;
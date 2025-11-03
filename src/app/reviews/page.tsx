'use client';
import React from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";
import Reviews from "@/components/Site/Reviews";

function Page() {

    return (
        <>
            <Header />
            <MainBanner />
            <Reviews/>
            <Footer />
        </>
    );
}

export default Page;

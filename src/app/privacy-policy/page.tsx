'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";

export const dynamic = 'force-dynamic';

function PrivacyContent() {
    const privacyData = {
        title: "Privacy Policy",
        descriptionLeft:
            "RELYmedia is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully.",
        descriptionRight:
            "We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us. We also automatically collect certain information about your device and how you interact with our website. We use this information to provide, maintain, and improve our services.",
        buttonText: "",
        buttonLink: "#",
    };

    return (
        <>
            <Header />
            <MainBanner />
            <PortfolioDataSection data={privacyData} />
            <Customer_Feedback />
            <Client_Logo />
            <Footer />
        </>
    );
}

function Page() {
    return (
        <Suspense fallback={
            <>
                <Header />
                <MainBanner />
                <div className="py-[50px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
                <Footer />
            </>
        }>
            <PrivacyContent />
        </Suspense>
    );
}

export default Page;


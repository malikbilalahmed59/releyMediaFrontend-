'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";

export const dynamic = 'force-dynamic';

function USBFlashDrivesContent() {
    const portfolioData = {
        title: "USB Flash Drives",
        fullContent: `
            <p>We carry an endless range of styles, colors, and packaging with branded flash drives starting at 64MB up to 256GB. From promotional thumb drives printed with your logo, to personalized jump drives custom molded to your specifications, we have the solutions to meet any need. At RELYmedia, we have over 600+ unique models including a wide variety of swivel, business card, pen, wristband, wood, and leather designs.</p>
            <p>Our bulk USB flash drives are made from the highest quality components including grade A flash chips. Same day and 2-day service are available at prices cheaper than our competition can match. We also offer data services including autorun creation, password protection, serialization, and secure partitions for all wholesale USB drives.</p>
        `,
        buttonText: "",
        buttonLink: "#",
    };

    return (
        <>
            <Suspense fallback={
                <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading header...</div>
                    </div>
                </div>
            }>
                <Header />
            </Suspense>
            <MainBanner />
            <PortfolioDataSection data={portfolioData} />
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
                <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading header...</div>
                    </div>
                </div>
                <MainBanner />
                <div className="py-[50px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
                <Footer />
            </>
        }>
            <USBFlashDrivesContent />
        </Suspense>
    );
}

export default Page;









'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";

export const dynamic = 'force-dynamic';

function DigitalPhotoFramesContent() {
    const portfolioData = {
        title: "Digital Photo Frames",
        fullContent: `
            <p>We carry an endless range of styles and sizes with LCD panels from 1.1 inch to 32 inches. All of our digital photo frames are available in a wide range of colors and packaging. We also offer multiple logo imprint options including color printing, laser engraving, and embossing. Custom color matching is also available on some models.</p>
            <p>Whether you are marketing to customers or providing gifts to employees, give them something they actually want and will keep for years to come. Our digital frames are built to last and made from only the highest quality components. Same day and 2-day service are available on most models at wholesale prices other companies cannot match.</p>
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
            <DigitalPhotoFramesContent />
        </Suspense>
    );
}

export default Page;








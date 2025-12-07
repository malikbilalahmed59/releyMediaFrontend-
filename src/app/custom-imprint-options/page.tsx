'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";

export const dynamic = 'force-dynamic';

function ImprintOptionsContent() {
    const portfolioData = {
        title: "Imprint Options",
        fullContent: `
            <p>We offer multiple imprint options for each of most of our products. The most common method is screen or pad printing. We can match your logo to the exact Pantone color with solid color printing or use 4-color process printing for images, blends, and gradients.</p>
            <p>Some other options include laser engraving for metal items and heat stamping for leather products. Colors can be added to the engraving and stamping on most models. Embossing is also available which creates a raised effect for your logo.</p>
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
            {/* ✅ pass the data here */}
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
            <ImprintOptionsContent />
        </Suspense>
    );
}

export default Page;

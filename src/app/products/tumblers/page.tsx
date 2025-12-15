'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";

export const dynamic = 'force-dynamic';

function StainlessTumblersContent() {
    const portfolioData = {
        title: "Stainless Tumblers",
        fullContent: `
            <p>We carry an endless range of tumbler styles, colors, and packaging with sizes ranging from 10 oz to 40 oz. From promotional coffee mugs printed with your logo, to personalized engraved tumblers, we have the solutions to meet any need at wholesale prices other companies cannot match. Our stainless steel tumblers are double wall copper vacuum insulated and made from the highest quality components, making these the ideal travel cups to keep your drinks hot or cold.</p>
            <p>Most tumbler suppliers buy from importers, adding an unnecessary third party to the supply chain. This results in higher costs, longer lead times, and lower quality control. At RELYmedia, we directly manufacture all of the tumblers we sell, enabling us to offer lower bulk prices, higher quality, and faster turnaround times.</p>
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
            <StainlessTumblersContent />
        </Suspense>
    );
}

export default Page;









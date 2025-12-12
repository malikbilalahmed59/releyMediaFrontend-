'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";
import SEOHead from "@/components/Site/SEOHead";

export const dynamic = 'force-dynamic';

function PortfolioContent() {
    const portfolioData = {
        title: "Portfolio",
        descriptionLeft:
            "No matter what your needs are, RELYmedia has the capabilities and experience to effectively meet them. From manufacturers to retailers, RELYmedia services companies in every sector. We also work with many non-profit organizations and governmental entities.",
        descriptionRight:
            "We have the capacity to handle orders of any size and the expertise to handle even the most complicated projects. For examples of our work, please click below to view our portfolio. Physical samples are available upon request.",
        buttonText: "View Portfolio",
        buttonLink: "#", // Replace with your portfolio URL
    };

    return (
        <>
            <SEOHead
                title="Portfolio - RELYmedia - Promotional Products"
                description="View RELYmedia's portfolio of promotional products. We handle orders of any size and work with companies in every sector."
            />
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
            <PortfolioContent />
        </Suspense>
    );
}

export default Page;

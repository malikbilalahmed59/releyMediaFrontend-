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

function RushServiceContent() {
    const portfolioData = {
        title: "Rush Services",
        descriptionLeft:
            "<strong>At RELYmedia,</strong> we are able to complete projects in less time than our competition. Since we have our own production facilities, we determine the schedule and have the flexibility to adjust other jobs to ensure your deadline is met.",
        descriptionRight:
            "Most companies have a very limited selection of products available for rush projects. We offer nearly all of our items on 2-day service, including printing, at a fraction of the cost our competitors charge. For more urgent projects, we also offer same day and 1-day service on many products.",
        buttonText: "",
        buttonLink: "#", // Replace with your portfolio URL
    };

    return (
        <>
            <SEOHead
                title="Rush Services - RELYmedia - Promotional Products"
                description="Get your promotional products fast with RELYmedia's rush services. We offer 2-day, 1-day, and same-day service on many products at competitive prices."
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
            <RushServiceContent />
        </Suspense>
    );
}

export default Page;

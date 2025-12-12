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

function AboutContent() {
    const portfolioData = {
        title: "About Us",
        fullContent: `
            <p>RELYmedia provides a wide variety of products and services to help organizations communicate information and build their brands. Our philosophy has always been to focus first and foremost on service and quality.</p>
            <p>What truly separates RELYmedia from the competition is our industry-leading customer service and attention to detail. Every company promises great service but no company can match the service RELYmedia delivers. We guarantee to meet any deadline, provide unmatched turnaround times, and have a responsive and knowledgeable staff.</p>
            <p>In addition to providing exceptional service, our commitment to quality is never-ending and we guarantee your complete satisfaction. Choose RELYmedia and experience the difference. No company works harder to earn your business.</p>
        `,
        buttonText: "",
        buttonLink: "#",
    };

    return (
        <>
            <SEOHead
                title="About Us - RELYmedia - Promotional Products"
                description="Learn about RELYmedia's commitment to providing innovative promotional products and exceptional service. We focus on service, quality, and meeting your deadlines."
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
            <AboutContent />
        </Suspense>
    );
}

export default Page;

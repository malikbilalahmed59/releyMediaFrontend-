'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/Site/SEOHead";

export const dynamic = 'force-dynamic';

function ResellersContent() {
    const portfolioData = {
        title: "ASI Distributors & Other Resellers",
        fullContent: `
            <p>RELYmedia is a manufacturer servicing promotional products distributors, CD/DVD replicators/brokers, and other resellers across the globe. We have very aggressive reseller pricing and a simple, streamlined ordering process.</p>
            <p>We make quoting easy by providing resellers with a comprehensive price grid and blind PDF catalog that can be sent to customers. Orders can be placed via email and there are no cumbersome forms to fill out. To learn more about being a reseller for our products, please contact us.</p>
        `,
        descriptionLeft: "",
        descriptionRight: "",
        buttonText: "",
        buttonLink: "#",
    };

    const productPages = [
        { name: "USB Flash Drives", url: "/products/usb-flash-drives-2" },
        { name: "Stainless Tumblers", url: "/products/tumblers" },
        { name: "Stainless Bottles", url: "/products/bottles" },
        { name: "MP3 Players", url: "/products/mp3-players" },
        { name: "Digital Photo Frames", url: "/products/digital-photo-frames" },
    ];

    return (
        <>
            <SEOHead
                title="ASI Distributors & Other Resellers - RELYmedia - Promotional Products"
                description="RELYmedia offers aggressive reseller pricing and streamlined ordering for ASI distributors and other resellers. Get comprehensive price grids and blind PDF catalogs."
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
            {/* Product Links Section */}
            <section className="py-[40px] pb-[60px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-4">
                            {productPages.map((page, index) => (
                                <Button
                                    key={index}
                                    asChild
                                    variant="secondary"
                                    className="h-auto font-semibold text-[16px] py-[12px] px-[24px] rounded-[12px] transition"
                                >
                                    <Link href={page.url}>
                                        {page.name}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
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
            <ResellersContent />
        </Suspense>
    );
}

export default Page;

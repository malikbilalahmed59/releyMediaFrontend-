'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";

function SiteMapContent() {
    const sitemapLinks = [
        {
            title: "Main Pages",
            links: [
                { label: "Home", url: "/" },
                { label: "Products", url: "/products" },
                { label: "About Us", url: "/about-us" },
                { label: "Contact Us", url: "/contact-us" },
            ],
        },
        {
            title: "Services",
            links: [
                { label: "ASI Distributors & Other Resellers", url: "/asi-distributors-resellers" },
                { label: "Custom Colors", url: "/custom-colors" },
                { label: "Custom Flash Drives", url: "/custom-flash-drives" },
                { label: "Data Services", url: "/custom-data-services" },
                { label: "Imprint Options", url: "/custom-imprint-options" },
                { label: "24 Hour Rush Service", url: "/24-hour-rush-service" },
            ],
        },
        {
            title: "Legal",
            links: [
                { label: "Terms of Use", url: "/terms-of-use" },
                { label: "Privacy Policy", url: "/privacy-policy" },
            ],
        },
        {
            title: "Account",
            links: [
                { label: "Sign In", url: "/signin" },
                { label: "Sign Up", url: "/signup" },
                { label: "Profile", url: "/profile" },
                { label: "Cart", url: "/cart" },
            ],
        },
    ];

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
            <section className="py-[80px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <h1 className="text-[36px] leading-[36px] font-bold mb-[40px] text-center">Sitemap</h1>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sitemapLinks.map((section, index) => (
                            <div key={index}>
                                <h2 className="text-[20px] font-bold mb-4">{section.title}</h2>
                                <ul className="space-y-2">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link 
                                                href={link.url} 
                                                className="text-[15px] text-[#666] hover:text-accent transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Customer_Feedback />
            <Client_Logo />
            <Footer />
        </>
    );
}

export const dynamic = 'force-dynamic';

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
                <section className="py-[80px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading...</div>
                    </div>
                </section>
                <Footer />
            </>
        }>
            <SiteMapContent />
        </Suspense>
    );
}

export default Page;


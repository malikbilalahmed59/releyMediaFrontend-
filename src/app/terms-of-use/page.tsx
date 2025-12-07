'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";

export const dynamic = 'force-dynamic';

function TermsContent() {
    const termsData = {
        title: "Terms of Use",
        fullContent: `
            <p>Certain restrictions apply to our product warranty, price match guarantee, and rush turnaround. Please contact us for specific details regarding these polices as they vary from product to product.</p>
            <p>The following terms apply to your use of this website:</p>
            <p>The information contained on this website is provided "as is," without any warranties or representations, express or implied, including that the information provided is complete, correct or up-to-date. RELYmedia may review this website and make changes or deletions at any time without advance notice. Under no circumstances does the information on this website, including, but not limited to, any pricing, constitute an offer to sell a product or service.</p>
            <p>To the maximum extent permitted by law, RELYmedia disclaims liability for any and all costs and damages resulting directly or indirectly from your use of or reliance on this website, including but not limited to direct or consequential, special, indirect, or incidental damages.</p>
            <p>Certain elements (including but not limited to trademarks, service marks, logos and copyrighted material) shown on this website are protected by the intellectual property rights of RELYmedia. You agree to use this website only for your personal, non-commercial use and not to copy, modify, or retransmit in any form the contents of this website to any third party without RELYmedia express advance written permission.</p>
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
            <PortfolioDataSection data={termsData} />
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
            <TermsContent />
        </Suspense>
    );
}

export default Page;


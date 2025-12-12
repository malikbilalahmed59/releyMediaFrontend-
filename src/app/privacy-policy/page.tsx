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

function PrivacyContent() {
    const privacyData = {
        title: "Privacy Policy",
        fullContent: `
            <p>RELYmedia is committed to protecting your privacy. We have internal policies in place to protect the privacy of the information we have about our individual consumers. We are continually working to find better ways to maximize the privacy and security of this information when servicing our customers.</p>
            <p>Keeping the personal information we collect about you secure is one of our most important responsibilities. RELYmedia handles personal information with care and only accesses information about you when needed to complete your quote, purchase, and otherwise meet your needs. We may also access information about you when responding to your request for information.</p>
            <p>We safeguard information according to established security procedures and we continually assess new technology for protecting information. Our employees are trained to understand and comply with these information principles. In the course of doing business, we collect and use various types of information, such as information available from public records and market research, as well as information you provide to us. RELYmedia may provide marketing statistics to reputable third parties or use your feedback for marketing purposes without disclosing any personally identifying information.</p>
            <p>If you have concerns about our privacy practices, please contact us.</p>
        `,
        buttonText: "",
        buttonLink: "#",
    };

    return (
        <>
            <SEOHead
                title="Privacy Policy - RELYmedia - Promotional Products"
                description="Read RELYmedia's privacy policy to understand how we protect and handle your personal information and data security."
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
            <PortfolioDataSection data={privacyData} />
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
            <PrivacyContent />
        </Suspense>
    );
}

export default Page;


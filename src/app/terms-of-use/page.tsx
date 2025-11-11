'use client';
import React from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";

function Page() {
    const termsData = {
        title: "Terms of Use",
        descriptionLeft:
            "Welcome to RELYmedia. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        descriptionRight:
            "RELYmedia reserves the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Use on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms of Use.",
        buttonText: "",
        buttonLink: "#",
    };

    return (
        <>
            <Header />
            <MainBanner />
            <PortfolioDataSection data={termsData} />
            <Customer_Feedback />
            <Client_Logo />
            <Footer />
        </>
    );
}

export default Page;


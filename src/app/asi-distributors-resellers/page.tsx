'use client';
import React from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import PortfolioDataSection from "@/components/Site/PortfolioDataSection";

function Page() {
    const portfolioData = {
        title: "ASI Distributors & Other Resellers\n",
        descriptionLeft:
            "RELYmedia is a manufacturer servicing promotional products distributors, CD/DVD replicators/brokers, and other resellers across the globe. We have very aggressive reseller pricing and a simple, streamlined ordering process. We make quoting easy by providing resellers with a comprehensive price grid and blind",
        descriptionRight:
            "PDF catalog that can be sent to customers. Orders can be placed via email and there are no cumbersome forms to fill out. To learn more about being a reseller for our products, please contact us.",
        buttonText: "",
        buttonLink: "#", // Replace with your portfolio URL
    };

    return (
        <>
            <Header />
            <MainBanner />
            {/* ✅ pass the data here */}
            <PortfolioDataSection data={portfolioData} />
            <Customer_Feedback />
            <Client_Logo />
            <Footer />
        </>
    );
}

export default Page;

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

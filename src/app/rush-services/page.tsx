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

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
        title: "About Us",
        descriptionLeft:
            "RELYmedia provides a wide variety of products and services to help organizations communicate information and build their brands. Our philosophy has always been to focus first and foremost on service and quality. What truly separates RELYmedia from the competition is our industry-leading customer service and attention to detail. Every company promises great service but no company can match the service ",
        descriptionRight:
            "RELYmedia delivers. We guarantee to meet any deadline, provide unmatched turnaround times, and have a responsive and knowledgeable staff. In addition to providing exceptional service, our commitment to quality is never-ending and we guarantee your complete satisfaction. Choose RELYmedia and experience the difference. No company works harder to earn your business..",
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

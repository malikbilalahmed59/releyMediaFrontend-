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
        title: "Custom Flash Drives",
        descriptionLeft:
            "In addition to offering over 600 different models, we can also custom design and manufacture flash drives in any shape, size, color, and material. Just tell us your idea and we will create a working sample in one week or less. While other companies offer this service, ",
        descriptionRight:
            "Nobody can match our turnaround times and pricing when it comes to custom flash drives. Most projects take only 1-2 weeks longer than standard orders and the pricing will often times be the same or less than many of our stock drives.\n",
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

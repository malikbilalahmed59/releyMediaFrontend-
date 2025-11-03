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
        title: "Data Services",
        descriptionLeft:
            "Our data services range from simple data preloading to complex encryption and drive partitions. No matter your needs, we have the experience and expertise to deliver your data effectively and securely. Some other services include AES encryption, drive naming, custom icon creation, and unique serialization.Our most common service is the development of autorun scripts,",
        descriptionRight:
            " so that a particular file or website is launched when the flash drive is plugged in.  Another option is to partition the drive so that your content is locked and cannot be removed but the rest of the drive remains usable for the end user. We can also create a secure partition so that data on the drive is accessible only by password.",
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

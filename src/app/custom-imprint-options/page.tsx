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
        title: "Imprint Options",
        descriptionLeft:
            "We offer multiple imprint options for each of most of our products. The most common method is screen or pad printing. We can match your logo to the exact Pantone color with solid color printing or use 4-color process printing for images, blends, and gradients.",
        descriptionRight:
            "Some other options include laser engraving for metal items and heat stamping for leather products. Colors can be added to the engraving and stamping on most models. Embossing is also available which creates a raised effect for your logo.",
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

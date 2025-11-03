'use client';
import React from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import MainBanner from "@/components/Site/Main_Banner";
import Portfolio_Items from "@/components/Site/Portfolio_Items";

function Page() {
    return (
        <>
            <Header/>
            <MainBanner/>
            <Portfolio_Items/>
            <Customer_Feedback/>
            <Client_Logo/>
            <Footer/>
        </>

    );
}

export default Page;
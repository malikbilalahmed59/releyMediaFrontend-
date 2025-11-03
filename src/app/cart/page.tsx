'use client';
import React from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import MainBanner from "@/components/Site/Main_Banner";
import Client_Logo from "@/components/Site/Client_Logo";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import Checkout from "@/components/Site/Checkout";

function Page() {
    return (
        <>
            <Header/>
            <MainBanner/>
            <Checkout/>
            <Client_Logo/>
            <Footer/>
        </>

    );
}

export default Page;
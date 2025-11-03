'use client';
import React from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Link from "next/link";
import ContactPageForm from "@/components/Site/ContactPageForm";

function Page() {
    return (
        <>
            <Header/>
            <section className="relative banner_layers w-[calc(100%-40px)] bg-no-repeat  bg-cover bg-center mx-[20px] rounded-[25px] 2xl:py-[82px] xl:py-[64px] py-[54px] bg-[url(/images/contact-banner.jpg)]">
                <div className="wrapper relative z-10">
                    <div className="text-center text-white">
                        <ul className="flex gap-[5px] items-center justify-center xl:mb-[8px] sm:mb-[5px]">
                            <li className="flex items-center gap-1 justify-center">
                                <Link
                                className="text-[16px] leading-[16px] font-semibold   hover:text-accent"
                                href="/">Home</Link> <span>-</span></li>
                            <li className="flex items-center gap-1  font-black">Contact us</li>
                        </ul>
                        <h1 className="font-bold 2xl:text-[55px] 2xl:leading-[65px] xl:text-[48px] xl:leading-[54px] lg:text-[42px] sm:text-[36px] text-[30px] leading-[38px] sm:leading-[42px] lg:leading-[48px] mb-[11px]">Request
                            a Quote</h1>
                        <p className="font-Regular xl:text-[24px] md:text-[20px] text-[16px] leading-[20px] md:leading-[24px] xl:leading-[32px] lg:w-[76%] w-[90%] mx-auto">Please feel free to contact us with any
                            questions or comments. We also appreciate your feedback and suggestions. Most inquiries are
                            responded to within 10 minutes.</p>
                    </div>
                </div>
            </section>
            <ContactPageForm/>
            <div className="bg-gradient">
                <Client_Logo/>
            </div>
            <Footer/>
        </>

    );
}

export default Page;
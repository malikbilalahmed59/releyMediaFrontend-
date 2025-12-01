'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Link from "next/link";
import ContactPageForm from "@/components/Site/ContactPageForm";
import Signup_Form from "@/components/Site/Signup_Form";
import Signin_Form from "@/components/Site/Signin_Form";

export const dynamic = 'force-dynamic';

function SigninContent() {
    return (
        <>
            <Suspense fallback={
                <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading header...</div>
                    </div>
                </div>
            }>
                <Header/>
            </Suspense>
            <section className="relative banner_layers w-[calc(100%-40px)] bg-no-repeat bg-cover bg-center mx-[20px] rounded-[25px] 2xl:py-[82px] xl:py-[64px] py-[54px] bg-[url(/images/contact-banner.jpg)]">
                <div className="wrapper relative z-10">
                    <div className="text-center text-white">
                        <ul className="flex gap-[5px] items-center justify-center xl:mb-[8px] sm:mb-[5px]">
                            <li className="flex items-center gap-1 justify-center">
                                <Link
                                className="text-[16px] leading-[16px] font-semibold   hover:text-accent"
                                href="/">Home</Link> <span>-</span></li>
                            <li className="flex items-center gap-1  font-black">Sign In</li>
                        </ul>
                        <h1 className="font-bold 2xl:text-[55px] 2xl:leading-[65px] xl:text-[48px] xl:leading-[54px] lg:text-[42px] sm:text-[36px] text-[30px] leading-[38px] sm:leading-[42px] lg:leading-[48px] mb-[11px]">Sign In</h1>
                    </div>
                </div>
            </section>
            <Suspense fallback={<div className="py-[50px] text-center">Loading form...</div>}>
                <Signin_Form/>
            </Suspense>
            <div className="bg-gradient">
                <Client_Logo/>
            </div>
            <Footer/>
        </>

    );
}

function Page() {
    return (
        <Suspense fallback={
            <>
                <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading header...</div>
                    </div>
                </div>
                <div className="py-[50px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
                <Footer/>
            </>
        }>
            <SigninContent />
        </Suspense>
    );
}

export default Page;
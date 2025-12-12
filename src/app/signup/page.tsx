'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Signup_Form from "@/components/Site/Signup_Form";
import SEOHead from "@/components/Site/SEOHead";

export const dynamic = 'force-dynamic';

function SignupContent() {
    return (
        <>
            <SEOHead
                title="Create Account - RELYmedia - Promotional Products"
                description="Create a new account with RELYmedia to access promotional products, track orders, and manage your account."
            />
            <Suspense fallback={
                <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading header...</div>
                    </div>
                </div>
            }>
                <Header/>
            </Suspense>
            <section className="relative banner_layers w-[calc(100%-40px)] bg-no-repeat  bg-cover bg-center mx-[20px] rounded-[25px] 2xl:py-[82px] xl:py-[64px] py-[54px] bg-[url(/images/contact-banner.jpg)]">
                <div className="wrapper relative z-10">
                    <div className="text-center text-white">
                        <h1 className="font-bold 2xl:text-[55px] 2xl:leading-[65px] xl:text-[48px] xl:leading-[54px] lg:text-[42px] sm:text-[36px] text-[30px] leading-[38px] sm:leading-[42px] lg:leading-[48px] mb-[11px]">Create an Account</h1>
                    </div>
                </div>
            </section>
            <Signup_Form/>
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
            <SignupContent />
        </Suspense>
    );
}

export default Page;
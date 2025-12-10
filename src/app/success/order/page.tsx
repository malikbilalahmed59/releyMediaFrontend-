'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

function OrderSuccessContent() {
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
                                className="text-[16px] leading-[16px] font-semibold hover:text-accent"
                                href="/">Home</Link> <span>-</span></li>
                            <li className="flex items-center gap-1 font-black">Order Placed</li>
                        </ul>
                        <h1 className="font-bold 2xl:text-[55px] 2xl:leading-[65px] xl:text-[48px] xl:leading-[54px] lg:text-[42px] sm:text-[36px] text-[30px] leading-[38px] sm:leading-[42px] lg:leading-[48px] mb-[11px]">
                            Order Successful!
                        </h1>
                    </div>
                </div>
            </section>
            <div className="py-[50px] relative">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="flex justify-center items-center">
                        <div className="w-full max-w-[821px] border-[#2525251A] rounded-[12px] sm:px-[24px] px-[18px] md:py-[36px] py-[26px] border text-center">
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full bg-accent/10 p-6">
                                    <CheckCircle2 className="h-16 w-16 text-accent" />
                                </div>
                            </div>
                            <h2 className="lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold mb-4">
                                Your Order Has Been Placed Successfully!
                            </h2>
                            <p className="text-[16px] leading-[24px] text-muted-foreground mb-8">
                                Thank you for your order! We've received your order and will begin processing it shortly. You will receive a confirmation email with your order details and tracking information.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] px-8 cursor-pointer text-foreground"
                                >
                                    <Link href="/">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Home
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] px-8 cursor-pointer"
                                >
                                    <Link href="/profile?tab=orders">
                                        <Package className="mr-2 h-4 w-4" />
                                        View My Orders
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
            <OrderSuccessContent />
        </Suspense>
    );
}

export default Page;


















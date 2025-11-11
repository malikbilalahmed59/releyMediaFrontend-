'use client';
import React, { Suspense } from 'react';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import ProfilePage from "@/components/Site/ProfilePage";

export const dynamic = 'force-dynamic';

function ProfileContent() {
    return (
        <>
            <Header/>
            <ProfilePage/>
            <Footer/>
        </>
    );
}

function Page() {
    return (
        <Suspense fallback={
            <>
                <Header/>
                <div className="py-[50px]">
                    <div className="wrapper 2xl:px-0 px-[15px]">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
                <Footer/>
            </>
        }>
            <ProfileContent />
        </Suspense>
    );
}

export default Page;
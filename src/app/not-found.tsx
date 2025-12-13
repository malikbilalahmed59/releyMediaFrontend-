'use client';
import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from "@/components/Site/Header";
import Footer from "@/components/Site/Footer";
import Client_Logo from "@/components/Site/Client_Logo";
import { getCategories, type Category } from '@/lib/api/catalog';
import { createSlug } from '@/lib/utils/slug';

export const dynamic = 'force-dynamic';

function NotFoundContent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Top sections (Main content)
    const topSections = [
        {
            title: "Main Pages",
            links: [
                { label: "Home", url: "/" },
                { label: "Products", url: "/products" },
                { label: "About Us", url: "/about-us" },
                { label: "Contact Us", url: "/contact-us" },
            ],
        },
        {
            title: "Services",
            links: [
                { label: "ASI Distributors", url: "/asi-distributors-resellers" },
                { label: "Custom Colors", url: "/custom-colors" },
                { label: "Custom Flash Drives", url: "/custom-flash-drives" },
                { label: "Data Services", url: "/custom-data-services" },
                { label: "Imprint Options", url: "/custom-imprint-options" },
                { label: "Packaging and Distribution", url: "/packaging-and-distribution" },
                { label: "24 Hour Rush Service", url: "/24-hour-rush-service" },
            ],
        },
    ];

    // Bottom sections (Legal, Account, etc.)
    const bottomSections = [
        {
            title: "Legal & Policies",
            links: [
                { label: "Terms of Use", url: "/terms-of-use" },
                { label: "Privacy Policy", url: "/privacy-policy" },
                { label: "Sitemap", url: "/site-map" },
            ],
        },
        {
            title: "Account",
            links: [
                { label: "Sign In", url: "/signin" },
                { label: "Sign Up", url: "/signup" },
                { label: "Profile", url: "/profile" },
                { label: "Cart", url: "/cart" },
                { label: "Checkout", url: "/checkout" },
                { label: "Invoice Payment", url: "/invoice-payment" },
                { label: "Orders", url: "/accounts/orders" },
            ],
        },
        {
            title: "Success Pages",
            links: [
                { label: "Quote Request Success", url: "/success/quote-request" },
                { label: "Contact Success", url: "/success/contact" },
                { label: "Order Success", url: "/success/order" },
            ],
        },
    ];

    // Dynamic category links
    const categoryLinks = categories.map((category) => ({
        label: category.name,
        url: `/products/category/${createSlug(category.name)}`,
    }));

    // Filter options
    const filterOptions = [
        { label: "Clearance", url: "/products?closeout=true" },
        { label: "Eco Friendly & Sustainable", url: "/products?eco_friendly=true" },
        { label: "24 Hour Rush", url: "/products?rush_service=true" },
        { label: "Made in the USA", url: "/products?usa_made=true" },
    ];

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
                        <h1 className="font-bold 2xl:text-[55px] 2xl:leading-[65px] xl:text-[48px] xl:leading-[54px] lg:text-[42px] sm:text-[36px] text-[30px] leading-[38px] sm:leading-[42px] lg:leading-[48px] mb-[11px]">404 - Page Does Not Exist</h1>
                    </div>
                </div>
            </section>
            <section className="py-[80px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="text-center mb-[40px]">
                        <p className="text-[18px] text-[#666] mb-4">The page you're looking for doesn't exist. Here are some helpful links:</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Top Sections: Main Pages and Services */}
                        {topSections.map((section, index) => (
                            <div key={index}>
                                <h2 className="text-[20px] font-bold mb-4">{section.title}</h2>
                                <ul className="space-y-2">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link 
                                                href={link.url} 
                                                className="text-[15px] text-[#666] hover:text-accent transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {/* Product Categories Section */}
                        {!loadingCategories && categoryLinks.length > 0 && (
                            <div>
                                <h2 className="text-[20px] font-bold mb-4">Product Categories</h2>
                                <ul className="space-y-2">
                                    {categoryLinks.map((link, i) => (
                                        <li key={i}>
                                            <Link 
                                                href={link.url} 
                                                className="text-[15px] text-[#666] hover:text-accent transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {loadingCategories && (
                            <div>
                                <h2 className="text-[20px] font-bold mb-4">Product Categories</h2>
                                <p className="text-[15px] text-[#666]">Loading categories...</p>
                            </div>
                        )}
                        {/* Filter Options Section */}
                        <div>
                            <h2 className="text-[20px] font-bold mb-4">Filter Options</h2>
                            <ul className="space-y-2">
                                {filterOptions.map((link, i) => (
                                    <li key={i}>
                                        <Link 
                                            href={link.url} 
                                            className="text-[15px] text-[#666] hover:text-accent transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Bottom Sections: Legal, Account, Success Pages */}
                        {bottomSections.map((section, index) => (
                            <div key={index}>
                                <h2 className="text-[20px] font-bold mb-4">{section.title}</h2>
                                <ul className="space-y-2">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link 
                                                href={link.url} 
                                                className="text-[15px] text-[#666] hover:text-accent transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <div className="bg-gradient">
                <Client_Logo/>
            </div>
            <Footer/>
        </>
    );
}

function NotFound() {
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
            <NotFoundContent />
        </Suspense>
    );
}

export default NotFound;




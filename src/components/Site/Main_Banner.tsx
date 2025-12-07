import React, { useRef, useEffect } from 'react';
import Image from "next/image";
import check from "../../../public/images/check.svg";
import Contact_Form from "@/components/Site/Contact_Form";

interface MainBannerProps {
    productCount?: number | null;
    categoryName?: string | null;
}

// Category to banner image mapping
const categoryBannerImageMap: Record<string, string> = {
    "Apparel": "/images/Banner Images/1 Apparel.jpg",
    "Pens & Other Writing": "/images/Banner Images/2 Pens.jpg",
    "Pens & Writing": "/images/Banner Images/2 Pens.jpg",
    "Drinkware": "/images/Banner Images/3 Drinkware.jpg",
    "Bags": "/images/Banner Images/4 Bags.jpg",
    "Technology & Flash Drives": "/images/Banner Images/5 Tech.jpg",
    "Auto, Home & Tools": "/images/Banner Images/6 Auto.jpg",
    "Outdoor, Leisure & Toys": "/images/Banner Images/7 Outoor.jpg",
    "Office & Awards": "/images/Banner Images/8 Office.jpg",
    "Health, Wellness & Safety": "/images/Banner Images/9 Health.jpg",
    "Health & Safety": "/images/Banner Images/9 Health.jpg",
    "Trade Shows & Events": "/images/Banner Images/10 Trade.jpg",
    "Stationary & Calendars": "/images/Banner Images/11 Stationary.jpg",
    "Stationery & Folders": "/images/Banner Images/11 Stationary.jpg",
    "Stationary & Folders": "/images/Banner Images/11 Stationary.jpg",
    "Food, Candy & Water": "/images/Banner Images/12 Food.jpg",
};

// Category to banner text template mapping
const categoryBannerTextMap: Record<string, string> = {
    "Apparel": "Apparel Items at",
    "Pens & Other Writing": "Pens & Other Writing Items at",
    "Pens & Writing": "Pens & Other Writing Items at",
    "Drinkware": "Drinkware Items at",
    "Bags": "Bags at",
    "Technology & Flash Drives": "Technology Items & Flash Drives at",
    "Auto, Home & Tools": "Auto / Home Items & Tools at",
    "Outdoor, Leisure & Toys": "Outdoor / Leisure Items & Toys at",
    "Office & Awards": "Office Items & Awards at",
    "Health, Wellness & Safety": "Health, Wellness & Safety Items at",
    "Health & Safety": "Health, Wellness & Safety Items at",
    "Trade Shows & Events": "Trade Show & Event Items at",
    "Stationary & Calendars": "Stationary Items & Calendars at",
    "Stationery & Folders": "Stationary Items & Calendars at",
    "Stationary & Folders": "Stationary Items & Calendars at",
    "Food, Candy & Water": "Food Items at",
};

function MainBanner({ productCount, categoryName }: MainBannerProps) {
    // Format number with commas
    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-US');
    };

    // Use provided product count if available, otherwise use default
    const displayCount = productCount && productCount > 0 
        ? formatNumber(productCount) 
        : '774,044';

    // Get banner image based on category
    const getBannerImage = (): string => {
        if (categoryName && categoryBannerImageMap[categoryName]) {
            // Return the path - encode spaces for URL
            const path = categoryBannerImageMap[categoryName];
            return path.replace(/\s/g, '%20');
        }
        return "/images/home_banner_img.jpg"; // Default home banner
    };

    // Get banner text based on category
    const getBannerText = (): string => {
        if (categoryName && categoryBannerTextMap[categoryName]) {
            const categoryText = categoryBannerTextMap[categoryName];
            return `<strong class="font-black 2xl:text-[38px] xl:text-[34px] md:text-[30px] sm:text-[26px] text-[24px]">${displayCount}</strong> ${categoryText} <br/> Prices <span class="text-accent font-black 2xl:text-[38px] xl:text-[34px] md:text-[30px] sm:text-[26px] text-[24px]">25%</span> Below the Competition`;
        }
        // Default heading for home page or when no category
        return `<strong class="font-black 2xl:text-[38px] xl:text-[34px] md:text-[30px] sm:text-[26px] text-[24px]">${displayCount}</strong> Promotional Items at <br/> Prices <span class="text-accent font-black 2xl:text-[38px] xl:text-[34px] md:text-[30px] sm:text-[26px] text-[24px]">25%</span> Below the Competition`;
    };

    const heading = getBannerText();
    const bannerImgPath = getBannerImage();
    const sectionRef = useRef<HTMLElement>(null);

    const cont = {
        heading: heading,
        features: [
            "110% Price Beat Guarantee",
            "Free Shipping, Proofs & Samples",
            "5-Star Service & Quality",
            "24 Hour Delivery Available",
        ],
    };

    // Set background image using useEffect to avoid Tailwind parsing
    useEffect(() => {
        if (sectionRef.current) {
            const bgValue = 'url("' + bannerImgPath + '")';
            sectionRef.current.style.backgroundImage = bgValue;
        }
    }, [bannerImgPath]);

    // Check if this is a category banner (not home page)
    const isCategoryBanner = categoryName && categoryBannerImageMap[categoryName];

    return (
        <section 
            ref={sectionRef}
            className="w-[calc(100%-40px)] bg-no-repeat bg-cover bg-center mx-[20px] rounded-[25px] 2xl:py-[74px] xl:py-[64px] md:py-[54px] py-[44px] relative"
        >
            {/* Gradient overlay - darker on left, lighter on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 rounded-[25px]"></div>
            <div className="wrapper 2xl:px-0 px-[15px] relative z-10">
                <div className="grid lg:grid-cols-[52%_48%] gap-y-6 lg:gap-x-8 justify-between">
                    <div className="text-white">
                        <h1
                            className="font-semibold 2xl:text-[33px] xl:text-[30px] md:text-[26px] sm:text-[24px] text-[22px] leading-[1.1] md:mb-[40px] mb-[30px]"
                            dangerouslySetInnerHTML={{ __html: cont.heading }}
                        />
                        <ul className="md:space-y-4 space-y-3">
                            {cont.features.map((item, index) => (
                                <li key={index} className="2xl:text-[36px] xl:text-[30px] md:text-[24px] sm:text-[20px] text-[18px] sm:leading-[20px] leading-[18px] 2xl:leading-[36px] xl:leading-[30px] md:leading-[26px] font-semibold flex gap-[12px] items-center">
                                    <Image src={check} alt="check" width={26} height={26} className="md:w-[26px] md:h-[26px] w-[20px] h-[20px]"/> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:ml-4">
                        <Contact_Form />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MainBanner;

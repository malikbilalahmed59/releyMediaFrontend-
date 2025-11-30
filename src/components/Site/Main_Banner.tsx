import React from 'react';
import Image from "next/image";
import check from "../../../public/images/check.svg";
import Contact_Form from "@/components/Site/Contact_Form";

interface MainBannerProps {
    productCount?: number | null;
    categoryName?: string | null;
}

function MainBanner({ productCount, categoryName }: MainBannerProps) {
    // Format number with commas
    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-US');
    };

    // Use provided product count if available, otherwise use default
    const displayCount = productCount && productCount > 0 
        ? formatNumber(productCount) 
        : '774,044';

    // Generate heading based on whether we have a category name
    let heading: string;
    if (categoryName && productCount && productCount > 0) {
        // Show "Found X [category] products" format for category pages
        heading = `Over <strong class="font-black 2xl:text-[45px] xl:text-[40px] md:text-[36px] sm:text-[30px] text-[26px]">${displayCount}</strong> ${categoryName} Products <br/> at Prices <span class="text-accent font-black 2xl:text-[45px] xl:text-[40px] md:text-[36px] sm:text-[30px] text-[26px]">25%+</span> Below the Competition`;
    } else {
        // Default heading for home page or when no category
        heading = `Over <strong class="font-black 2xl:text-[45px] xl:text-[40px] md:text-[36px] sm:text-[30px] text-[26px]">${displayCount}</strong> Promotional Items <br/> at Prices <span class="text-accent font-black 2xl:text-[45px] xl:text-[40px] md:text-[36px] sm:text-[30px] text-[26px]">25%+</span> Below the Competition`;
    }

    const cont = {
        heading: heading,
        features: [
            "110% Price Beat Guarantee",
            "Free Shipping, Proofs & Samples",
            "5-Star Service & Quality",
            "24 Hour Delivery Available",
        ],
    };

    return (
        <section className="w-[calc(100%-40px)] bg-[url(/images/home_banner_img.png)] bg-no-repeat  bg-cover bg-center mx-[20px] rounded-[25px] 2xl:py-[74px] xl:py-[64px] md:py-[54px] py-[44px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="grid lg:grid-cols-[55%_44.75%] gap-y-6 justify-between">
                    <div className="text-white">
                        <h1
                            className="font-semibold 2xl:text-[38px] xl:text-[36px] md:text-[30px] sm:text-[28px] text-[26px] leading-[30px] sm:leading-[34px] md:leading-[36px] xl:leading-[46px] md:mb-[27px] mb-[20px]"
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
                    <Contact_Form />
                </div>
            </div>
        </section>
    );
}

export default MainBanner;

import React from "react";
import Image from "next/image";
import check from "../../../public/images/check.svg";
import Contact_Form from "@/components/Site/Contact_Form";
import Link from "next/link";

function Products_Banner() {
    const bannerData = {
        breadcrumbs: [
            { label: "Home", href: "/" },
            { label: "Products", href: "#" },
        ],
        title: "Custom Quotes In Under 10 Minutes",
        subtitle: "PRICE BEAT GUARANTEE",
        offerText: {
            price: "$1.95",
            description: "Bulk Flash Drives",
        },
        backgroundImage: "/images/home_banner_img.png",
    };

    return (
        <section
            className="w-[calc(100%-40px)] bg-no-repeat bg-fixed bg-cover bg-center mx-[20px] rounded-[25px] 2xl:py-[74px] xl:py-[64px] md:py-[54px] py-[44px]"
            style={{ backgroundImage: `url(${bannerData.backgroundImage})` }}
        >
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="grid xl:grid-cols-[45%_44.75%] lg:grid-cols-[36%_49.75%] gap-y-6  justify-between items-center">
                    <div className="text-white">
                        <ul className="flex gap-[5px] items-center text-white md:mb-[11px] mb-[6px]">
                            {bannerData.breadcrumbs.map((crumb, index) => (
                                <li key={index} className="flex items-center gap-1">
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="sm:text-[16px] text-[14px] leading-[14px] sm:leading-[16px] font-bold text-white hover:text-accent"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-[14px] leading-[14px] font-semibold text-white">{crumb.label}</span>
                                    )}
                                    {index < bannerData.breadcrumbs.length - 1 && <span>-</span>}
                                </li>
                            ))}
                        </ul>

                        <h1 className="font-bold 2xl:text-[55px] 2xl:leading-[65px] xl:text-[48px] xl:leading-[54px] lg:text-[42px] sm:text-[36px] text-[32px] leading-[38px] sm:leading-[42px] lg:leading-[48px] mb-[11px]">
                            {bannerData.title}
                        </h1>

                        <span className="text-uppercase font-semibold 2xl:text-[35px] 2xl:leading-[35px] xl:text-[30px] lg:text-[28px] sm:text-[24px] text-[22px] leading-[30px] md:mb-[20px] mb-[10px] block text-accent">
              {bannerData.subtitle}
            </span>

                        <div className="md:text-[24px] sm:text-[20px] text-[18px] leading-[24px] font-semibold">
                            <strong className="font-bold">{bannerData.offerText.price}</strong>{" "}
                            {bannerData.offerText.description}
                        </div>
                    </div>

                    <Contact_Form />
                </div>
            </div>
        </section>
    );
}

export default Products_Banner;

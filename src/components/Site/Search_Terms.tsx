import React from "react";
import Image from "next/image";
import Link from "next/link";
import popular_img1 from "../../../public/images/popular_img1.png";

function SearchTerms() {
    const data = {
        sectionTitle: "Popular Search Terms",
        items: [
            {  img: popular_img1, title: "Health & Safety", link: "/search/health-safety" },
            {  img: popular_img1, title: "Construction", link: "/search/construction" },
            {  img: popular_img1, title: "Technology", link: "/search/technology" },
            { img: popular_img1, title: "Education", link: "/search/education" },
            {  img: popular_img1, title: "Finance", link: "/search/finance" },
            {  img: popular_img1, title: "Hospitality", link: "/search/hospitality" },
            {  img: popular_img1, title: "Engineering", link: "/search/engineering" },
            { img: popular_img1, title: "Transportation", link: "/search/transportation" },
        ],
    };

    return (
        <section className="2xl:pb-[80px] xl:pb-[60px] sm:pb-[50px] pb-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold 2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">
                    {data.sectionTitle}
                </h2>

                <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 2xl:gap-y-[63px] xl:gap-y-[50px] lg:gap-y-[25px] gap-y-[20px] gap-x-[20px] justify-between">
                    {data.items.map((item, index) => (
                        <div key={index} className="text-center">
                            <Link href={item.link}>
                                <figure className="bg-gradient h-[138px] md:p-0 p-[20px] xl:w-[138px] flex items-center justify-center rounded-[17px] mx-auto transition-transform hover:scale-105">
                                    <Image src={item.img} alt={item.title} />
                                </figure>
                                <span className="block font-semibold lg:text-[18px] text-[14px] leading-[18px] mt-[14px]">{item.title}</span>
                            </Link>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default SearchTerms;

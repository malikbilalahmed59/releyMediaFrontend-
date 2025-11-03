import React from "react";
import Image from "next/image";
import Link from "next/link";
import categories_img3 from "../../../public/images/categories_img3.png";
import categories_img11 from "../../../public/images/categories_img11.png";
import categories_img12 from "../../../public/images/categories_img12.png";
import categories_img2 from "../../../public/images/categories_img2.png";
import categories_img15 from "../../../public/images/categories_img15.png";
import categories_img7 from "../../../public/images/categories_img7.png";
import categories_img4 from "../../../public/images/categories_img4.png";
import categories_img9 from "../../../public/images/categories_img9.png";

function SearchTerms() {
    const data = {
        sectionTitle: "Popular Search Terms",
        items: [
            {  img: categories_img9, title: "Health & Safety", link: "/products" },
            {  img: categories_img3, title: "Drinkware", link: "/products" },
            {  img: categories_img11, title: "Stationary & Folders", link: "/products" },
            { img: categories_img12, title: "Food, Candy & Water", link: "/products" },
            {  img: categories_img4, title: "Bags", link: "/products" },
            {  img: categories_img7, title: "Outdoor, Leisure & Toys", link: "/products" },
            {  img: categories_img15, title: "Made in the USA", link: "/products" },
            { img: categories_img2, title: "Pens & Writing", link: "/products" },
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
                                <figure className="bg-gradient h-[138px] p-[20px] xl:w-[138px] flex items-center justify-center rounded-[17px] mx-auto transition-transform hover:scale-105">
                                    <Image src={item.img} alt={item.title} className="w-full h-full object-contain"/>
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

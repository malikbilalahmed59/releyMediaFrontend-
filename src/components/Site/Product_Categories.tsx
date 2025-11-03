import React from "react";
import Image from "next/image";
import Link from "next/link";

// ✅ Import category images
import categories_img1 from "../../../public/images/categories_img1.png";
import categories_img2 from "../../../public/images/categories_img2.png";
import categories_img3 from "../../../public/images/categories_img3.png";
import categories_img4 from "../../../public/images/categories_img4.png";
import categories_img5 from "../../../public/images/categories_img5.png";
import categories_img6 from "../../../public/images/categories_img6.png";
import categories_img7 from "../../../public/images/categories_img7.png";
import categories_img8 from "../../../public/images/categories_img8.png";
import categories_img9 from "../../../public/images/categories_img9.png";
import categories_img10 from "../../../public/images/categories_img10.png";
import categories_img11 from "../../../public/images/categories_img11.png";
import categories_img12 from "../../../public/images/categories_img12.png";
import categories_img13 from "../../../public/images/categories_img13.png";
import categories_img14 from "../../../public/images/categories_img14.png";
import categories_img15 from "../../../public/images/categories_img15.png";
import categories_img16 from "../../../public/images/categories_img16.png";

function ProductCategories() {
    // ✅ Centralized category data with correct links
    const categories = [
        { name: "Apparel", img: categories_img1, link: "/single-products" },
        { name: "Pens & Writing", img: categories_img2, link: "/single-products" },
        { name: "Drinkware", img: categories_img3, link: "/single-products" },
        { name: "Bags", img: categories_img4, link: "/single-products" },
        { name: "Technology & Flash Drives", img: categories_img5, link: "/single-products" },
        { name: "Auto, Home & Tools", img: categories_img6, link: "/single-products" },
        { name: "Outdoor, Leisure & Toys", img: categories_img7, link: "/single-products" },
        { name: "Office & Awards", img: categories_img8, link: "/single-products" },
        { name: "Health & Safety", img: categories_img9, link: "/single-products" },
        { name: "Trade Shows & Events", img: categories_img10, link: "/single-products" },
        { name: "Stationery & Folders", img: categories_img11, link: "/single-products" },
        { name: "Food, Candy & Water", img: categories_img12, link: "/single-products" },
        { name: "Clearance", img: categories_img13, link: "/single-products" },
        { name: "24 Hour Rush", img: categories_img14, link: "/single-products" },
        { name: "Made in the USA", img: categories_img15, link: "/single-products" },
        { name: "Eco Friendly & Sustainable", img: categories_img16, link: "/single-products" },
    ];

    return (
        <section className="xl:py-[60px] sm:py-[50px] py-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-semibold 2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">
                    Featured <span className="font-black">Promotional Product</span> Categories
                </h2>

                <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 2xl:gap-y-[63px] xl:gap-y-[50px] lg:gap-y-[25px] gap-y-[20px] gap-x-[20px] justify-between">
                    {categories.map((category, index) => (
                        <div key={index} className="text-center">
                            <Link href={category.link}>
                                <figure
                                    className="bg-gray-100 p-[20px] xl:w-[138px] h-[138px] flex items-center justify-center
                  rounded-[17px] mx-auto transition-transform hover:scale-105 hover:shadow-md"
                                >
                                    <Image
                                        src={category.img}
                                        alt={`${category.name} image`}
                                        className="w-full h-full object-contain"
                                    />
                                </figure>
                                <span className="block font-semibold lg:text-[18px] text-[14px] leading-[18px] mt-[14px]">
                  {category.name}
                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductCategories;

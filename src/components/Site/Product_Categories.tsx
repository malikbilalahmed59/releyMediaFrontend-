import React from "react";
import Image from "next/image";
import Link from "next/link";
import categories_img1 from "../../../public/images/categories_img1.png";

function ProductCategories() {
    // ✅ Centralized category data with dynamic links
    const categories = [
        { name: "Apparel", img: categories_img1, link: "/categories/apparel" },
        { name: "Drinkware", img: categories_img1, link: "/categories/drinkware" },
        { name: "Tech Accessories", img: categories_img1, link: "/categories/tech-accessories" },
        { name: "Bags", img: categories_img1, link: "/categories/bags" },
        { name: "Office Supplies", img: categories_img1, link: "/categories/office-supplies" },
        { name: "Outdoor & Leisure", img: categories_img1, link: "/categories/outdoor-leisure" },
        { name: "Health & Wellness", img: categories_img1, link: "/categories/health-wellness" },
        { name: "Eco-Friendly", img: categories_img1, link: "/categories/eco-friendly" },
        { name: "Toys & Games", img: categories_img1, link: "/categories/toys-games" },
        { name: "Travel", img: categories_img1, link: "/categories/travel" },
        { name: "Stationery", img: categories_img1, link: "/categories/stationery" },
        { name: "Event Giveaways", img: categories_img1, link: "/categories/event-giveaways" },
        { name: "Home & Kitchen", img: categories_img1, link: "/categories/home-kitchen" },
        { name: "Awards & Recognition", img: categories_img1, link: "/categories/awards-recognition" },
        { name: "Custom Packaging", img: categories_img1, link: "/categories/custom-packaging" },
        { name: "Pet Products", img: categories_img1, link: "/categories/pet-products" },
    ];

    return (
        <section className="xl:py-[60px] sm:py-[50px] py-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-semibold 2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">
                    Featured <span className="font-black">Promotional Product</span>{" "}
                    Categories
                </h2>

                <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 2xl:gap-y-[63px] xl:gap-y-[50px] lg:gap-y-[25px] gap-y-[20px] gap-x-[20px] justify-between">
                    {categories.map((category, index) => (
                        <div key={index} className="text-center">
                            <Link href={category.link}>
                                <figure className="bg-gradient md:p-0 p-[20px] xl:w-[138px] h-[138px] flex items-center justify-center rounded-[17px] mx-auto transition-transform hover:scale-105">
                                    <Image
                                        src={category.img}
                                        alt={category.name}
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

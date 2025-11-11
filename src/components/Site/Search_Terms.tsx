'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategories, type Category } from '@/lib/api/catalog';
import { createSlug } from '@/lib/utils/slug';
import categories_img3 from "../../../public/images/categories_img3.png";
import categories_img11 from "../../../public/images/categories_img11.png";
import categories_img12 from "../../../public/images/categories_img12.png";
import categories_img2 from "../../../public/images/categories_img2.png";
import categories_img15 from "../../../public/images/categories_img15.png";
import categories_img7 from "../../../public/images/categories_img7.png";
import categories_img4 from "../../../public/images/categories_img4.png";
import categories_img9 from "../../../public/images/categories_img9.png";

// Static image mapping for popular search terms
const searchTermImageMap: Record<string, any> = {
    "Health & Safety": categories_img9,
    "Drinkware": categories_img3,
    "Stationary & Folders": categories_img11,
    "Stationery & Folders": categories_img11,
    "Food, Candy & Water": categories_img12,
    "Bags": categories_img4,
    "Outdoor, Leisure & Toys": categories_img7,
    "Made in the USA": categories_img15,
    "Pens & Writing": categories_img2,
    "Pens & Other Writing": categories_img2,
};

function SearchTerms() {
    const router = useRouter();
    const [apiCategories, setApiCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setApiCategories(data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Popular search terms - map to API categories
    const popularTerms = [
        "Health & Safety",
        "Drinkware",
        "Stationery & Folders",
        "Food, Candy & Water",
        "Bags",
        "Outdoor, Leisure & Toys",
        "Made in the USA",
        "Pens & Writing",
    ];

    // Map popular terms to categories with IDs
    const mappedItems = popularTerms.map((term) => {
        // Find matching category from API
        const category = apiCategories.find(
            (cat) => cat.name === term || 
            cat.name === term.replace("Pens & Writing", "Pens & Other Writing") ||
            cat.name === term.replace("Stationery & Folders", "Stationary & Folders")
        );
        
        const image = searchTermImageMap[term] || categories_img2;
        
        // Check if it's a filter
        if (term === "Made in the USA") {
            return {
                title: term,
                img: image,
                link: "/products?usa_made=true",
                isFilter: true,
            };
        }
        
        // Regular category
        const categorySlug = category ? createSlug(category.name) : null;
        return {
            title: term,
            img: image,
            link: categorySlug ? `/products/category/${categorySlug}` : "/products",
            categoryId: category?.id,
            isFilter: false,
        };
    });

    const handleItemClick = (link: string, e: React.MouseEvent) => {
        e.preventDefault();
        router.push(link);
    };

    return (
        <section className="2xl:pb-[80px] xl:pb-[60px] sm:pb-[50px] pb-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold 2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">
                    Popular Search Terms
                </h2>

                <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 2xl:gap-y-[63px] xl:gap-y-[50px] lg:gap-y-[25px] gap-y-[20px] gap-x-[20px] justify-between">
                    {loading ? (
                        <div className="col-span-full text-center py-8">Loading...</div>
                    ) : (
                        mappedItems.map((item, index) => (
                            <div key={item.title || index} className="text-center">
                                <Link 
                                    href={item.link}
                                    onClick={(e) => handleItemClick(item.link, e)}
                                >
                                    <figure className="bg-gradient h-[138px] p-[20px] xl:w-[138px] flex items-center justify-center rounded-[17px] mx-auto transition-transform hover:scale-105">
                                        <Image src={item.img} alt={item.title} className="w-full h-full object-contain"/>
                                    </figure>
                                    <span className="block font-semibold lg:text-[18px] text-[14px] leading-[18px] mt-[14px]">{item.title}</span>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default SearchTerms;

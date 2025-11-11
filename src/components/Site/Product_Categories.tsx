'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategories, type Category } from '@/lib/api/catalog';
import { createSlug } from '@/lib/utils/slug';

// ✅ Import category images (keeping static as requested)
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

// Category name to image mapping (static images)
const categoryImageMap: Record<string, any> = {
    "Apparel": categories_img1,
    "Pens & Writing": categories_img2,
    "Pens & Other Writing": categories_img2,
    "Drinkware": categories_img3,
    "Bags": categories_img4,
    "Technology & Flash Drives": categories_img5,
    "Auto, Home & Tools": categories_img6,
    "Outdoor, Leisure & Toys": categories_img7,
    "Office & Awards": categories_img8,
    "Health & Safety": categories_img9,
    "Trade Shows & Events": categories_img10,
    "Stationery & Folders": categories_img11,
    "Stationary & Folders": categories_img11,
    "Food, Candy & Water": categories_img12,
    "Eco Friendly & Sustainable": categories_img16,
};

function ProductCategories() {
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

    // Map API categories to display format with static images
    const mappedCategories = apiCategories.map((category) => {
        // Find matching image by category name
        const image = categoryImageMap[category.name] || categories_img1; // fallback to first image
        const categorySlug = createSlug(category.name);
        return {
            id: category.id,
            name: category.name,
            img: image,
            link: `/products/category/${categorySlug}`,
            isFilter: false,
        };
    });

    // Last 4 are filters (not categories)
    const filterCategories = [
        { 
            name: "Eco Friendly & Sustainable", 
            img: categories_img16, 
            link: "/products",
            isFilter: true,
            filterType: 'eco_friendly'
        },
        { 
            name: "Clearance", 
            img: categories_img13, 
            link: "/products?closeout=true",
            isFilter: true,
            filterType: 'clearance'
        },
        { 
            name: "24 Hour Rush", 
            img: categories_img14, 
            link: "/products",
            isFilter: true,
            filterType: 'rush'
        },
        { 
            name: "Made in the USA", 
            img: categories_img15, 
            link: "/products?usa_made=true",
            isFilter: true,
            filterType: 'usa_made'
        },
    ];

    const allCategories = [...mappedCategories, ...filterCategories];

    const handleCategoryClick = (link: string, isFilter: boolean, filterType: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (isFilter && filterType === 'clearance') {
            router.push('/products?closeout=true');
        } else if (isFilter && filterType === 'usa_made') {
            router.push('/products?usa_made=true');
        } else if (isFilter && filterType === 'rush') {
            router.push('/products?rush_service=true');
        } else if (isFilter && filterType === 'eco_friendly') {
            router.push('/products?eco_friendly=true');
        } else if (isFilter && link === '/products') {
            router.push('/products');
        } else {
            router.push(link);
        }
    };

    return (
        <section className="xl:py-[60px] sm:py-[50px] py-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-semibold 2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">
                    Featured <span className="font-black">Promotional Product</span> Categories
                </h2>

                <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 2xl:gap-y-[63px] xl:gap-y-[50px] lg:gap-y-[25px] gap-y-[20px] gap-x-[20px] justify-between">
                    {loading ? (
                        <div className="col-span-full text-center py-8">Loading categories...</div>
                    ) : (
                        allCategories.map((category, index) => (
                            <div key={category.id || category.name || index} className="text-center">
                                <Link 
                                    href={category.link}
                                    onClick={(e) => handleCategoryClick(category.link, category.isFilter, category.filterType || '', e)}
                                >
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
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductCategories;

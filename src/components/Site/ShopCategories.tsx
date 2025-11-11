'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {ArrowRight , ChevronDown} from "lucide-react";
import Link from "next/link";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getCategories, type Category } from '@/lib/api/catalog';
import { createSlug } from '@/lib/utils/slug';

function ShopCategories() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryName: string, e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(false);
        const slug = createSlug(categoryName);
        router.push(`/products/category/${slug}`);
    };

    const handleClearanceClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(false);
        router.push('/products?closeout=true');
    };

    const handleUsaMadeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(false);
        router.push('/products?usa_made=true');
    };

    // Check if we're on a category page by checking the pathname
    const categorySlug = pathname?.startsWith('/products/category/') 
        ? pathname.split('/products/category/')[1]?.split('?')[0] 
        : null;
    const isClearance = searchParams.get('closeout') === 'true';
    const isUsaMade = searchParams.get('usa_made') === 'true';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="cursor-pointer xl:text-[16px] sm:text-[14px] text-[12px]  font-semibold h-auto xl:py-[11px]
                 sm:py-[8px] py-[6px] xl:px-[28px] lg:px-[18px] px-[10px] hover:bg-transpaernt ">Shop All Categories <ChevronDown /></Button>
            </PopoverTrigger>
            <PopoverContent className="rounded-[20px]">
                <h6 className="text-center  font-semibold pb-[16px] text-[20px] leading-[20px]">Product Category</h6>
                <Separator className="mx-[10px" />
                <div className="space-y-[13px] mt-[13px]">
                    {loading ? (
                        <div className="text-center py-4 text-sm text-gray-500">Loading categories...</div>
                    ) : (
                        <>
                            {categories.map((category) => {
                                const categorySlugFromName = createSlug(category.name);
                                const isSelected = categorySlug === categorySlugFromName;
                                return (
                                    <Link 
                                        key={category.id}
                                        href={`/products/category/${categorySlugFromName}`}
                                        onClick={(e) => handleCategoryClick(category.name, e)}
                                        className={`flex items-center justify-between w-full hover:text-accent ${
                                            isSelected ? 'font-bold text-accent' : ''
                                        }`}
                                    >
                                        {category.name} <ArrowRight />
                                    </Link>
                                );
                            })}
                            <Link 
                                href="/products?closeout=true"
                                onClick={handleClearanceClick}
                                className={`flex items-center justify-between w-full hover:text-accent ${
                                    isClearance ? 'font-bold text-accent' : ''
                                }`}
                            >
                                Clearance <ArrowRight />
                            </Link>
                            <Link 
                                href="/products?rush_service=true"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpen(false);
                                    router.push('/products?rush_service=true');
                                }}
                                className={`flex items-center justify-between w-full hover:text-accent ${
                                    searchParams.get('rush_service') === 'true' ? 'font-bold text-accent' : ''
                                }`}
                            >
                                24 Hour Rush <ArrowRight />
                            </Link>
                            <Link 
                                href="/products?usa_made=true"
                                onClick={handleUsaMadeClick}
                                className={`flex items-center justify-between w-full hover:text-accent ${
                                    isUsaMade ? 'font-bold text-accent' : ''
                                }`}
                            >
                                Made in the USA <ArrowRight />
                            </Link>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default ShopCategories;
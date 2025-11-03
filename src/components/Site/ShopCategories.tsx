import React from 'react';
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {ArrowRight , ChevronDown} from "lucide-react";
import Link from "next/link";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
function ShopCategories() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="cursor-pointer xl:text-[16px] sm:text-[14px] text-[12px]  font-semibold h-auto xl:py-[11px]
                 sm:py-[8px] py-[6px] xl:px-[28px] lg:px-[18px] px-[10px] hover:bg-transpaernt ">Shop All Categories <ChevronDown /></Button>
            </PopoverTrigger>
            <PopoverContent className="rounded-[20px]">
                <h6 className="text-center  font-semibold pb-[16px] text-[20px] leading-[20px]">Product Category</h6>
                <Separator className="mx-[10px" />
                <div className="space-y-[13px] mt-[13px]">
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Apparel <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Pens & Writing <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Drinkware <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Bags <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Technology & Flash Drives <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Auto, Home & Tools <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Outdoor, Leisure & Toys <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Office & Awards <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Health & Safety <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Trade Shows & Events <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Stationary & Folders <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Clearance <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">24 Hour Rush <ArrowRight /></Link>
                    <Link href="/products" className="flex items-center justify-between w-full hover:text-accent">Made in the USA <ArrowRight /></Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default ShopCategories;
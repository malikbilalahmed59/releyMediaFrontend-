import React from 'react';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

function FilterSidebar() {
    const filterData = {
        categories: [
            "Apparel",
            "Pens & Writing",
            "Drinkware",
            "Bags",
            "Technology & Flash Drives",
            "Auto, Home & Tools",
            "Trade Shows & Events",
            "Stationary & Folders",
            "Clearance",
        ],
        warrantyTypes: [
            { id: "no-warranty", label: "No Warranty" },
            { id: "seller-warranty", label: "Seller Warranty" },
        ],
        colors: [
            { id: "black", label: "Black" },
            { id: "clear", label: "Clear" },
            { id: "gold", label: "Gold" },
            { id: "white", label: "White" },
            { id: "green", label: "Green" },
            { id: "silver", label: "Silver" },
        ],
    };

    return (
        <div className="w-full border border-[#ECECEC] rounded-[20px] px-[15px] py-[20px]">
            <div className="flex justify-between pb-[14px] mb-[25px] border-b border-[#ECECEC] px-[15px]">
                <h5 className="text-[18px] font-semibold leading-[18px] text-[#151515]">Filters</h5>
                <Link href="#" className="inline-block text-[14px] leading-[14px] plusJakarta-font text-[#151515]">Reset</Link>
            </div>

            {/* Search */}
            <div className="flex items-center w-full relative mb-[20px]">
                <Input
                    type="text"
                    placeholder="Search"
                    className="border border-[#E5E5E5] text-[16px] leading-[16px] placeholder:text-[#B2B2B2] rounded-[12px] py-[10px] pl-[15px] pr-[45px] h-auto focus:outline-none focus-visible:shadow-none"
                />
                <Button type="submit" variant="outline" className="absolute right-[30px] rounded-none cursor-pointer !p-0 border-none hover:bg-transparent">
                    <Search />
                </Button>
            </div>

            {/* Price */}
            <div className="mb-[20px]">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Price</h4>
                <div className="flex items-center space-x-2">
                    <Input placeholder="Min" className="border border-[#E5E5E5] text-[16px] leading-[16px] placeholder:text-[#B2B2B2] rounded-[6px] h-[31px]" />
                    <span>-</span>
                    <Input placeholder="Max" className="border border-[#E5E5E5] text-[16px] leading-[16px] placeholder:text-[#B2B2B2] rounded-[6px] h-[31px]" />
                    <Button variant="secondary" className="rounded-[6px] cursor-pointer h-[31px]">
                        <Play className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>

            {/* Warranty Type */}
            <div className="mb-[20px]">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Warranty Type</h4>
                <div className="space-y-2">
                    {filterData.warrantyTypes.map(({ id, label }) => (
                        <div key={id} className="flex items-center space-x-2">
                            <Checkbox id={id} className="w-[18px] h-[18px]" />
                            <label htmlFor={id} className="text-[17px] text-[#919191]">{label}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Color Family */}
            <div className="mb-[20px]">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Color Family</h4>
                <div className="grid grid-cols-[30%_30%] gap-y-2">
                    {filterData.colors.map(({ id, label }) => (
                        <div key={id} className="flex items-center space-x-2">
                            <Checkbox id={id} className="w-[18px] h-[18px]" />
                            <label htmlFor={id} className="text-[17px] text-[#919191]">{label}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
                {filterData.categories.map((item, index) => (
                    <div
                        key={item}
                        className={`flex items-center justify-between text-[16px] cursor-pointer hover:text-accent ${index === 0 ? "font-bold" : ""}`}
                    >
                        <span>{item}</span>
                        <ArrowRight className="w-6 h-6" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilterSidebar;

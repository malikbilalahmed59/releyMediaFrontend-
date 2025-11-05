import React from 'react';
import Link from "next/link";
import {Mail, Phone, Search, ShoppingBasket, User} from "lucide-react";
import Image from "next/image";
import relymedia_logo from "../../../public/images/relymedia-logo.svg";
import { ArrowRight,ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import ShopCategories from "@/components/Site/ShopCategories";

function Header() {
    return (
        <>
            <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                <div className="wrapper  2xl:px-0 px-[15px]">
                    <div className="flex lg:justify-between justify-center">
                        <ul className="flex xl:gap-[24px] gap-[10px] items-center">
                            <li className="xl:text-[15px] text-[13px] leading-[15px]"><Link href="" className="flex items-center"><Mail className="text-accent xl:mr-[10px] mr-[5px]" size={18}/> sales@relymedia.com</Link></li>
                            <li className="xl:text-[15px] text-[13px] leading-[15px]"><Link href="" className="flex items-center"><Phone className="text-accent xl:mr-[10px] mr-[5px]" size={18}/> 1-866-476-2095</Link></li>
                            <li className="xl:text-[15px] text-[13px] leading-[15px] md:inline-block hidden">Speak to a Representative Immediately — Current Status: <strong>No Wait!</strong></li>
                        </ul>
                        <ul className="lg:flex hidden xl:gap-[30px] gap-[10px] items-center ">
                            <li className="xl:text-[15px] text-[13px] leading-[15px]"><Link href=""><strong>24 </strong> Hour Rush</Link></li>
                            <li className="xl:text-[15px] text-[13px] leading-[15px]"><Link href="">Made in the USA</Link></li>
                            <li className="xl:text-[15px] text-[13px] leading-[15px]"><Link href="">Clearance</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <header className="py-[16px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="flex justify-between sm:gap-0 gap-5">
                        <div className="flex items-end xl:gap-[35px] sm:gap-[20px] gap-[10px]">
                            <Link href="/">
                                <figure>
                                    <Image src={relymedia_logo} alt="relymedia_logo" width={163} height={50}/>
                                </figure>
                            </Link>
                            <div>
                                {/*<DropdownMenu>*/}
                                {/*    <DropdownMenuTrigger asChild>*/}
                                {/*        <Button variant="outline" className="cursor-pointer xl:text-[16px] sm:text-[14px] text-[12px]  font-semibold h-auto xl:py-[11px] sm:py-[8px] py-[6px] xl:px-[28px] lg:px-[18px] px-[10px] hover:bg-transpaernt ">Shop All Categories   <ChevronDown /></Button>*/}
                                {/*    </DropdownMenuTrigger>*/}
                                {/*    <DropdownMenuContent className="w-auto" align="start">*/}
                                {/*        <DropdownMenuLabel className="text-center  font-semibold py-[10px]">Product Category</DropdownMenuLabel>*/}
                                {/*        <DropdownMenuSeparator className="mx-[10px]"/>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Apparel <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Pens & Writing <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Drinkware <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Bags <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Technology & Flash Drives <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Auto, Home & Tools <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Outdoor, Leisure & Toys <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Office & Awards <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Health & Safety <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Trade Shows & Events <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Stationary & Folders <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Clearance <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">24 Hour Rush <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*        <DropdownMenuItem><Link href="#" className="flex items-center justify-between w-full">Made in the USA <ArrowRight /></Link></DropdownMenuItem>*/}
                                {/*    </DropdownMenuContent>*/}
                                {/*</DropdownMenu>*/}
                                <ShopCategories/>
                            </div>
                        </div>
                        <div className="flex items-center lg:gap-[12px] gap-[6px]">
                            <div className="md:flex hidden items-center xl:w-[506px] lg:w-[400px] w-[280px] relative">
                                <Input type="text" placeholder="Search Products, e.g. stainless tubler" className="border border-[#DEDEDE] text-[16px] leading-[16px] text-[#252525] placeholder:text-[#252525] rounded-[10px] lg:py-[15px] py-[11px] pl-[15px] pr-[45px] h-auto focus:outline-none focus-visible:shadow-none"/>
                                <Button type="submit" variant="secondary" className="absolute right-0 rounded-none lg:h-[48px] h-[40px] rounded-tr-[10px] rounded-br-[10px] lg:w-[54px] w-[40px] cursor-pointer"><Search /></Button>
                            </div>
                            <ul className="flex lg:gap-[12px] gap-[6px]">
                                <li><Link href="" className="bg-[#F5F5F5] lg:w-[48px] lg:h-[48px] w-[40px] h-[40px] flex items-center justify-center rounded-[10px] relative"><ShoppingBasket /> <span className="absolute top-1/2 -translate-y-1/2 right-[10px] w-[12px] h-[12px] bg-[#987727] flex items-center justify-center rounded-full text-[8px] text-white">6</span></Link></li>
                                <li><Link href="profile" className="bg-[#F5F5F5] lg:w-[48px] lg:h-[48px] w-[40px] h-[40px] flex items-center justify-center rounded-[10px]"><User /></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="md:hidden flex items-center w-full mt-4 relative">
                        <Input type="text" placeholder="Search Products, e.g. stainless tubler" className="border border-[#DEDEDE] sm:text-[16px] text-[14px] leading-[16px] text-[#252525] placeholder:text-[#252525] rounded-[10px] lg:py-[15px] py-[11px] pl-[15px] pr-[45px] h-auto focus:outline-none focus-visible:shadow-none"/>
                        <Button type="submit" variant="secondary" className="absolute right-0 rounded-none lg:h-[48px] h-[40px] rounded-tr-[10px] rounded-br-[10px] lg:w-[54px] w-[40px] cursor-pointer"><Search /></Button>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
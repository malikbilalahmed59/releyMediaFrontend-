'use client';
import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { useAuth } from "@/contexts/AuthContext";
import * as accountsAPI from '@/lib/api/accounts';
import type { Cart } from '@/lib/api/accounts';

function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<Cart | null>(null);
    const [cartLoading, setCartLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    
    // Check which filters are active
    const isUsaMade = searchParams.get('usa_made') === 'true';
    const isClearance = searchParams.get('closeout') === 'true';
    const isRushService = searchParams.get('rush_service') === 'true';
    const isProductsPage = pathname === '/products';

    const loadCart = useCallback(async () => {
        try {
            setCartLoading(true);
            const cartData = await accountsAPI.getCart();
            setCart(cartData);
        } catch (error) {
            console.error('Error loading cart:', error);
            setCart(null);
        } finally {
            setCartLoading(false);
        }
    }, []);

    // Load cart when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            loadCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated, loadCart]);

    // Reload cart when pathname changes (in case items were added)
    useEffect(() => {
        if (isAuthenticated && (pathname === '/cart' || pathname === '/checkout' || pathname === '/products' || pathname.startsWith('/single-products'))) {
            loadCart();
        }
    }, [pathname, isAuthenticated, loadCart]);

    // Listen for cart update events
    useEffect(() => {
        if (!isAuthenticated) return;
        
        const handleCartUpdate = () => {
            loadCart();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [isAuthenticated, loadCart]);

    const cartItemCount = cart?.total_items || 0;

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchQuery.trim()) {
                router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            }
        }
    };
    return (
        <>
            <div className="border-b border-[#2525251A] rounded-bl-[50px] rounded-br-[50px] py-[14px]">
                <div className="wrapper  2xl:px-0 px-[15px]">
                    <div className="flex lg:justify-between justify-center">
                        <ul className="flex xl:gap-[24px] gap-[10px] items-center">
                            <li className="xl:text-[15px] text-[13px] leading-[15px]">
                                <Link href="mailto:sales@relymedia.com" className="flex items-center hover:text-accent transition-colors">
                                    <Mail className="text-accent xl:mr-[10px] mr-[5px]" size={18}/> sales@relymedia.com
                                </Link>
                            </li>
                            <li className="xl:text-[15px] text-[13px] leading-[15px]">
                                <Link href="tel:1-866-476-2095" className="flex items-center hover:text-accent transition-colors">
                                    <Phone className="text-accent xl:mr-[10px] mr-[5px]" size={18}/> 1-866-476-2095
                                </Link>
                            </li>
                            <li className="xl:text-[15px] text-[13px] leading-[15px] md:inline-block hidden">Speak to a Representative Immediately — Current Status: <strong>No Wait!</strong></li>
                        </ul>
                        <ul className="lg:flex hidden xl:gap-[30px] gap-[10px] items-center ">
                            <li className="xl:text-[15px] text-[13px] leading-[15px]">
                                <Link 
                                    href="/products?rush_service=true"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push('/products?rush_service=true');
                                    }}
                                    className={isRushService ? 'font-bold text-accent' : ''}
                                >
                                    <strong>24 </strong> Hour Rush
                                </Link>
                            </li>
                            <li className="xl:text-[15px] text-[13px] leading-[15px]">
                                <Link 
                                    href="/products?usa_made=true"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push('/products?usa_made=true');
                                    }}
                                    className={isUsaMade ? 'font-bold text-accent' : ''}
                                >
                                    Made in the USA
                                </Link>
                            </li>
                            <li className="xl:text-[15px] text-[13px] leading-[15px]">
                                <Link 
                                    href="/products?closeout=true"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push('/products?closeout=true');
                                    }}
                                    className={isClearance ? 'font-bold text-accent' : ''}
                                >
                                    Clearance
                                </Link>
                            </li>
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
                            <form onSubmit={handleSearch} className="md:flex hidden items-center xl:w-[506px] lg:w-[400px] w-[280px] relative">
                                <Input 
                                    type="text" 
                                    placeholder="Search Products, e.g. stainless tumbler" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="border border-[#DEDEDE] text-[16px] leading-[16px] text-[#252525] placeholder:text-[#252525] rounded-[10px] lg:py-[15px] py-[11px] pl-[15px] pr-[45px] h-auto focus:outline-none focus-visible:shadow-none"
                                />
                                <Button 
                                    type="submit" 
                                    onClick={handleButtonClick}
                                    variant="secondary" 
                                    className="absolute right-0 rounded-none lg:h-[48px] h-[40px] rounded-tr-[10px] rounded-br-[10px] lg:w-[54px] w-[40px] cursor-pointer"
                                >
                                    <Search />
                                </Button>
                            </form>
                            <ul className="flex lg:gap-[12px] gap-[6px]">
                                <li>
                                    <Link 
                                        href="/cart" 
                                        className="bg-[#F5F5F5] lg:w-[48px] lg:h-[48px] w-[40px] h-[40px] flex items-center justify-center rounded-[10px] relative"
                                    >
                                        <ShoppingBasket /> 
                                        {isAuthenticated && cartItemCount > 0 && (
                                            <span className="absolute top-1/2 -translate-y-1/2 right-[10px] w-[12px] h-[12px] bg-[#987727] flex items-center justify-center rounded-full text-[8px] text-white">
                                                {cartItemCount > 99 ? '99+' : cartItemCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/profile" 
                                        onClick={(e) => {
                                            if (!isAuthenticated) {
                                                e.preventDefault();
                                                router.push(`/signin?returnUrl=${encodeURIComponent('/profile')}`);
                                            }
                                        }}
                                        className="bg-[#F5F5F5] lg:w-[48px] lg:h-[48px] w-[40px] h-[40px] flex items-center justify-center rounded-[10px]"
                                    >
                                        <User />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <form onSubmit={handleSearch} className="md:hidden flex items-center w-full mt-4 relative">
                        <Input 
                            type="text" 
                            placeholder="Search Products, e.g. stainless tumbler" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="border border-[#DEDEDE] sm:text-[16px] text-[14px] leading-[16px] text-[#252525] placeholder:text-[#252525] rounded-[10px] lg:py-[15px] py-[11px] pl-[15px] pr-[45px] h-auto focus:outline-none focus-visible:shadow-none"
                        />
                        <Button 
                            type="submit" 
                            onClick={handleButtonClick}
                            variant="secondary" 
                            className="absolute right-0 rounded-none lg:h-[48px] h-[40px] rounded-tr-[10px] rounded-br-[10px] lg:w-[54px] w-[40px] cursor-pointer"
                        >
                            <Search />
                        </Button>
                    </form>
                </div>
            </header>
        </>
    );
}

export default Header;
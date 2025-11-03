import React from 'react';
import Image from "next/image";
import Link from "next/link";
import pen from "../../../public/images/pen.png";
import { Button } from "@/components/ui/button";
import { MoveRight, ShoppingCart } from "lucide-react";

function BuyCart() {
    const content = [
        {
            title: "Pens",
            description: "Customized Engraving Ballpoint with...",
            price: "$1500",
            image: pen,
        },
        {
            title: "Luxury Pen Set",
            description: "Premium metal finish with custom box",
            price: "$2300",
            image: pen,
        },
        {
            title: "Executive Rollerball",
            description: "Smooth ink flow for signature writing",
            price: "$1800",
            image: pen,
        },
        {
            title: "Classic Wooden Pen",
            description: "Eco-friendly handcrafted design",
            price: "$2000",
            image: pen,
        },
    ];

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(245px,1fr))] gap-[20px]">
            {content.map((item, index) => (
                <div key={index} className="bg-gradient px-[10px] pt-[10px] pb-[23px] rounded-[12px] buy_cart">
                    <Link href="/single-products">
                        <figure className="w-full h-[208px] flex items-center justify-center rounded-[6px] bg-white mb-[24px] overflow-hidden cursor-pointer">
                            <Image src={item.image} alt={item.title} className="w-full h-full object-contain" />
                        </figure>
                    </Link>
                    <Link href="/single-products" className="block">
                        <h3 className="text-[18px] leading-[18px] mb-[10px] font-semibold hover:text-accent cursor-pointer">{item.title}</h3>
                        <span className="text-[15px] leading-[15px] block mb-[10px]">{item.description}</span>
                    </Link>
                    <div className="font-black text-[22px] leading-[22px] mb-[28px]">{item.price}</div>
                    <div className="flex gap-[10px]">
                        <Link href="/checkout">
                            <Button className="sm:text-[16px] text-[14px] leading-[16px] font-bold cursor-pointer h-auto md:py-[17px] py-[10px] 2xl:!px-[61px] !px-[40px] rounded-[12px]">
                                Buy Now <MoveRight size={24} />
                            </Button>
                        </Link>
                        <Link href="/cart">
                            <Button
                                variant="outline"
                                className="text-[16px] leading-[16px] font-bold cursor-pointer rounded-[12px] border-foreground md:h-[50px] h-[46px] w-[46px] md:w-[50px] bg-transparent hover:bg-transparent"
                            >
                                <ShoppingCart className="text-foreground" />
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default BuyCart;

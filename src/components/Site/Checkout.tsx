"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Link from "next/link";


function Checkout() {
    const [products, setProducts] = useState([
        { name: "Classic Square Corners", img: "/images/square_img.png", price: 3450, quantity: 1 },
        { name: "Classic Round Corners", img: "/images/round.png", price: 3450, quantity: 1 },
        { name: "Mp3 Players", img: "/images/mp3.png", price: 3450, quantity: 1 },
        { name: "Pens", img: "/images/pen_img.png", price: 3450, quantity: 1 },
    ]);

    const handleQuantityChange = (index: number, delta: number) => {
        setProducts((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const subtotal = products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <>
            <div className="sm:pt-[40px] pt-[20px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <ul className="flex gap-[5px] items-center ">
                        <li className="flex items-center gap-1">
                            <Link href="" className="text-[16px] leading-[16px] font-semibold text-[#111111CC]  hover:text-accent">Home</Link> <span>-</span>
                        </li>
                        <li className="flex items-center gap-1 text-[#111111] font-black">Add to Cart</li>
                    </ul>
                </div>
            </div>
            <div className="sm:pt-[50px] pt-[30px] xl:pb-[115px] lg:pb-[80px] pb-[50px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="grid grid-cols-1 lg:grid-cols-[61%_37%] gap-[23px] w-full">
                        {/* Product List */}
                        <Card
                            className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] pb-[30px]">
                            <CardHeader className="bg-accent rounded-t-[20px] sm:py-[16px] py-[10px] px-[34px]  font-semibold text-lg h-auto gap-0">
                                <div className="flex justify-between items-center text-white font-bold xl:text-[18px] text-[16px] uppercase">
                                    <div className="flex-1 sm:text-left text-center">Product</div>
                                    <div className="sm:flex hidden items-center xl:gap-[74px] gap-[54px]">
                                        <div className="">Price</div>
                                        <div className="">Quantity</div>
                                        <div className=" ">Total</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-[34px] space-y-[30px]">
                                {/* Column Headings */}
                                {products.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center sm:flex-row flex-col"
                                    >
                                        <div className="flex items-center gap-[10px] flex-1">
                                            <figure className="relative w-[56px] h-[56px] bg-gradient rounded-[10px] p-[10px]">
                                                <Image
                                                    src={item.img}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain w-full h-full"
                                                />
                                            </figure>
                                            <div className="text-[16px] font-semibold xl:w-[30%]">
                                                {item.name}
                                            </div>
                                        </div>

                                        <div className="flex items-center xl:gap-[64px] gap-[34px]">
                                            <div className="sm:text-[18px] text-[16px]  font-Regular ">
                                                ${item.price.toLocaleString()}
                                            </div>
                                            <div className="flex items-center border border-[#25252566] rounded-full px-2 py-1 w-24 justify-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-lg text-[#25252580] h-[2.5px] hover:bg-transparent cursor-pointer hover:text-foreground"
                                                    onClick={() => handleQuantityChange(idx, -1)}
                                                >
                                                    −
                                                </Button>
                                                <span className="mx-2 font-black">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-lg h-[2.5px] hover:bg-transparent cursor-pointer hover:text-foreground"
                                                    onClick={() => handleQuantityChange(idx, 1)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <div className=" font-semibold sm:text-[18px] text-[16px]">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div>
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px]">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[30px] font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px] text-white text-center gap-0">
                                    Payment Summary
                                </CardHeader>
                                <CardContent className="space-y-[20px] px-[24px]">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-[16px]">Subtotal:</span>
                                        <span className="font-semibold sm:text-[16px] text-[14px]">${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between ">
                                        <span className="font-bold text-[16px]">Shipping:</span>
                                        <span className="text-sky-600 cursor-pointer underline sm:text-[16px] text-[14px]">Add info</span>
                                    </div>
                                    <div className="flex justify-between ">
                                        <span className="font-bold text-[16px]">Coupon Code:</span>
                                        <span className="text-sky-600 cursor-pointer underline sm:text-[16px] text-[14px]">Add Coupon</span>
                                    </div>
                                    <div className="flex justify-between  ">
                                        <span className="text-[16px] font-bold">Grand total:</span>
                                        <span className="sm:text-[16px] text-[14px]">${subtotal.toLocaleString()}</span>
                                    </div>

                                    <Button variant="secondary" className="w-full h-auto bg-foreground font-bold  text-white py-[12px] sm:text-[16px] text-[14px] cursor-pointer">
                                        Proceed to Checkout <ArrowRight />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;

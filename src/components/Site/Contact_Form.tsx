import React from 'react';
import {SquarePen, User} from "lucide-react";
import {Button} from "@/components/ui/button";

function ContactForm() {
    return (
        <div className="bg-[#FFFFFF33] rounded-[12px] lg:p-[24px] p-[20px] backdrop-blur-[50px]">
            <h2 className="2xl:text-[32px] xl:text-[28px] md:text-[26px] sm:text-[24px] text-[22px] xl:leading-[38px] sm:leading-[32px] leading-[26px] text-white font-bold text-center md:mb-[16px] mb-[14px]">Custom Quotes in Under 10 Minutes Save Up to <span className="text-accent">50%</span> Off Website Prices</h2>
            <form>
                <ul className="grid sm:grid-cols-2 lg:gap-[15px] gap-[10px]">
                    <li className="">
                        <div
                            className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="text"
                                placeholder="Name"
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li>
                        <div
                            className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="tel"
                                placeholder="Phone"
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li>
                        <div
                            className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="email"
                                placeholder="email"
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li>
                        <div
                            className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="number"
                                placeholder="Quantity"
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li>
                        <div
                            className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="text"
                                placeholder="Specifications ( product ID, etc )"
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li><Button variant="secondary" className="cursor-pointer w-full plusJakarta-font font-bold text-foreground h-auto 2xl:py-[16px] lg:py-[15px] py-[13px] px-[10px]"><SquarePen/> Get a Quote</Button></li>
                </ul>
            </form>
        </div>
    );
}

export default ContactForm;
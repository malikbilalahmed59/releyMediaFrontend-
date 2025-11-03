"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import Image from "next/image";

export default function CheckoutForm() {
    const [paymentMethod, setPaymentMethod] = useState("credit");

    return (
        <>
            <div className="sm:pt-[40px] pt-[20px]">
                <div className="wrapper  2xl:px-0 px-[15px]">
                    <ul className="flex gap-[5px] items-center ">
                        <li className="flex items-center gap-1">
                            <Link
                                className="text-[16px] leading-[16px] font-semibold text-[#111111CC]  hover:text-accent"
                                href="/">Home</Link> <span>-</span>
                        </li>
                        <li className="flex items-center gap-1 text-[#111111] font-black">Check out</li>
                    </ul>
                </div>
            </div>
            <div className="sm:pt-[50px] pt-[30px] lg:pb-[80px] pb-[50px]">
                <div className="wrapper 2xl:px-0 px-[15px]">
                    <div className="grid xl:grid-cols-[62.8%_33.8%] md:grid-cols-[55.8%_40.8%]  xl:gap-[42px] lg:gap-[34px] gap-[20px]">
                        {/* Left Section - Billing + Card Details */}
                        <div className=" space-y-6">
                            {/* Billing Address */}
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] pb-[30px]">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[34px] font-semibold h-auto gap-0">
                                    <CardTitle className="text-white font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px]">Billing Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-[16px] px-[20px]">
                                    <div className="grid sm:grid-cols-2 gap-[16px]">
                                        <div>
                                            <Label className="form-label">Name</Label>
                                            <Input placeholder="John Doe" className="form-input"/>
                                        </div>
                                        <div>
                                            <Label className="form-label">Email</Label>
                                            <Input placeholder="nevaeh.simmons@example.com" className="form-input"/>
                                        </div>
                                        <div>
                                            <Label className="form-label">Phone</Label>
                                            <Input placeholder="(319) 555-0115" className="form-input"/>
                                        </div>
                                        <div>
                                            <Label className="form-label">Zip</Label>
                                            <Input placeholder="5948" className="form-input"/>
                                        </div>
                                        <div>
                                            <Label className="form-label">Company Name</Label>
                                            <Input placeholder="Biffco Enterprises Ltd." className="form-input"/>
                                        </div>
                                        <div>
                                            <Label className="form-label">Country</Label>
                                            <Input placeholder="USA" className="form-input"/>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="form-label">Address</Label>
                                        <Input placeholder="4517 Washington Ave. Manchester, Kentucky 39495" className="form-input"/>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card Details */}
                            <Card className="shadow-none border-[#25252526] pt-[0] rounded-[20px] bg-transparent gap-[25px] pb-[30px]">
                                <CardHeader className="bg-accent rounded-t-[20px] xl:py-[21px] sm:py-[20px] py-[14px] px-[34px] font-semibold h-auto gap-0">
                                    <CardTitle className="text-white font-bold xl:text-[18px] text-[16px] leading-[16px] xl:leading-[18px]">Card Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-[16px] px-[20px]">
                                    <div >
                                        <Label className="form-label">Name on Card</Label>
                                        <Input placeholder="John Doe" className="form-input"/>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-[16px]">
                                        <div>
                                            <Label className="form-label">Card Number</Label>
                                            <Input placeholder="1234 1234 1234 1234" className="form-input"/>
                                        </div>
                                        <div>
                                            <Label className="form-label">Card Expiry Date</Label>
                                            <Input placeholder="MM/YY" className="form-input"/>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="form-label">CVV</Label>
                                        <Input placeholder="768" className="form-input" />
                                    </div>
                                    <Button variant="secondary" className="w-full h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] cursor-pointer bg-foreground text-white xl:mt-[16px] mt-[10px]">
                                        Pay Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Section - Payment Options */}
                        <div>
                            <Card className="bg-[#F5F5F5] border-transparent rounded-[20px] py-[20px] px-[14px] shadow-none">
                                <CardContent className="px-0">
                                    <h3 className="text-[18px] leading-[18px] font-bold mb-[24px]">Choose Payment</h3>
                                    <RadioGroup
                                        defaultValue="credit"
                                        onValueChange={setPaymentMethod}
                                        className="space-y-4 lg:mb-[65px] mb-[55px]"
                                    >
                                        <div className="flex  space-x-[15px]">
                                            <RadioGroupItem value="credit" id="credit" className="w-[21px] h-[21px] relative top-[6px]"/>
                                            <Label htmlFor="credit" className="inline-block font-semibold text-[16px]">
                                                Pay via credit card
                                                <p className="lg:text-[15px] text-[12px] text-foreground/80 mt-[3px] !font-Regular">
                                                    (MasterCard, Maestro, Visa, Visa Electron, JCB <br className="lg:block hidden"/> and  American Express)
                                                </p>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-[15px]">
                                            <RadioGroupItem value="paypal" id="paypal" className="w-[21px] h-[21px] "/>
                                            <Label htmlFor="paypal" className="inline-block font-semibold text-[16px]">PayPal</Label>
                                        </div>
                                    </RadioGroup>

                                    <div className="flex flex-wrap justify-center items-center lg:gap-[16px] gap-[10px]">
                                        <Image src="/images/visa.png" alt="Visa" width={57} height={40} />
                                        <Image src="/images/mastercard.png" alt="MasterCard" width={57} height={40} />
                                        <Image src="/images/paypal.png" alt="PayPal" width={57} height={40} />
                                        <Image src="/images/stripe.png" alt="Stripe" width={57} height={40} />
                                        <Image src="/images/discover.png" alt="Discover" width={57} height={40} />
                                    </div>

                                    <div className="text-center text-[16px] font-bold mt-[13px]">
                                        Guaranteed safe checkout 🔒
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {Mail, User ,PhoneCall } from "lucide-react";
import Image from "next/image";
import contact_shape from "../../../public/images/contact_shape_img.png";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function ContactPageForm() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        quantity: '',
        productType: '',
        message: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(form)
        // Add your submission logic here (API call, etc.)
    }

    return (
        <div className="py-[50px] relative ">
            <div className="wrapper 2xl:px-0 px-[15px] ">
                <div className="flex justify-center items-center relative z-30">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-[821px] border-[#2525251A] rounded-[12px] sm:px-[24px] px-[18px] md:py-[36px] py-[26px] border"
                    >
                        <h2 className="lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold  2xl:mb-[34px] lg:mb-[26px]  mb-[20px] text-center">Contact Us</h2>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="relative w-full ">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Enter your first name"
                                        className="!pl-10 contact-input"
                                    />
                                </div>
                            <div className="relative w-full ">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Enter your last name"
                                    className="!pl-10 contact-input"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="relative w-full ">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="!pl-10 contact-input"
                                />
                            </div>
                            <div className="relative w-full">
                                <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    placeholder="Quantity (min. 250)"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    min={250}
                                    className="contact-input"
                                />
                            </div>
                            <div>
                                <Select
                                    onValueChange={(value) =>
                                        setForm({ ...form, productType: value })
                                    }

                                >
                                    <SelectTrigger id="productType" className="contact-input w-full h-[52px]">
                                        <SelectValue placeholder="Product Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bottle">Bottle</SelectItem>
                                        <SelectItem value="can">Can</SelectItem>
                                        <SelectItem value="box">Box</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Please enter your question or comment"
                                value={form.message}
                                onChange={handleChange}
                                className="contact-input resize-none  min-h-[88px]"
                            />
                        </div>
                        <Button type="submit" variant="secondary" className="w-full h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] cursor-pointer text-foreground" >Send</Button>
                    </form>
                </div>
            </div>
            <figure className="absolute bottom-[-18px] right-0">
                <Image src={contact_shape} alt="contact_shape"/>
            </figure>
        </div>
    )
}

export default ContactPageForm;
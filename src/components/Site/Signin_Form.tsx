'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, User, PhoneCall, LockKeyhole } from "lucide-react"
import Image from "next/image"
import contact_shape from "../../../public/images/contact_shape_img.png"
import Link from "next/link";

function Signin_Form() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(form)
        // Add your submission logic here (API call, etc.)
    }

    return (
        <div className="py-[50px] relative">
            <div className="wrapper 2xl:px-0 px-[15px] relative z-30">
                <div className="flex justify-center items-center relative z-30">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-[821px] border-[#2525251A] rounded-[12px] sm:px-[24px] px-[18px] md:py-[36px] py-[26px] border"
                    >
                        <h2 className="lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold text-center mb-[26px]">
                            Welcome Back
                        </h2>

                        {/* First & Last Name */}

                        {/* Email & Phone */}
                        <div className="grid md:grid-cols-1 gap-4 mb-4">
                            <div className="relative w-full">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4" />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input"
                                />
                            </div>
                            <div className="relative w-full">
                                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4" />
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input"
                                />
                            </div>
                        </div>


                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] cursor-pointer text-foreground"
                        >
                            Send
                        </Button>
                    </form>

                </div>
                <div className="text-center mt-[27px] text-[16px]">Don’t have an account yet?  <Link href="#" className="font-bold hover:text-accent">Sign Up</Link></div>
            </div>
            <figure className="absolute bottom-[-18px] right-0">
                <Image src={contact_shape} alt="contact shape" />
            </figure>
        </div>
    )
}

export default Signin_Form;

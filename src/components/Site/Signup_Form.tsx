'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, User, PhoneCall, LockKeyhole } from "lucide-react"
import Image from "next/image"
import contact_shape from "../../../public/images/contact_shape_img.png"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

function Signup_Form() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        username: '',
        businessName: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
        setError(null) // Clear error on input change
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (form.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        // Generate username from email if not provided
        const username = form.username || form.email.split('@')[0]

        setIsLoading(true)

        try {
            await register({
                email: form.email,
                username: username,
                password: form.password,
                password_confirm: form.confirmPassword,
                first_name: form.firstName,
                last_name: form.lastName,
                phone_number: form.phone,
                business_name: form.businessName,
            })
            
            // Redirect to home after successful registration (auto-login happens in register)
            router.push('/')
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.')
            setIsLoading(false)
        }
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
                            Get Started
                        </h2>

                        {/* First & Last Name */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="relative w-full">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                            <div className="relative w-full">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter your last name"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="relative w-full">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                            <div className="relative w-full">
                                <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Username & Business Name */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="relative w-full">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="text"
                                    name="username"
                                    placeholder="Username (optional)"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                            <div className="relative w-full">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="text"
                                    name="businessName"
                                    placeholder="Business name (optional)"
                                    value={form.businessName}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Password & Confirm Password */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="relative w-full">
                                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                            <div className="relative w-full">
                                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={isLoading}
                            className="w-full h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] cursor-pointer text-white disabled:opacity-50"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                </div>
                <div className="text-center mt-[27px] text-[16px]">Already have an account? <Link href="/signin" className="font-bold hover:text-accent">Sign In</Link></div>
            </div>
            <figure className="absolute bottom-[-18px] right-0">
                <Image src={contact_shape} alt="contact shape" />
            </figure>
        </div>
    )
}

export default Signup_Form

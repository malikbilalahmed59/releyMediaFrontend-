'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, LockKeyhole } from "lucide-react"
import Image from "next/image"
import contact_shape from "../../../public/images/contact_shape_img.png"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"

function Signin_Form() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
        setError(null) // Clear error on input change
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            await login({
                username_or_email: form.email,
                password: form.password,
            })
            
            // Redirect to returnUrl or home
            const returnUrl = searchParams.get('returnUrl') || '/'
            router.push(returnUrl)
        } catch (err: any) {
            let errorMessage = 'Login failed. Please check your credentials.';
            
            // Parse error message to provide better feedback
            if (err.message) {
                if (err.message.includes('404') || err.message.includes('Not Found')) {
                    errorMessage = 'Login endpoint not found. Please contact support or check your API configuration.';
                } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                    errorMessage = 'Invalid email or password. Please try again.';
                } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
                    errorMessage = 'Access denied. Please contact support.';
                } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (err.message.includes('Network') || err.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                } else {
                    // Try to extract a cleaner error message
                    try {
                        const errorData = JSON.parse(err.message);
                        if (errorData.error) {
                            errorMessage = errorData.error;
                        } else if (errorData.details && !errorData.details.includes('<!doctype')) {
                            errorMessage = errorData.details;
                        }
                    } catch {
                        // If parsing fails, use the original message if it's not HTML
                        if (!err.message.includes('<!doctype') && !err.message.includes('<html>')) {
                            errorMessage = err.message;
                        }
                    }
                }
            }
            
            setError(errorMessage);
            setIsLoading(false);
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
                            Welcome Back
                        </h2>

                        {/* First & Last Name */}

                        {/* Email & Phone */}
                        <div className="grid md:grid-cols-1 gap-4 mb-4">
                            <div className="relative w-full">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                            <div className="relative w-full">
                                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
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
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                </div>
                <div className="text-center mt-[27px] text-[16px]">Don't have an account yet?  <Link href="/signup" className="font-bold hover:text-accent">Create an Account</Link></div>
            </div>
            <figure className="absolute bottom-[-18px] right-0">
                <Image src={contact_shape} alt="contact shape" />
            </figure>
        </div>
    )
}

export default Signin_Form;

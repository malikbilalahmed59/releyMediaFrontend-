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
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        
        // Special handling for phone field - only allow numbers and limit to 10 digits
        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '');
            const limitedValue = digitsOnly.slice(0, 10);
            setForm({ ...form, [name]: limitedValue });
        } else {
            setForm({ ...form, [name]: value });
        }
        setError(null) // Clear error on input change
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (!form.name || !form.name.trim()) {
            setError('Name is required')
            return
        }

        if (!form.email || !form.email.trim()) {
            setError('Email is required')
            return
        }

        if (form.phone && form.phone.trim()) {
            const digitsOnly = form.phone.replace(/\D/g, '');
            if (digitsOnly.length !== 10) {
                setError('Phone number must be exactly 10 digits')
                return
            }
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (form.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        // Generate username from email
        const username = form.email.split('@')[0]
        // Split name into first and last name
        const nameParts = form.name.trim().split(/\s+/)
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        setIsLoading(true)

        try {
            await register({
                email: form.email,
                username: username,
                password: form.password,
                password_confirm: form.confirmPassword,
                first_name: firstName,
                last_name: lastName,
                phone_number: form.phone,
                business_name: '',
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
                        {/* Name */}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    maxLength={10}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
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

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {Mail, User ,PhoneCall } from "lucide-react";
import Image from "next/image";
import contact_shape from "../../../public/images/contact_shape_img.png";
import { useAuth } from "@/contexts/AuthContext";
import * as accountsAPI from '@/lib/api/accounts';
import { useToast } from "@/components/ui/toast";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function ContactPageForm() {
    const { isAuthenticated, user } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        quantity: '',
        productType: '',
        message: '',
    })

    // Prefill form with user data when authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            setForm(prev => ({
                ...prev,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone: user.phone_number || '',
            }));
        }
    }, [isAuthenticated, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate all required fields
        const errors: string[] = [];
        
        if (!form.firstName || !form.firstName.trim()) {
            errors.push('First name is required');
        }
        
        if (!form.lastName || !form.lastName.trim()) {
            errors.push('Last name is required');
        }
        
        if (!form.email || !form.email.trim()) {
            errors.push('Email is required');
        }
        
        if (!form.phone || !form.phone.trim()) {
            errors.push('Phone number is required');
        }
        
        if (!form.quantity || !form.quantity.trim()) {
            errors.push('Quantity is required');
        }
        
        if (!form.productType || !form.productType.trim()) {
            errors.push('Product type is required');
        }
        
        if (!form.message || !form.message.trim()) {
            errors.push('Message is required');
        }
        
        if (errors.length > 0) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: errors.join('. '),
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await accountsAPI.submitQuoteRequest({
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
                phone: form.phone,
                quantity: form.quantity,
                product_type: form.productType,
                message: form.message,
                referred_url: typeof window !== 'undefined' ? window.location.href : undefined,
            });

            // Redirect to success page
            router.push('/success/contact');
        } catch (error: any) {
            console.error('Error submitting quote request:', error);
            addToast({
                type: 'error',
                title: 'Submission Failed',
                description: error.message || 'Failed to submit quote request. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
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
                            <div className="relative w-full ">
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

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="relative w-full ">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                            <div className="relative w-full">
                                <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground h-4 w-4 z-10" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
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
                                    className="contact-input !h-auto !rounded-[12px]"
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
                        <Button 
                            type="submit" 
                            variant="secondary" 
                            disabled={isSubmitting}
                            className="w-full h-auto font-bold text-[16px] 2xl:py-[18px] lg:py-[16px] py-[14px] cursor-pointer text-foreground disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Send'}
                        </Button>
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
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

function ContactPageForm() {
    const { isAuthenticated, user } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        quantity: '',
        productId: '',
        message: '',
    })

    // Prefill form with user data when authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const fullName = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '';
            setForm(prev => ({
                ...prev,
                name: fullName,
                email: user.email || '',
                phone: user.phone_number || '',
            }));
        }
    }, [isAuthenticated, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Special handling for phone field - only allow numbers and limit to 10 digits
        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '');
            const limitedValue = digitsOnly.slice(0, 10);
            setForm({ ...form, [name]: limitedValue });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    // Helper function to validate phone number (exactly 10 digits)
    const validatePhoneNumber = (phone: string): boolean => {
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length === 10;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate all required fields
        const errors: string[] = [];
        
        if (!form.name || !form.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!form.email || !form.email.trim()) {
            errors.push('Email is required');
        }
        
        if (!form.phone || !form.phone.trim()) {
            errors.push('Phone number is required');
        } else if (!validatePhoneNumber(form.phone)) {
            errors.push('Phone number must be exactly 10 digits');
        }
        
        if (!form.message || !form.message.trim()) {
            errors.push('Please enter your question or comment');
        }
        
        // Quantity and Product ID are optional, no validation needed
        
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
            // Split name into first and last name if available
            const nameParts = form.name.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Build payload, only including quantity if it has a valid value
            const payload: any = {
                name: form.name,
                first_name: firstName,
                last_name: lastName,
                email: form.email,
                phone: form.phone,
                specifications: form.message,
                message: form.message,
                referred_url: typeof window !== 'undefined' ? window.location.href : undefined,
            };
            
            // Only include quantity if it's a valid non-empty value
            if (form.quantity && form.quantity.trim() !== '') {
                payload.quantity = form.quantity.trim();
            }
            
            // Only include product_id if it has a valid value
            if (form.productId && form.productId.trim() !== '') {
                payload.product_id = form.productId.trim();
            }
            
            await accountsAPI.submitQuoteRequest(payload);

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
                                    id="phone"
                                    name="phone"
                                    placeholder="Phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    maxLength={10}
                                    required
                                    className="!pl-10 contact-input !h-auto !rounded-[12px]"
                                />
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-4">
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                placeholder="Quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                className="contact-input !h-auto !rounded-[12px]"
                            />
                        </div>

                        {/* Product ID */}
                        <div className="mb-4">
                            <Input
                                id="productId"
                                name="productId"
                                type="text"
                                placeholder="Product ID"
                                value={form.productId}
                                onChange={handleChange}
                                className="contact-input !h-auto !rounded-[12px]"
                            />
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
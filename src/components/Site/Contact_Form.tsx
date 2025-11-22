'use client';

import React, { useState, useEffect } from 'react';
import {SquarePen, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import * as accountsAPI from '@/lib/api/accounts';
import { useToast } from "@/components/ui/toast";

function ContactForm() {
    const { isAuthenticated, user } = useAuth();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        quantity: '',
        specifications: '',
    });

    // Prefill form with user data when authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            setForm(prev => ({
                ...prev,
                name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '',
                email: user.email || '',
                phone: user.phone_number || '',
            }));
        }
    }, [isAuthenticated, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
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
        }
        
        if (!form.quantity || !form.quantity.trim()) {
            errors.push('Quantity is required');
        }
        
        if (!form.specifications || !form.specifications.trim()) {
            errors.push('Specifications are required');
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
            // Split name into first and last name if available
            const nameParts = form.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            await accountsAPI.submitQuoteRequest({
                name: form.name,
                first_name: firstName,
                last_name: lastName,
                email: form.email,
                phone: form.phone,
                quantity: form.quantity,
                specifications: form.specifications,
            });

            addToast({
                type: 'success',
                title: 'Quote Request Submitted',
                description: 'Your quote request has been submitted successfully. We will contact you soon!',
            });

            // Reset form after successful submission (keep prefilled data if user is logged in)
            setForm({
                name: isAuthenticated && user 
                    ? (user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '')
                    : '',
                email: isAuthenticated && user ? (user.email || '') : '',
                phone: isAuthenticated && user ? (user.phone_number || '') : '',
                quantity: '',
                specifications: '',
            });
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
    };

    return (
        <div className="bg-[#FFFFFF33] rounded-[12px] lg:p-[24px] p-[20px] backdrop-blur-[50px] lg:sticky lg:top-[20px] lg:self-start">
            <h2 className="2xl:text-[32px] xl:text-[28px] md:text-[26px] sm:text-[24px] text-[22px] xl:leading-[38px] sm:leading-[32px] leading-[26px] text-white font-bold text-center md:mb-[16px] mb-[14px]">Custom Quotes in Under 10 Minutes Save Up to <span className="text-accent">50%</span> Off Website Prices</h2>
            <form onSubmit={handleSubmit}>
                <ul className="grid sm:grid-cols-2 lg:gap-[15px] gap-[10px]">
                    <li className="">
                        <div className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={form.name}
                                onChange={handleChange}
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li>
                        <div className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li>
                        <div className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="email"
                                name="email"
                                placeholder="email"
                                value={form.email}
                                onChange={handleChange}
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li>
                        <div className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li>
                        <div className="custom-input-wrapper">
                            <User className="text-white"/>
                            <input
                                type="text"
                                name="specifications"
                                placeholder="Specifications ( product ID, etc )"
                                value={form.specifications}
                                onChange={handleChange}
                                className="bg-transparent outline-none text-white placeholder-white placeholder:text-[16px] text-[16px] w-full"
                            />
                        </div>
                    </li>
                    <li><Button 
                        type="submit" 
                        variant="secondary" 
                        disabled={isSubmitting}
                        className="cursor-pointer w-full plusJakarta-font font-bold text-foreground h-auto 2xl:py-[16px] lg:py-[15px] py-[13px] px-[10px] disabled:opacity-50"
                    >
                        <SquarePen/> {isSubmitting ? 'Submitting...' : 'Get a Quote'}
                    </Button></li>
                </ul>
            </form>
        </div>
    );
}

export default ContactForm;
// app/profile/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john@example.com",
    });

    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [address, setAddress] = useState({
        shipping: "",
        billing: "",
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    return (
        <div className="wrapper 2xl:px-0 px-[15px] mx-auto py-[50px]">
            <Card className="max-w-2xl mx-auto shadow-lg rounded-2xl gap-0 p-0">
                <CardHeader className="py-[18px] gap-0">
                    <CardTitle className="text-[22px] font-semibold">Profile Settings</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="py-[24px]">
                    <Tabs defaultValue="profile">
                        <TabsList className="grid grid-cols-3 w-full p-[5px] h-auto">
                            <TabsTrigger value="profile" className="text-[16px] leading-[16px] font-semibold py-[12px] h-auto cursor-pointer">Profile</TabsTrigger>
                            <TabsTrigger value="password" className="text-[16px] leading-[16px] font-semibold py-[12px] h-auto cursor-pointer">Password</TabsTrigger>
                            <TabsTrigger value="addresses" className="text-[16px] leading-[16px] font-semibold py-[12px] h-auto cursor-pointer">Addresses</TabsTrigger>
                        </TabsList>

                        {/* Profile Info Tab */}
                        <TabsContent value="profile">
                            <form className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="name" className="form-label">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        onChange={handleProfileChange}
                                        placeholder="Enter your full name"
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="form-label">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        onChange={handleProfileChange}
                                        placeholder="Enter your email"
                                        type="email"
                                        className="form-input"
                                    />
                                </div>
                                <Button type="button" variant="secondary" className="w-full h-auto font-bold text-[16px] 2xl:py-[18px]
                                     lg:py-[16px] py-[14px] cursor-pointer bg-foreground text-white xl:mt-[16px] mt-[10px]">
                                    Save Changes
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Password Change Tab */}
                        <TabsContent value="password">
                            <form className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="current" className="form-label">Current Password</Label>
                                    <Input
                                        id="current"
                                        name="current"
                                        onChange={handlePasswordChange}
                                        type="password"
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="new" className="form-label">New Password</Label>
                                    <Input
                                        id="new"
                                        name="new"
                                        onChange={handlePasswordChange}
                                        type="password"
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="confirm" className="form-label">Confirm Password</Label>
                                    <Input
                                        id="confirm"
                                        name="confirm"
                                        onChange={handlePasswordChange}
                                        type="password"
                                        className="form-input"
                                    />
                                </div>
                                <Button type="button" className="w-full h-auto font-bold text-[16px] 2xl:py-[18px]
                                     lg:py-[16px] py-[14px] cursor-pointer bg-foreground text-white xl:mt-[16px] mt-[10px]">
                                    Update Password
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Addresses Tab */}
                        <TabsContent value="addresses">
                            <form className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="shipping" className="form-label">Shipping Address</Label>
                                    <Input
                                        id="shipping"
                                        name="shipping"
                                        className="form-input"
                                        onChange={handleAddressChange}
                                        placeholder="Enter shipping address"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="billing" className="form-label">Billing Address</Label>
                                    <Input
                                        id="billing"
                                        name="billing"
                                        className="form-input"
                                        onChange={handleAddressChange}
                                        placeholder="Enter billing address"
                                    />
                                </div>
                                <Button type="button" className="w-full h-auto font-bold text-[16px] 2xl:py-[18px]
                                     lg:py-[16px] py-[14px] cursor-pointer bg-foreground text-white xl:mt-[16px] mt-[10px]">
                                    Save Addresses
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

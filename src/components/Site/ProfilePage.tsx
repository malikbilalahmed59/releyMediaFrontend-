// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AddressForm from "@/components/Site/AddressForm";
import { useAuth } from "@/contexts/AuthContext";
import * as accountsAPI from '@/lib/api/accounts';
import { useToast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserAddress, CreateAddressRequest } from '@/lib/api/accounts';

export default function ProfilePage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'profile');
    const [profile, setProfile] = useState<{
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        business_name: string;
    }>({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        business_name: "",
    });

    const [password, setPassword] = useState<{
        current: string;
        new: string;
        confirm: string;
    }>({
        current: "",
        new: "",
        confirm: "",
    });

    const [loading, setLoading] = useState(true);
    const [sameAsBilling, setSameAsBilling] = useState(false);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedBillingId, setSelectedBillingId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadProfile();
        loadAddresses();
    }, []);

    // Update active tab when URL changes
    useEffect(() => {
        if (tabFromUrl && ['profile', 'password', 'addresses'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const profileData = await accountsAPI.getProfile();
            setProfile({
                first_name: profileData.first_name ?? "",
                last_name: profileData.last_name ?? "",
                email: profileData.email ?? "",
                phone_number: profileData.phone_number ?? "",
                business_name: profileData.business_name ?? "",
            });
        } catch (error: any) {
            console.error('Error loading profile:', error);
            addToast({
                type: 'error',
                title: 'Error',
                description: 'Failed to load profile',
            });
        } finally {
            setLoading(false);
        }
    };

    const loadAddresses = async () => {
        try {
            const response = await accountsAPI.getAddresses();
            let addressesArray: UserAddress[] = [];
            
            if (Array.isArray(response)) {
                addressesArray = response;
            } else if (response && typeof response === 'object') {
                const responseObj = response as any;
                if ('results' in responseObj && Array.isArray(responseObj.results)) {
                    addressesArray = responseObj.results;
                } else if ('data' in responseObj && Array.isArray(responseObj.data)) {
                    addressesArray = responseObj.data;
                } else if ('addresses' in responseObj && Array.isArray(responseObj.addresses)) {
                    addressesArray = responseObj.addresses;
                }
            }
            
            setAddresses(addressesArray);
            
            // Set default billing address if available
            const defaultBilling = addressesArray.find(a => a.address_type === 'billing' && a.is_default);
            if (defaultBilling) {
                setSelectedBillingId(defaultBilling.id);
            }
        } catch (error: any) {
            console.error('Error loading addresses:', error);
        }
    };

    const handleAddressSaved = () => {
        loadAddresses();
    };

    const handleSyncAddresses = async () => {
        if (!selectedBillingId) {
            addToast({
                type: 'warning',
                title: 'No Billing Address',
                description: 'Please select or create a billing address first',
            });
            return;
        }

        const billingAddress = addresses.find(a => a.id === selectedBillingId);
        if (!billingAddress) {
            addToast({
                type: 'error',
                title: 'Error',
                description: 'Billing address not found',
            });
            return;
        }

        try {
            setProcessing(true);
            
            // Get all addresses to find existing shipping address
            const allAddresses = await accountsAPI.getAddresses();
            let addressesArray: UserAddress[] = [];
            
            if (Array.isArray(allAddresses)) {
                addressesArray = allAddresses;
            } else if (allAddresses && typeof allAddresses === 'object') {
                const addressesObj = allAddresses as any;
                if ('results' in addressesObj && Array.isArray(addressesObj.results)) {
                    addressesArray = addressesObj.results;
                } else if ('data' in addressesObj && Array.isArray(addressesObj.data)) {
                    addressesArray = addressesObj.data;
                } else if ('addresses' in addressesObj && Array.isArray(addressesObj.addresses)) {
                    addressesArray = addressesObj.addresses;
                }
            }

            // Find existing shipping address
            const existingShipping = addressesArray.find(a => a.address_type === 'shipping');
            
            const shippingData: CreateAddressRequest = {
                address_type: 'shipping',
                address_line1: billingAddress.address_line1,
                address_line2: billingAddress.address_line2,
                city: billingAddress.city,
                state: billingAddress.state,
                postal_code: billingAddress.postal_code,
                country: billingAddress.country,
                is_default: billingAddress.is_default,
            };

            if (existingShipping) {
                // Update existing shipping address via PUT
                await accountsAPI.updateAddress(existingShipping.id, shippingData);
            } else {
                // Create new shipping address via POST
                await accountsAPI.createAddress(shippingData);
            }

            await loadAddresses();
            
            addToast({
                type: 'success',
                title: 'Addresses Synced!',
                description: 'Shipping address has been synced with billing address',
            });
        } catch (error: any) {
            console.error('Error syncing addresses:', error);
            addToast({
                type: 'error',
                title: 'Sync Failed',
                description: error.message || 'Failed to sync addresses. Please try again.',
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value ?? "" }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword(prev => ({ ...prev, [name]: value ?? "" }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await accountsAPI.updateProfile(profile);
            addToast({
                type: 'success',
                title: 'Success',
                description: 'Profile updated successfully',
            });
        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Error',
                description: error.message || 'Failed to update profile',
            });
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.new !== password.confirm) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Passwords do not match',
            });
            return;
        }
        try {
            await accountsAPI.changePassword({
                old_password: password.current,
                new_password: password.new,
                new_password_confirm: password.confirm,
            });
            addToast({
                type: 'success',
                title: 'Success',
                description: 'Password updated successfully',
            });
            setPassword({ current: "", new: "", confirm: "" });
        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Error',
                description: error.message || 'Failed to update password',
            });
        }
    };

    return (
        <div className="wrapper 2xl:px-0 px-[15px] mx-auto py-[50px]">
            <Card className="max-w-2xl mx-auto shadow-lg rounded-2xl gap-0 p-0">
                <CardHeader className="py-[18px] gap-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[22px] font-semibold">Profile Settings</CardTitle>
                        <Link href="/accounts/orders">
                            <Button variant="outline" className="h-auto py-2 px-4 text-[14px] font-semibold">
                                My Orders
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="py-[24px]">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-3 w-full p-[5px] h-auto">
                            <TabsTrigger value="profile" className="text-[16px] leading-[16px] font-semibold py-[12px] h-auto cursor-pointer">Profile</TabsTrigger>
                            <TabsTrigger value="password" className="text-[16px] leading-[16px] font-semibold py-[12px] h-auto cursor-pointer">Password</TabsTrigger>
                            <TabsTrigger value="addresses" className="text-[16px] leading-[16px] font-semibold py-[12px] h-auto cursor-pointer">Addresses</TabsTrigger>
                        </TabsList>

                        {/* Profile Info Tab */}
                        <TabsContent value="profile">
                            <form onSubmit={handleProfileSubmit} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="first_name" className="form-label">First Name</Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            value={profile.first_name ?? ""}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your first name"
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="last_name" className="form-label">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            value={profile.last_name ?? ""}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your last name"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email" className="form-label">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={profile.email ?? ""}
                                        onChange={handleProfileChange}
                                        placeholder="Enter your email"
                                        type="email"
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone_number" className="form-label">Phone Number</Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        value={profile.phone_number ?? ""}
                                        onChange={handleProfileChange}
                                        placeholder="Enter your phone number"
                                        type="tel"
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="business_name" className="form-label">Business Name</Label>
                                    <Input
                                        id="business_name"
                                        name="business_name"
                                        value={profile.business_name ?? ""}
                                        onChange={handleProfileChange}
                                        placeholder="Enter your business name (optional)"
                                        className="form-input"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" className="w-full h-auto font-bold text-[16px] 2xl:py-[18px]
                                     lg:py-[16px] py-[14px] cursor-pointer bg-foreground text-white xl:mt-[16px] mt-[10px]">
                                    Save Changes
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Password Change Tab */}
                        <TabsContent value="password">
                            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="current" className="form-label">Current Password</Label>
                                    <Input
                                        id="current"
                                        name="current"
                                        value={password.current ?? ""}
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
                                        value={password.new ?? ""}
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
                                        value={password.confirm ?? ""}
                                        onChange={handlePasswordChange}
                                        type="password"
                                        className="form-input"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-auto font-bold text-[16px] 2xl:py-[18px]
                                     lg:py-[16px] py-[14px] cursor-pointer bg-foreground text-white xl:mt-[16px] mt-[10px]">
                                    Update Password
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Addresses Tab */}
                        <TabsContent value="addresses">
                            <div className="space-y-6 mt-4">
                                <div>
                                    <h3 className="text-[18px] font-bold mb-4">Billing Addresses</h3>
                                    <AddressForm 
                                        addressType="billing" 
                                        showExisting={true}
                                        onAddressSaved={handleAddressSaved}
                                        onSelect={setSelectedBillingId}
                                        selectedAddressId={selectedBillingId}
                                        syncWithType={sameAsBilling ? 'shipping' : null}
                                    />
                                </div>
                                <Separator />
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[18px] font-bold">Shipping Addresses</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="same_as_billing_profile"
                                                    checked={sameAsBilling}
                                                    onCheckedChange={(checked) => {
                                                        setSameAsBilling(checked as boolean);
                                                    }}
                                                />
                                                <Label htmlFor="same_as_billing_profile" className="text-[14px] cursor-pointer font-semibold">
                                                    Same as billing address
                                                </Label>
                                            </div>
                                            {sameAsBilling && selectedBillingId && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleSyncAddresses}
                                                    disabled={processing}
                                                    className="h-8 text-xs font-semibold"
                                                >
                                                    {processing ? 'Syncing...' : '🔄 Sync Now'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {sameAsBilling && selectedBillingId && (
                                        <div className="mb-4 p-3 bg-accent/10 border-2 border-accent/30 rounded-lg">
                                            <p className="text-[14px] font-semibold text-foreground mb-2">
                                                ✓ Shipping address will be synced with billing address
                                            </p>
                                            {(() => {
                                                const selectedBilling = addresses.find(a => a.id === selectedBillingId);
                                                return selectedBilling ? (
                                                    <div className="text-[12px] text-muted-foreground mt-2 p-2 bg-white rounded text-left">
                                                        <p className="font-semibold">{selectedBilling.address_line1}</p>
                                                        {selectedBilling.address_line2 && <p>{selectedBilling.address_line2}</p>}
                                                        <p>{selectedBilling.city}, {selectedBilling.state} {selectedBilling.postal_code}</p>
                                                        <p>{selectedBilling.country}</p>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </div>
                                    )}
                                    {!sameAsBilling && (
                                        <AddressForm 
                                            addressType="shipping" 
                                            showExisting={true}
                                            onAddressSaved={handleAddressSaved}
                                            syncWithType={null}
                                        />
                                    )}
                                    {sameAsBilling && (
                                        <div className="text-center py-4 bg-muted/30 rounded-lg">
                                            <p className="text-[14px] text-muted-foreground">
                                                Shipping address will be the same as billing address. 
                                                Create or edit a billing address to sync automatically, or click "Sync Now" to sync existing addresses.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

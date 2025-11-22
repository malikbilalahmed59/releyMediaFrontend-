'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import * as accountsAPI from '@/lib/api/accounts';
import type { UserAddress, CreateAddressRequest } from '@/lib/api/accounts';
import { useToast } from "@/components/ui/toast";
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface AddressFormProps {
    addressType: 'billing' | 'shipping';
    onAddressSaved?: () => void;
    showExisting?: boolean;
    onSelect?: (addressId: number) => void;
    selectedAddressId?: number | null;
    syncWithType?: 'billing' | 'shipping' | null; // Address type to sync with
    onSyncAddress?: (addressId: number) => void; // Callback when synced address is created/updated
}

export default function AddressForm({ 
    addressType, 
    onAddressSaved, 
    showExisting = true,
    onSelect,
    selectedAddressId,
    syncWithType = null,
    onSyncAddress
}: AddressFormProps) {
    const { addToast } = useToast();
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<CreateAddressRequest>({
        address_type: addressType,
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'USA',
        is_default: false,
    });

    useEffect(() => {
        loadAddresses();
    }, [addressType]);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const response = await accountsAPI.getAddresses();
            
            // Handle different response formats
            let allAddresses: UserAddress[] = [];
            
            if (Array.isArray(response)) {
                // Direct array response
                allAddresses = response;
            } else if (response && typeof response === 'object') {
                // Check for paginated response (results array)
                const responseObj = response as any;
                if ('results' in responseObj && Array.isArray(responseObj.results)) {
                    allAddresses = responseObj.results;
                } else if ('data' in responseObj && Array.isArray(responseObj.data)) {
                    allAddresses = responseObj.data;
                } else if ('addresses' in responseObj && Array.isArray(responseObj.addresses)) {
                    allAddresses = responseObj.addresses;
                } else {
                    console.warn('Unexpected address response format:', response);
                    allAddresses = [];
                }
            }
            
            const filtered = allAddresses.filter(a => a && a.address_type === addressType);
            setAddresses(filtered);
        } catch (error: any) {
            console.error('Error loading addresses:', error);
            addToast({
                type: 'error',
                title: 'Error',
                description: error.message || 'Failed to load addresses',
            });
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEdit = (address: UserAddress) => {
        setFormData({
            address_type: address.address_type,
            address_line1: address.address_line1,
            address_line2: address.address_line2 || '',
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
            is_default: address.is_default,
        });
        setEditingId(address.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            console.log('[Delete Address] Attempting to delete address ID:', id, 'Type:', typeof id);
            
            // Ensure ID is a valid number
            if (!id || isNaN(Number(id))) {
                throw new Error('Invalid address ID');
            }
            
            await accountsAPI.deleteAddress(Number(id));
            addToast({
                type: 'success',
                title: 'Success',
                description: 'Address deleted successfully',
            });
            // Reload addresses to update the list
            await loadAddresses();
            if (onAddressSaved) onAddressSaved();
        } catch (error: any) {
            console.error('[Delete Address] Error:', error);
            console.error('[Delete Address] Error details:', {
                message: error.message,
                stack: error.stack,
            });
            
            // Handle 404 error specifically
            let errorMessage = 'Failed to delete address';
            if (error.message) {
                if (error.message.includes('404') || error.message.includes('Not Found') || error.message.includes('No UserAddress matches')) {
                    errorMessage = 'Address not found. It may have already been deleted or does not belong to your account.';
                    // Still reload addresses in case it was deleted but we got an error
                    await loadAddresses();
                } else {
                    errorMessage = error.message;
                }
            }
            
            addToast({
                type: 'error',
                title: 'Delete Failed',
                description: errorMessage,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.address_line1 || !formData.city || !formData.state || !formData.postal_code || !formData.country) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                description: 'Please fill in all required fields',
            });
            return;
        }

        try {
            let savedAddress: UserAddress;
            
            if (editingId) {
                // Update existing address
                savedAddress = await accountsAPI.updateAddress(editingId, formData);
                addToast({
                    type: 'success',
                    title: 'Success',
                    description: 'Address updated successfully',
                });
            } else {
                // Create new address
                savedAddress = await accountsAPI.createAddress(formData);
                addToast({
                    type: 'success',
                    title: 'Success',
                    description: 'Address added successfully',
                });
            }

            // If syncing is enabled, create/update the corresponding address via API
            if (syncWithType && syncWithType !== addressType) {
                try {
                    // Get all addresses to find if there's an existing address of the sync type
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
                    
                    // Find existing address of the sync type
                    // Priority: 1) Default address of sync type, 2) First address of sync type, 3) Matching address by data
                    let existingSyncAddress = addressesArray.find(
                        a => a.address_type === syncWithType && a.is_default
                    ) || addressesArray.find(
                        a => a.address_type === syncWithType
                    );
                    
                    // If we're editing and there's a selected address, try to find a matching one
                    // (addresses with same data but different type)
                    if (editingId && !existingSyncAddress) {
                        const currentAddress = addressesArray.find(a => a.id === editingId);
                        if (currentAddress) {
                            // Try to find an address with matching data
                            existingSyncAddress = addressesArray.find(
                                a => a.address_type === syncWithType &&
                                a.address_line1 === currentAddress.address_line1 &&
                                a.city === currentAddress.city &&
                                a.postal_code === currentAddress.postal_code
                            );
                        }
                    }
                    
                    // Prepare sync address data (same data but different type)
                    const syncAddressData: CreateAddressRequest = {
                        address_type: syncWithType,
                        address_line1: formData.address_line1,
                        address_line2: formData.address_line2,
                        city: formData.city,
                        state: formData.state,
                        postal_code: formData.postal_code,
                        country: formData.country,
                        is_default: formData.is_default,
                    };
                    
                    let syncedAddressId: number;
                    
                    if (existingSyncAddress) {
                        // Update existing sync address via PUT request
                        console.log(`Updating ${syncWithType} address (ID: ${existingSyncAddress.id}) to match ${addressType} address`);
                        const updatedSyncAddress = await accountsAPI.updateAddress(
                            existingSyncAddress.id, 
                            syncAddressData
                        );
                        syncedAddressId = updatedSyncAddress.id;
                    } else {
                        // Create new sync address via POST request to /api/accounts/addresses/
                        console.log(`[Address Sync] Creating new ${syncWithType} address via POST request to match ${addressType} address`);
                        console.log(`[Address Sync] POST payload:`, JSON.stringify(syncAddressData, null, 2));
                        const newSyncAddress = await accountsAPI.createAddress(syncAddressData);
                        syncedAddressId = newSyncAddress.id;
                        console.log(`[Address Sync] POST successful - Created ${syncWithType} address with ID: ${syncedAddressId}`);
                    }
                    
                    // Notify parent component about the synced address
                    if (onSyncAddress) {
                        onSyncAddress(syncedAddressId);
                    }
                    
                    addToast({
                        type: 'success',
                        title: 'Addresses Synced',
                        description: `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} and ${syncWithType.charAt(0).toUpperCase() + syncWithType.slice(1)} addresses are now the same`,
                    });
                } catch (syncError: any) {
                    console.error('Error syncing address:', syncError);
                    addToast({
                        type: 'warning',
                        title: 'Sync Warning',
                        description: `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} address saved, but ${syncWithType} address sync failed. Please update it manually.`,
                    });
                }
            }

            // Reset form
            setFormData({
                address_type: addressType,
                address_line1: '',
                address_line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'USA',
                is_default: false,
            });
            setEditingId(null);
            setShowForm(false);
            loadAddresses();
            if (onAddressSaved) onAddressSaved();
        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Error',
                description: error.message || 'Failed to save address',
            });
        }
    };

    const resetForm = () => {
        setFormData({
            address_type: addressType,
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'USA',
            is_default: false,
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="text-center py-4">Loading addresses...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Existing Addresses */}
            {showExisting && addresses.length > 0 && (
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <Card 
                            key={address.id} 
                            className={`border-2 transition-all ${
                                selectedAddressId === address.id 
                                    ? 'border-accent bg-accent/5 shadow-md' 
                                    : 'border-border hover:border-accent/50'
                            }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h4 className="font-semibold text-[16px] text-foreground">
                                                {address.address_line1}
                                            </h4>
                                            {address.is_default && (
                                                <span className="text-xs bg-accent text-white px-2 py-1 rounded-full font-semibold">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        {address.address_line2 && (
                                            <p className="text-[14px] text-muted-foreground mb-1">{address.address_line2}</p>
                                        )}
                                        <p className="text-[14px] text-muted-foreground mb-1">
                                            {address.city}, {address.state} {address.postal_code}
                                        </p>
                                        <p className="text-[14px] text-muted-foreground font-medium">{address.country}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {onSelect && (
                                            <Button
                                                variant={selectedAddressId === address.id ? "secondary" : "outline"}
                                                size="sm"
                                                onClick={() => onSelect(address.id)}
                                                className="h-8 px-3"
                                                title={selectedAddressId === address.id ? "Selected" : "Select this address"}
                                            >
                                                {selectedAddressId === address.id ? (
                                                    <>
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Selected
                                                    </>
                                                ) : (
                                                    'Select'
                                                )}
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(address)}
                                            className="h-8 w-8 p-0"
                                            title="Edit address"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(address.id)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            title="Delete address"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm ? (
                <Card className="border-2 border-accent shadow-lg">
                    <CardHeader className="bg-accent/10 pb-3">
                        <CardTitle className="text-[18px] font-bold">
                            {editingId ? `Edit ${addressType.charAt(0).toUpperCase() + addressType.slice(1)} Address` : `Add New ${addressType.charAt(0).toUpperCase() + addressType.slice(1)} Address`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="address_line1" className="form-label">
                                    Address Line 1 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="address_line1"
                                    name="address_line1"
                                    value={formData.address_line1}
                                    onChange={handleInputChange}
                                    placeholder="123 Main St"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="address_line2" className="form-label">Address Line 2</Label>
                                <Input
                                    id="address_line2"
                                    name="address_line2"
                                    value={formData.address_line2}
                                    onChange={handleInputChange}
                                    placeholder="Suite 100 (optional)"
                                    className="form-input"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city" className="form-label">
                                        City <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="New York"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state" className="form-label">
                                        State <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="NY"
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="postal_code" className="form-label">
                                        Postal Code <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="postal_code"
                                        name="postal_code"
                                        value={formData.postal_code}
                                        onChange={handleInputChange}
                                        placeholder="10001"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="country" className="form-label">
                                        Country <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="USA"
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_default"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onCheckedChange={(checked) => 
                                        setFormData(prev => ({ ...prev, is_default: checked as boolean }))
                                    }
                                />
                                <Label htmlFor="is_default" className="text-[14px] cursor-pointer">
                                    Set as default {addressType} address
                                </Label>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button 
                                    type="submit" 
                                    variant="secondary" 
                                    className="flex-1 h-auto py-3 font-semibold"
                                >
                                    {editingId ? 'Update Address' : 'Save Address'}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={resetForm}
                                    className="h-auto py-3 px-4"
                                    title="Cancel"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    variant="outline"
                    onClick={() => setShowForm(true)}
                    className="w-full h-auto py-3 font-semibold border-2 border-dashed hover:border-accent hover:bg-accent/5 transition-colors"
                >
                    + Add New {addressType.charAt(0).toUpperCase() + addressType.slice(1)} Address
                </Button>
            )}
        </div>
    );
}


'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategories, type Category } from '@/lib/api/catalog';
import { createSlug } from '@/lib/utils/slug';

interface FilterSidebarProps {
    categoryData?: {
        id: number;
        name: string;
        subcategories?: Array<{
            id: number;
            name: string;
        }>;
    } | null;
}

function FilterSidebar({ categoryData }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
        searchParams.get('subcategory_id') ? parseInt(searchParams.get('subcategory_id')!) : null
    );
    
    // Filter state from URL params
    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
    const [minQuantity, setMinQuantity] = useState(searchParams.get('min_quantity') || '');
    const [maxQuantity, setMaxQuantity] = useState(searchParams.get('max_quantity') || '');
    const [closeout, setCloseout] = useState(searchParams.get('closeout') === 'true');
    const [usaMade, setUsaMade] = useState(searchParams.get('usa_made') === 'true');
    const [bestSelling, setBestSelling] = useState(searchParams.get('best_selling') === 'true');
    const [rushService, setRushService] = useState(searchParams.get('rush_service') === 'true');
    const [ecoFriendly, setEcoFriendly] = useState(searchParams.get('eco_friendly') === 'true');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Sync filter state with URL params when they change
    useEffect(() => {
        setMinPrice(searchParams.get('min_price') || '');
        setMaxPrice(searchParams.get('max_price') || '');
        setMinQuantity(searchParams.get('min_quantity') || '');
        setMaxQuantity(searchParams.get('max_quantity') || '');
        setCloseout(searchParams.get('closeout') === 'true');
        setUsaMade(searchParams.get('usa_made') === 'true');
        setBestSelling(searchParams.get('best_selling') === 'true');
        setRushService(searchParams.get('rush_service') === 'true');
        setEcoFriendly(searchParams.get('eco_friendly') === 'true');
        const subcatId = searchParams.get('subcategory_id');
        setSelectedSubcategory(subcatId ? parseInt(subcatId) : null);
    }, [searchParams]);

    const applyFilters = (includeSubcategory = true) => {
        const params = new URLSearchParams();
        
        // Check if we're on a category page
        const pathname = window.location.pathname;
        const isCategoryPage = pathname?.startsWith('/products/category/');
        const categorySlug = isCategoryPage ? pathname.split('/products/category/')[1]?.split('?')[0] : null;
        
        // Preserve search query from URL
        const q = searchParams.get('q');
        if (q) params.set('q', q);
        
        // Subcategory filter
        if (includeSubcategory && selectedSubcategory) {
            params.set('subcategory_id', selectedSubcategory.toString());
        }
        
        // Price filters
        if (minPrice) params.set('min_price', minPrice);
        if (maxPrice) params.set('max_price', maxPrice);
        
        // Quantity filters
        if (minQuantity) params.set('min_quantity', minQuantity);
        if (maxQuantity) params.set('max_quantity', maxQuantity);
        
        // Boolean filters
        if (closeout) params.set('closeout', 'true');
        if (usaMade) params.set('usa_made', 'true');
        if (bestSelling) params.set('best_selling', 'true');
        if (rushService) params.set('rush_service', 'true');
        if (ecoFriendly) params.set('eco_friendly', 'true');
        
        // Preserve ordering
        const ordering = searchParams.get('ordering');
        if (ordering) params.set('ordering', ordering);
        
        params.set('page', '1'); // Reset to first page
        
        // If on category page, preserve the category slug in the path
        if (isCategoryPage && categorySlug) {
            router.push(`/products/category/${categorySlug}?${params.toString()}`);
        } else {
            router.push(`/products?${params.toString()}`);
        }
    };

    // Auto-apply boolean filters when changed
    const handleCloseoutChange = (checked: boolean) => {
        setCloseout(checked);
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set('closeout', 'true');
        } else {
            params.delete('closeout');
        }
        updateUrlWithFilters(params);
    };

    const handleUsaMadeChange = (checked: boolean) => {
        setUsaMade(checked);
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set('usa_made', 'true');
        } else {
            params.delete('usa_made');
        }
        updateUrlWithFilters(params);
    };

    const updateUrlWithFilters = (params: URLSearchParams) => {
        const pathname = window.location.pathname;
        const isCategoryPage = pathname?.startsWith('/products/category/');
        const categorySlug = isCategoryPage ? pathname.split('/products/category/')[1]?.split('?')[0] : null;
        params.set('page', '1');
        if (isCategoryPage && categorySlug) {
            router.push(`/products/category/${categorySlug}?${params.toString()}`);
        } else {
            router.push(`/products?${params.toString()}`);
        }
    };

    const handleBestSellingChange = (checked: boolean) => {
        setBestSelling(checked);
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set('best_selling', 'true');
        } else {
            params.delete('best_selling');
        }
        updateUrlWithFilters(params);
    };

    const handleRushServiceChange = (checked: boolean) => {
        setRushService(checked);
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set('rush_service', 'true');
        } else {
            params.delete('rush_service');
        }
        updateUrlWithFilters(params);
    };

    const handleEcoFriendlyChange = (checked: boolean) => {
        setEcoFriendly(checked);
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set('eco_friendly', 'true');
        } else {
            params.delete('eco_friendly');
        }
        updateUrlWithFilters(params);
    };

    const handleSubcategoryClick = (subcategoryId: number) => {
        const pathname = window.location.pathname;
        const isCategoryPage = pathname?.startsWith('/products/category/');
        const categorySlug = isCategoryPage ? pathname.split('/products/category/')[1]?.split('?')[0] : null;
        const params = new URLSearchParams(searchParams.toString());
        
        // Toggle subcategory - if same one clicked, remove it
        if (selectedSubcategory === subcategoryId) {
            params.delete('subcategory_id');
            setSelectedSubcategory(null);
        } else {
            params.set('subcategory_id', subcategoryId.toString());
            setSelectedSubcategory(subcategoryId);
        }
        
        params.set('page', '1');
        if (isCategoryPage && categorySlug) {
            router.push(`/products/category/${categorySlug}?${params.toString()}`);
        } else {
            router.push(`/products?${params.toString()}`);
        }
    };

    const resetFilters = () => {
        const pathname = window.location.pathname;
        const isCategoryPage = pathname?.startsWith('/products/category/');
        const categorySlug = isCategoryPage ? pathname.split('/products/category/')[1]?.split('?')[0] : null;
        const params = new URLSearchParams();
        const q = searchParams.get('q');
        if (q) params.set('q', q);
        const ordering = searchParams.get('ordering');
        if (ordering) params.set('ordering', ordering);
        
        setMinPrice('');
        setMaxPrice('');
        setMinQuantity('');
        setMaxQuantity('');
        setCloseout(false);
        setUsaMade(false);
        setBestSelling(false);
        setRushService(false);
        setEcoFriendly(false);
        setSelectedSubcategory(null);
        
        if (isCategoryPage && categorySlug) {
            router.push(`/products/category/${categorySlug}${params.toString() ? `?${params.toString()}` : ''}`);
        } else {
            router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
        }
    };

    const handleCategoryClick = (categoryName: string) => {
        const categorySlug = createSlug(categoryName);
        router.push(`/products/category/${categorySlug}`);
    };

    return (
        <div className="w-full border border-[#ECECEC] rounded-[20px] px-[15px] py-[20px]">
            <div className="flex justify-between pb-[14px] mb-[25px] border-b border-[#ECECEC] px-[15px]">
                <h5 className="text-[18px] font-semibold leading-[18px] text-[#151515]">Filters</h5>
                <button 
                    onClick={resetFilters}
                    className="inline-block text-[14px] leading-[14px] plusJakarta-font text-[#151515] hover:text-accent cursor-pointer"
                >
                    Reset
                </button>
            </div>

            {/* Price */}
            <div className="mb-[20px]">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Price</h4>
                <div className="flex items-center space-x-2">
                    <Input 
                        type="number"
                        placeholder="Min" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border border-[#E5E5E5] text-[16px] leading-[16px] placeholder:text-[#B2B2B2] rounded-[6px] h-[31px]" 
                    />
                    <span>-</span>
                    <Input 
                        type="number"
                        placeholder="Max" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border border-[#E5E5E5] text-[16px] leading-[16px] placeholder:text-[#B2B2B2] rounded-[6px] h-[31px]" 
                    />
                    <Button 
                        variant="secondary" 
                        onClick={() => applyFilters()}
                        className="rounded-[6px] cursor-pointer h-[31px]"
                    >
                        <Play className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>

            {/* Quantity */}
            <div className="mb-[20px]">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Quantity</h4>
                <div className="flex items-center space-x-2">
                    <Input 
                        type="number"
                        placeholder="Min" 
                        value={minQuantity}
                        onChange={(e) => setMinQuantity(e.target.value)}
                        className="border border-[#E5E5E5] text-[16px] leading-[16px] placeholder:text-[#B2B2B2] rounded-[6px] h-[31px]" 
                    />
                    <span>-</span>
                    <Input 
                        type="number"
                        placeholder="Max" 
                        value={maxQuantity}
                        onChange={(e) => setMaxQuantity(e.target.value)}
                        className="border border-[#E5E5E5] text-[16px] leading-[16px] placeholder:text-[#B2B2B2] rounded-[6px] h-[31px]" 
                    />
                    <Button 
                        variant="secondary" 
                        onClick={() => applyFilters()}
                        className="rounded-[6px] cursor-pointer h-[31px]"
                    >
                        <Play className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>

            {/* Options */}
            <div className="mb-[20px]">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Options</h4>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="usa_made" 
                            checked={usaMade}
                            onCheckedChange={(checked) => handleUsaMadeChange(checked === true)}
                            className="w-[18px] h-[18px]" 
                        />
                        <label htmlFor="usa_made" className="text-[17px] text-[#919191] cursor-pointer">Made in USA</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="closeout" 
                            checked={closeout}
                            onCheckedChange={(checked) => handleCloseoutChange(checked === true)}
                            className="w-[18px] h-[18px]" 
                        />
                        <label htmlFor="closeout" className="text-[17px] text-[#919191] cursor-pointer">Clearance</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="best_selling" 
                            checked={bestSelling}
                            onCheckedChange={(checked) => handleBestSellingChange(checked === true)}
                            className="w-[18px] h-[18px]" 
                        />
                        <label htmlFor="best_selling" className="text-[17px] text-[#919191] cursor-pointer">Best Selling</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="rush_service" 
                            checked={rushService}
                            onCheckedChange={(checked) => handleRushServiceChange(checked === true)}
                            className="w-[18px] h-[18px]" 
                        />
                        <label htmlFor="rush_service" className="text-[17px] text-[#919191] cursor-pointer">24 Hour Rush</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="eco_friendly" 
                            checked={ecoFriendly}
                            onCheckedChange={(checked) => handleEcoFriendlyChange(checked === true)}
                            className="w-[18px] h-[18px]" 
                        />
                        <label htmlFor="eco_friendly" className="text-[17px] text-[#919191] cursor-pointer">Eco Friendly & Sustainable</label>
                        </div>
                </div>
            </div>

            {/* Subcategories - Show when category is selected */}
            {categoryData && categoryData.subcategories && categoryData.subcategories.length > 0 && (
            <div className="mb-[20px]">
                    <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Subcategories</h4>
                    <div className="space-y-2">
                        {categoryData.subcategories.map((subcategory) => (
                            <div
                                key={subcategory.id}
                                className={`flex items-center justify-between text-[16px] cursor-pointer hover:text-accent ${
                                    selectedSubcategory === subcategory.id ? 'font-bold text-accent' : ''
                                }`}
                                onClick={() => handleSubcategoryClick(subcategory.id)}
                            >
                                <span>{subcategory.name}</span>
                                <ArrowRight className="w-6 h-6" />
                        </div>
                    ))}
                </div>
            </div>
            )}

            {/* Categories */}
            <div className="space-y-2">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Categories</h4>
                {loadingCategories ? (
                    <div className="text-[14px] text-[#919191]">Loading categories...</div>
                ) : categories.length > 0 ? (
                    categories.map((category) => {
                        const isSelected = categoryData?.id === category.id;
                        return (
                            <div
                                key={category.id}
                                className={`flex items-center justify-between text-[16px] cursor-pointer hover:text-accent ${
                                    isSelected ? 'font-bold text-accent' : ''
                                }`}
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                <span>{category.name}</span>
                        <ArrowRight className="w-6 h-6" />
                    </div>
                        );
                    })
                ) : (
                    <div className="text-[14px] text-[#919191]">No categories available</div>
                )}
            </div>
        </div>
    );
}

export default FilterSidebar;

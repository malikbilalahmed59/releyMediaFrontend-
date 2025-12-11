'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    getCategories, 
    getCategorySubcategories,
    getFilterMaterials,
    getFilterBrands,
    type Category,
    type FilterMaterial,
    type FilterBrand
} from '@/lib/api/catalog';
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
    const [subcategories, setSubcategories] = useState<Array<{ id: number; name: string }>>([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const [materials, setMaterials] = useState<FilterMaterial[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [brands, setBrands] = useState<FilterBrand[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(false);
    // Initialize showAll states based on whether items are selected
    const [showAllMaterials, setShowAllMaterials] = useState(() => {
        return !!searchParams.get('material');
    });
    const [showAllBrands, setShowAllBrands] = useState(() => {
        return !!searchParams.get('brand');
    });
    const [showAllColors, setShowAllColors] = useState(false);
    
    // Static list of colors in the exact order provided
    const staticColors = [
        'Black',
        'White',
        'Blue',
        'Red',
        'Yellow',
        'Green',
        'Orange',
        'Purple',
        'Brown',
        'Gray',
        'Silver',
        'Gold',
        'Pink',
        'Navy',
        'Royal Blue',
        'Light Blue',
        'Burgundy',
        'Crimson',
        'Dark Green',
        'Lime Green',
        'Light Green',
        'Tan',
        'Teal'
    ];
    
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
        searchParams.get('subcategory_id') ? parseInt(searchParams.get('subcategory_id')!) : null
    );
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(
        searchParams.get('material') || null
    );
    const [selectedBrand, setSelectedBrand] = useState<string | null>(
        searchParams.get('brand') || null
    );
    const [selectedColor, setSelectedColor] = useState<string | null>(
        searchParams.get('color') || null
    );
    const [searchQuery, setSearchQuery] = useState<string>(
        searchParams.get('q') || ''
    );
    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
    
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

    // Auto-expand sections when items are selected
    useEffect(() => {
        if (selectedMaterial) {
            setShowAllMaterials(true);
        }
    }, [selectedMaterial]);
    
    useEffect(() => {
        if (selectedBrand) {
            setShowAllBrands(true);
        }
    }, [selectedBrand]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                // Ensure we have a valid categories array
                if (data && data.categories && Array.isArray(data.categories)) {
                    setCategories(data.categories);
                } else {
                    console.warn('Invalid categories data structure:', data);
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Set empty array on error to prevent UI breaking
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch subcategories when category is selected
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (categoryData?.id) {
                // First check if subcategories are already in categoryData
                if (categoryData.subcategories && Array.isArray(categoryData.subcategories) && categoryData.subcategories.length > 0) {
                    setSubcategories(categoryData.subcategories);
                } else {
                    // Otherwise fetch them separately
                    setLoadingSubcategories(true);
                    try {
                        const data = await getCategorySubcategories(categoryData.id);
                        setSubcategories(data.subcategories || []);
                    } catch (error) {
                        console.error('Error fetching subcategories:', error);
                        setSubcategories([]);
                    } finally {
                        setLoadingSubcategories(false);
                    }
                }
            } else {
                setSubcategories([]);
            }
        };
        fetchSubcategories();
    }, [categoryData?.id, categoryData?.subcategories]);

    // Memoize filter params to prevent unnecessary refetches
    const filterParams = useMemo(() => {
        const subcategoryIdFromUrl = searchParams.get('subcategory_id');
        const subcategoryId = subcategoryIdFromUrl ? parseInt(subcategoryIdFromUrl) : selectedSubcategory;
        
        return {
            categoryId: categoryData?.id,
            subcategoryId: subcategoryId || undefined,
            searchQuery: searchParams.get('q') || undefined,
            brand: searchParams.get('brand') || undefined,
            material: searchParams.get('material') || undefined,
            color: searchParams.get('color') || undefined,
            closeout: searchParams.get('closeout') === 'true' ? true : searchParams.get('closeout') === 'false' ? false : undefined,
            usaMade: searchParams.get('usa_made') === 'true' ? true : searchParams.get('usa_made') === 'false' ? false : undefined,
            rushService: searchParams.get('rush_service') === 'true' ? true : searchParams.get('rush_service') === 'false' ? false : undefined,
            ecoFriendly: searchParams.get('eco_friendly') === 'true' ? true : searchParams.get('eco_friendly') === 'false' ? false : undefined,
            minPrice: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
            maxPrice: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
            minQuantity: searchParams.get('min_quantity') ? parseInt(searchParams.get('min_quantity')!) : undefined,
            maxQuantity: searchParams.get('max_quantity') ? parseInt(searchParams.get('max_quantity')!) : undefined,
        };
    }, [categoryData?.id, selectedSubcategory, searchParams]);

    // Fetch dynamic filters (materials and brands) based on context
    useEffect(() => {
        const abortController = new AbortController();
        
        const fetchDynamicFilters = async () => {
            if (!filterParams.categoryId) {
                setMaterials([]);
                setBrands([]);
                return;
            }

            // Base params with all filters except the one being fetched
            const baseParams = {
                category_id: filterParams.categoryId,
                subcategory_id: filterParams.subcategoryId,
                q: filterParams.searchQuery,
                color: filterParams.color,
                closeout: filterParams.closeout,
                usa_made: filterParams.usaMade,
                rush_service: filterParams.rushService,
                eco_friendly: filterParams.ecoFriendly,
                min_price: filterParams.minPrice,
                max_price: filterParams.maxPrice,
                min_quantity: filterParams.minQuantity,
                max_quantity: filterParams.maxQuantity,
            };

            setLoadingMaterials(true);
            setLoadingBrands(true);
            
            try {
                // Fetch materials with brand filter (if brand is selected, show materials for that brand)
                // Don't exclude selected material - it should appear in the list to show it's selected
                // Fetch brands with material filter (if material is selected, show brands for that material)
                // Don't exclude selected brand - it should appear in the list to show it's selected
                const [materialsData, brandsData] = await Promise.all([
                    getFilterMaterials({
                        ...baseParams,
                        brand: filterParams.brand, // Include brand filter when fetching materials (filter by selected brand)
                        // Don't pass material: filterParams.material - we want selected material to show in the list
                    }).catch(err => {
                        if (err.name === 'AbortError') return { materials: [] };
                        console.error('Error fetching materials:', err);
                        return { materials: [] };
                    }),
                    getFilterBrands({
                        ...baseParams,
                        // Don't pass brand: filterParams.brand - we want selected brand to show in the list
                        material: filterParams.material, // Include material filter when fetching brands (filter by selected material)
                    }).catch(err => {
                        if (err.name === 'AbortError') return { brands: [] };
                        console.error('Error fetching brands:', err);
                        return { brands: [] };
                    }),
                ]);
                
                if (!abortController.signal.aborted) {
                    setMaterials(materialsData.materials || []);
                    setBrands(brandsData.brands || []);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching dynamic filters:', error);
                }
                if (!abortController.signal.aborted) {
                    setMaterials([]);
                    setBrands([]);
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoadingMaterials(false);
                    setLoadingBrands(false);
                }
            }
        };

        fetchDynamicFilters();

        return () => {
            abortController.abort();
        };
    }, [filterParams]);

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
        setSelectedMaterial(searchParams.get('material') || null);
        setSelectedBrand(searchParams.get('brand') || null);
        setSelectedColor(searchParams.get('color') || null);
        setSearchQuery(searchParams.get('q') || '');
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
        
        // Material filter
        if (selectedMaterial) {
            params.set('material', selectedMaterial);
        }
        
        // Brand filter
        if (selectedBrand) {
            params.set('brand', selectedBrand);
        }
        
        // Color filter
        if (selectedColor) {
            params.set('color', selectedColor);
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

    const updateUrlWithFilters = useCallback((params: URLSearchParams) => {
        const pathname = window.location.pathname;
        const isCategoryPage = pathname?.startsWith('/products/category/');
        const categorySlug = isCategoryPage ? pathname.split('/products/category/')[1]?.split('?')[0] : null;
        params.set('page', '1');
        if (isCategoryPage && categorySlug) {
            router.push(`/products/category/${categorySlug}?${params.toString()}`);
        } else {
            router.push(`/products?${params.toString()}`);
        }
    }, [router]);

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
        setSelectedMaterial(null);
        setSelectedBrand(null);
        setSelectedColor(null);
        
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

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value);
        
        // Clear existing debounce timer
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        
        // Debounce the actual search API call
        searchDebounceRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (value.trim()) {
                params.set('q', value.trim());
            } else {
                params.delete('q');
            }
            
            params.set('page', '1');
            updateUrlWithFilters(params);
        }, 500); // 500ms debounce delay
    }, [searchParams, updateUrlWithFilters]);

    const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Clear debounce and execute immediately on Enter
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
            const params = new URLSearchParams(searchParams.toString());
            
            if (searchQuery.trim()) {
                params.set('q', searchQuery.trim());
            } else {
                params.delete('q');
            }
            
            params.set('page', '1');
            updateUrlWithFilters(params);
        }
    }, [searchQuery, searchParams, updateUrlWithFilters]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        // Clear debounce timer
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        params.set('page', '1');
        updateUrlWithFilters(params);
    }, [searchParams, updateUrlWithFilters]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, []);

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

            {/* Search Bar - At the top */}
            <div className="mb-[20px]">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Search Within Results</h4>
                <div className="relative flex items-center">
                    <div className="absolute left-3 pointer-events-none z-10">
                        <Search className="h-4 w-4 text-[#B2B2B2]" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search by name or description"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        className="border border-[#E5E5E5] text-[16px] leading-[16px] placeholder:text-[#B2B2B2] rounded-[6px] h-[40px] pl-[40px] pr-[40px] flex-1"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 hover:bg-gray-100 rounded-full p-1 transition-colors z-10"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4 text-[#B2B2B2] hover:text-[#151515]" />
                        </button>
                    )}
                </div>
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
                    {/* Best Selling - Commented out for future phase */}
                    {/* <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="best_selling" 
                            checked={bestSelling}
                            onCheckedChange={(checked) => handleBestSellingChange(checked === true)}
                            className="w-[18px] h-[18px]" 
                        />
                        <label htmlFor="best_selling" className="text-[17px] text-[#919191] cursor-pointer">Best Selling</label>
                    </div> */}
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

            {/* Materials Filter */}
            {(materials.length > 0 || loadingMaterials) && (
                <div className="mb-[20px]">
                    <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Material</h4>
                    {loadingMaterials ? (
                        <div className="text-[14px] text-[#919191]">Loading materials...</div>
                    ) : materials.length > 0 ? (
                        <>
                            <div className="space-y-2">
                                {(showAllMaterials ? materials : materials.slice(0, 5)).map((material) => {
                                    const handleMaterialChange = () => {
                                        const newMaterial = selectedMaterial === material.name ? null : material.name;
                                        setSelectedMaterial(newMaterial);
                                        const params = new URLSearchParams(searchParams.toString());
                                        if (newMaterial) {
                                            params.set('material', newMaterial);
                                        } else {
                                            params.delete('material');
                                        }
                                        params.set('page', '1');
                                        updateUrlWithFilters(params);
                                    };
                                    return (
                                        <div
                                            key={material.name}
                                            className={`flex items-center space-x-2 cursor-pointer hover:text-accent ${
                                                selectedMaterial === material.name ? 'font-bold text-accent' : ''
                                            }`}
                                            onClick={handleMaterialChange}
                                        >
                                            <Checkbox 
                                                checked={selectedMaterial === material.name}
                                                onCheckedChange={handleMaterialChange}
                                                className="w-[18px] h-[18px]" 
                                            />
                                            <label className="text-[17px] text-[#919191] cursor-pointer flex-1">
                                                {material.name} <span className="text-[14px] text-[#B2B2B2]">({material.count})</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            {materials.length > 5 && (
                                <button
                                    onClick={() => setShowAllMaterials(!showAllMaterials)}
                                    className="mt-2 text-[14px] text-accent hover:underline flex items-center gap-1"
                                >
                                    {showAllMaterials ? (
                                        <>
                                            Show Less <ChevronUp className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            Show More ({materials.length - 5} more) <ChevronDown className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-[14px] text-[#919191]">No materials available</div>
                    )}
                </div>
            )}

            {/* Brands Filter */}
            {(brands.length > 0 || loadingBrands) && (
                <div className="mb-[20px]">
                    <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Brand</h4>
                    {loadingBrands ? (
                        <div className="text-[14px] text-[#919191]">Loading brands...</div>
                    ) : brands.length > 0 ? (
                        <>
                            <div className="space-y-2">
                                {(showAllBrands ? brands : brands.slice(0, 5)).map((brand) => {
                                    const handleBrandChange = () => {
                                        const newBrand = selectedBrand === brand.name ? null : brand.name;
                                        setSelectedBrand(newBrand);
                                        const params = new URLSearchParams(searchParams.toString());
                                        if (newBrand) {
                                            params.set('brand', newBrand);
                                        } else {
                                            params.delete('brand');
                                        }
                                        params.set('page', '1');
                                        updateUrlWithFilters(params);
                                    };
                                    return (
                                        <div
                                            key={brand.name}
                                            className={`flex items-center space-x-2 cursor-pointer hover:text-accent ${
                                                selectedBrand === brand.name ? 'font-bold text-accent' : ''
                                            }`}
                                            onClick={handleBrandChange}
                                        >
                                            <Checkbox 
                                                checked={selectedBrand === brand.name}
                                                onCheckedChange={handleBrandChange}
                                                className="w-[18px] h-[18px]" 
                                            />
                                            <label className="text-[17px] text-[#919191] cursor-pointer flex-1">
                                                {brand.name} <span className="text-[14px] text-[#B2B2B2]">({brand.count})</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            {brands.length > 5 && (
                                <button
                                    onClick={() => setShowAllBrands(!showAllBrands)}
                                    className="mt-2 text-[14px] text-accent hover:underline flex items-center gap-1"
                                >
                                    {showAllBrands ? (
                                        <>
                                            Show Less <ChevronUp className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            Show More ({brands.length - 5} more) <ChevronDown className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-[14px] text-[#919191]">No brands available</div>
                    )}
                </div>
            )}

            {/* Colors Filter - Static List in 2 Columns */}
            <div className="mb-[20px]">
                <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Color</h4>
                <div className="grid grid-cols-2 gap-2">
                    {(showAllColors ? staticColors : staticColors.slice(0, 15)).map((color) => {
                        const handleColorChange = () => {
                            const newColor = selectedColor === color ? null : color;
                            setSelectedColor(newColor);
                            const params = new URLSearchParams(searchParams.toString());
                            if (newColor) {
                                params.set('color', newColor);
                            } else {
                                params.delete('color');
                            }
                            params.set('page', '1');
                            updateUrlWithFilters(params);
                        };
                        return (
                            <div
                                key={color}
                                className={`flex items-center space-x-1 cursor-pointer hover:text-accent ${
                                    selectedColor === color ? 'font-bold text-accent' : ''
                                }`}
                                onClick={handleColorChange}
                            >
                                <Checkbox 
                                    checked={selectedColor === color}
                                    onCheckedChange={handleColorChange}
                                    className="w-[16px] h-[16px]" 
                                />
                                <label className="text-[14px] text-[#919191] cursor-pointer flex-1 truncate">
                                    {color}
                                </label>
                            </div>
                        );
                    })}
                </div>
                {staticColors.length > 15 && (
                    <button
                        onClick={() => setShowAllColors(!showAllColors)}
                        className="mt-2 text-[14px] text-accent hover:underline flex items-center gap-1"
                    >
                        {showAllColors ? (
                            <>
                                Show Less <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Show More ({staticColors.length - 15} more) <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Subcategories - Show when category is selected */}
            {categoryData && (subcategories.length > 0 || loadingSubcategories) && (
                <div className="mb-[20px]">
                    <h4 className="text-[16px] font-bold leading-[16px] mb-[10px]">Subcategories</h4>
                    {loadingSubcategories ? (
                        <div className="text-[14px] text-[#919191]">Loading subcategories...</div>
                    ) : subcategories.length > 0 ? (
                        <div className="space-y-2">
                            {subcategories.map((subcategory) => (
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
                    ) : null}
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

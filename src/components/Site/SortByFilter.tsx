'use client';
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const orderingMap: Record<string, { label: string; value: string }> = {
    best: { label: "Best Match", value: "best_match" },
    newest: { label: "Newest", value: "newest" },
    popular: { label: "Most Popular", value: "most_popular" },
    priceLow: { label: "Price: Low to High", value: "price_low_high" },
    priceHigh: { label: "Price: High to Low", value: "price_high_low" },
};

const reverseOrderingMap: Record<string, string> = {
    best_match: "best",
    newest: "newest",
    popular: "popular",
    most_popular: "popular",
    price_low_high: "priceLow",
    price_high_low: "priceHigh",
};

export default function SortByFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentOrdering = searchParams.get('ordering') || 'best_match';
    const currentId = reverseOrderingMap[currentOrdering] || 'best';
    
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(orderingMap[currentId]?.label || "Best Match")
    const [options, setOptions] = useState([
        { id: "best", label: "Best Match", checked: currentId === "best" },
        { id: "newest", label: "Newest", checked: currentId === "newest" },
        { id: "popular", label: "Most Popular", checked: currentId === "popular" },
        { id: "priceLow", label: "Price: Low to High", checked: currentId === "priceLow" },
        { id: "priceHigh", label: "Price: High to Low", checked: currentId === "priceHigh" },
    ])

    useEffect(() => {
        const currentId = reverseOrderingMap[currentOrdering] || 'best';
        const selectedOpt = orderingMap[currentId];
        if (selectedOpt) {
            setSelected(selectedOpt.label);
            setOptions([
                { id: "best", label: "Best Match", checked: currentId === "best" },
                { id: "newest", label: "Newest", checked: currentId === "newest" },
                { id: "popular", label: "Most Popular", checked: currentId === "popular" },
                { id: "priceLow", label: "Price: Low to High", checked: currentId === "priceLow" },
                { id: "priceHigh", label: "Price: High to Low", checked: currentId === "priceHigh" },
            ]);
        }
    }, [currentOrdering]);

    const handleSelect = (id: string) => {
        const updated = options.map((opt) => ({
            ...opt,
            checked: opt.id === id,
        }))
        setOptions(updated)
        const selectedOpt = updated.find((opt) => opt.checked)
        setSelected(selectedOpt?.label || "Sort")
        
        // Close the popover
        setOpen(false);
        
        // Update URL with new ordering
        const params = new URLSearchParams(searchParams.toString());
        params.set('ordering', orderingMap[id].value);
        params.set('page', '1'); // Reset to first page
        router.push(`/products?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-[11px] justify-end">
            <span className="font-semibold text-[14px]">Sort By:</span>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-[245px] h-[38px] border border-[#E5E5E5] rounded-[10px] justify-between text-sm font-normal hover:bg-transparent text-[#B2B2B2]"
                    >
                        {selected}
                        <ChevronDown className="h-4 w-4 text-foreground" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[245px] p-2 space-y-2">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => handleSelect(option.id)}
                        >
                            <Checkbox
                                checked={option.checked}
                                onCheckedChange={() => handleSelect(option.id)}
                            />
                            <label className="text-sm cursor-pointer">{option.label}</label>
                        </div>
                    ))}
                </PopoverContent>
            </Popover>
        </div>
    )
}

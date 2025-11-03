import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function SortByFilter() {
    const [selected, setSelected] = useState("Best Match")
    const [options, setOptions] = useState([
        { id: "best", label: "Best Match", checked: true },
        { id: "newest", label: "Newest" },
        { id: "popular", label: "Most Popular" },
        { id: "priceLow", label: "Price: Low to High" },
        { id: "priceHigh", label: "Price: High to Low" },
    ])

    const handleSelect = (id: string) => {
        const updated = options.map((opt) => ({
            ...opt,
            checked: opt.id === id,
        }))
        setOptions(updated)
        const selectedOpt = updated.find((opt) => opt.checked)
        setSelected(selectedOpt?.label || "Sort")
    }

    return (
        <div className="flex items-center gap-[11px] justify-end">
            <span className="font-semibold text-[14px]">Sort By:</span>
            <Popover>
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

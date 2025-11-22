'use client';

import React, { useState, useEffect } from 'react';
import './CustomizationSelector.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X, Sparkles, Printer, Palette, Check } from 'lucide-react';
import * as customizationAPI from '@/lib/api/customization';
import type { 
    CustomizationOptionsResponse, 
    CartCustomization,
    EmbroideryOption,
    DigitalPrintOption,
    ScreenPrintOption
} from '@/lib/api/customization';

interface CustomizationSelectorProps {
    quantity: number;
    onCustomizationsChange: (customizations: CartCustomization[], totalPrice: number) => void;
}

export default function CustomizationSelector({ quantity, onCustomizationsChange }: CustomizationSelectorProps) {
    const [options, setOptions] = useState<CustomizationOptionsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCustomizations, setSelectedCustomizations] = useState<CartCustomization[]>([]);
    
    // Screen print state
    const [screenPrintColorCount, setScreenPrintColorCount] = useState<number | null>(null);
    
    // Embroidery state
    const [embroideryOptionId, setEmbroideryOptionId] = useState<number | null>(null);
    const [stitchCount, setStitchCount] = useState<string>('');
    
    // Digital print state
    const [digitalPrintOptionId, setDigitalPrintOptionId] = useState<number | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
                const data = await customizationAPI.getCustomizationOptions();
                setOptions(data);
            } catch (error) {
                console.error('Error fetching customization options:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        updateCustomizations();
    }, [screenPrintColorCount, embroideryOptionId, stitchCount, digitalPrintOptionId, quantity, options]);

    const updateCustomizations = () => {
        const customizations: CartCustomization[] = [];
        let totalPrice = 0;

        // Screen print
        if (screenPrintColorCount && options?.screen_print) {
            const price = customizationAPI.getScreenPrintPrice(
                options.screen_print.options as ScreenPrintOption[],
                screenPrintColorCount,
                quantity
            );
            if (price > 0) {
                customizations.push({
                    customization_type: 'screen_print',
                    color_count: screenPrintColorCount,
                });
                totalPrice += price * quantity;
            }
        }

        // Embroidery
        if (embroideryOptionId && stitchCount && options?.embroidery) {
            const stitchNum = parseInt(stitchCount);
            if (!isNaN(stitchNum) && stitchNum > 0) {
                const price = customizationAPI.getEmbroideryPrice(
                    options.embroidery.options as EmbroideryOption[],
                    stitchNum,
                    quantity
                );
                if (price > 0) {
                    customizations.push({
                        customization_type: 'embroidery',
                        stitch_count: stitchNum,
                    });
                    totalPrice += price * quantity;
                }
            }
        }

        // Digital print
        if (digitalPrintOptionId && options?.digital_print) {
            const price = customizationAPI.getDigitalPrintPrice(
                options.digital_print.options as DigitalPrintOption[],
                digitalPrintOptionId,
                quantity
            );
            if (price > 0) {
                customizations.push({
                    customization_type: 'digital_print',
                    imprint_size_id: digitalPrintOptionId,
                });
                totalPrice += price * quantity;
            }
        }

        setSelectedCustomizations(customizations);
        onCustomizationsChange(customizations, totalPrice);
    };

    const getScreenPrintPrice = (colorCount: number): number => {
        if (!options?.screen_print) return 0;
        return customizationAPI.getScreenPrintPrice(
            options.screen_print.options as ScreenPrintOption[],
            colorCount,
            quantity
        );
    };

    const getEmbroideryPrice = (optionId: number, stitches: number): number => {
        if (!options?.embroidery) return 0;
        return customizationAPI.getEmbroideryPrice(
            options.embroidery.options as EmbroideryOption[],
            stitches,
            quantity
        );
    };

    const getDigitalPrintPrice = (optionId: number): number => {
        if (!options?.digital_print) return 0;
        return customizationAPI.getDigitalPrintPrice(
            options.digital_print.options as DigitalPrintOption[],
            optionId,
            quantity
        );
    };

    const removeCustomization = (type: string) => {
        if (type === 'screen_print') {
            setScreenPrintColorCount(null);
        } else if (type === 'embroidery') {
            setEmbroideryOptionId(null);
            setStitchCount('');
        } else if (type === 'digital_print') {
            setDigitalPrintOptionId(null);
        }
    };

    if (loading) {
        return (
            <Card className="border-2 border-accent/30 bg-accent/5">
                <CardHeader>
                    <CardTitle className="text-[20px] font-bold flex items-center gap-2">
                        <Sparkles className="text-accent" size={24} />
                        Decoration Options
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-muted-foreground">Loading customization options...</div>
                </CardContent>
            </Card>
        );
    }

    if (!options) {
        return null;
    }

    const screenPrintOptions = options.screen_print?.options as ScreenPrintOption[] || [];
    const embroideryOptions = options.embroidery?.options as EmbroideryOption[] || [];
    const digitalPrintOptions = options.digital_print?.options as DigitalPrintOption[] || [];

    return (
        <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 shadow-lg">
            <CardHeader className="pb-4">
                <CardTitle className="text-[22px] font-bold flex items-center gap-2 text-foreground">
                    <Sparkles className="text-accent" size={26} />
                    Decoration Options
                </CardTitle>
                <p className="text-[14px] text-muted-foreground mt-2">
                    Please select one of the following:
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Screen Print */}
                {screenPrintOptions.length > 0 && (
                    <div className="space-y-3 p-4 bg-white/50 rounded-lg border border-accent/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Printer className="text-accent" size={20} />
                                <Label className="text-[16px] font-bold text-foreground">
                                    {options.screen_print?.display_name || 'Screen Printing'}
                                </Label>
                            </div>
                            {screenPrintColorCount && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCustomization('screen_print')}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                    <X size={16} />
                                </Button>
                            )}
                        </div>
                        {!screenPrintColorCount ? (
                            <Select
                                value={screenPrintColorCount?.toString() || ''}
                                onValueChange={(value) => setScreenPrintColorCount(parseInt(value))}
                            >
                                <SelectTrigger className="w-full h-auto py-3 border-2 border-accent/30 focus:border-accent">
                                    <SelectValue placeholder="Select number of colors" />
                                </SelectTrigger>
                                <SelectContent>
                                    {screenPrintOptions.map((option) => (
                                        <SelectItem key={option.color_count} value={option.color_count.toString()}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{option.color_count} Color{option.color_count > 1 ? 's' : ''}</span>
                                                <span className="text-accent font-bold ml-4 price-text">
                                                    ${getScreenPrintPrice(option.color_count).toFixed(2)}/unit
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border-2 border-accent/30">
                                <div className="flex items-center gap-2">
                                    <Check className="text-accent" size={18} />
                                    <span className="font-semibold">
                                        {screenPrintColorCount} Color{screenPrintColorCount > 1 ? 's' : ''} Screen Print
                                    </span>
                                </div>
                                <span className="text-accent font-bold">
                                    ${(getScreenPrintPrice(screenPrintColorCount) * quantity).toFixed(2)} total
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Embroidery */}
                {embroideryOptions.length > 0 && (
                    <div className="space-y-3 p-4 bg-white/50 rounded-lg border border-accent/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-accent" size={20} />
                                <Label className="text-[16px] font-bold text-foreground">
                                    Embroidery
                                </Label>
                            </div>
                            {embroideryOptionId && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCustomization('embroidery')}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                    <X size={16} />
                                </Button>
                            )}
                        </div>
                        {!embroideryOptionId ? (
                            <div className="space-y-3">
                                <Select
                                    value={embroideryOptionId?.toString() || ''}
                                    onValueChange={(value) => {
                                        const optionId = parseInt(value);
                                        setEmbroideryOptionId(optionId);
                                        const option = embroideryOptions.find(opt => opt.id === optionId);
                                        if (option) {
                                            setStitchCount(option.min_stitches.toString());
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full h-auto py-3 border-2 border-accent/30 focus:border-accent">
                                        <SelectValue placeholder="Select number of stitches" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {embroideryOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id.toString()}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {embroideryOptionId && (
                                    <div className="space-y-2">
                                        <Label className="text-[14px] font-semibold">Number of Stitches</Label>
                                        <Input
                                            type="number"
                                            value={stitchCount}
                                            onChange={(e) => setStitchCount(e.target.value)}
                                            placeholder="Select number of stitches"
                                            className="border-2 border-accent/30 focus:border-accent"
                                            min={embroideryOptions.find(opt => opt.id === embroideryOptionId)?.min_stitches || 1}
                                            max={embroideryOptions.find(opt => opt.id === embroideryOptionId)?.max_stitches || 10000}
                                        />
                                        {stitchCount && !isNaN(parseInt(stitchCount)) && (
                                            <p className="text-[12px] text-muted-foreground">
                                                Price: ${getEmbroideryPrice(embroideryOptionId, parseInt(stitchCount)).toFixed(2)}/unit
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border-2 border-accent/30">
                                <div className="flex items-center gap-2">
                                    <Check className="text-accent" size={18} />
                                    <span className="font-semibold">
                                        Embroidery ({stitchCount} stitches)
                                    </span>
                                </div>
                                <span className="text-accent font-bold">
                                    ${(getEmbroideryPrice(embroideryOptionId, parseInt(stitchCount) || 0) * quantity).toFixed(2)} total
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Digital Print */}
                {digitalPrintOptions.length > 0 && (
                    <div className="space-y-3 p-4 bg-white/50 rounded-lg border border-accent/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Palette className="text-accent" size={20} />
                                <Label className="text-[16px] font-bold text-foreground">
                                    {options.digital_print?.display_name || 'Digital Print'}
                                </Label>
                            </div>
                            {digitalPrintOptionId && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCustomization('digital_print')}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                    <X size={16} />
                                </Button>
                            )}
                        </div>
                        {!digitalPrintOptionId ? (
                            <Select
                                value={digitalPrintOptionId?.toString() || ''}
                                onValueChange={(value) => setDigitalPrintOptionId(parseInt(value))}
                            >
                                <SelectTrigger className="w-full h-auto py-3 border-2 border-accent/30 focus:border-accent">
                                    <SelectValue placeholder="Select imprint size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {digitalPrintOptions.map((option) => (
                                        <SelectItem key={option.id} value={option.id.toString()}>
                                            <div className="flex items-center justify-between w-full">
                                                <div>
                                                    <div className="font-semibold">{option.name}</div>
                                                    {option.description && (
                                                        <div className="text-[12px] text-muted-foreground">{option.description}</div>
                                                    )}
                                                </div>
                                                <span className="text-accent font-bold ml-4 price-text">
                                                    ${getDigitalPrintPrice(option.id).toFixed(2)}/unit
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border-2 border-accent/30">
                                <div className="flex items-center gap-2">
                                    <Check className="text-accent" size={18} />
                                    <span className="font-semibold">
                                        {digitalPrintOptions.find(opt => opt.id === digitalPrintOptionId)?.name}
                                    </span>
                                </div>
                                <span className="text-accent font-bold">
                                    ${(getDigitalPrintPrice(digitalPrintOptionId) * quantity).toFixed(2)} total
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Total Customization Price */}
                {selectedCustomizations.length > 0 && (
                    <div className="p-4 bg-accent/20 rounded-lg border-2 border-accent/40">
                        <div className="flex items-center justify-between">
                            <span className="text-[16px] font-bold text-foreground">Customization Total:</span>
                            <span className="text-[20px] font-bold text-accent">
                                ${selectedCustomizations.reduce((sum, custom) => {
                                    let price = 0;
                                    if (custom.customization_type === 'screen_print' && custom.color_count) {
                                        price = getScreenPrintPrice(custom.color_count);
                                    } else if (custom.customization_type === 'embroidery' && custom.stitch_count && embroideryOptionId) {
                                        price = getEmbroideryPrice(embroideryOptionId, custom.stitch_count);
                                    } else if (custom.customization_type === 'digital_print' && custom.imprint_size_id) {
                                        price = getDigitalPrintPrice(custom.imprint_size_id);
                                    }
                                    return sum + (price * quantity);
                                }, 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}



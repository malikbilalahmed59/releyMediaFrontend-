/**
 * Customization API Service
 * 
 * Handles customization options and pricing for apparel products
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.relymedia.com';
const USE_PROXY = typeof window !== 'undefined';

/**
 * Type definitions for Customization API
 */

export interface CustomizationPrice {
  quantity_tier: number;
  price_per_unit: string;
  price_id: number;
}

export interface EmbroideryOption {
  id: number;
  name: string;
  min_stitches: number;
  max_stitches: number;
  prices: CustomizationPrice[];
}

export interface DigitalPrintOption {
  id: number;
  name: string;
  description?: string;
  prices: CustomizationPrice[];
}

export interface ScreenPrintOption {
  color_count: number;
  prices: CustomizationPrice[];
}

export interface CustomizationType {
  type: 'embroidery' | 'digital_print' | 'screen_print';
  display_name: string;
  options: EmbroideryOption[] | DigitalPrintOption[] | ScreenPrintOption[];
}

export interface CustomizationOptionsResponse {
  embroidery?: CustomizationType;
  digital_print?: CustomizationType;
  screen_print?: CustomizationType;
  quantity_tiers: Array<{
    quantity: number;
    display: string;
  }>;
}

export interface CartCustomization {
  customization_type: 'screen_print' | 'embroidery' | 'digital_print';
  color_count?: number;
  stitch_count?: number;
  imprint_size_id?: number;
}

export interface CartItemCustomization {
  id: number;
  customization_type: string;
  customization_type_display: string;
  color_count?: number;
  stitch_count?: number;
  imprint_size_id?: number;
  unit_price: string;
  total_price: string;
}

/**
 * Get all available customization options
 */
export async function getCustomizationOptions(): Promise<CustomizationOptionsResponse> {
  const url = USE_PROXY 
    ? '/api/customization/options'
    : `${API_BASE_URL}/api/customization/options/`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to fetch customization options: ${errorText}`);
  }

  return response.json();
}

/**
 * Calculate customization price based on quantity
 */
export function calculateCustomizationPrice(
  prices: CustomizationPrice[],
  quantity: number
): number {
  if (!prices || prices.length === 0) return 0;
  
  // Sort prices by quantity_tier descending
  const sortedPrices = [...prices].sort((a, b) => b.quantity_tier - a.quantity_tier);
  
  // Find the appropriate price tier for the quantity
  for (const price of sortedPrices) {
    if (quantity >= price.quantity_tier) {
      return parseFloat(price.price_per_unit);
    }
  }
  
  // If quantity is less than the smallest tier, use the smallest tier price
  const smallestTier = sortedPrices[sortedPrices.length - 1];
  return parseFloat(smallestTier.price_per_unit);
}

/**
 * Get price for screen print customization
 */
export function getScreenPrintPrice(
  options: ScreenPrintOption[],
  colorCount: number,
  quantity: number
): number {
  const option = options.find(opt => opt.color_count === colorCount);
  if (!option) return 0;
  return calculateCustomizationPrice(option.prices, quantity);
}

/**
 * Get price for embroidery customization
 */
export function getEmbroideryPrice(
  options: EmbroideryOption[],
  stitchCount: number,
  quantity: number
): number {
  // Find the option that matches the stitch count range
  const option = options.find(
    opt => stitchCount >= opt.min_stitches && stitchCount <= opt.max_stitches
  );
  if (!option) return 0;
  return calculateCustomizationPrice(option.prices, quantity);
}

/**
 * Get price for digital print customization
 */
export function getDigitalPrintPrice(
  options: DigitalPrintOption[],
  imprintSizeId: number,
  quantity: number
): number {
  const option = options.find(opt => opt.id === imprintSizeId);
  if (!option) return 0;
  return calculateCustomizationPrice(option.prices, quantity);
}



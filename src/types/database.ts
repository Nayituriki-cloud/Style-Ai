/**
 * STYLE AI Relational Database Schema & Types
 * Represents the 11 core tables:
 * - users
 * - style_profiles
 * - wardrobe_items
 * - outfits
 * - outfit_items
 * - favorites
 * - style_preferences
 * - outfit_calendar
 * - recommendations
 * - shopping_items
 * - chat_history
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isPro: boolean;
  proExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type StyleCategory =
  | 'Classic'
  | 'Smart Casual'
  | 'Business'
  | 'Streetwear'
  | 'Minimalist'
  | 'Luxury'
  | 'Casual'
  | 'Sporty'
  | 'Vintage'
  | 'African-inspired'
  | 'Formal'
  | 'Creative';

export type OccasionType =
  | 'University'
  | 'Work'
  | 'Business meeting'
  | 'Interview'
  | 'Wedding'
  | 'Date'
  | 'Party'
  | 'Travel'
  | 'Casual day'
  | 'Sports'
  | 'Formal event'
  | 'Traditional/African fashion';

export type BudgetLevel = 'Low' | 'Medium' | 'Premium';

export interface StyleProfile {
  id: string;
  userId: string;
  genderPreference: string;
  ageRange: string;
  favoriteColors: string[];
  clothingPreferences: string[];
  budgetLevel: BudgetLevel;
  climateLocation: string;
  primaryAesthetic: StyleCategory;
  secondaryAesthetics: StyleCategory[];
  archetypeTitle: string; // e.g., "Elevated Minimalist", "Modern Sartorialist"
  createdAt: string;
  updatedAt: string;
}

export type WardrobeCategory =
  | 'Tops'
  | 'T-shirts'
  | 'Shirts'
  | 'Jackets'
  | 'Trousers'
  | 'Jeans'
  | 'Dresses'
  | 'Skirts'
  | 'Shoes'
  | 'Bags'
  | 'Watches'
  | 'Accessories'
  | 'Traditional';

export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: WardrobeCategory;
  subcategory?: string;
  colorName: string;
  colorHex: string;
  brand?: string;
  size?: string;
  material?: string;
  seasons?: string[];
  occasions?: OccasionType[];
  imageUrl: string;
  notes?: string;
  isFavorite: boolean;
  budgetTier?: BudgetLevel;
  purchasePrice?: number;
  timesWorn: number;
  createdAt: string;
  updatedAt: string;
}

export interface Outfit {
  id: string;
  userId: string;
  title: string;
  description: string;
  occasion: OccasionType;
  styleCategory: StyleCategory;
  colorPalette: { name: string; hex: string }[];
  isFavorite: boolean;
  rating?: number;
  budgetTier?: BudgetLevel;
  stylingNotes?: string;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OutfitItem {
  id: string;
  outfitId: string;
  wardrobeItemId?: string;
  customItemName?: string;
  category: WardrobeCategory;
  colorHex?: string;
  slotPosition: number; // 1: Outerwear, 2: Top, 3: Bottom, 4: Footwear, 5: Bag, 6: Accessories
}

export interface Favorite {
  id: string;
  userId: string;
  targetType: 'outfit' | 'wardrobe_item' | 'recommendation';
  targetId: string;
  createdAt: string;
}

export interface StylePreference {
  id: string;
  userId: string;
  colorPreference: string;
  fitPreference: 'Slim' | 'Regular' | 'Relaxed' | 'Oversized';
  preferredFabrics: string[];
  excludedColors: string[];
  budgetMonthlyMax?: number;
  updatedAt: string;
}

export interface OutfitCalendarEntry {
  id: string;
  userId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  dateString: string; // YYYY-MM-DD
  outfitId: string;
  occasion: OccasionType;
  notes?: string;
  weatherForecast?: string;
  isWorn: boolean;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  occasion: OccasionType;
  title: string;
  vibe: string;
  stylingRationale: string;
  colorPalette: { name: string; hex: string }[];
  suggestedItems: { category: string; name: string; description: string; stylingTip: string }[];
  climateAdjustments?: string;
  isSavedAsOutfit: boolean;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  title: string;
  category: WardrobeCategory;
  description: string;
  price: number;
  currency: string;
  sizeInformation: string;
  seller: string;
  availability: 'In Stock' | 'Low Stock' | 'Pre-order';
  externalPurchaseUrl: string;
  imageUrl: string;
  budgetTier: BudgetLevel;
  matchedStyles: StyleCategory[];
  matchedOccasions: OccasionType[];
  colorHex: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  relatedOutfitId?: string;
}

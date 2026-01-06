// Smart Suggestions & Upselling Engine
import { menuData } from '../data';
import { CartLine } from '../bot/respondLocal';

export interface Suggestion {
  type: 'upsell' | 'cross-sell' | 'combo' | 'popular';
  message: string;
  items: string[];
  discount?: number;
  reason: string;
}

// Popular combos based on real restaurant data
const POPULAR_COMBOS = [
  {
    items: ['Tacos', 'Jus'],
    message: 'Bghiti tzid Jus m3a Tacos? 🥤 Combo parfait!',
    discount: 5,
  },
  {
    items: ['Pizza', 'Jus'],
    message: 'Pizza + Jus = Combo top! 🍕🥤 -5 DH',
    discount: 5,
  },
  {
    items: ['Burger', 'Jus'],
    message: 'Burger + Jus? Perfect combo! 🍔🥤',
    discount: 5,
  },
];

// Upsell rules (suggest larger size or premium items)
const UPSELL_RULES = {
  'Tacos Normal': {
    suggest: 'Tacos XL',
    message: 'Tacos XL ghir +10 DH w kaykoun kbir bzaf! 🔥',
    extraCost: 10,
  },
  'Pizza Petite': {
    suggest: 'Pizza Grande',
    message: 'Pizza Grande ghir +10 DH - kat3mer 2-3 personnes! 🍕',
    extraCost: 10,
  },
  'Burger Simple': {
    suggest: 'Burger Snip Taste',
    message: 'Burger Snip Taste (60 DH) - notre spécialité! 🔥',
    extraCost: 20,
  },
};

// Cross-sell suggestions (frequently bought together)
const CROSS_SELL_RULES: Record<string, string[]> = {
  PIZZA: ['Jus', 'Salade'],
  TACOS: ['Jus', 'Frites'],
  BURGER: ['Jus', 'Frites'],
  PATES: ['Jus', 'Salade'],
  KABAB: ['Jus', 'Salade'],
  PANIZZA: ['Jus'],
};

// Get smart suggestion based on cart
export function getSmartSuggestion(cart: CartLine[]): Suggestion | null {
  if (cart.length === 0) return null;

  const lastItem = cart[cart.length - 1];
  const cartCategories = cart.map((item) => item.sectionTitle);

  // 1. Check for combo opportunities
  const comboSuggestion = checkComboOpportunity(cart);
  if (comboSuggestion) return comboSuggestion;

  // 2. Check for upsell opportunities
  const upsellSuggestion = checkUpsellOpportunity(lastItem);
  if (upsellSuggestion) return upsellSuggestion;

  // 3. Check for cross-sell opportunities
  const crossSellSuggestion = checkCrossSellOpportunity(lastItem, cartCategories);
  if (crossSellSuggestion) return crossSellSuggestion;

  // 4. Suggest popular items
  return getPopularItemSuggestion(cart);
}

// Check if user can make a combo
function checkComboOpportunity(cart: CartLine[]): Suggestion | null {
  const itemNames = cart.map((item) => item.itemName.toLowerCase());

  for (const combo of POPULAR_COMBOS) {
    const hasFirstItem = combo.items.some((item) =>
      itemNames.some((cartItem) => cartItem.includes(item.toLowerCase()))
    );

    const missingItem = combo.items.find(
      (item) => !itemNames.some((cartItem) => cartItem.includes(item.toLowerCase()))
    );

    if (hasFirstItem && missingItem) {
      return {
        type: 'combo',
        message: combo.message,
        items: [missingItem],
        discount: combo.discount,
        reason: 'Combo populaire',
      };
    }
  }

  return null;
}

// Check if we can upsell to a better version
function checkUpsellOpportunity(lastItem: CartLine): Suggestion | null {
  const itemKey = Object.keys(UPSELL_RULES).find((key) =>
    lastItem.itemName.toLowerCase().includes(key.toLowerCase())
  );

  if (itemKey) {
    const rule = UPSELL_RULES[itemKey as keyof typeof UPSELL_RULES];
    return {
      type: 'upsell',
      message: rule.message,
      items: [rule.suggest],
      reason: `Upgrade pour +${rule.extraCost} DH`,
    };
  }

  return null;
}

// Suggest complementary items
function checkCrossSellOpportunity(
  lastItem: CartLine,
  cartCategories: string[]
): Suggestion | null {
  const category = lastItem.sectionTitle.toUpperCase();
  const suggestions = CROSS_SELL_RULES[category];

  if (!suggestions) return null;

  // Find items not already in cart
  const missingItems = suggestions.filter(
    (item) => !cartCategories.some((cat) => cat.toUpperCase().includes(item.toUpperCase()))
  );

  if (missingItems.length > 0) {
    const item = missingItems[0];
    const messages: Record<string, string> = {
      Jus: 'Bghiti chi Jus m3aha? 🥤 Frais w nadi!',
      Salade: 'Tzid Salade? 🥗 Healthy w fresh!',
      Frites: 'Frites m3aha? 🍟 Ghir +5 DH!',
    };

    return {
      type: 'cross-sell',
      message: messages[item] || `Bghiti ${item}? Perfect m3a ${lastItem.itemName}!`,
      items: [item],
      reason: 'Souvent commandé ensemble',
    };
  }

  return null;
}

// Suggest popular items
function getPopularItemSuggestion(cart: CartLine[]): Suggestion | null {
  const popularItems = [
    { name: 'Tacos XL', category: 'TACOS', message: 'Tacos XL - Best-seller! 🔥' },
    {
      name: 'Pizza Snip Taste',
      category: 'PIZZA',
      message: 'Pizza Snip Taste - Notre spécialité! 🍕',
    },
    {
      name: 'Burger Snip Taste',
      category: 'BURGER',
      message: 'Burger Snip Taste - Top qualité! 🍔',
    },
  ];

  const cartCategories = cart.map((item) => item.sectionTitle.toUpperCase());

  // Suggest popular item from category not in cart
  const suggestion = popularItems.find((item) => !cartCategories.includes(item.category));

  if (suggestion) {
    return {
      type: 'popular',
      message: suggestion.message,
      items: [suggestion.name],
      reason: 'Item populaire',
    };
  }

  return null;
}

// Get suggestion message in user's preferred language
export function getSuggestionMessage(
  suggestion: Suggestion,
  language: 'darija' | 'fr' | 'ar' | 'en' = 'darija'
): string {
  // For now, return the default message (mostly Darija/French mix)
  // Can be expanded to support full translations
  return suggestion.message;
}

// Calculate if suggestion saves money
export function calculateSavings(cart: CartLine[], suggestion: Suggestion): number {
  return suggestion.discount || 0;
}

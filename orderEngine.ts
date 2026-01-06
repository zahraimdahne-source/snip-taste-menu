// Order engine for Snip Taste chatbot - Advanced Logic
import { restaurantData } from './restaurantData';

export type OrderState =
  | 'idle'
  | 'choosing_item'
  | 'waiting_size'
  | 'waiting_qty'
  | 'waiting_extras'
  | 'ask_add_more'
  | 'waiting_name'
  | 'waiting_address'
  | 'waiting_payment'
  | 'finalized';

export interface CartItem {
  categoryId: string;
  category: string;
  itemName: string;
  qty: number;
  size: 'small' | 'large' | null;
  extras: Array<{ name: string; unit_price: number }>;
  unit_price: number;
  line_total: number;
  type: string;
}

export interface OrderContext {
  state: OrderState;
  cart: CartItem[];
  currentItem: Partial<CartItem> | null;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  paymentMethod: 'cash' | 'CIH' | null;
  total: number;
}

// 1. Advanced Text Normalization
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ') // Replace punctuation with space
    .replace(/\s{2,}/g, ' '); // Collapse spaces
};

// Remove category prefixes for smarter matching (e.g., "Pizza Milano" -> "Milano")
export const stripPrefixes = (text: string): string => {
  return text.replace(/^(pizza|tacos|sandwich|plat|salade|jus|panizza) /i, '');
};

// 2. Size Detection & Extraction
// Returns the size found and the text with the size keyword removed
export const extractSize = (
  text: string
): { size: 'small' | 'large' | null; cleanedText: string } => {
  let normalized = normalizeText(text);
  let size: 'small' | 'large' | null = null;

  const smallKeywords = ['sghir', 'sghira', 'petit', 'small', 'صغير', 'صغيرة', 'صغييرة', 's'];
  const largeKeywords = [
    'kbir',
    'kbira',
    'grand',
    'grande',
    'large',
    'lard',
    'كبير',
    'كبيرة',
    'l',
    'xl',
  ]; // XL treats as large usually

  // Check for large first (conflict resolution)
  for (const kw of largeKeywords) {
    // Check word boundaries to avoid partial matches if possible, or simple includes
    // Simple includes is safer for mixed input like "milano kbira"
    if (normalized.includes(kw)) {
      size = 'large';
      normalized = normalized.replace(kw, '').trim();
      break;
    }
  }

  if (!size) {
    for (const kw of smallKeywords) {
      if (normalized.includes(kw)) {
        size = 'small';
        normalized = normalized.replace(kw, '').trim();
        break;
      }
    }
  }

  return { size, cleanedText: normalized };
};

// 3. Smart Item Search
export const searchItemsSmart = (userInput: string, limit = 10) => {
  // First, extract size if present
  const { size, cleanedText } = extractSize(userInput);
  const normalizedQuery = normalizeText(cleanedText);

  const results: any[] = [];

  // Iterate all items
  restaurantData.menu.forEach((section) => {
    section.items.forEach((item: any) => {
      const normalizedItemName = normalizeText(item.name);
      const strippedItemName = stripPrefixes(normalizedItemName);

      // Match logic:
      // 1. Direct match: "milano" matches "pizza milano" or "milano"
      // 2. Contains match: "pizza milano" includes "milano"
      const isMatch =
        normalizedItemName.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedItemName) ||
        strippedItemName.includes(normalizedQuery) ||
        normalizedQuery.includes(strippedItemName);

      if (isMatch && normalizedQuery.length > 2) {
        // Avoid matching single chars too easily
        results.push({
          ...item,
          category: section.category,
          categoryId: section.id,
          type: section.type,
          supplements: section.supplements || [],
          matchScore: strippedItemName === normalizedQuery ? 100 : 50, // Simple scoring
          detectedSize: size, // Pass along the detected size
        });
      }
    });
  });

  // Sort by score (exact matches first)
  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
};

// 4. Quantity Detection
export const detectQuantity = (text: string): number => {
  const normalized = normalizeText(text);
  const match = normalized.match(/\d+/);
  if (match) return parseInt(match[0], 10);

  if (normalized.includes('wa7da') || normalized.includes('wahda') || normalized.includes('واحدة'))
    return 1;
  if (normalized.includes('jوج') || normalized.includes('zouj') || normalized.includes('jooj'))
    return 2;
  if (normalized.includes('tlata') || normalized.includes('tlat')) return 3;
  if (normalized.includes('rab3a')) return 4;

  return 1; // Default
};

// 5. Yes/No Detection
export const detectYesNo = (text: string): 'yes' | 'no' | null => {
  const normalized = normalizeText(text);
  const yesKeywords = [
    'iyyeh',
    'eh',
    'ah',
    'wakha',
    'yes',
    'oui',
    'اي',
    'نعم',
    'واخا',
    'iyeh',
    'ok',
    'daccord',
    'صافي',
  ];
  const noKeywords = ['la', 'no', 'non', 'لا', 'ماشي', 'bla', 'machi', 'walou', 'alo'];

  if (yesKeywords.some((kw) => normalized.includes(kw))) return 'yes';
  if (noKeywords.some((kw) => normalized.includes(kw))) return 'no';
  return null;
};

// 6. Extras Handling Rule Configuration
export const getExtrasConfig = (categoryId: string) => {
  switch (categoryId) {
    case 'pizza':
      return {
        ask: true,
        question: 'Bghiti tzid fromage? (+10 DH) - iyyeh / la',
        items: [{ name: 'Supplément Fromage', unit_price: 10 }],
      };
    case 'tacos':
      return {
        ask: true,
        question: 'Bghiti fromage (+5) wla sauce (+2)? (iyyeh/la)',
        items: [
          { name: 'Supplément Fromage', unit_price: 5 },
          { name: 'Sauce', unit_price: 2 },
        ],
      };
    case 'panizzas':
      return {
        ask: true,
        question: 'Bghiti m3aha frites (+5 DH)? (iyyeh/la)',
        items: [{ name: 'Avec Frites', unit_price: 5 }],
      };
    case 'kabab':
      return {
        ask: true,
        question: 'Bghiti sauce (+2 DH)? (iyyeh/la)',
        items: [{ name: 'Sauce', unit_price: 2 }],
      };
    case 'pates':
      return {
        ask: true,
        question: 'Bghiti supplément pates (+20 DH)? (iyyeh/la)',
        items: [{ name: 'Supplément Pates', unit_price: 20 }],
      };
    default:
      return { ask: false, question: '', items: [] };
  }
};

// Calculate Item Price
export const calculateItemPrice = (item: CartItem): number => {
  let basePrice = 0;
  if (item.size === 'small' && 'price_small' in (item as any)) {
    // Typo fix: we need to access source item for dual prices.
    // Wait, CartItem doesn't hold price_small/large props directly, but currentItem in context should init correctly using the found item.
    // For simplicity, we assume unit_price was set correctly for standard items.
    // For dual price items, we must ensure item.unit_price IS set to the correct size price at creation.
    basePrice = item.unit_price;
  } else {
    basePrice = item.unit_price;
  }

  const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.unit_price, 0);
  return (basePrice + extrasTotal) * item.qty;
};

// Calculate cart total
export const calculateCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.line_total, 0);
};

// Generate WhatsApp Link
export const generateWhatsAppLink = (context: OrderContext): string => {
  const waNumber = '212660542323';

  const orderLines = context.cart
    .map((item) => {
      const sizeText = item.size ? ` ${item.size === 'small' ? 'sghira' : 'kbira'}` : '';
      const extrasText =
        item.extras.length > 0 ? ` (+ ${item.extras.map((e) => e.name).join(', ')})` : '';
      return `- ${item.itemName}${sizeText}${extrasText} x${item.qty} = ${item.line_total} DH`;
    })
    .join('\n');

  const message = `Salam Snip Taste 👋

Bghit ncommandi:
${orderLines}

Total: ${context.total} DH
Delivery: ${context.customerAddress || 'Casablanca'}
Nom: ${context.customerName || 'Client'}
Tel: ${context.customerPhone || ''}
Payment: ${context.paymentMethod || 'Cash'}`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
};

export const formatItemDisplay = (item: any): string => {
  if (item.price_small && item.price_large) {
    return `• ${item.name}: ${item.price_small} DH (sghira) / ${item.price_large} DH (kbira)`;
  }
  return `• ${item.name}: ${item.price} DH`;
};

// Get category supplements (This function was removed in the new content, but I'll keep it if it's not explicitly removed)
// The instruction was "Replace the entire content of orderEngine.ts with the advanced logic matching the user's detailed specification."
// The new content provided does not include `getCategorySupplements`. So it should be removed.
// I will remove it.

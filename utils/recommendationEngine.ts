// Personalized Recommendations Engine
// "Your usual?" - Learns user preferences and suggests personalized items

import { CartLine } from '../bot/respondLocal';
import { menuData } from '../data';

export interface PersonalizedRecommendation {
  itemName: string;
  reason: string;
  confidence: number; // 0-1
  category: string;
  price: number;
  message: string;
}

export interface OrderHistory {
  orderId: string;
  items: CartLine[];
  total: number;
  date: Date;
  dayOfWeek: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

// Storage key
const STORAGE_KEY_ORDER_HISTORY = 'snip_order_history';
const STORAGE_KEY_PREFERENCES = 'snip_item_preferences';

// Recommendation Engine Class
export class RecommendationEngine {
  private orderHistory: OrderHistory[] = [];
  private itemPreferences: Map<string, number> = new Map(); // item -> frequency

  constructor() {
    this.loadHistory();
    this.calculatePreferences();
  }

  // Load order history from localStorage
  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDER_HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.orderHistory = parsed.map((order: any) => ({
          ...order,
          date: new Date(order.date),
        }));
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  }

  // Save order history
  private saveHistory(): void {
    try {
      localStorage.setItem(STORAGE_KEY_ORDER_HISTORY, JSON.stringify(this.orderHistory));
    } catch (error) {
      console.error('Error saving order history:', error);
    }
  }

  // Add order to history
  addOrder(cart: CartLine[]): void {
    const now = new Date();
    const hour = now.getHours();

    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const order: OrderHistory = {
      orderId: `ORDER_${Date.now()}`,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.line_total, 0),
      date: now,
      dayOfWeek: now.getDay(),
      timeOfDay,
    };

    this.orderHistory.push(order);

    // Keep only last 50 orders
    if (this.orderHistory.length > 50) {
      this.orderHistory = this.orderHistory.slice(-50);
    }

    this.saveHistory();
    this.calculatePreferences();
  }

  // Calculate item preferences from history
  private calculatePreferences(): void {
    this.itemPreferences.clear();

    this.orderHistory.forEach((order) => {
      order.items.forEach((item) => {
        const count = this.itemPreferences.get(item.itemName) || 0;
        this.itemPreferences.set(item.itemName, count + item.qty);
      });
    });
  }

  // Get user's most ordered items
  getMostOrderedItems(limit: number = 3): string[] {
    const sorted = Array.from(this.itemPreferences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sorted.map(([itemName]) => itemName);
  }

  // Get "your usual" recommendation
  getUsualOrder(): PersonalizedRecommendation[] {
    const mostOrdered = this.getMostOrderedItems(3);

    return mostOrdered.map((itemName) => {
      const frequency = this.itemPreferences.get(itemName) || 0;
      const totalOrders = this.orderHistory.length;
      const confidence = totalOrders > 0 ? frequency / totalOrders : 0;

      return {
        itemName,
        reason: `Tu commandes ça ${frequency} fois!`,
        confidence,
        category: this.getCategoryForItem(itemName),
        price: this.getPriceForItem(itemName),
        message: `Bghiti ${itemName} comme d'habitude? 😄`,
      };
    });
  }

  // Get recommendations based on time of day
  getTimeBasedRecommendations(): PersonalizedRecommendation[] {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Find orders from similar time
    const similarTimeOrders = this.orderHistory.filter((order) => order.timeOfDay === timeOfDay);

    if (similarTimeOrders.length === 0) return [];

    // Count items from similar time
    const timePreferences = new Map<string, number>();
    similarTimeOrders.forEach((order) => {
      order.items.forEach((item) => {
        const count = timePreferences.get(item.itemName) || 0;
        timePreferences.set(item.itemName, count + 1);
      });
    });

    // Get top items
    const topItems = Array.from(timePreferences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    return topItems.map(([itemName, count]) => ({
      itemName,
      reason: `Tu commandes souvent ça le ${this.getTimeLabel(timeOfDay)}`,
      confidence: count / similarTimeOrders.length,
      category: this.getCategoryForItem(itemName),
      price: this.getPriceForItem(itemName),
      message: `${this.getTimeLabel(timeOfDay)} - bghiti ${itemName}? 😄`,
    }));
  }

  // Get recommendations based on day of week
  getDayBasedRecommendations(): PersonalizedRecommendation[] {
    const dayOfWeek = new Date().getDay();

    const sameDayOrders = this.orderHistory.filter((order) => order.dayOfWeek === dayOfWeek);

    if (sameDayOrders.length === 0) return [];

    const dayPreferences = new Map<string, number>();
    sameDayOrders.forEach((order) => {
      order.items.forEach((item) => {
        const count = dayPreferences.get(item.itemName) || 0;
        dayPreferences.set(item.itemName, count + 1);
      });
    });

    const topItems = Array.from(dayPreferences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    return topItems.map(([itemName, count]) => ({
      itemName,
      reason: `Ton favori du ${this.getDayLabel(dayOfWeek)}`,
      confidence: count / sameDayOrders.length,
      category: this.getCategoryForItem(itemName),
      price: this.getPriceForItem(itemName),
      message: `C'est ${this.getDayLabel(dayOfWeek)}! Bghiti ${itemName}? 🔥`,
    }));
  }

  // Get smart recommendations combining all factors
  getSmartRecommendations(): PersonalizedRecommendation[] {
    const usual = this.getUsualOrder();
    const timeBased = this.getTimeBasedRecommendations();
    const dayBased = this.getDayBasedRecommendations();

    // Combine and deduplicate
    const all = [...usual, ...timeBased, ...dayBased];
    const unique = new Map<string, PersonalizedRecommendation>();

    all.forEach((rec) => {
      const existing = unique.get(rec.itemName);
      if (!existing || rec.confidence > existing.confidence) {
        unique.set(rec.itemName, rec);
      }
    });

    // Sort by confidence
    return Array.from(unique.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }

  // Get category for item
  private getCategoryForItem(itemName: string): string {
    for (const section of menuData) {
      const item = section.items.find((i) => i.name === itemName);
      if (item) return section.title;
    }
    return 'Unknown';
  }

  // Get price for item
  private getPriceForItem(itemName: string): number {
    for (const section of menuData) {
      const item = section.items.find((i) => i.name === itemName);
      if (item) {
        if ('price' in item) return item.price;
        if ('prices' in item) return item.prices.small;
      }
    }
    return 0;
  }

  // Get time label
  private getTimeLabel(timeOfDay: string): string {
    const labels: Record<string, string> = {
      morning: 'matin',
      afternoon: 'après-midi',
      evening: 'soir',
      night: 'nuit',
    };
    return labels[timeOfDay] || timeOfDay;
  }

  // Get day label
  private getDayLabel(dayOfWeek: number): string {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return days[dayOfWeek];
  }

  // Check if user is a regular
  isRegularCustomer(): boolean {
    return this.orderHistory.length >= 3;
  }

  // Get total orders
  getTotalOrders(): number {
    return this.orderHistory.length;
  }

  // Get last order date
  getLastOrderDate(): Date | null {
    if (this.orderHistory.length === 0) return null;
    return this.orderHistory[this.orderHistory.length - 1].date;
  }

  // Get days since last order
  getDaysSinceLastOrder(): number | null {
    const lastOrder = this.getLastOrderDate();
    if (!lastOrder) return null;

    const now = new Date();
    const diff = now.getTime() - lastOrder.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}

// Singleton instance
let recommendationEngineInstance: RecommendationEngine | null = null;

export function getRecommendationEngine(): RecommendationEngine {
  if (!recommendationEngineInstance) {
    recommendationEngineInstance = new RecommendationEngine();
  }
  return recommendationEngineInstance;
}

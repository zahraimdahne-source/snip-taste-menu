// Proactive Assistance System
// Bot helps before user asks - monitors behavior and provides timely suggestions

import { CartLine } from '../bot/respondLocal';

export interface ProactiveAction {
  type: 'reminder' | 'suggestion' | 'help' | 'warning' | 'celebration';
  message: string;
  priority: 'low' | 'medium' | 'high';
  trigger: string;
  action?: () => void;
}

// Timing thresholds
const IDLE_THRESHOLD = 30000; // 30 seconds
const CART_ABANDON_THRESHOLD = 180000; // 3 minutes
const TYPING_PAUSE_THRESHOLD = 5000; // 5 seconds

// Proactive Assistant Class
export class ProactiveAssistant {
  private lastActivityTime: number = Date.now();
  private cartAddedTime: number | null = null;
  private isTyping: boolean = false;
  private typingStartTime: number | null = null;
  private checkoutStarted: boolean = false;

  // Update activity timestamp
  updateActivity(): void {
    this.lastActivityTime = Date.now();
  }

  // Mark typing state
  setTyping(isTyping: boolean): void {
    this.isTyping = isTyping;
    if (isTyping && !this.typingStartTime) {
      this.typingStartTime = Date.now();
    } else if (!isTyping) {
      this.typingStartTime = null;
    }
  }

  // Mark cart activity
  markCartActivity(): void {
    this.cartAddedTime = Date.now();
  }

  // Mark checkout started
  markCheckoutStarted(): void {
    this.checkoutStarted = true;
  }

  // Check if user is idle
  isUserIdle(): boolean {
    return Date.now() - this.lastActivityTime > IDLE_THRESHOLD;
  }

  // Check if user abandoned cart
  hasAbandonedCart(cart: CartLine[]): boolean {
    if (cart.length === 0 || !this.cartAddedTime) return false;
    return Date.now() - this.cartAddedTime > CART_ABANDON_THRESHOLD && !this.checkoutStarted;
  }

  // Check if user is stuck typing
  isStuckTyping(): boolean {
    if (!this.isTyping || !this.typingStartTime) return false;
    return Date.now() - this.typingStartTime > TYPING_PAUSE_THRESHOLD;
  }

  // Get proactive suggestions based on current state
  getProactiveSuggestion(
    cart: CartLine[],
    conversationLength: number,
    lastUserMessage?: string
  ): ProactiveAction | null {
    // 1. Cart abandonment reminder
    if (this.hasAbandonedCart(cart)) {
      return {
        type: 'reminder',
        message: this.getCartReminderMessage(cart),
        priority: 'high',
        trigger: 'cart_abandoned',
      };
    }

    // 2. User is idle but has items in cart
    if (this.isUserIdle() && cart.length > 0) {
      return {
        type: 'reminder',
        message: 'Mazal hna 😄 Bghiti tkemmel order?',
        priority: 'medium',
        trigger: 'idle_with_cart',
      };
    }

    // 3. User stuck typing
    if (this.isStuckTyping()) {
      return {
        type: 'help',
        message: "Bghiti chi m3awna? 😄 9ol ghir 'menu' wla 'help'",
        priority: 'low',
        trigger: 'stuck_typing',
      };
    }

    // 4. Empty cart after long conversation
    if (conversationLength > 5 && cart.length === 0) {
      return {
        type: 'suggestion',
        message:
          'Kat9leb 3la chi haja? 🤔 Nقترح 3lik:\\n⭐ Tacos XL\\n⭐ Pizza Snip Taste\\n⭐ Burger Snip Taste',
        priority: 'medium',
        trigger: 'long_conversation_no_order',
      };
    }

    // 5. Large cart - suggest checkout
    if (cart.length >= 5 && !this.checkoutStarted) {
      return {
        type: 'suggestion',
        message: `Kayn 3andek ${cart.length} items f cart 🔥 Bghiti tcommander daba?`,
        priority: 'medium',
        trigger: 'large_cart',
      };
    }

    return null;
  }

  // Get time-based greeting
  getTimeBasedGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Sbah lkhir! ☀️ Bghiti chi breakfast?';
    } else if (hour >= 12 && hour < 14) {
      return 'Bon appétit! 🍽️ Wakt lghda - chno bghiti?';
    } else if (hour >= 14 && hour < 18) {
      return 'Merhba! 😄 Bghiti chi goûter?';
    } else if (hour >= 18 && hour < 22) {
      return 'Msa lkhir! 🌙 Wakt l3cha - chno kat9leb 3lih?';
    } else {
      return 'Merhba bik! {{LOGO}} Chno bghiti lyoum?';
    }
  }

  // Get cart reminder message
  private getCartReminderMessage(cart: CartLine[]): string {
    const total = cart.reduce((sum, item) => sum + item.line_total, 0);
    const itemCount = cart.length;

    const messages = [
      `Mazal 3andek ${itemCount} items f cart (${total} DH) 😄 Bghiti tkemmel?`,
      `Cart dyalk fih ${itemCount} items 🔥 Total: ${total} DH. Ready?`,
      `${itemCount} items f cart, ${total} DH 😋 Nكملو?`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Get celebration message for milestones
  getCelebrationMessage(orderCount: number): string | null {
    if (orderCount === 1) {
      return '🎉 Première commande! Merci bzaf! Voici un code promo pour la prochaine fois: FIRST10';
    }

    if (orderCount === 5) {
      return "🔥 5ème commande! T'es un client fidèle! Voici 20% off: LOYAL20";
    }

    if (orderCount === 10) {
      return "⭐ 10 commandes! T'es une star! Livraison gratuite à vie! 🚚";
    }

    if (orderCount % 10 === 0) {
      return `🎊 ${orderCount} commandes! Incroyable! Cadeau surprise dans ta prochaine commande! 🎁`;
    }

    return null;
  }

  // Get helpful tip based on context
  getContextualTip(lastMessage: string): string | null {
    const msg = lastMessage.toLowerCase();

    if (msg.includes('cher') || msg.includes('prix') || msg.includes('combien')) {
      return '💡 Tip: Nos combos (Pizza/Tacos + Jus) te font économiser 5 DH!';
    }

    if (msg.includes('rapide') || msg.includes('vite') || msg.includes('time')) {
      return '⚡ Tip: Commande maintenant, livraison en 30-45 min!';
    }

    if (msg.includes('halal')) {
      return '✅ Tip: Tout est 100% halal chez nous!';
    }

    return null;
  }

  // Suggest based on day of week
  getDayBasedSuggestion(): string | null {
    const day = new Date().getDay();

    if (day === 5) {
      // Friday
      return '🎉 Jum3a Mubarak! Special weekend: Pizza Family -10%!';
    }

    if (day === 0) {
      // Sunday
      return '😎 Dimanche relax! Profite de nos burgers premium!';
    }

    if (day === 1) {
      // Monday
      return '💪 Bon début de semaine! Tacos XL pour bien démarrer!';
    }

    return null;
  }

  // Weather-based suggestion (would need weather API in production)
  getWeatherBasedSuggestion(isRaining: boolean = false, temp?: number): string | null {
    if (isRaining) {
      return '☔ Il pleut! Reste au chaud, on livre! Soupe chaude disponible 🍲';
    }

    if (temp && temp > 30) {
      return '🌡️ Il fait chaud! Nos jus frais et salades sont parfaits! 🥤🥗';
    }

    if (temp && temp < 15) {
      return '🥶 Il fait froid! Pizza chaude ou burger bien chaud? 🍕🍔';
    }

    return null;
  }

  // Reset state
  reset(): void {
    this.lastActivityTime = Date.now();
    this.cartAddedTime = null;
    this.isTyping = false;
    this.typingStartTime = null;
    this.checkoutStarted = false;
  }
}

// Singleton instance
let proactiveAssistantInstance: ProactiveAssistant | null = null;

export function getProactiveAssistant(): ProactiveAssistant {
  if (!proactiveAssistantInstance) {
    proactiveAssistantInstance = new ProactiveAssistant();
  }
  return proactiveAssistantInstance;
}

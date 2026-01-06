// Context & Memory System for Chatbot
// Remembers conversation history, user preferences, and provides context-aware responses

import { CartLine } from '../bot/respondLocal';

export interface ConversationContext {
  userId: string;
  conversationHistory: ConversationMessage[];
  userPreferences: UserPreferences;
  sessionData: SessionData;
  lastInteraction: Date;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  entities?: Record<string, any>;
}

export interface UserPreferences {
  favoriteItems: string[];
  dietaryRestrictions: string[];
  preferredLanguage: 'darija' | 'fr' | 'ar' | 'en';
  preferredPayment?: 'Cash' | 'CIH Bank';
  savedAddress?: string;
  savedPhone?: string;
  orderCount: number;
  lastOrderDate?: Date;
}

export interface SessionData {
  currentTopic?: string;
  mentionedItems: string[];
  askedQuestions: string[];
  cartSnapshot: CartLine[];
  sessionStartTime: Date;
}

// Local storage keys
const STORAGE_KEY_PREFIX = 'snip_chat_context_';
const STORAGE_KEY_PREFS = 'snip_user_prefs';

// Context Manager Class
export class ContextManager {
  private context: ConversationContext;

  constructor(userId: string = 'default_user') {
    this.context = this.loadContext(userId) || this.createNewContext(userId);
  }

  // Create new context
  private createNewContext(userId: string): ConversationContext {
    return {
      userId,
      conversationHistory: [],
      userPreferences: {
        favoriteItems: [],
        dietaryRestrictions: [],
        preferredLanguage: 'darija',
        orderCount: 0,
      },
      sessionData: {
        mentionedItems: [],
        askedQuestions: [],
        cartSnapshot: [],
        sessionStartTime: new Date(),
      },
      lastInteraction: new Date(),
    };
  }

  // Load context from localStorage
  private loadContext(userId: string): ConversationContext | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.lastInteraction = new Date(parsed.lastInteraction);
        parsed.sessionData.sessionStartTime = new Date(parsed.sessionData.sessionStartTime);
        parsed.conversationHistory = parsed.conversationHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        return parsed;
      }
    } catch (error) {
      console.error('Error loading context:', error);
    }
    return null;
  }

  // Save context to localStorage
  private saveContext(): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + this.context.userId, JSON.stringify(this.context));
    } catch (error) {
      console.error('Error saving context:', error);
    }
  }

  // Add message to history
  addMessage(role: 'user' | 'assistant', content: string, intent?: string): void {
    const message: ConversationMessage = {
      role,
      content,
      timestamp: new Date(),
      intent,
    };

    this.context.conversationHistory.push(message);
    this.context.lastInteraction = new Date();

    // Keep only last 50 messages to avoid storage bloat
    if (this.context.conversationHistory.length > 50) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-50);
    }

    this.saveContext();
  }

  // Get recent messages
  getRecentMessages(count: number = 5): ConversationMessage[] {
    return this.context.conversationHistory.slice(-count);
  }

  // Get context for current conversation
  getCurrentContext(): string {
    const recent = this.getRecentMessages(3);
    if (recent.length === 0) return '';

    return recent.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
  }

  // Update user preferences
  updatePreferences(updates: Partial<UserPreferences>): void {
    this.context.userPreferences = {
      ...this.context.userPreferences,
      ...updates,
    };
    this.saveContext();
  }

  // Add favorite item
  addFavoriteItem(itemName: string): void {
    if (!this.context.userPreferences.favoriteItems.includes(itemName)) {
      this.context.userPreferences.favoriteItems.push(itemName);
      this.saveContext();
    }
  }

  // Get favorite items
  getFavoriteItems(): string[] {
    return this.context.userPreferences.favoriteItems;
  }

  // Update session data
  updateSession(updates: Partial<SessionData>): void {
    this.context.sessionData = {
      ...this.context.sessionData,
      ...updates,
    };
    this.saveContext();
  }

  // Track mentioned items
  addMentionedItem(itemName: string): void {
    if (!this.context.sessionData.mentionedItems.includes(itemName)) {
      this.context.sessionData.mentionedItems.push(itemName);
      this.saveContext();
    }
  }

  // Check if user is returning
  isReturningUser(): boolean {
    return this.context.userPreferences.orderCount > 0;
  }

  // Get user's usual order (most common items)
  getUsualOrder(): string[] {
    const favorites = this.context.userPreferences.favoriteItems;
    return favorites.slice(0, 3); // Top 3 favorites
  }

  // Increment order count
  incrementOrderCount(): void {
    this.context.userPreferences.orderCount++;
    this.context.userPreferences.lastOrderDate = new Date();
    this.saveContext();
  }

  // Get personalized greeting
  getPersonalizedGreeting(): string | null {
    const { orderCount, lastOrderDate, favoriteItems } = this.context.userPreferences;

    if (orderCount === 0) {
      return null; // First time user, use default greeting
    }

    if (orderCount === 1) {
      return 'Merhba bik! Content de te revoir 😄';
    }

    if (orderCount >= 5) {
      return 'Ahlan! Client fidèle 🔥 Bghiti ton habituel?';
    }

    if (favoriteItems.length > 0) {
      const fav = favoriteItems[0];
      return `Salam! Bghiti ${fav} comme d'habitude? 😄`;
    }

    return 'Merhba bik! 😄';
  }

  // Check if user asked this question recently
  hasAskedRecently(question: string): boolean {
    return this.context.sessionData.askedQuestions.includes(question.toLowerCase());
  }

  // Mark question as asked
  markQuestionAsked(question: string): void {
    this.context.sessionData.askedQuestions.push(question.toLowerCase());
    this.saveContext();
  }

  // Get time since last interaction
  getTimeSinceLastInteraction(): number {
    return Date.now() - this.context.lastInteraction.getTime();
  }

  // Clear session (keep preferences)
  clearSession(): void {
    this.context.sessionData = {
      mentionedItems: [],
      askedQuestions: [],
      cartSnapshot: [],
      sessionStartTime: new Date(),
    };
    this.context.conversationHistory = [];
    this.saveContext();
  }

  // Get full context
  getContext(): ConversationContext {
    return this.context;
  }
}

// Singleton instance
let contextManagerInstance: ContextManager | null = null;

export function getContextManager(userId?: string): ContextManager {
  if (
    !contextManagerInstance ||
    (userId && contextManagerInstance.getContext().userId !== userId)
  ) {
    contextManagerInstance = new ContextManager(userId);
  }
  return contextManagerInstance;
}

// Intent detection helper
export function detectIntent(message: string): string {
  const msg = message.toLowerCase();

  if (msg.match(/\b(menu|carte|plat|manger)\b/)) return 'view_menu';
  if (msg.match(/\b(prix|combien|coute|cher)\b/)) return 'ask_price';
  if (msg.match(/\b(livr|deliver|tawsil|wassel)\b/)) return 'ask_delivery';
  if (msg.match(/\b(payer|payment|khlas|CIH|cash)\b/)) return 'ask_payment';
  if (msg.match(/\b(halal|haram)\b/)) return 'ask_halal';
  if (msg.match(/\b(recommand|suggest|conseil|nقترح)\b/)) return 'ask_recommendation';
  if (msg.match(/\b(merci|shukran|thanks)\b/)) return 'thank';
  if (msg.match(/\b(bye|bslama|au revoir)\b/)) return 'goodbye';

  // Food items
  if (msg.match(/\b(pizza|tacos|burger|salade|pates|kabab|jus)\b/)) return 'order_item';

  return 'general';
}

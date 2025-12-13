import { CartItem } from '../types';

// Google Analytics 4 tracking functions
declare global {
  interface Window {
    gtag?: (command: string, targetId: string | Date, config?: Record<string, unknown>) => void;
  }
}

export const analytics = {
  // Track when user views a menu item
  trackMenuItemView: (itemName: string, category: string) => {
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        item_name: itemName,
        item_category: category,
      });
    }
  },

  // Track when user adds item to cart
  trackAddToCart: (item: CartItem) => {
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        item_name: item.name,
        quantity: item.quantity,
        price: item.totalPrice,
        variant: item.variant || 'standard',
      });
    }
  },

  // Track when user removes item from cart
  trackRemoveFromCart: (item: CartItem) => {
    if (window.gtag) {
      window.gtag('event', 'remove_from_cart', {
        item_name: item.name,
        quantity: item.quantity,
        price: item.totalPrice,
      });
    }
  },

  // Track checkout/order submission
  trackCheckout: (cartTotal: number, itemCount: number, deliveryFee: number) => {
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        value: cartTotal + deliveryFee,
        currency: 'MAD',
        items: itemCount,
        delivery_fee: deliveryFee,
      });
    }
  },

  // Track language change
  trackLanguageChange: (language: string) => {
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        language: language,
      });
    }
  },

  // Track category view
  trackCategoryView: (category: string) => {
    if (window.gtag) {
      window.gtag('event', 'view_category', {
        category: category,
      });
    }
  },

  // Track promo popup interaction
  trackPromoView: () => {
    if (window.gtag) {
      window.gtag('event', 'promo_view', {
        promo_name: '3ssila_special',
      });
    }
  },

  trackPromoClick: () => {
    if (window.gtag) {
      window.gtag('event', 'promo_click', {
        promo_name: '3ssila_special',
      });
    }
  },
};

import { useState } from 'react';
import { CartItem } from '../types';

export function useCartPersistence() {
  // Always start with empty cart (no persistence)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Persistence disabled - cart resets on refresh

  const clearCart = () => {
    setCart([]);
  };

  return { cart, setCart, clearCart };
}

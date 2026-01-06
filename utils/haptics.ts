/**
 * Haptic Feedback Utility
 * Provides vibration feedback for user interactions
 * Works on mobile devices that support the Vibration API
 */

// Check if vibration is supported
const isVibrationSupported = (): boolean => {
  return 'vibrate' in navigator;
};

/**
 * Vibration Patterns
 * Each pattern is an array: [vibrate_ms, pause_ms, vibrate_ms, ...]
 */
export const VibrationPatterns = {
  // Light tap - for button clicks, selections
  LIGHT: [10],

  // Medium tap - for adding items, important actions
  MEDIUM: [20],

  // Strong tap - for confirmations, success actions
  STRONG: [30],

  // Double tap - for special actions
  DOUBLE: [15, 50, 15],

  // Success pattern - for completed orders, achievements
  SUCCESS: [20, 100, 20, 100, 40],

  // Error pattern - for errors, warnings
  ERROR: [50, 50, 50],

  // Notification - for incoming messages, updates
  NOTIFICATION: [30, 100, 30],

  // Add to cart - special pattern for adding items
  ADD_TO_CART: [15, 30, 25],

  // Remove from cart
  REMOVE: [25, 50, 15],

  // Long press detected
  LONG_PRESS: [40],

  // Swipe action
  SWIPE: [12, 20, 12],
};

/**
 * Haptic feedback types with descriptions
 */
export enum HapticType {
  LIGHT = 'LIGHT', // Light tap for subtle feedback
  MEDIUM = 'MEDIUM', // Medium tap for standard actions
  STRONG = 'STRONG', // Strong tap for important actions
  DOUBLE = 'DOUBLE', // Double tap for special actions
  SUCCESS = 'SUCCESS', // Success pattern
  ERROR = 'ERROR', // Error pattern
  NOTIFICATION = 'NOTIFICATION', // Notification pattern
  ADD_TO_CART = 'ADD_TO_CART', // Add to cart pattern
  REMOVE = 'REMOVE', // Remove pattern
  LONG_PRESS = 'LONG_PRESS', // Long press pattern
  SWIPE = 'SWIPE', // Swipe pattern
}

/**
 * Trigger haptic feedback
 * @param type - Type of haptic feedback
 */
export const triggerHaptic = (type: HapticType = HapticType.MEDIUM): void => {
  if (!isVibrationSupported()) {
    // Fallback: Could add visual feedback here
    return;
  }

  try {
    const pattern = VibrationPatterns[type];
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

/**
 * Custom vibration pattern
 * @param pattern - Array of vibration durations in ms
 */
export const triggerCustomHaptic = (pattern: number[]): void => {
  if (!isVibrationSupported()) {
    return;
  }

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Custom haptic feedback failed:', error);
  }
};

/**
 * Stop all vibrations
 */
export const stopHaptic = (): void => {
  if (isVibrationSupported()) {
    navigator.vibrate(0);
  }
};

/**
 * React hook for haptic feedback
 */
export const useHaptic = () => {
  const vibrate = (type: HapticType = HapticType.MEDIUM) => {
    triggerHaptic(type);
  };

  const vibrateCustom = (pattern: number[]) => {
    triggerCustomHaptic(pattern);
  };

  const stop = () => {
    stopHaptic();
  };

  return {
    vibrate,
    vibrateCustom,
    stop,
    isSupported: isVibrationSupported(),
  };
};

/**
 * Higher-order function to add haptic feedback to click handlers
 * @param handler - Original click handler
 * @param hapticType - Type of haptic feedback
 */
export const withHaptic = <T extends (...args: any[]) => any>(
  handler: T,
  hapticType: HapticType = HapticType.MEDIUM
): T => {
  return ((...args: any[]) => {
    triggerHaptic(hapticType);
    return handler(...args);
  }) as T;
};

/**
 * Haptic feedback for common actions
 */
export const haptics = {
  // Button clicks
  buttonClick: () => triggerHaptic(HapticType.LIGHT),

  // Menu item selection
  selectItem: () => triggerHaptic(HapticType.MEDIUM),

  // Add to cart
  addToCart: () => triggerHaptic(HapticType.ADD_TO_CART),

  // Remove from cart
  removeFromCart: () => triggerHaptic(HapticType.REMOVE),

  // Order confirmation
  orderSuccess: () => triggerHaptic(HapticType.SUCCESS),

  // Error occurred
  error: () => triggerHaptic(HapticType.ERROR),

  // Notification received
  notification: () => triggerHaptic(HapticType.NOTIFICATION),

  // Toggle switch
  toggle: () => triggerHaptic(HapticType.LIGHT),

  // Long press detected
  longPress: () => triggerHaptic(HapticType.LONG_PRESS),

  // Swipe action
  swipe: () => triggerHaptic(HapticType.SWIPE),

  // Navigation
  navigate: () => triggerHaptic(HapticType.LIGHT),

  // Modal open/close
  modal: () => triggerHaptic(HapticType.MEDIUM),

  // Increment/Decrement
  increment: () => triggerHaptic(HapticType.LIGHT),
  decrement: () => triggerHaptic(HapticType.LIGHT),
};

export default haptics;

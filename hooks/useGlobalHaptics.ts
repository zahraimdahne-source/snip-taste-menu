import { useEffect } from 'react';
import { triggerCustomHaptic } from '../utils/haptics';

/**
 * Smart Contextual Haptic Feedback Hook
 * Uses different vibration patterns based on element type and importance
 */
export const useGlobalHaptics = () => {
  useEffect(() => {
    // Helper function to safely get className as string (handles SVG elements)
    const getClassName = (element: Element): string => {
      if (typeof element.className === 'string') {
        return element.className;
      } else if (element.className && 'baseVal' in element.className) {
        // SVG element with SVGAnimatedString
        return (element.className as SVGAnimatedString).baseVal;
      }
      return '';
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const text = target.textContent?.toLowerCase() || '';
      const className = getClassName(target).toLowerCase();

      // Get button text and classes for context
      const buttonElement = target.closest('button');
      const buttonText = buttonElement?.textContent?.toLowerCase() || '';
      const buttonClass = buttonElement ? getClassName(buttonElement).toLowerCase() : '';

      // Check element types
      const isButton = target.tagName === 'BUTTON' || buttonElement;
      const isLink = target.tagName === 'A' || target.closest('a');
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA';
      const isClickable =
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.closest('.cursor-pointer');

      // Skip if not interactive
      if (!isButton && !isLink && !isInput && !isClickable) {
        return;
      }

      // SMART CONTEXTUAL VIBRATIONS

      // 1. SUCCESS ACTIONS - Celebration pattern
      if (
        buttonText.includes('commander') ||
        buttonText.includes('confirmer') ||
        buttonText.includes('order') ||
        buttonText.includes('payé') ||
        text.includes('success') ||
        className.includes('success')
      ) {
        triggerCustomHaptic([20, 100, 20, 100, 40]); // Celebration!
        return;
      }

      // 2. ADD TO CART - Special "drop in cart" pattern
      if (
        buttonText.includes('ajouter') ||
        buttonText.includes('add') ||
        buttonClass.includes('add') ||
        text.includes('cart') ||
        text.includes('panier')
      ) {
        triggerCustomHaptic([15, 30, 25]); // Drop in cart feel
        return;
      }

      // 3. REMOVE/DELETE - Different "take out" pattern
      if (
        buttonText.includes('supprimer') ||
        buttonText.includes('remove') ||
        buttonText.includes('delete') ||
        buttonClass.includes('delete') ||
        buttonClass.includes('remove') ||
        text.includes('vider')
      ) {
        triggerCustomHaptic([25, 50, 15]); // Take out feel
        return;
      }

      // 4. ERROR/CANCEL - Warning pattern
      if (
        buttonText.includes('annuler') ||
        buttonText.includes('cancel') ||
        buttonText.includes('fermer') ||
        buttonText.includes('close') ||
        className.includes('error') ||
        className.includes('danger')
      ) {
        triggerCustomHaptic([50, 50, 50]); // Warning feel
        return;
      }

      // 5. IMPORTANT ACTIONS - Medium vibration
      if (
        isButton &&
        (buttonClass.includes('primary') ||
          buttonClass.includes('important') ||
          buttonClass.includes('bg-snip-orange') ||
          buttonClass.includes('bg-green'))
      ) {
        triggerCustomHaptic([15]); // Clear feedback
        return;
      }

      // 6. NAVIGATION/LINKS - Light vibration
      if (isLink) {
        triggerCustomHaptic([8]); // Subtle navigation
        return;
      }

      // 7. INPUTS/TOGGLES - Light vibration
      if (isInput) {
        triggerCustomHaptic([8]); // Subtle input
        return;
      }

      // 8. DEFAULT - Light button click
      triggerCustomHaptic([10]); // Standard click
    };

    // Add global click listener
    document.addEventListener('click', handleClick, { passive: true });

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};

/**
 * Alternative: Vibrate on EVERY single click (even non-interactive elements)
 */
export const useUniversalHaptics = () => {
  useEffect(() => {
    const handleClick = () => {
      triggerCustomHaptic([10]);
    };

    // Add global click listener for ALL clicks
    document.addEventListener('click', handleClick, { passive: true });

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};

/**
 * Touch-optimized haptics for mobile
 * Triggers on touchstart for faster feedback
 */
export const useTouchHaptics = () => {
  useEffect(() => {
    const handleTouch = (event: TouchEvent) => {
      const target = event.target as HTMLElement;

      // Check if the touch target is interactive
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      const isLink = target.tagName === 'A' || target.closest('a');
      const isClickable =
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.closest('.cursor-pointer');

      if (isButton || isLink || isClickable) {
        triggerCustomHaptic([10]);
      }
    };

    // Add touch listener for mobile devices
    document.addEventListener('touchstart', handleTouch, { passive: true });

    // Cleanup on unmount
    return () => {
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);
};

export default useGlobalHaptics;

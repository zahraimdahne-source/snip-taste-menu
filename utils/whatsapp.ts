import { CartItem } from '../types';

export type DeliveryDistance = '0-2km' | '3-5km' | '5-10km';

export const DELIVERY_FEES: Record<DeliveryDistance, number> = {
  '0-2km': 5,
  '3-5km': 10,
  '5-10km': 15,
};

export function calculateDeliveryFee(distance: DeliveryDistance): number {
  return DELIVERY_FEES[distance];
}

export function formatOrderForWhatsApp(
  cart: CartItem[],
  deliveryDistance: DeliveryDistance,
  language: 'fr' | 'ar' = 'fr'
): string {
  const deliveryFee = calculateDeliveryFee(deliveryDistance);
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal + deliveryFee;

  const header =
    language === 'fr'
      ? `🍕 *SNIP TASTE - NOUVELLE COMMANDE*\n━━━━━━━━━━━━━━━━━━━━\n`
      : `🍕 *سنيب تيست - طلب جديد*\n━━━━━━━━━━━━━━━━━━━━\n`;

  const orderLabel = language === 'fr' ? '📋 *COMMANDE:*\n' : '📋 *الطلب:*\n';

  let message = header + orderLabel;

  // Add each cart item
  cart.forEach((item, index) => {
    message += `\n${index + 1}. *${item.name}*\n`;
    if (item.variant) {
      message += `   ${language === 'fr' ? 'Taille' : 'الحجم'}: ${item.variant}\n`;
    }
    if (item.selectedSupplements && item.selectedSupplements.length > 0) {
      const suppLabel = language === 'fr' ? 'Suppléments' : 'إضافات';
      message += `   ${suppLabel}: ${item.selectedSupplements.map((s) => s.name).join(', ')}\n`;
    }
    message += `   ${language === 'fr' ? 'Quantité' : 'الكمية'}: ${item.quantity}\n`;
    message += `   ${language === 'fr' ? 'Prix' : 'السعر'}: ${item.totalPrice.toFixed(2)} DH\n`;
  });

  // Add totals
  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `${language === 'fr' ? '💰 Sous-total' : '💰 المجموع الفرعي'}: ${subtotal.toFixed(2)} DH\n`;
  message += `${language === 'fr' ? '🚚 Livraison' : '🚚 التوصيل'} (${deliveryDistance}): ${deliveryFee.toFixed(2)} DH\n`;
  message += `${language === 'fr' ? '✅ *TOTAL*' : '✅ *المجموع الكلي*'}: *${total.toFixed(2)} DH*\n`;

  // Add footer
  const footer =
    language === 'fr'
      ? `\n━━━━━━━━━━━━━━━━━━━━\n📍 *Adresse de livraison:*\n[Veuillez indiquer votre adresse]\n\n📞 Contact: +212 660 542 323`
      : `\n━━━━━━━━━━━━━━━━━━━━\n📍 *عنوان التوصيل:*\n[الرجاء إدخال عنوانك]\n\n📞 الاتصال: +212 660 542 323`;

  message += footer;

  return message;
}

export function sendToWhatsApp(
  phoneNumber: string,
  message: string,
  isMobile: boolean = false
): void {
  const encodedMessage = encodeURIComponent(message);
  const baseUrl = isMobile ? 'whatsapp://send' : 'https://web.whatsapp.com/send';
  const url = `${baseUrl}?phone=${phoneNumber}&text=${encodedMessage}`;

  window.open(url, '_blank');
}

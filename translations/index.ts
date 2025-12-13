export const translations = {
  fr: {
    // Header
    title: 'Gastronomie Fine par Chef Jalal',

    // Navigation
    menu: 'Menu',
    cart: 'Panier',
    viewCart: 'Voir mon panier',

    // Cart
    yourCart: 'Votre Panier',
    emptyCart: 'Votre panier est vide',
    addItems: 'Ajoutez des articles pour commencer',
    subtotal: 'Sous-total',
    delivery: 'Livraison',
    total: 'Total',
    clearCart: 'Vider le panier',
    confirmClear: 'Êtes-vous sûr de vouloir vider le panier?',
    sendOrder: 'Envoyer la commande',
    sendViaWhatsApp: 'Commander via WhatsApp',

    // Delivery
    selectDeliveryDistance: 'Sélectionnez la distance de livraison',
    deliveryDistance: 'Distance de livraison',

    // Item Modal
    selectSize: 'Sélectionnez la taille',
    small: 'Petite',
    large: 'Grande',
    supplements: 'Suppléments',
    addSupplements: 'Ajouter des suppléments',
    quantity: 'Quantité',
    addToCart: 'Ajouter au panier',
    price: 'Prix',

    // Menu Categories
    'tex-mex': 'TEX MEX',
    jus: 'JUS',
    desserts: 'DESSERTS',
    boissons: 'BOISSONS',
    salades: 'SALADES',
    pizza: 'PIZZA',
    burger: 'BURGER',
    pasticcios: 'PASTICCIOS',
    pates: 'PATES',
    panizzas: 'PANIZZAS',
    tacos: 'TACOS',
    sandwich: 'SANDWICH',
    kabab: 'KABAB',
    plats: 'PLATS',

    // Footer
    contactUs: 'Contactez-nous',
    scanMe: 'SCANNEZ-MOI',
    homeDelivery: 'Livraison à domicile',
    available: 'DISPONIBLE',

    // Common
    close: 'Fermer',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    remove: 'Retirer',
    dh: 'DH',
  },

  ar: {
    // Header
    title: 'فن الطهي الراقي من الشيف جلال',

    // Navigation
    menu: 'القائمة',
    cart: 'السلة',
    viewCart: 'عرض سلتي',

    // Cart
    yourCart: 'سلتك',
    emptyCart: 'سلتك فارغة',
    addItems: 'أضف عناصر للبدء',
    subtotal: 'المجموع الفرعي',
    delivery: 'التوصيل',
    total: 'المجموع الكلي',
    clearCart: 'إفراغ السلة',
    confirmClear: 'هل أنت متأكد من رغبتك في إفراغ السلة؟',
    sendOrder: 'إرسال الطلب',
    sendViaWhatsApp: 'اطلب عبر واتساب',

    // Delivery
    selectDeliveryDistance: 'اختر مسافة التوصيل',
    deliveryDistance: 'مسافة التوصيل',

    // Item Modal
    selectSize: 'اختر الحجم',
    small: 'صغيرة',
    large: 'كبيرة',
    supplements: 'إضافات',
    addSupplements: 'أضف إضافات',
    quantity: 'الكمية',
    addToCart: 'أضف إلى السلة',
    price: 'السعر',

    // Menu Categories
    'tex-mex': 'تكس مكس',
    jus: 'عصائر',
    desserts: 'حلويات',
    boissons: 'مشروبات',
    salades: 'سلطات',
    pizza: 'بيتزا',
    burger: 'برجر',
    pasticcios: 'باستيتشيو',
    pates: 'معكرونة',
    panizzas: 'بانيزا',
    tacos: 'تاكوس',
    sandwich: 'ساندويتش',
    kabab: 'كباب',
    plats: 'أطباق رئيسية',

    // Footer
    contactUs: 'اتصل بنا',
    scanMe: 'امسحني',
    homeDelivery: 'التوصيل للمنزل',
    available: 'متاح',

    // Common
    close: 'إغلاق',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    remove: 'إزالة',
    dh: 'درهم',
  },
};

export type Language = 'fr' | 'ar';
export type TranslationKey = keyof typeof translations.fr;

export function t(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.fr[key] || key;
}

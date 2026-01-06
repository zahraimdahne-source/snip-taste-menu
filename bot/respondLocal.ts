// Offline bot engine for Snip Taste - Safe Selection Logic

export type PriceItem = { name: string; price: number };
export type DualPriceItem = { name: string; prices: { small: number; large: number } };
export type MenuItem = PriceItem | DualPriceItem;

export type MenuSection = {
  id: string; // Required to match MenuSectionData
  title: string;
  items: MenuItem[];
  type: 'standard' | 'dual-price' | 'list';
  note?: string;
  supplements?: { name: string; price: number }[]; // Read supplements from data
};

type Size = 'small' | 'large';

export type CartLine = {
  sectionTitle: string;
  itemName: string;
  qty: number;
  size?: Size;
  selectedSauce?: string; // NEW: Specific sauce choice
  extras: { name: string; unit_price: number }[];
  unit_price: number;
  line_total: number;
};

type PendingPick = {
  sectionIndex: number;
  itemIndex: number;
  size?: Size;
  qty?: number;
  selectedSauce?: string;
};

export type BotPhase =
  | 'idle'
  | 'browsing'
  | 'await_size'
  | 'await_qty'
  | 'ask_sauce' // NEW PHASE
  | 'await_extras'
  | 'cart_actions'
  | 'ask_delivery_method'
  | 'ask_delivery_distance' // NEW PHASE
  | 'ask_address'
  | 'ask_payment'
  | 'final';

export type BotState = {
  phase: BotPhase;
  cart: CartLine[];
  pending?: PendingPick;
  currentCategory?: string;
  customer: {
    deliveryMethod?: 'Livraison' | 'Sur Place / Emporter';
    deliveryDistance?: '0-2km' | '3-5km' | '5-10km';
    address?: string;
    payment?: 'Cash' | 'CIH Bank';
    clientLocation?: { lat: number; lng: number };
    distance?: number;
  };
  menuSection?: MenuSection; // For displaying menu in chatbot
};

export const initialBotState: BotState = {
  phase: 'idle',
  cart: [],
  customer: {},
};

/** ------------------ UTILS ------------------ **/

function cleanName(name: string) {
  // Keep full names so users know exactly what they're ordering
  return name.trim();
}

function money(n: number) {
  return `${Math.round(n)} DH`;
}

function cartTotal(cart: CartLine[]) {
  return cart.reduce((s, l) => s + l.line_total, 0);
}

function isDualPrice(item: MenuItem): item is DualPriceItem {
  return (item as any).prices !== undefined;
}

function makeWhatsAppLink(cart: CartLine[], customer: BotState['customer']) {
  const phone = '212660542323';

  const lines = cart
    .map((l) => {
      let details = '';
      if (l.size) details += ` (${l.size === 'large' ? 'Kbira' : 'Sghira'})`;
      if (l.selectedSauce) details += ` [Sauce: ${l.selectedSauce}]`;
      if (l.extras.length) details += ` + ${l.extras.map((e) => e.name).join(', ')}`;
      return `- ${l.itemName}${details} x${l.qty} = ${money(l.line_total)}`;
    })
    .join('\n');

  const itemsTotal = cartTotal(cart);

  // Calculate delivery fee
  const deliveryFees = { '0-2km': 5, '3-5km': 10, '5-10km': 15 };
  const deliveryFee =
    customer.deliveryMethod === 'Livraison' && customer.deliveryDistance
      ? deliveryFees[customer.deliveryDistance]
      : 0;

  const total = itemsTotal + deliveryFee;

  let deliveryInfo = '';
  if (customer.deliveryMethod === 'Livraison') {
    deliveryInfo = `Livraison: ${customer.address || 'Non spécifié'} (${customer.deliveryDistance || '0-2km'}: ${deliveryFee} DH)`;
  } else {
    deliveryInfo = `Commande: ${customer.deliveryMethod || 'Emporter'}`;
  }

  // Add location information if available
  let locationInfo = '';
  if (customer.clientLocation) {
    const { lat, lng } = customer.clientLocation;
    const googleMapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    locationInfo = `\n📍 Ma Position: ${googleMapsLink}`;
    if (customer.distance) {
      locationInfo += `\n📏 Distance: ${customer.distance} km`;
    }
  }

  const text =
    `Salam Snip Taste 👋\n` +
    `Bghit ncommandi:\n` +
    `${lines}\n` +
    `Sous-total: ${money(itemsTotal)}\n` +
    (deliveryFee > 0 ? `Frais livraison: ${money(deliveryFee)}\n` : '') +
    `Total: ${money(total)}\n` +
    `${deliveryInfo}${locationInfo}\n` +
    `Payment: ${customer.payment || 'Cash'}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** ------------------ EXTRAS LOGIC ------------------ **/

// Sauce options - different for PLAT vs Tacos/Kabab
const TACOS_KABAB_SAUCES = ['Algérienne', 'Bigy', 'Barbecue', 'Mixte'];
const PLAT_SAUCES = ['Sauce Blanche', 'Sauce Champignon'];

function getSauceOptions(sectionTitle: string): string[] {
  const t = sectionTitle.toUpperCase();
  if (t.includes('PLAT')) {
    return PLAT_SAUCES;
  }
  return TACOS_KABAB_SAUCES;
}

function shouldAskSauce(sectionTitle: string): boolean {
  const t = sectionTitle.toUpperCase();
  return t.includes('TACOS') || t.includes('KABAB') || t.includes('PLAT');
}

function getExtrasConfig(sectionTitle: string) {
  const t = sectionTitle.toUpperCase();
  // Read from Data.ts essentially, or hardcode common patterns
  if (t.includes('PIZZA') || t.includes('BURGER')) {
    return {
      question: 'Bghiti zyada Fromage (+10 DH)?',
      options: ['Iyyeh (Oui)', 'La (Non)'],
      values: [{ name: 'Supplément Fromage', unit_price: 10 }],
    };
  }
  if (t.includes('TACOS')) {
    return {
      question: 'Bghiti Suppléments?',
      options: ['Fromage (+5)', 'Sauce Extra (+2)', 'Bjouj (+7)', 'Walou'],
      values: [
        { name: 'Supplément Fromage', unit_price: 5 },
        { name: 'Sauce', unit_price: 2 }, // "Sauce" in supplements is Extra Sauce
      ],
    };
  }
  if (t.includes('PANIZZA')) {
    return {
      question: 'Bghiti m3aha Frites (+5 DH)?',
      options: ['Iyyeh (Oui)', 'La (Non)'],
      values: [{ name: 'Avec Frites', unit_price: 5 }],
    };
  }
  if (t.includes('PATES')) {
    return {
      question: 'Bghiti supplément Pates (+20 DH)?',
      options: ['Iyyeh (Oui)', 'La (Non)'],
      values: [{ name: 'Supplément Pates', unit_price: 20 }],
    };
  }
  if (t.includes('KABAB')) {
    return {
      question: 'Bghiti Sauce Extra (+2 DH)?',
      options: ['Iyyeh (Oui)', 'La (Non)'],
      values: [{ name: 'Sauce', unit_price: 2 }],
    };
  }
  return null;
}

/** ------------------ MAIN HANDLER ------------------ **/

export function handleUserMessage(
  menuData: MenuSection[],
  state: BotState,
  input: string
): { state: BotState; reply: string; options?: string[]; imageUrl?: string } {
  const text = input.trim();
  const lower = text.toLowerCase();

  // Safe Menu Data Check
  if (!menuData || menuData.length === 0) {
    return { state, reply: 'Error: Menu data not found.', options: [] };
  }

  // --- GLOBAL RESET / MENU COMMAND ---
  if (lower === 'menu' || lower === 'menu principal' || lower === 'restart') {
    return {
      state: { ...initialBotState, cart: state.cart, customer: state.customer },
      reply: "Merhba! Ha l'menu (Click 3la categorie):",
      options: menuData.map((s) => s.title),
    };
  }

  // --- STATE MACHINE ---

  // 1. IDLE
  if (state.phase === 'idle') {
    const foundSection = menuData.find(
      (s) => s.title.toLowerCase() === lower || text.includes(s.title)
    );
    if (foundSection) {
      // Show ALL items, not just first 8
      const items = foundSection.items.map((i) => cleanName(i.name));
      return {
        state: { ...state, phase: 'browsing', currentCategory: foundSection.title },
        reply: `Zwina! Ha les choix f **${foundSection.title}** 👇`,
        options: items.concat(['Retour Menu']),
      };
    }
    return {
      state,
      reply: 'Merhba bik! Khtar chmen category bghiti 👇',
      options: menuData.map((s) => s.title),
    };
  }

  // 2. BROWSING
  if (state.phase === 'browsing') {
    if (lower === 'retour menu') {
      return {
        state: { ...state, phase: 'idle', currentCategory: undefined },
        reply: "Raj3na l'menu principal.",
        options: menuData.map((s) => s.title),
      };
    }

    const sectionIndex = menuData.findIndex((s) => s.title === state.currentCategory);
    if (sectionIndex === -1) {
      return {
        state: { ...state, phase: 'idle' },
        reply: 'W93 ghalat, 3awd khtar.',
        options: menuData.map((s) => s.title),
      };
    }

    const section = menuData[sectionIndex];
    const itemIndex = section.items.findIndex(
      (i) => cleanName(i.name).toLowerCase() === lower || i.name.toLowerCase().includes(lower)
    );

    if (itemIndex !== -1) {
      const item = section.items[itemIndex];
      const pending: PendingPick = { sectionIndex, itemIndex };

      if (isDualPrice(item)) {
        return {
          state: { ...state, phase: 'await_size', pending },
          reply: `Zwin! **${item.name}**. Bghitiha Sghira wla Kbira?`,
          options: ['Sghira (Small)', 'Kbira (Large)'],
        };
      } else {
        return {
          state: { ...state, phase: 'await_qty', pending },
          reply: `Mzyan! **${item.name}** (${money(item.price)}). Ch7al bghiti men Wehda?`,
          options: ['1', '2', '3', '4'],
        };
      }
    }
    // Show ALL items when user input is not recognized
    const items = section.items.map((i) => cleanName(i.name));
    return {
      state,
      reply: 'Mafhemtch chno khtari 😅. Khtar wehda men hado 👇',
      options: items.concat(['Retour Menu']),
    };
  }

  // 3. AWAIT_SIZE
  if (state.phase === 'await_size') {
    if (!state.pending)
      return {
        state: { ...state, phase: 'idle' },
        reply: 'Reset.',
        options: menuData.map((s) => s.title),
      };

    let size: Size | undefined;
    if (lower.includes('sghira') || lower.includes('small')) size = 'small';
    if (lower.includes('kbira') || lower.includes('large')) size = 'large';

    if (size) {
      return {
        state: { ...state, phase: 'await_qty', pending: { ...state.pending, size } },
        reply: `Ok **${size === 'large' ? 'Kbira' : 'Sghira'}**. Ch7al bghiti?`,
        options: ['1', '2', '3', '4'],
      };
    }
    return {
      state,
      reply: 'Goli ghir: Sghira wla Kbira 👇',
      options: ['Sghira (Small)', 'Kbira (Large)'],
    };
  }

  // 4. AWAIT_QTY
  if (state.phase === 'await_qty') {
    if (!state.pending)
      return {
        state: { ...state, phase: 'idle' },
        reply: 'Reset.',
        options: menuData.map((s) => s.title),
      };

    const qty =
      parseInt(text) || (text.includes('wa7da') ? 1 : null) || (text.includes('joj') ? 2 : null);
    if (!qty) {
      return { state, reply: 'Khtar l3adad (1, 2, 3...) 👇', options: ['1', '2', '3', '4'] };
    }

    // Logic: If Tacos/Kabab/Plat -> Ask Sauce. Else -> Check Extras.
    const section = menuData[state.pending.sectionIndex];
    if (shouldAskSauce(section.title)) {
      const sauceOptions = getSauceOptions(section.title);
      return {
        state: { ...state, phase: 'ask_sauce', pending: { ...state.pending, qty } },
        reply: 'Khtar Sauce li bghiti:',
        options: sauceOptions,
      };
    }

    const extrasConfig = getExtrasConfig(section.title);
    if (extrasConfig) {
      return {
        state: { ...state, phase: 'await_extras', pending: { ...state.pending, qty } },
        reply: extrasConfig.question,
        options: extrasConfig.options,
      };
    }

    return addToCartAndAskNext(state, menuData, qty, []);
  }

  if (state.phase === 'ask_sauce') {
    if (!state.pending) return { state: { ...state, phase: 'idle' }, reply: 'Reset.', options: [] };

    const section = menuData[state.pending.sectionIndex];
    const sauceOptions = getSauceOptions(section.title);
    const sauce = sauceOptions.find((s) => lower.includes(s.toLowerCase()));
    if (!sauce) {
      return { state, reply: 'Khtar sauce men hado 👇', options: sauceOptions };
    }

    // Check for Extras after Sauce
    const extrasConfig = getExtrasConfig(section.title);

    const updatedPending = { ...state.pending, selectedSauce: sauce };

    if (extrasConfig) {
      return {
        state: { ...state, phase: 'await_extras', pending: updatedPending },
        reply: extrasConfig.question,
        options: extrasConfig.options,
      };
    }
    return addToCartAndAskNext(state, menuData, updatedPending.qty!, [], sauce);
  }

  // 6. AWAIT_EXTRAS
  if (state.phase === 'await_extras') {
    if (!state.pending)
      return {
        state: { ...state, phase: 'idle' },
        reply: 'Reset.',
        options: menuData.map((s) => s.title),
      };

    const section = menuData[state.pending.sectionIndex];
    const extrasConfig = getExtrasConfig(section.title);
    let chosenExtras: { name: string; unit_price: number }[] = [];

    if (extrasConfig) {
      const yes =
        lower.includes('iyyeh') ||
        lower.includes('oui') ||
        lower.includes('fromage') ||
        lower.includes('bjoj') ||
        lower.includes('extra');
      const no = lower.includes('la') || lower.includes('non') || lower.includes('walou');

      if (yes) {
        if (lower.includes('sauce'))
          chosenExtras.push(extrasConfig.values.find((v) => v.name === 'Sauce')!);
        else if (lower.includes('bjoj')) chosenExtras = extrasConfig.values;
        else chosenExtras.push(extrasConfig.values[0]);
      } else if (!no) {
        return { state, reply: 'Khtar men lkhtiyaratt 👇', options: extrasConfig.options };
      }
    }

    return addToCartAndAskNext(
      state,
      menuData,
      state.pending.qty!,
      chosenExtras,
      state.pending.selectedSauce
    );
  }

  // 7. CART_ACTIONS
  if (state.phase === 'cart_actions') {
    if (lower.includes('zid') || lower.includes('menu')) {
      return {
        state: { ...state, phase: 'idle' },
        reply: 'Merhba, chno bghiti tzid? 👇',
        options: menuData.map((s) => s.title),
      };
    }
    if (lower.includes('safi') || lower.includes('finir') || lower.includes('checkout')) {
      return {
        state: { ...state, phase: 'ask_delivery_method' },
        reply: 'Kifach baghi tcommandi?',
        options: ['Livraison', 'Sur Place / Emporter'],
      };
    }
    return { state, reply: 'Bghiti tzid chi haja? 👇', options: ['Zid chi haja', 'Safi (Finir)'] };
  }

  // 8. ASK_DELIVERY_METHOD
  if (state.phase === 'ask_delivery_method') {
    if (lower.includes('livraison')) {
      return {
        state: {
          ...state,
          phase: 'ask_delivery_distance',
          customer: { ...state.customer, deliveryMethod: 'Livraison' },
        },
        reply: 'Ch7al 3andek men distance?',
        options: ['0-2km (5 DH)', '3-5km (10 DH)', '5-10km (15 DH)'],
      };
    }
    return {
      state: {
        ...state,
        phase: 'ask_payment',
        customer: { ...state.customer, deliveryMethod: 'Sur Place / Emporter' },
      },
      reply: "C'est noté ✅. Daba tariqat lkhalass?",
      options: ['Cash', 'CIH Bank'],
    };
  }

  // 9. ASK_DELIVERY_DISTANCE (New Phase)
  if (state.phase === 'ask_delivery_distance') {
    let distance: '0-2km' | '3-5km' | '5-10km' | undefined;
    if (lower.includes('0-2') || lower.includes('0 2')) distance = '0-2km';
    else if (lower.includes('3-5') || lower.includes('3 5')) distance = '3-5km';
    else if (lower.includes('5-10') || lower.includes('5 10')) distance = '5-10km';

    if (!distance) {
      return {
        state,
        reply: 'Khtar distance men hado 👇',
        options: ['0-2km (5 DH)', '3-5km (10 DH)', '5-10km (15 DH)'],
      };
    }

    return {
      state: {
        ...state,
        phase: 'ask_address',
        customer: { ...state.customer, deliveryDistance: distance },
      },
      reply: 'Top! Fin gha nlivriw lik? (Quartier):',
      options: ['Maarif', 'Bourgogne', 'Racine', 'Anfa', 'Gauthier', 'Sidi Maarouf', 'Autre'],
    };
  }

  // 10. ASK_ADDRESS
  if (state.phase === 'ask_address') {
    const address = text;
    return {
      state: { ...state, phase: 'ask_payment', customer: { ...state.customer, address } },
      reply: "C'est noté ✅. Daba tariqat lkhalass?",
      options: ['Cash', 'CIH Bank'],
    };
  }

  // 10. ASK_PAYMENT
  if (state.phase === 'ask_payment') {
    const isCIH = lower.includes('cih');
    const payment = isCIH ? 'CIH Bank' : 'Cash';
    const finalCustomer = { ...state.customer, payment: payment as any };

    // Generate everything BEFORE resetting
    const waLink = makeWhatsAppLink(state.cart, finalCustomer);

    // Extract order details from WhatsApp link for display
    const itemsTotal = cartTotal(state.cart);
    const deliveryFees = { '0-2km': 5, '3-5km': 10, '5-10km': 15 };
    const deliveryFee =
      finalCustomer.deliveryMethod === 'Livraison' && finalCustomer.deliveryDistance
        ? deliveryFees[finalCustomer.deliveryDistance]
        : 0;
    const total = itemsTotal + deliveryFee;

    let replyText = `✅ Commande Wazda!\nTotal: ${money(total)}\n\n👇 **Wrek hna bach tsift commande f WhatsApp** 👇\n${waLink}`;
    let imageUrl: string | undefined = undefined;

    if (isCIH) {
      // Build order summary for display
      const orderLines = state.cart
        .map((l) => {
          let details = '';
          if (l.size) details += ` (${l.size === 'large' ? 'Kbira' : 'Sghira'})`;
          if (l.selectedSauce) details += ` [${l.selectedSauce}]`;
          if (l.extras.length) details += ` + ${l.extras.map((e) => e.name).join(', ')}`;
          return `- ${l.itemName}${details} x${l.qty} = ${money(l.line_total)}`;
        })
        .join('\n');

      const deliveryInfo =
        finalCustomer.deliveryMethod === 'Livraison'
          ? `📍 ${finalCustomer.address} (${finalCustomer.deliveryDistance}: ${deliveryFee} DH)`
          : `🏪 ${finalCustomer.deliveryMethod}`;

      replyText =
        `✅ Commande Wazda!\n\n📋 **Détails de la commande:**\n${orderLines}\n\n` +
        `💰 Sous-total: ${money(itemsTotal)}\n` +
        (deliveryFee > 0 ? `🚚 Livraison: ${money(deliveryFee)}\n` : '') +
        `**Total: ${money(total)}**\n\n` +
        `${deliveryInfo}\n` +
        `💳 Payment: CIH Bank\n\n` +
        `👇 **Scannez le QR code pour payer**\n\n` +
        `${waLink}`;
      imageUrl = '/QR CIH.png';
    }

    return {
      state: { ...initialBotState },
      reply:
        replyText + '\n\n__________________\n\n**Marhba bik! Bghiti tcommande haja okhra?** 👇',
      options: menuData.map((s) => s.title),
      imageUrl,
    };
  }

  // FINAL
  if (state.phase === 'final') {
    return {
      state: { ...initialBotState },
      reply: 'Merhba bik f Snip Taste 🔥\nKhtar chmen category bghiti:',
      options: menuData.map((s) => s.title),
    };
  }

  return { state, reply: 'Resetting...', options: [] };
}

/** HELPER: Add item to cart and transition to CART_ACTIONS */
function addToCartAndAskNext(
  state: BotState,
  menuData: MenuSection[],
  qty: number,
  extras: any[],
  sauce?: string
): { state: BotState; reply: string; options: string[] } {
  if (!state.pending) return { state, reply: 'Error', options: [] };

  const section = menuData[state.pending.sectionIndex];
  const item = section.items[state.pending.itemIndex];

  let basePrice = 0;
  if (isDualPrice(item)) {
    basePrice = state.pending.size === 'large' ? item.prices.large : item.prices.small;
  } else {
    basePrice = (item as PriceItem).price;
  }

  const extrasTotal = extras.reduce((sum, e) => sum + e.unit_price, 0);
  const unitPrice = basePrice + extrasTotal;

  const newLine: CartLine = {
    sectionTitle: section.title,
    itemName: item.name,
    qty,
    size: state.pending.size,
    selectedSauce: sauce,
    extras,
    unit_price: unitPrice,
    line_total: unitPrice * qty,
  };

  const newCart = [...state.cart, newLine];

  return {
    state: { ...state, phase: 'cart_actions', cart: newCart, pending: undefined },
    reply: `✅ Tzad lik: **${item.name}**${sauce ? ` (${sauce})` : ''} x${qty}.\n💰 Total commade: ${money(cartTotal(newCart))}\n\nBghiti tzid **produit akhor (Multi)** wla **Safi (Finir)**?`,
    options: ['Zid chi haja', 'Safi (Finir)'],
  };
}

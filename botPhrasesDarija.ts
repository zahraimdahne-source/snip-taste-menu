// Darija-only conversation phrases for Snip Taste chatbot
export const botPhrasesDarija = {
  greeting: [
    'Salam khoya/khti! Merhba bik f Snip Taste 🔥 Chno bghiti tberre3 bih lyoum?',
    'Ahlan! Nwerti 🔥 Wach bghiti chi tacos, pizza, wla burger?',
    'Merhbaaa 😄 9oli ghir chno 3jebk w ana n3awnk!',
    'Salam! Kayn bzaf d lmakla nadi 🔥 Chno bghiti?',
  ],

  menu_overview: [
    'Hadi hiya lmenu dyalna 😄:\n\n🍕 PIZZA (20-50 DH)\n🌮 TACOS (25-50 DH)\n🍔 BURGER (30-60 DH)\n🥗 SALADES (25-40 DH)\n🍝 PATES (30-35 DH)\n🥙 KABAB (30-40 DH)\n🍹 JUS (15-20 DH)\n\n9oli chno bghiti w n3tik details!',
    'Kayn 3andna bzaf 😄:\n\n🍕 PIZZA\n🌮 TACOS\n🍔 BURGER\n🥗 SALADES\n🍝 PATES\n🥙 KABAB\n🍹 JUS\n\nChno kat9leb 3lih?',
  ],

  ask_size: [
    'Bghitiha sghira wla kbira?',
    'Sghira wla kbira? 😄',
    'Size: sghira (S) wla kbira (L)?',
  ],

  ask_qty: ['Ch7al mn wa7da bghiti?', 'Kam wa7da? (1, 2, 3...)', 'Chhal mn wa7da ndir lik?'],

  ask_extras_pizza: [
    'Bghiti tzid fromage? (+10 DH) - 9ol iyyeh wla la',
    'Supplément fromage +10 DH? (iyyeh/la)',
  ],

  ask_extras_tacos: [
    'Bghiti tzid fromage (+5 DH) wla sauce (+2 DH)? 9ol iyyeh wla la',
    'Extras: fromage +5 DH, sauce +2 DH? (iyyeh/la/bla)',
  ],

  ask_extras_panizza: [
    'Bghiti frites m3aha? (+5 DH) - iyyeh wla la',
    'Avec frites +5 DH? (iyyeh/la)',
  ],

  ask_extras_kabab: ['Bghiti sauce? (+2 DH) - iyyeh wla la', 'Sauce +2 DH? (iyyeh/la)'],

  ask_extras_pates: [
    'Bghiti supplément pates? (+20 DH) - iyyeh wla la',
    'Supplément pates +20 DH? (iyyeh/la)',
  ],

  ask_add_more: [
    'Zwin 😄 bghiti tzid chi haja okhra? (iyyeh / la)',
    'Mzyan! Kayn chi haja okhra? (iyyeh/la)',
    'Tzadat ✅ Bghiti tzid? (iyyeh/la)',
  ],

  ask_address: [
    "Sift lia l'adresse (quartier f Casa) + رقم الهاتف عافاك.",
    'Fin nta/nti f Casa? + رقم الهاتف.',
    "L'adresse dial tawsil + telephone?",
  ],

  ask_name: ['Smiya dyalk 3afak?', 'Chno smitk?', 'Smiya?'],

  ask_payment: [
    'Khlas cash wla transfert CIH?',
    'Payment: cash wla CIH?',
    'Katkhless kifash? cash wla CIH?',
  ],

  confirm_added: [
    'Tzadat ✅ {itemName}. Cart daba: {cart_total} DH.',
    'Zwin! {itemName} tzadat. Total: {cart_total} DH.',
  ],

  item_found: [
    "Hadi l'options li lقيت 😄:\n\n{items}\n\n9ol smiya kamla.",
    'Kayn 3andna 😄:\n\n{items}\n\n9ol smiya li bghiti.',
  ],

  fallback: [
    'Smah lia، mafhemtch mzyan 😅. 9ol smiya d lplat wla l9ism (pizza/tacos/jus...).',
    'Mzyan! Ghir 3awd b chi tari9a okhra 😄: bghiti menu? wla chi plat m3ayen?',
    'Mafhemtch 😅 Wach bghiti menu? wla chi plat m3ayen?',
  ],

  delivery_info: [
    'Kantwasslo f Casa kamla 🚚 (30-45 دقيقة).',
    'Tawsil 3andna 30-45 دقيقة f Casablanca 😄.',
  ],

  final_message: [
    'Hadchi li tlabti ✅\n\nTotal: {total} DH\n\nHna WhatsApp link باش تمشي ديريكت و message واجد:\n\n{wa_link}',
    'Safi! Total: {total} DH 🔥\n\nDkhol l WhatsApp من هنا:\n{wa_link}',
  ],
};

// Helper to get random phrase
export function getRandomDarijaPhrase(category: keyof typeof botPhrasesDarija): string {
  const phrases = botPhrasesDarija[category];
  if (!Array.isArray(phrases)) return phrases as string;
  return phrases[Math.floor(Math.random() * phrases.length)];
}

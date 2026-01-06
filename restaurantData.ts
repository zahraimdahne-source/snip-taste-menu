// Professional menu data structure for Snip Taste Restaurant
export const restaurantData = {
  restaurant: 'Snip Taste',
  location: 'Casablanca, Morocco',
  menu: [
    {
      id: 'tex-mex',
      category: 'TEX MEX',
      type: 'standard',
      items: [
        { name: 'Frite', price: 10 },
        { name: 'Nugget x 6', price: 20 },
        { name: 'Chicken x 2', price: 15 },
        { name: 'Chicken x 3', price: 20 },
      ],
    },
    {
      id: 'jus',
      category: 'JUS',
      category_en: 'Juice',
      type: 'standard',
      items: [
        { name: 'Banane', price: 15 },
        { name: 'Pomme', price: 15 },
        { name: 'Orange', price: 15 },
        { name: 'Citron', price: 15 },
        { name: 'Fraise', price: 18 },
        { name: 'Mangue', price: 18 },
        { name: 'Papay', price: 18 },
        { name: 'Avocat', price: 20 },
        { name: 'Ananas', price: 18 },
        { name: 'Panache', price: 20 },
      ],
    },
    {
      id: 'desserts',
      category: 'DESSERTS',
      type: 'standard',
      items: [{ name: 'Tiramisu', price: 16 }],
    },
    {
      id: 'boissons',
      category: 'BOISSONS',
      category_en: 'Drinks',
      type: 'standard',
      items: [
        { name: 'Eau Minerale Petit', price: 4 },
        { name: 'Soda', price: 6 },
        { name: 'Tropical Soda', price: 7 },
      ],
    },
    {
      id: 'salades',
      category: 'SALADES',
      type: 'standard',
      items: [
        { name: 'Salade Mexicain', price: 25 },
        { name: 'Salade Nicoise', price: 25 },
        { name: 'Salade Sniptaste', price: 40 },
      ],
    },
    {
      id: 'pizza',
      category: 'PIZZA',
      type: 'dual-price',
      note: 'Supplément Fromage: 10 DH',
      supplements: [{ name: 'Supplément Fromage', price: 10 }],
      items: [
        { name: 'Pizza Margherita', price_small: 20, price_large: 30 },
        { name: 'Pizza Hot Dog', price_small: 25, price_large: 35 },
        { name: 'Pizza Végétarien', price_small: 30, price_large: 35 },
        { name: 'Pizza Thon', price_small: 30, price_large: 40 },
        { name: 'Pizza Jambon', price_small: 30, price_large: 40 },
        { name: 'Pizza Poulet', price_small: 30, price_large: 40 },
        { name: 'Pizza Viande Hachée', price_small: 30, price_large: 40 },
        { name: 'Pizza Quatre Fromage', price_small: 30, price_large: 40 },
        { name: 'Pizza Jasmine', price_small: 35, price_large: 45 },
        { name: 'Pizza Milano', price_small: 35, price_large: 45 },
        { name: 'Pizza Fruit De Mer', price_small: 35, price_large: 45 },
        { name: 'Pizza Pepperoni', price_small: 35, price_large: 45 },
        { name: 'Pizza Quatre Saisons', price_small: 35, price_large: 45 },
        { name: 'Pizza Sniptaste', price_small: 40, price_large: 50 },
      ],
    },
    {
      id: 'burger',
      category: 'BURGER',
      type: 'standard',
      items: [
        { name: 'Chesse Burger', price: 30 },
        { name: 'Chicken Burger', price: 30 },
        { name: 'Egg Burger', price: 35 },
        { name: 'Double Burger', price: 37 },
        { name: 'Snip Taste Burger', price: 60 },
      ],
    },
    {
      id: 'pasticcios',
      category: 'PASTICCIOS',
      type: 'standard',
      items: [
        { name: 'Pasticcio Viande Hachée', price: 30 },
        { name: 'Pasticcio Poulet', price: 30 },
        { name: 'Pasticcio Jambon De Dinde Fumée', price: 30 },
        { name: 'Pasticcio Mixte', price: 35 },
      ],
    },
    {
      id: 'pates',
      category: 'PATES',
      category_en: 'Pasta',
      type: 'standard',
      note: 'Supplément Pates: 20 DH',
      supplements: [{ name: 'Supplément Pates', price: 20 }],
      items: [
        { name: 'Carbonara', price: 30 },
        { name: 'Poulet Champignon', price: 30 },
        { name: 'Bolognaise', price: 35 },
        { name: 'Fruits De Mer', price: 35 },
      ],
    },
    {
      id: 'panizzas',
      category: 'PANIZZAS',
      type: 'standard',
      note: 'Avec Frites: +5 DH',
      supplements: [{ name: 'Avec Frites', price: 5 }],
      items: [
        { name: 'Panizza Hot Dog', price: 30 },
        { name: 'Panizza Thon', price: 30 },
        { name: 'Panizza Poulet', price: 30 },
        { name: 'Panizza Viande Hachée', price: 35 },
        { name: 'Panizza Cordon Bleu', price: 35 },
        { name: 'Panizza Poulet Pané', price: 35 },
      ],
    },
    {
      id: 'tacos',
      category: 'TACOS',
      type: 'standard',
      note: 'Avec Frites | Supp. Fromage: 5 DH | Sauce: 2 DH',
      supplements: [
        { name: 'Supplément Fromage', price: 5 },
        { name: 'Sauce', price: 2 },
      ],
      items: [
        { name: 'Tacos Hot Dog', price: 25 },
        { name: 'Tacos Poulet', price: 30 },
        { name: 'Tacos Chicken', price: 35 },
        { name: 'Tacos Nuggets', price: 30 },
        { name: 'Tacos Cordon Bleu', price: 35 },
        { name: 'Tacos Viand Hachée', price: 33 },
        { name: 'Tacos Mixte', price: 35 },
        { name: 'Tacos Fruit De Mer', price: 45 },
        { name: 'Tacos XL', price: 50 },
      ],
    },
    {
      id: 'sandwich',
      category: 'SANDWICH',
      type: 'standard',
      items: [
        { name: 'Sandwich Thon', price: 25 },
        { name: 'Sandwich Poulet Americain', price: 35 },
        { name: 'Sandwich Viande Hachée Americain', price: 33 },
        { name: 'Sandwich Mixte', price: 35 },
      ],
    },
    {
      id: 'kabab',
      category: 'KABAB',
      type: 'standard',
      note: 'Sauce: 2 DH',
      supplements: [{ name: 'Sauce', price: 2 }],
      items: [
        { name: 'Kabab Viande Hachée', price: 30 },
        { name: 'Kabab Poulet', price: 30 },
        { name: 'Kabab Nuggets', price: 30 },
        { name: 'Kabab Cordon Bleu', price: 30 },
        { name: 'Kabab Chicken', price: 30 },
        { name: 'Kabab Mixte', price: 35 },
        { name: 'Kabab Sniptaste', price: 40 },
      ],
    },
    {
      id: 'plats',
      category: 'PLATS',
      category_en: 'Main Dishes',
      type: 'standard',
      items: [
        { name: 'Emincé De Poulet', price: 45 },
        { name: 'Brochette Poulet', price: 40 },
        { name: 'Plat Chicken (Sans Légumes)', price: 40 },
        { name: 'Plat Chicken (Avec Légumes)', price: 45 },
        { name: 'Brochette Viande Hachée', price: 45 },
        { name: 'Plat Mixte', price: 50 },
      ],
    },
  ],
  info: {
    currency: 'DH',
    currency_full: 'Moroccan Dirham',
    delivery: '30-45 minutes across Casablanca',
    payment: ['Cash', 'CIH Bank'],
    halal: true,
    total_items: 94,
    total_categories: 14,
  },
};

// Helper functions for chatbot
export const getMenuByCategory = (categoryId: string) => {
  return restaurantData.menu.find((section) => section.id === categoryId);
};

export const searchMenuItems = (query: string, limit = 10) => {
  const lowerQuery = query.toLowerCase();
  const results: any[] = [];

  restaurantData.menu.forEach((section) => {
    section.items.forEach((item) => {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          ...item,
          category: section.category,
          categoryId: section.id,
          supplements: section.supplements || [],
        });
      }
    });
  });

  return results.slice(0, limit);
};

export const getCategoryList = () => {
  return restaurantData.menu.map((section) => ({
    id: section.id,
    name: section.category,
    itemCount: section.items.length,
  }));
};

export const getPopularItems = () => {
  // Return best-sellers based on menu structure
  return [
    { name: 'Tacos XL', price: 50, category: 'TACOS' },
    { name: 'Pizza Sniptaste', price_small: 40, price_large: 50, category: 'PIZZA' },
    { name: 'Snip Taste Burger', price: 60, category: 'BURGER' },
  ];
};

export const formatPrice = (item: any) => {
  if ('price' in item) {
    return `${item.price} DH`;
  }
  if ('price_small' in item && 'price_large' in item) {
    return `${item.price_small} DH (petit) / ${item.price_large} DH (grand)`;
  }
  return 'Prix non disponible';
};

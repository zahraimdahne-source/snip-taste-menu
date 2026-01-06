// Standalone migration script - no external imports needed
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDMFVRwnQ8PHj1Tq6x-MBqA68Xe25uugGA',
  authDomain: 'sniptaste.firebaseapp.com',
  projectId: 'sniptaste',
  storageBucket: 'sniptaste.firebasestorage.app',
  messagingSenderId: '894504487452',
  appId: '1:894504487452:web:b362e2d62e6e462b586dd9',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// All menu data embedded directly
const menuData = [
  {
    id: 'tex-mex',
    items: [
      { name: 'Frite', price: 10 },
      { name: 'Nugget x 6', price: 20 },
      { name: 'Chicken x 2', price: 15 },
      { name: 'Chicken x 3', price: 20 },
    ],
  },
  {
    id: 'jus',
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
    items: [{ name: 'Tiramisu', price: 16 }],
  },
  {
    id: 'boissons',
    items: [
      { name: 'Eau Minerale Petit', price: 4 },
      { name: 'Soda', price: 6 },
      { name: 'Tropical Soda', price: 7 },
    ],
  },
  {
    id: 'salades',
    items: [
      { name: 'Salade Mexicain', price: 25 },
      { name: 'Salade Nicoise', price: 25 },
      { name: 'Salade Sniptaste', price: 40 },
    ],
  },
  {
    id: 'pizza',
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
    items: [
      { name: 'Pasticcio Viande Hachée', price: 30 },
      { name: 'Pasticcio Poulet', price: 30 },
      { name: 'Pasticcio Jambon De Dinde Fumée', price: 30 },
      { name: 'Pasticcio Mixte', price: 35 },
    ],
  },
  {
    id: 'pates',
    items: [
      { name: 'Carbonara', price: 30 },
      { name: 'Poulet Champignon', price: 30 },
      { name: 'Bolognaise', price: 35 },
      { name: 'Fruits De Mer', price: 35 },
    ],
  },
  {
    id: 'panizzas',
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
    items: [
      { name: 'Sandwich Thon', price: 25 },
      { name: 'Sandwich Poulet Americain', price: 35 },
      { name: 'Sandwich Viande Hachée Americain', price: 33 },
      { name: 'Sandwich Mixte', price: 35 },
    ],
  },
  {
    id: 'kabab',
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
    items: [
      { name: 'Emincé De Poulet', price: 45 },
      { name: 'Brochette Poulet', price: 40 },
      { name: 'Plat Chicken (Sans Légumes)', price: 40 },
      { name: 'Plat Chicken (Avec Légumes)', price: 45 },
      { name: 'Brochette Viande Hachée', price: 45 },
      { name: 'Plat Mixte', price: 50 },
    ],
  },
];

const categories = [
  { id: 'tex-mex', name: 'TEX MEX', nameAr: 'تكس مكس', order: 1 },
  { id: 'jus', name: 'JUS', nameAr: 'عصير', order: 2 },
  { id: 'desserts', name: 'DESSERTS', nameAr: 'حلويات', order: 3 },
  { id: 'boissons', name: 'BOISSONS', nameAr: 'مشروبات', order: 4 },
  { id: 'salades', name: 'SALADES', nameAr: 'سلطات', order: 5 },
  { id: 'pizza', name: 'PIZZA', nameAr: 'بيتزا', order: 6 },
  { id: 'burger', name: 'BURGER', nameAr: 'برجر', order: 7 },
  { id: 'pasticcios', name: 'PASTICCIOS', nameAr: 'باستيشيو', order: 8 },
  { id: 'pates', name: 'PATES', nameAr: 'معكرونة', order: 9 },
  { id: 'panizzas', name: 'PANIZZAS', nameAr: 'بانيزا', order: 10 },
  { id: 'tacos', name: 'TACOS', nameAr: 'تاكوس', order: 11 },
  { id: 'sandwich', name: 'SANDWICH', nameAr: 'ساندويتش', order: 12 },
  { id: 'kabab', name: 'KABAB', nameAr: 'كباب', order: 13 },
  { id: 'plats', name: 'PLATS', nameAr: 'أطباق', order: 14 },
];

async function migrate() {
  console.log('🚀 Starting migration...\n');

  // Add categories
  console.log('Adding categories...');
  for (const cat of categories) {
    await addDoc(collection(db, 'categories'), cat);
    console.log(`✓ ${cat.name}`);
  }

  // Add menu items
  console.log('\nAdding menu items...');
  let count = 0;
  for (const section of menuData) {
    for (const item of section.items) {
      const menuItem = {
        name: item.name,
        nameAr: item.name,
        category: section.id,
        image: '',
        description: '',
        available: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (item.price !== undefined) {
        menuItem.price = item.price;
      } else if (item.price_small !== undefined) {
        menuItem.price = item.price_small;
        menuItem.priceSmall = item.price_small;
        menuItem.priceLarge = item.price_large;
      }

      await addDoc(collection(db, 'menuItems'), menuItem);
      count++;
      console.log(`✓ ${count}. ${item.name}`);
    }
  }

  // Add settings
  console.log('\nAdding settings...');
  await addDoc(collection(db, 'settings'), {
    restaurantName: 'Snip Taste',
    phone: '+212 660 542 323',
    address: 'N 6, residence ennakhil, Bd Mohamed Zefzaf, Casablanca',
    whatsappNumber: '212660542323',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  console.log('✓ Settings added');

  console.log(`\n✅ Migration complete! Added ${count} menu items.`);
  console.log('\nRefresh your admin dashboard to see all items!');
  process.exit(0);
}

migrate().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});

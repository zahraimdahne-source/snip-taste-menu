// Simple migration script using Node.js directly
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Load environment variables
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Restaurant data from your menu
const restaurantData = require('../restaurantData');
const menuData = restaurantData.restaurantData.menu;

// Categories
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

async function migrateCategories() {
  console.log('Migrating categories...');
  for (const category of categories) {
    try {
      await addDoc(collection(db, 'categories'), category);
      console.log(`✓ Added category: ${category.name}`);
    } catch (error) {
      console.error(`✗ Error adding category ${category.name}:`, error.message);
    }
  }
}

async function migrateMenuItems() {
  console.log('\nMigrating menu items...');
  let count = 0;

  for (const section of menuData) {
    const category = section.id;

    for (const item of section.items) {
      try {
        let menuItem = {
          name: item.name,
          nameAr: item.name,
          category: category,
          image: '',
          description: '',
          available: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        // Handle different price structures
        if (item.price !== undefined) {
          menuItem.price = item.price;
        } else if (item.price_small !== undefined && item.price_large !== undefined) {
          menuItem.price = item.price_small;
          menuItem.priceSmall = item.price_small;
          menuItem.priceLarge = item.price_large;
        }

        await addDoc(collection(db, 'menuItems'), menuItem);
        count++;
        console.log(`✓ Added item ${count}: ${item.name} (${category})`);
      } catch (error) {
        console.error(`✗ Error adding item ${item.name}:`, error.message);
      }
    }
  }
  console.log(`\nTotal items added: ${count}`);
}

async function migrateSettings() {
  console.log('\nMigrating restaurant settings...');

  const settings = {
    restaurantName: 'Snip Taste',
    phone: '+212 660 542 323',
    address: 'N 6, residence ennakhil, Bd Mohamed Zefzaf, Casablanca',
    whatsappNumber: '212660542323',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  try {
    await addDoc(collection(db, 'settings'), settings);
    console.log('✓ Added restaurant settings');
  } catch (error) {
    console.error('✗ Error adding settings:', error.message);
  }
}

async function runMigration() {
  console.log('🚀 Starting data migration...\n');

  try {
    await migrateCategories();
    await migrateMenuItems();
    await migrateSettings();

    console.log('\n✅ Migration completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Refresh the admin dashboard');
    console.log('2. See all menu items');
    console.log('3. Edit, delete, or add new items');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

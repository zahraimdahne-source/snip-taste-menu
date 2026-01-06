/**
 * Data Migration Script
 * This script migrates existing menu data from data.ts to Firestore
 * Run this once after setting up Firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { restaurantData } from '../restaurantData';

const menuData = restaurantData.menu;

// Firebase configuration - replace with your actual config
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

// Categories mapping
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

// Common sauces
const sauces = [
  { id: 'algerienne', name: 'Algérienne', nameAr: 'جزائرية' },
  { id: 'mayonnaise', name: 'Mayonnaise', nameAr: 'مايونيز' },
  { id: 'ketchup', name: 'Ketchup', nameAr: 'كاتشب' },
  { id: 'harissa', name: 'Harissa', nameAr: 'هريسة' },
  { id: 'blanche', name: 'Sauce Blanche', nameAr: 'صلصة بيضاء' },
  { id: 'champignon', name: 'Sauce Champignon', nameAr: 'صلصة الفطر' },
];

async function migrateCategories() {
  console.log('Migrating categories...');
  for (const category of categories) {
    try {
      await addDoc(collection(db, 'categories'), category);
      console.log(`✓ Added category: ${category.name}`);
    } catch (error) {
      console.error(`✗ Error adding category ${category.name}:`, error);
    }
  }
}

async function migrateSauces() {
  console.log('\nMigrating sauces...');
  for (const sauce of sauces) {
    try {
      await addDoc(collection(db, 'sauces'), sauce);
      console.log(`✓ Added sauce: ${sauce.name}`);
    } catch (error) {
      console.error(`✗ Error adding sauce ${sauce.name}:`, error);
    }
  }
}

async function migrateMenuItems() {
  console.log('\nMigrating menu items...');

  for (const section of menuData) {
    const category = section.id;

    for (const item of section.items) {
      try {
        const menuItem: any = {
          name: item.name,
          nameAr: item.name, // You can add Arabic translations later
          category: category,
          image: '', // Add image URLs later
          description: '',
          available: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        // Handle different price structures
        if ('price' in item) {
          menuItem.price = (item as any).price;
        } else if ('price_small' in item && 'price_large' in item) {
          // For dual-price items (like pizza), store as small price by default
          menuItem.price = (item as any).price_small;
          menuItem.priceSmall = (item as any).price_small;
          menuItem.priceLarge = (item as any).price_large;
        }

        await addDoc(collection(db, 'menuItems'), menuItem);
        console.log(`✓ Added item: ${item.name} (${category})`);
      } catch (error) {
        console.error(`✗ Error adding item ${item.name}:`, error);
      }
    }
  }
}

async function migrateSettings() {
  console.log('\nMigrating restaurant settings...');

  const settings = {
    restaurantInfo: {
      name: 'Snip Taste',
      nameAr: 'سنيب تيست',
      phone: '+212 XXX-XXXXXX', // Replace with actual phone
      address: 'Your Restaurant Address',
      addressAr: 'عنوان المطعم',
      whatsappNumber: '212XXXXXXXXX', // Replace with actual WhatsApp number
    },
    deliveryZones: [
      { name: 'Zone 1 (0-2 km)', price: 0 },
      { name: 'Zone 2 (2-5 km)', price: 10 },
      { name: 'Zone 3 (5-10 km)', price: 20 },
    ],
    operatingHours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '23:00' },
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  try {
    await addDoc(collection(db, 'settings'), settings);
    console.log('✓ Added restaurant settings');
  } catch (error) {
    console.error('✗ Error adding settings:', error);
  }
}

async function runMigration() {
  console.log('🚀 Starting data migration...\n');

  try {
    await migrateCategories();
    await migrateSauces();
    await migrateMenuItems();
    await migrateSettings();

    console.log('\n✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Go to Firebase Console to verify the data');
    console.log('2. Add images to menu items via the admin dashboard');
    console.log('3. Update Arabic translations for menu items');
    console.log('4. Update restaurant settings with correct phone/address');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  }
}

// Run migration
runMigration();

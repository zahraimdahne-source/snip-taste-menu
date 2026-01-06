// Script to populate local database with all menu items from restaurantData
import { localDB } from '../services/localDatabase';
import { restaurantData } from '../restaurantData';

export function populateLocalDatabase() {
  console.log('🚀 Populating local database with menu items...');

  let count = 0;

  for (const section of restaurantData.menu) {
    for (const item of section.items) {
      const menuItem: any = {
        name: item.name,
        nameAr: item.name,
        category: section.id,
        image: '',
        description: '',
        available: true,
      };

      // Handle different price structures
      if ('price' in item) {
        menuItem.price = item.price;
      } else if ('price_small' in item && 'price_large' in item) {
        menuItem.price = item.price_small;
        menuItem.priceSmall = item.price_small;
        menuItem.priceLarge = item.price_large;
      }

      localDB.addMenuItem(menuItem);
      count++;
    }
  }

  console.log(`✅ Added ${count} menu items to local database!`);
  return count;
}

// Auto-populate on first load
if (typeof window !== 'undefined') {
  const items = localDB.getMenuItems();
  if (items.length === 0) {
    populateLocalDatabase();
  }
}

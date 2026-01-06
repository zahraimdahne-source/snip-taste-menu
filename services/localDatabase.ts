import { menuData } from '../data';
import { MenuSectionData, Supplement } from '../types';

// Local Storage Database Service
// This replaces Firebase with local browser storage

export interface MenuItem {
  id: string;
  name: string;
  nameAr?: string;
  category: string; // references section.id
  price: number;
  priceSmall?: number;
  priceLarge?: number;
  image?: string;
  description?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  order: number;
  // Metadata from data.ts to reconstruct sections
  type: 'standard' | 'dual-price' | 'list';
  note?: string;
  supplements?: Supplement[];
}

export interface RestaurantSettings {
  restaurantName: string;
  phone: string;
  address: string;
  whatsappNumber: string;
}

class LocalDatabase {
  private MENU_ITEMS_KEY = 'sniptaste_menu_items';
  private CATEGORIES_KEY = 'sniptaste_categories';
  private SETTINGS_KEY = 'sniptaste_settings';
  private ORDERS_KEY = 'sniptaste_orders';

  // Initialize with default data if empty
  initialize() {
    // Check if we have items. If not, populate from static data.
    const items = this.getMenuItems();
    if (items.length === 0) {
      console.log('📦 Initializing Local Database from static data...');
      this.populateDefaultData();
    }
  }

  // Populate with all menu items from data.ts
  populateDefaultData() {
    const categories: Category[] = [];
    const items: MenuItem[] = [];

    // Parse menuData (sections) into flat database structure
    menuData.forEach((section, index) => {
      // 1. Create Category
      categories.push({
        id: section.id,
        name: section.title,
        order: index + 1,
        type: section.type,
        note: section.note,
        supplements: section.supplements,
      });

      // 2. Create Items
      section.items.forEach((item, itemIndex) => {
        // Handle Price
        let price = 0;
        let priceSmall = undefined;
        let priceLarge = undefined;

        if (item.price) {
          price = item.price;
        } else if (item.prices) {
          priceSmall = item.prices.small;
          priceLarge = item.prices.large;
          price = item.prices.small; // Base price for sorting/display
        }

        // Generate ID
        const itemId = `${section.id}-${itemIndex}-${Date.now()}`;

        items.push({
          id: itemId,
          name: item.name,
          category: section.id,
          price: price,
          priceSmall: priceSmall,
          priceLarge: priceLarge,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    });

    const settings: RestaurantSettings = {
      restaurantName: 'Snip Taste',
      phone: '+212 660 542 323',
      address: 'N 6, residence ennakhil, Bd Mohamed Zefzaf, Casablanca',
      whatsappNumber: '212660542323',
    };

    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(this.MENU_ITEMS_KEY, JSON.stringify(items));

    // Don't overwrite orders if they exist
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify([]));
    }

    console.log(`✅ Database Populated: ${categories.length} categories, ${items.length} items`);
  }

  // Helper to reconstruct sections for CustomerApp
  getMenuSections(): MenuSectionData[] {
    const categories = this.getCategories();
    const allItems = this.getMenuItems();

    return categories.map((cat) => {
      // Filter items for this category
      const catItems = allItems.filter((item) => item.category === cat.id && item.available);

      // Map DB Item back to View Item
      const viewItems = catItems.map((item) => ({
        name: item.name,
        price: item.price,
        prices:
          item.priceSmall && item.priceLarge
            ? {
                small: item.priceSmall,
                large: item.priceLarge,
              }
            : undefined,
      }));

      return {
        id: cat.id,
        title: cat.name,
        type: cat.type,
        note: cat.note,
        supplements: cat.supplements,
        items: viewItems,
      };
    });
  }

  // Menu Items CRUD
  getMenuItems(): MenuItem[] {
    try {
      const items = localStorage.getItem(this.MENU_ITEMS_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Failed to parse menu items:', error);
      return [];
    }
  }

  getMenuItem(id: string): MenuItem | null {
    const items = this.getMenuItems();
    return items.find((item) => item.id === id) || null;
  }

  addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem {
    const items = this.getMenuItems();
    const newItem: MenuItem = {
      ...item,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    localStorage.setItem(this.MENU_ITEMS_KEY, JSON.stringify(items));
    return newItem;
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const items = this.getMenuItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(this.MENU_ITEMS_KEY, JSON.stringify(items));
    return items[index];
  }

  deleteMenuItem(id: string): boolean {
    const items = this.getMenuItems();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    localStorage.setItem(this.MENU_ITEMS_KEY, JSON.stringify(filtered));
    return true;
  }

  // Categories
  getCategories(): Category[] {
    try {
      const cats = localStorage.getItem(this.CATEGORIES_KEY);
      return cats ? JSON.parse(cats) : [];
    } catch (error) {
      console.error('Failed to parse categories:', error);
      return [];
    }
  }

  addCategory(category: Omit<Category, 'id' | 'order'>): Category {
    const cats = this.getCategories();
    const newCat: Category = {
      ...category,
      id: category.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      order: cats.length + 1,
    };
    cats.push(newCat);
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(cats));
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const cats = this.getCategories();
    const index = cats.findIndex((c) => c.id === id);
    if (index === -1) return null;

    cats[index] = { ...cats[index], ...updates };
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(cats));
    return cats[index];
  }

  // Settings
  getSettings(): RestaurantSettings {
    try {
      const settings = localStorage.getItem(this.SETTINGS_KEY);
      return settings
        ? JSON.parse(settings)
        : {
            restaurantName: 'Snip Taste',
            phone: '',
            address: '',
            whatsappNumber: '',
          };
    } catch (error) {
      console.error('Failed to parse settings:', error);
      return {
        restaurantName: 'Snip Taste',
        phone: '',
        address: '',
        whatsappNumber: '',
      };
    }
  }

  updateSettings(settings: RestaurantSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  // Orders
  getOrders(): any[] {
    try {
      const orders = localStorage.getItem(this.ORDERS_KEY);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Failed to parse orders:', error);
      return [];
    }
  }

  addOrder(order: any): void {
    const orders = this.getOrders();
    orders.push({
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  // Export/Import for backup
  exportData(): string {
    return JSON.stringify({
      menuItems: this.getMenuItems(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      orders: this.getOrders(),
    });
  }

  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.menuItems) localStorage.setItem(this.MENU_ITEMS_KEY, JSON.stringify(data.menuItems));
      if (data.categories)
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(data.categories));
      if (data.settings) localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings));
      if (data.orders) localStorage.setItem(this.ORDERS_KEY, JSON.stringify(data.orders));
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  }
}

export const localDB = new LocalDatabase();

// Initialize on load (Populates if empty)
localDB.initialize();

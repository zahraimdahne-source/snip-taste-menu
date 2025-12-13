export interface MenuItem {
  name: string;
  price?: number;
  prices?: {
    small: number;
    large: number;
  };
}

export interface Supplement {
  name: string;
  price: number;
}

export interface MenuSectionData {
  id: string;
  title: string;
  items: MenuItem[];
  type: 'standard' | 'dual-price' | 'list';
  note?: string;
  supplements?: Supplement[];
}

export interface CategoryGroup {
  groupName?: string;
  sections: MenuSectionData[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string; // e.g., 'Petit', 'Grand'
  selectedSupplements: Supplement[];
  totalPrice: number;
  selectedSauce?: string;
}

export interface Popup {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  type: 'promo' | 'announcement' | 'survey' | 'welcome' | 'exit';
  startDate: Date;
  endDate: Date;
  frequency: 'once' | 'daily' | 'weekly' | 'always';
  targetAudience: 'all' | 'new' | 'returning';
  isActive: boolean;
  priority: number;
  ctaText: string;
  ctaAction: 'add_to_cart' | 'navigate' | 'close' | 'external_link';
  ctaLink?: string;

  // Analytics
  viewCount: number;
  clickCount: number;
  conversionCount: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PopupDisplayRule {
  showOnce: boolean;
  showAfterSeconds?: number;
  showOnPages?: string[];
  excludePages?: string[];
}

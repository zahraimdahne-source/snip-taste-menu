import { Popup } from '../types/popup';

class PopupService {
  private STORAGE_KEY = 'sniptaste_popups';
  private VIEWED_KEY = 'sniptaste_viewed_popups';

  // Get all popups
  getPopups(): Popup[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    const popups = JSON.parse(data);
    // Convert date strings back to Date objects
    return popups.map((p: any) => ({
      ...p,
      startDate: new Date(p.startDate),
      endDate: new Date(p.endDate),
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  }

  // Get active popups (within date range and enabled)
  getActivePopups(): Popup[] {
    const now = new Date();
    return this.getPopups()
      .filter(
        (popup) =>
          popup.isActive && new Date(popup.startDate) <= now && new Date(popup.endDate) >= now
      )
      .sort((a, b) => b.priority - a.priority);
  }

  // Add popup
  addPopup(
    popup: Omit<
      Popup,
      'id' | 'viewCount' | 'clickCount' | 'conversionCount' | 'createdAt' | 'updatedAt'
    >
  ): Popup {
    const popups = this.getPopups();
    const newPopup: Popup = {
      ...popup,
      id: `popup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      viewCount: 0,
      clickCount: 0,
      conversionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    popups.push(newPopup);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(popups));
    return newPopup;
  }

  // Update popup
  updatePopup(id: string, updates: Partial<Popup>): Popup | null {
    const popups = this.getPopups();
    const index = popups.findIndex((p) => p.id === id);
    if (index === -1) return null;

    popups[index] = {
      ...popups[index],
      ...updates,
      updatedAt: new Date(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(popups));
    return popups[index];
  }

  // Delete popup
  deletePopup(id: string): boolean {
    const popups = this.getPopups();
    const filtered = popups.filter((p) => p.id !== id);
    if (filtered.length === popups.length) return false;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  // Duplicate popup
  duplicatePopup(id: string): Popup | null {
    const popup = this.getPopups().find((p) => p.id === id);
    if (!popup) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      viewCount: _viewCount,
      clickCount: _clickCount,
      conversionCount: _conversionCount,
      ...popupData
    } = popup;
    return this.addPopup({
      ...popupData,
      title: `${popup.title} (Copy)`,
      isActive: false,
    });
  }

  // Track view
  trackView(id: string): void {
    const popups = this.getPopups();
    const popup = popups.find((p) => p.id === id);
    if (!popup) return;

    popup.viewCount++;
    popup.updatedAt = new Date();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(popups));

    // Mark as viewed by user
    const viewed = this.getViewedPopups();
    viewed.push({ id, timestamp: new Date() });
    localStorage.setItem(this.VIEWED_KEY, JSON.stringify(viewed));
  }

  // Track click
  trackClick(id: string): void {
    const popups = this.getPopups();
    const popup = popups.find((p) => p.id === id);
    if (!popup) return;

    popup.clickCount++;
    popup.updatedAt = new Date();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(popups));
  }

  // Track conversion
  trackConversion(id: string): void {
    const popups = this.getPopups();
    const popup = popups.find((p) => p.id === id);
    if (!popup) return;

    popup.conversionCount++;
    popup.updatedAt = new Date();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(popups));
  }

  // Check if should show popup to user
  shouldShowPopup(popup: Popup): boolean {
    const viewed = this.getViewedPopups();
    const viewedPopup = viewed.find((v) => v.id === popup.id);

    // Never viewed - show it
    if (!viewedPopup) return true;

    // Show once - don't show again
    if (popup.frequency === 'once') return false;

    // Always show
    if (popup.frequency === 'always') return true;

    // Calculate days since last view
    const daysSinceView =
      (Date.now() - new Date(viewedPopup.timestamp).getTime()) / (1000 * 60 * 60 * 24);

    // Daily frequency
    if (popup.frequency === 'daily' && daysSinceView >= 1) return true;

    // Weekly frequency
    if (popup.frequency === 'weekly' && daysSinceView >= 7) return true;

    return false;
  }

  // Get popup to display (considering all rules)
  getPopupToDisplay(): Popup | null {
    const activePopups = this.getActivePopups();

    for (const popup of activePopups) {
      if (this.shouldShowPopup(popup)) {
        return popup;
      }
    }

    return null;
  }

  // Clear viewed history (for testing)
  clearViewedHistory(): void {
    localStorage.removeItem(this.VIEWED_KEY);
  }

  // Get analytics for all popups
  getAnalytics() {
    const popups = this.getPopups();
    return {
      total: popups.length,
      active: popups.filter((p) => p.isActive).length,
      totalViews: popups.reduce((sum, p) => sum + p.viewCount, 0),
      totalClicks: popups.reduce((sum, p) => sum + p.clickCount, 0),
      totalConversions: popups.reduce((sum, p) => sum + p.conversionCount, 0),
      avgClickRate: this.calculateAvgClickRate(popups),
      avgConversionRate: this.calculateAvgConversionRate(popups),
    };
  }

  private calculateAvgClickRate(popups: Popup[]): number {
    const totalViews = popups.reduce((sum, p) => sum + p.viewCount, 0);
    const totalClicks = popups.reduce((sum, p) => sum + p.clickCount, 0);
    return totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  }

  private calculateAvgConversionRate(popups: Popup[]): number {
    const totalClicks = popups.reduce((sum, p) => sum + p.clickCount, 0);
    const totalConversions = popups.reduce((sum, p) => sum + p.conversionCount, 0);
    return totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  }

  private getViewedPopups(): Array<{ id: string; timestamp: Date }> {
    const data = localStorage.getItem(this.VIEWED_KEY);
    if (!data) return [];

    const viewed = JSON.parse(data);
    return viewed.map((v: any) => ({
      ...v,
      timestamp: new Date(v.timestamp),
    }));
  }
}

export const popupService = new PopupService();

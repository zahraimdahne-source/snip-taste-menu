// Simple local authentication
// Stores admin credentials in localStorage

interface AdminUser {
  email: string;
  password: string; // In production, this should be hashed
}

class LocalAuth {
  private ADMIN_KEY = 'sniptaste_admin_v2';
  private SESSION_KEY = 'sniptaste_session';

  // Initialize with default admin
  initialize() {
    if (!localStorage.getItem(this.ADMIN_KEY)) {
      // ⬇️ EDIT THIS LINE TO CHANGE EMAIL AND PASSWORD ⬇️
      this.createAdmin('abdo@sniptaste.com', 'ABdO@SniptaSTE/2025');
    }
  }

  createAdmin(email: string, password: string): void {
    const admin: AdminUser = { email, password };
    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admin));
  }

  login(email: string, password: string): boolean {
    const adminData = localStorage.getItem(this.ADMIN_KEY);
    if (!adminData) return false;

    try {
      const admin: AdminUser = JSON.parse(adminData);
      if (admin.email === email && admin.password === password) {
        localStorage.setItem(this.SESSION_KEY, 'true');
        return true;
      }
    } catch (e) {
      console.error('Auth error', e);
      return false;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.SESSION_KEY) === 'true';
  }

  getCurrentUser(): { email: string } | null {
    if (!this.isAuthenticated()) return null;
    const adminData = localStorage.getItem(this.ADMIN_KEY);
    if (!adminData) return null;
    try {
      const admin: AdminUser = JSON.parse(adminData);
      return { email: admin.email };
    } catch (e) {
      return null;
    }
  }
}

export const localAuth = new LocalAuth();
localAuth.initialize();

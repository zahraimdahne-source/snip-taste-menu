# Running the Snip Taste Application

## Quick Start - Both Apps Run Together! 🚀

**Good news**: When you run the development server, **BOTH** the menu app and admin panel run simultaneously on the same server!

### Start the Application

```bash
npm run dev
```

This single command starts the Vite development server and serves **both applications**:

✅ **Customer Menu App** - `http://localhost:3001/`
✅ **Admin Panel** - `http://localhost:3001/admin/login`

---

## Accessing the Applications

### 1. Customer Menu App

- **URL**: `http://localhost:3001/`
- **Purpose**: Customer-facing menu for ordering
- **Features**:
  - Browse menu categories
  - Add items to cart
  - Place orders via WhatsApp
  - AI Chatbot assistance
  - Location sharing

### 2. Admin Panel

- **URL**: `http://localhost:3001/admin/login`
- **Login Credentials**:
  - Email: `abdo@sniptaste.com`
  - Password: `ABdO@SniptaSTE/2025`
- **Features**:
  - Menu management (add/edit/delete items)
  - Category management
  - Order tracking
  - Analytics dashboard
  - Settings configuration

---

## How It Works

The application uses **React Router** to handle both apps in a single Vite project:

```
http://localhost:3001/
├── /                    → Customer Menu App
├── /admin/login         → Admin Login
├── /admin/dashboard     → Admin Dashboard
├── /admin/menu          → Menu Management
├── /admin/orders        → Order Management
├── /admin/analytics     → Analytics
└── /admin/settings      → Settings
```

**One server, multiple routes** - No need to run separate processes!

---

## Development Workflow

### Step 1: Start the Server

```bash
npm run dev
```

### Step 2: Open Both Apps

Open two browser tabs:

- **Tab 1**: `http://localhost:3001/` (Menu App)
- **Tab 2**: `http://localhost:3001/admin/login` (Admin Panel)

### Step 3: Work on Both Simultaneously

- Changes to menu components → Refresh menu app
- Changes to admin components → Refresh admin panel
- Hot reload works for both!

---

## Testing Both Apps

### Test Menu App

1. Open `http://localhost:3001/`
2. Click on menu items
3. Add to cart
4. Test ordering flow

### Test Admin Panel

1. Open `http://localhost:3001/admin/login`
2. Login with credentials above
3. Navigate to Menu Management
4. Add/edit menu items
5. Changes reflect in menu app immediately!

---

## Production Build

When you build for production, both apps are included:

```bash
npm run build
```

This creates a single `dist` folder containing both applications.

---

## Troubleshooting

### Server Not Running?

```bash
# Check if dev server is running
# You should see: "Local: http://localhost:3001/"

# If not running, start it:
npm run dev
```

### Can't Access Admin Panel?

- Make sure you're using the correct URL: `http://localhost:3001/admin/login`
- Check that the dev server is running
- Try clearing browser cache

### Port Already in Use?

```bash
# Kill the process using port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Then restart:
npm run dev
```

---

## Summary

✅ **Single command** runs both apps: `npm run dev`
✅ **Menu App**: `http://localhost:3001/`
✅ **Admin Panel**: `http://localhost:3001/admin/login`
✅ **No separate processes needed**
✅ **Both apps work simultaneously**

**You're all set!** 🎉

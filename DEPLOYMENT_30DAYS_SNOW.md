# ❄️🔥 Snip Taste - 30-Day Snow Season Feature

## ✨ What's New

### **30-Day Seasonal Logo System**

Your Snip Taste Menu now features an intelligent seasonal logo system:

- **Snow Season (30 Days)**: Logo displays `logo snow.gif` with beautiful falling snow
- **Auto-Transition**: After 30 days, automatically switches to `logo fire.gif`
- **Persistent Tracking**: Uses browser localStorage to remember when the snow season started
- **Smooth Transition**: Elegant fade effect when switching between logos

---

## 🎯 How It Works

### **First-Time Visitor**

1. User visits your site for the first time
2. Snow season starts automatically (today's date is saved)
3. Snow logo displays for the next 30 days
4. Console shows: "🎄 Snow season started!"

### **During Snow Season (Days 1-30)**

- Snow logo displays with falling snow animation
- Console shows: "❄️ Snow season day X of 30"
- Countdown of remaining days

### **After 30 Days**

- Automatic smooth transition to fire logo
- Console shows: "🔥 Snow season ended! Switching to fire logo..."
- Fire logo displays permanently (until you reset)

### **Returning Visitors**

- System remembers when their snow season started
- Shows appropriate logo based on elapsed time
- No reset unless browser data is cleared

---

## 📦 Deployment Package

**File**: `snip-30days-snow-deploy.zip`
**Location**: `c:\Users\Administrator\OneDrive\Bureau\SSNNIIPP\snip-30days-snow-deploy.zip`

### Includes:

- ✅ 30-day snow season feature
- ✅ Automatic fire logo transition
- ✅ Both logo GIF files (snow & fire)
- ✅ All menu features intact
- ✅ Production-optimized build
- ✅ localStorage persistence

---

## 🚀 Deploy to Netlify

### **Option 1: Drag & Drop (Easiest)**

1. Go to: https://app.netlify.com/drop
2. Drag `snip-30days-snow-deploy.zip` onto the page
3. Wait for deployment
4. Get your live URL!

### **Option 2: Netlify CLI**

```bash
netlify deploy --prod --dir=dist
```

### **Option 3: Existing Site Update**

1. Extract the ZIP file
2. Go to your Netlify dashboard
3. Drag the `dist` folder contents to deploy

---

## 🔧 Technical Details

### **localStorage Key**

```typescript
'snipTasteSnowSeasonStart'; // Stores ISO date string
```

### **Duration**

```typescript
const SNOW_DURATION_DAYS = 30; // Customizable
```

### **Date Calculation**

```typescript
const daysPassed = Math.floor(
  (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
);
```

### **Hourly Check**

The system checks every hour if the 30-day period has ended, ensuring automatic transition even if the user keeps the page open.

---

## 🎨 Customization Options

### **Change Snow Season Duration**

Edit `components/Logo.tsx` line 13:

```typescript
const SNOW_DURATION_DAYS = 30; // Change to any number of days
```

Examples:

- **7 days**: `const SNOW_DURATION_DAYS = 7;`
- **60 days**: `const SNOW_DURATION_DAYS = 60;`
- **90 days**: `const SNOW_DURATION_DAYS = 90;`

### **Reset Snow Season Manually**

To restart the snow season for all users, add this to your browser console:

```javascript
localStorage.removeItem('snipTasteSnowSeasonStart');
location.reload();
```

### **Force Fire Logo Immediately**

```javascript
localStorage.setItem('snipTasteSnowSeasonStart', '2024-01-01');
location.reload();
```

### **Check Current Status**

```javascript
const start = localStorage.getItem('snipTasteSnowSeasonStart');
const daysPassed = Math.floor((new Date() - new Date(start)) / (1000 * 60 * 60 * 24));
console.log(`Day ${daysPassed + 1} of snow season`);
```

---

## ✅ Testing Checklist

After deployment, verify:

- [ ] Snow logo displays on first visit
- [ ] Browser console shows snow season start message
- [ ] Console shows current day count
- [ ] Logo click plays audio
- [ ] Menu loads correctly
- [ ] Cart functionality works
- [ ] WhatsApp ordering functional
- [ ] Mobile responsive

### **Test 30-Day Transition (Fast)**

To test the transition without waiting 30 days:

1. Open browser console
2. Run:

```javascript
// Set start date to 31 days ago
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 31);
localStorage.setItem('snipTasteSnowSeasonStart', pastDate.toISOString());
location.reload();
```

3. You should see the fire logo!

---

## 📊 Timeline Example

| Day | Logo    | Status              |
| --- | ------- | ------------------- |
| 1   | ❄️ Snow | Snow season started |
| 15  | ❄️ Snow | 15 days remaining   |
| 29  | ❄️ Snow | 1 day remaining     |
| 30  | ❄️ Snow | Last day of snow    |
| 31+ | 🔥 Fire | Snow season ended   |

---

## 🎯 Features

### **Smart Persistence**

- Uses browser localStorage
- Survives page refreshes
- Independent per browser/device
- Automatic cleanup not needed

### **Smooth Transitions**

- Fade-out effect (300ms)
- Logo switch
- Fade-in effect (500ms)
- No jarring changes

### **Performance**

- Hourly check interval (not constant)
- Minimal CPU usage
- No external API calls
- Lightweight implementation

---

## 🔍 Debugging

### **Check Snow Season Status**

Open browser console and look for:

- `🎄 Snow season started!` - First visit
- `❄️ Snow season day X of 30` - Current status
- `⏰ X days remaining in snow season` - Countdown
- `🔥 Snow season ended!` - Transition complete

### **View Stored Date**

```javascript
console.log(localStorage.getItem('snipTasteSnowSeasonStart'));
```

### **Clear and Restart**

```javascript
localStorage.clear();
location.reload();
```

---

## 📱 Mobile Compatibility

✅ Works perfectly on:

- iOS Safari
- Android Chrome
- Mobile Firefox
- All modern mobile browsers

localStorage is supported on all modern browsers!

---

## 🎁 Bonus Features

### **Seasonal Updates**

You can easily add more seasonal variations:

```typescript
// Example: Add spring/summer/fall logos
const getSeason Logo = (daysPassed: number) => {
  if (daysPassed < 30) return '/logo snow.gif';     // Winter
  if (daysPassed < 120) return '/logo spring.gif';  // Spring
  if (daysPassed < 210) return '/logo summer.gif';  // Summer
  if (daysPassed < 300) return '/logo fall.gif';    // Fall
  return '/logo fire.gif';                          // Default
};
```

---

## 📞 Support

Need help with:

- Changing duration?
- Adding more seasons?
- Custom transition effects?
- Resetting for all users?

Just ask! 🚀

---

## 🎉 What's Included

✅ 30-day snow season tracking
✅ Automatic fire logo transition
✅ Smooth fade animations
✅ localStorage persistence
✅ Hourly automatic checks
✅ Console logging for debugging
✅ Mobile-friendly
✅ Production-optimized

---

**Created**: December 14, 2025
**Version**: 30-Day Snow Season Edition
**Package**: `snip-30days-snow-deploy.zip`
**Status**: ✅ Ready to Deploy!

---

## 🚀 Quick Start

1. Upload `snip-30days-snow-deploy.zip` to Netlify
2. Visit your site
3. See the snow logo ❄️
4. Wait 30 days (or test with console commands)
5. Watch it automatically switch to fire 🔥

**That's it! Your seasonal logo system is live!** 🎊

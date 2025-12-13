# 🍕 Snip Taste Menu

[![Netlify Status](https://api.netlify.com/api/v1/badges/621e23e9-5bed-4e4d-9312-34c16ae9b2dd/deploy-status)](https://app.netlify.com/projects/sniptaste-test1/deploys)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

A modern, interactive digital menu application for Snip Taste restaurant in Casablanca, Morocco. Built with React, TypeScript, and Tailwind CSS.

![Snip Taste Logo](./public/logo.png)

## ✨ Features

- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🎨 **Modern UI** - Beautiful design with custom fonts and animations
- 🛒 **Interactive Cart** - Add items, customize with supplements, and manage orders
- 🍔 **Multiple Categories** - Pizza, Burgers, Tacos, Sandwiches, Salads, and more
- 🎯 **Easy Navigation** - Intuitive layout with visual food decorations
- 📄 **PDF Export** - Generate order summaries (via jsPDF)
- 🌐 **Multilingual Ready** - Currently in French, easy to extend

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd SSNNIIPP

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 Available Scripts

| Script                 | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start development server        |
| `npm run build`        | Build for production            |
| `npm run preview`      | Preview production build        |
| `npm run lint`         | Run ESLint                      |
| `npm run lint:fix`     | Fix ESLint errors automatically |
| `npm run format`       | Format code with Prettier       |
| `npm run format:check` | Check code formatting           |
| `npm run type-check`   | Run TypeScript type checking    |

## 🏗️ Project Structure

```
SSNNIIPP/
├── components/          # React components
│   ├── CartSummary.tsx # Shopping cart modal
│   ├── FoodDecor.tsx   # Decorative SVG elements
│   ├── ItemModal.tsx   # Item detail modal
│   ├── Logo.tsx        # Restaurant logo component
│   ├── MenuSection.tsx # Menu category section
│   └── MenuTitle.tsx   # Section title component
├── public/             # Static assets
│   ├── logo.png        # Restaurant logo
│   └── _redirects      # Netlify SPA routing
├── App.tsx             # Main application component
├── data.ts             # Menu data
├── types.ts            # TypeScript type definitions
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── netlify.toml        # Netlify deployment config
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: React 19.2
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS (via CDN)
- **PDF Generation**: jsPDF 2.5
- **Fonts**: Google Fonts (Oswald, Permanent Marker, Roboto Condensed, Shadows Into Light)

## 🎨 Design Features

- **Custom Color Palette**:
  - Snip Yellow: `#FFD700`
  - Snip Orange: `#FF6B35`
  - Snip Black: `#1A1A1A`
  - Snip BG: `#F4F1EA`

- **Typography**:
  - Display: Oswald
  - Handwritten: Permanent Marker
  - Body: Roboto Condensed
  - Script: Shadows Into Light

## 📱 Menu Categories

- 🌮 Tex-Mex
- 🥤 Fresh Juices
- 🍰 Desserts
- 🥤 Beverages
- 🥗 Salads
- 🍕 Pizza
- 🍔 Burgers
- 🍝 Pasticcios
- 🍝 Pasta
- 🥙 Panizzas
- 🌮 Tacos
- 🥪 Sandwiches
- 🥙 Kabab
- 🍽️ Main Dishes

## 🚀 Deployment

### Netlify (Recommended)

The project is configured for easy deployment on Netlify:

```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
# Or connect your Git repository to Netlify for automatic deployments
```

The `netlify.toml` file includes:

- Build configuration
- SPA redirect rules
- Security headers
- Cache optimization

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Ensure your server redirects all routes to `index.html` for SPA routing

## 📞 Contact Information

**Snip Taste**

- 📍 N 6, residence ennakhil, Bd Mohamed Zefzaf, Casablanca
- 📱 +212 660 542 323
- 🚚 Home delivery available

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary to Snip Taste restaurant.

## 🙏 Acknowledgments

- Design inspired by modern restaurant menu trends
- Built with ❤️ for Snip Taste Casablanca

---

**Made with 🍕 by Snip Taste Team**

import React, { useState, useEffect } from 'react';
import { menuData } from './data';
import { MenuItem, CartItem, MenuSectionData, Supplement } from './types';
import MenuSection from './components/MenuSection';
import Logo from './components/Logo';
import TypingTitle from './components/TypingTitle';
import { PizzaDecor, BurgerDecor, TacoDecor } from './components/FoodDecor';
import ItemModal from './components/ItemModal';
import CartSummary from './components/CartSummary';
import PromoPopup from './components/PromoPopup';
import LazyImage from './components/LazyImage';
import { useCartPersistence } from './hooks/useCartPersistence';
import { analytics } from './utils/analytics';
import { useWelcomeAudio } from './hooks/useWelcomeAudio';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { cart, setCart, clearCart } = useCartPersistence();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [sectionSupplements, setSectionSupplements] = useState<Supplement[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Welcome audio on first click
  useWelcomeAudio();

  // Track promo popup view on mount
  useEffect(() => {
    if (showPromoPopup) {
      analytics.trackPromoView();
    }
  }, [showPromoPopup]);

  // Helper to find section by ID
  const getSection = (id: string) => menuData.find((s) => s.id === id)!;

  const handleItemClick = (item: MenuItem, section: MenuSectionData) => {
    setSelectedItem(item);
    setSectionSupplements(section.supplements || []);
    setSelectedSectionId(section.id);
    setIsItemModalOpen(true);
  };

  const handleAddToCart = (items: CartItem[]) => {
    setCart([...cart, ...items]);
    // Track analytics for each item added
    items.forEach((item) => {
      analytics.trackAddToCart(item);
    });
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    const removedItem = newCart[index];
    newCart.splice(index, 1);
    setCart(newCart);
    // Track analytics
    if (removedItem) {
      analytics.trackRemoveFromCart(removedItem);
    }
  };

  const handlePromoClick = () => {
    // Create a promotional item to add to cart
    const promoItem: CartItem = {
      id: `promo-${Date.now()}`,
      name: 'Offre Spéciale 3ssila',
      price: 0, // Free or special price
      quantity: 1,
      variant: 'Promotion',
      selectedSupplements: [],
      totalPrice: 0,
    };
    setCart([...cart, promoItem]);
    analytics.trackPromoClick();
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {!isMenuVisible && <LoadingScreen onLogoClick={() => setIsMenuVisible(true)} />}
      {isMenuVisible && (
        <div className="min-h-screen pb-12 overflow-x-hidden font-sans text-gray-900 selection:bg-snip-orange selection:text-white">
          {/* Decorative background elements */}
          <div className="fixed inset-0 z-[-1] opacity-5 pointer-events-none bg-wood-pattern"></div>

          {/* Container */}
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative">
            {/* Header / Hero */}
            <header className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 relative">
              <div className="absolute top-10 left-10 md:left-1/4 opacity-10 -rotate-12 pointer-events-none">
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10,100 Q50,10 90,100 T190,100"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="z-10 order-2 md:order-1 mt-6 md:mt-0">
                {/* Left side spacer or small decorative text could go here */}
              </div>

              <div className="z-20 order-1 md:order-2 flex flex-col items-center">
                <div onClick={() => setIsMenuVisible(true)} className="cursor-pointer">
                  <Logo />
                </div>
                <TypingTitle />
              </div>

              <div className="z-10 order-3 hidden md:block w-32">{/* Right side spacer */}</div>
            </header>

            {/* Main Menu Grid Layout */}
            {isMenuVisible && (
              <main className="relative">
                {/* We'll use a masonry-like structure using columns for the menu feel */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                  {/* Column 1 items (Left side of page 1 mostly) */}
                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('tex-mex')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('jus')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('desserts')} onItemClick={handleItemClick} />
                    <MenuSection section={getSection('boissons')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('salades')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid relative">
                    <PizzaDecor className="w-48 h-48 absolute -right-4 -top-12 z-20 hidden lg:block rotate-12" />
                    <MenuSection section={getSection('pizza')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid relative">
                    <BurgerDecor className="w-40 h-40 absolute -left-8 -top-8 z-20 hidden md:block -rotate-12" />
                    <MenuSection section={getSection('burger')} onItemClick={handleItemClick} />
                  </div>

                  {/* Delivery GIF Filler */}
                  <div className="break-inside-avoid flex justify-center md:justify-start items-center mb-12">
                    <LazyImage
                      src="/livreur snip.gif"
                      alt="Livraison Snip Taste"
                      className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                    />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('pasticcios')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('pates')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('panizzas')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid relative">
                    <TacoDecor className="w-44 h-44 absolute -right-6 bottom-0 z-20 hidden md:block rotate-6" />
                    <MenuSection section={getSection('tacos')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('sandwich')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('kabab')} onItemClick={handleItemClick} />
                  </div>

                  <div className="break-inside-avoid">
                    <MenuSection section={getSection('plats')} onItemClick={handleItemClick} />
                  </div>
                </div>
              </main>
            )}

            {/* Footer / Contact Info */}
            <footer className="mt-20 pt-10 border-t-4 border-dotted border-snip-black/20 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 text-center md:text-left relative">
              <div className="flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg shadow-md mb-4">
                  {/* Using a placeholder for QR Code */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.google.com/maps/search/?api=1%26query=Snip+Taste+Casablanca"
                    alt="Scan for location"
                    className="w-32 h-32"
                  />
                </div>
                <p className="font-display font-bold text-lg text-gray-600">SCAN ME</p>
              </div>

              <div className="flex flex-col items-center md:items-start space-y-2">
                <h3 className="font-display font-bold text-2xl uppercase mb-2 text-snip-black">
                  Contact Us
                </h3>
                <p className="font-body text-xl font-bold flex items-center gap-2">
                  <span className="text-snip-orange">📍</span>N 6, residence ennakhil, Bd Mohamed
                  Zefzaf, Casablanca
                </p>
                <p className="font-display font-bold text-4xl text-snip-orange tracking-widest my-2">
                  +212 660 542 323
                </p>
                <p className="font-body text-xl font-bold uppercase tracking-wider text-gray-700">
                  SNACK SNIP TASTE
                </p>

                <div className="flex gap-4 mt-4">
                  {/* Social Icons */}
                  <a
                    href="https://www.facebook.com/SnipTast?locale=fr_FR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-snip-orange rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black transition-colors"
                    aria-label="Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/snacksniptaste?igsh=YXI1amp0cnd0Y2dt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-snip-orange rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/212660542323"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-snip-orange rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black transition-colors"
                    aria-label="WhatsApp"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="bg-snip-black text-snip-yellow px-6 py-4 rounded-lg transform rotate-2 shadow-xl border-2 border-white">
                <p className="font-display text-2xl font-bold uppercase text-center">
                  Livraison à domicile
                </p>
                <p className="font-display text-xl text-center">DISPONIBLE</p>
                <p className="font-hand text-3xl mt-2 text-center text-white">+212 660 542 323</p>

                {/* DevMed Contact */}
                <div className="mt-4 pt-4 border-t border-snip-yellow/30">
                  <a
                    href="tel:+212607607604"
                    className="font-hand text-2xl text-center text-white hover:text-snip-yellow transition-colors duration-300 block cursor-pointer"
                  >
                    By DevMed
                  </a>
                </div>
              </div>
            </footer>

            {/* Floating Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-6 right-6 z-40 bg-snip-orange text-white rounded-full p-4 shadow-2xl hover:bg-snip-black transition-all hover:scale-110 group"
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartTotalItems > 0 && (
                  <span className="absolute -top-3 -right-3 bg-snip-yellow text-snip-black font-display font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-white text-snip-black px-3 py-1 rounded shadow-md font-bold font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Voir mon panier
              </span>
            </button>

            {/* Modals */}
            <ItemModal
              key={selectedItem?.name || 'modal'}
              item={selectedItem}
              availableSupplements={sectionSupplements}
              sectionId={selectedSectionId}
              isOpen={isItemModalOpen}
              onClose={() => setIsItemModalOpen(false)}
              onConfirm={handleAddToCart}
            />

            <CartSummary
              cart={cart}
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={clearCart}
            />

            {/* Promotional Popup */}
            {showPromoPopup && (
              <PromoPopup
                imageSrc="/3ssila.jpg"
                onClose={() => setShowPromoPopup(false)}
                onAddToCart={handlePromoClick}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;

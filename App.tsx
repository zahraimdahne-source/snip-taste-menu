
import React, { useState } from 'react';
import { menuData } from './data';
import { MenuItem, CartItem, MenuSectionData, Supplement } from './types';
import MenuSection from './components/MenuSection';
import Logo from './components/Logo';
import { PizzaDecor, BurgerDecor, TacoDecor } from './components/FoodDecor';
import ItemModal from './components/ItemModal';
import CartSummary from './components/CartSummary';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [sectionSupplements, setSectionSupplements] = useState<Supplement[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Helper to find section by ID
  const getSection = (id: string) => menuData.find(s => s.id === id)!;

  const handleItemClick = (item: MenuItem, section: MenuSectionData) => {
    setSelectedItem(item);
    setSectionSupplements(section.supplements || []);
    setSelectedSectionId(section.id);
    setIsItemModalOpen(true);
  };

  const handleAddToCart = (items: CartItem[]) => {
    setCart([...cart, ...items]);
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen pb-12 overflow-x-hidden font-sans text-gray-900 selection:bg-snip-orange selection:text-white">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-[-1] opacity-5 pointer-events-none bg-wood-pattern"></div>
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative">
        
        {/* Header / Hero */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 relative">
          <div className="absolute top-10 left-10 md:left-1/4 opacity-10 -rotate-12 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M10,100 Q50,10 90,100 T190,100" stroke="black" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          <div className="z-10 order-2 md:order-1 mt-6 md:mt-0">
             {/* Left side spacer or small decorative text could go here */}
          </div>

          <div className="z-20 order-1 md:order-2 flex flex-col items-center">
            <Logo />
            <div className="mt-4 relative">
               <h1 className="text-8xl md:text-9xl font-hand text-snip-orange menu-shadow transform -rotate-6 z-10 relative">
                 Menu
               </h1>
               <h1 className="text-8xl md:text-9xl font-hand text-snip-black absolute top-1 left-1 transform -rotate-6 z-0 opacity-20 blur-sm">
                 Menu
               </h1>
            </div>
            <p className="font-display uppercase tracking-[0.2em] text-xl mt-2 font-bold text-gray-700">
              Snip Taste
            </p>
          </div>

          <div className="z-10 order-3 hidden md:block w-32">
             {/* Right side spacer */}
          </div>
        </header>

        {/* Main Menu Grid Layout */}
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
            <h3 className="font-display font-bold text-2xl uppercase mb-2 text-snip-black">Contact Us</h3>
            <p className="font-body text-xl font-bold flex items-center gap-2">
              <span className="text-snip-orange">📍</span> 
              N 6, residence ennakhil, Bd Mohamed Zefzaf, Casablanca
            </p>
            <p className="font-display font-bold text-4xl text-snip-orange tracking-widest my-2">
              +212 660 542 323
            </p>
            <p className="font-body text-xl font-bold uppercase tracking-wider text-gray-700">
              SNACK SNIP TASTE
            </p>
            
            <div className="flex gap-4 mt-4">
               {/* Social Icons */}
               <div className="w-10 h-10 bg-snip-orange rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black transition-colors">f</div>
               <div className="w-10 h-10 bg-snip-orange rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black transition-colors">ig</div>
               <div className="w-10 h-10 bg-snip-orange rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black transition-colors">wa</div>
            </div>
          </div>
          
           <div className="bg-snip-black text-snip-yellow px-6 py-4 rounded-lg transform rotate-2 shadow-xl border-2 border-white">
              <p className="font-display text-2xl font-bold uppercase text-center">
                Livraison à domicile
              </p>
              <p className="font-display text-xl text-center">DISPONIBLE</p>
              <p className="font-hand text-3xl mt-2 text-center text-white">
                 +212 660 542 323
              </p>
           </div>

        </footer>

        {/* Floating Cart Button */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-snip-orange text-white rounded-full p-4 shadow-2xl hover:bg-snip-black transition-all hover:scale-110 group"
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
        />

        {/* Floating elements for visual noise */}
        <div className="fixed top-1/4 left-0 w-24 h-24 opacity-5 pointer-events-none -z-10 bg-contain bg-no-repeat" style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/135/135655.png')" }}></div>
        <div className="fixed bottom-1/4 right-0 w-32 h-32 opacity-5 pointer-events-none -z-10 bg-contain bg-no-repeat transform rotate-45" style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/706/706164.png')" }}></div>
      </div>
    </div>
  );
}

export default App;

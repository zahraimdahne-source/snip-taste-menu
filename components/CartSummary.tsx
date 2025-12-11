
import React, { useState } from 'react';
import { CartItem } from '../types';
import { jsPDF } from 'jspdf';

interface CartSummaryProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (index: number) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart, isOpen, onClose, onRemoveItem }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const deliveryPrice = 10.00;
  
  const itemsTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalAmount = itemsTotal + (isDelivery ? deliveryPrice : 0);
  const phoneNumber = "212660542323";

  const generateReceiptPDF = async () => {
    try {
      // Create PDF with 80mm width (standard thermal receipt) and dynamic height
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 250] // Fixed width, arbitrary long height
      });

      // --- Helper Functions ---
      const centerText = (text: string, y: number, fontSize: number = 10, fontStyle: string = 'normal') => {
        doc.setFont('courier', fontStyle);
        doc.setFontSize(fontSize);
        const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
        const x = (80 - textWidth) / 2;
        doc.text(text, x, y);
      };

      const drawDashedLine = (y: number) => {
        doc.setLineDash([1, 1], 0);
        doc.line(4, y, 76, y);
        doc.setLineDash([], 0); // Reset
      };

      let yCursor = 10;

      // --- Header ---
      
      // Try to add Logo
      try {
        const logoImg = new Image();
        logoImg.src = '/logo.png';
        // Wait for image load (simple promise wrapper)
        await new Promise((resolve) => {
          if (logoImg.complete) resolve(true);
          logoImg.onload = () => resolve(true);
          logoImg.onerror = () => resolve(false); 
        });
        
        // Add logo if available
        if (logoImg.complete && logoImg.naturalHeight !== 0) {
           // Increased size to 40x40mm and centered (80-40)/2 = 20
           doc.addImage(logoImg, 'PNG', 20, yCursor, 40, 40);
           yCursor += 42;
        }
      } catch (e) {
        console.warn("Logo failed to load for PDF", e);
      }

      // Title & Info
      centerText('SNIP TASTE', yCursor, 16, 'bold');
      yCursor += 6;
      
      centerText('Tel : 0660542323', yCursor, 9);
      yCursor += 5;

      const date = new Date();
      const dateStr = date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const orderNum = Math.floor(10000 + Math.random() * 90000); // Random 5 digit order number

      doc.setFontSize(8);
      doc.setFont('courier', 'normal');
      doc.text(`Le : ${dateStr}`, 4, yCursor);
      yCursor += 4;
      doc.text(`ORDRE N°: ${orderNum}`, 4, yCursor);
      yCursor += 4;
      doc.text(`Service : ${isDelivery ? 'Livraison' : 'Sur place / Emporter'}`, 4, yCursor);
      yCursor += 6;

      // --- Table Header ---
      drawDashedLine(yCursor);
      yCursor += 4;

      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.text('ARTICLE', 4, yCursor);
      doc.text('P.U', 45, yCursor, { align: 'right' });
      doc.text('QTE', 55, yCursor, { align: 'right' });
      doc.text('TOTAL', 76, yCursor, { align: 'right' });
      yCursor += 2;
      
      drawDashedLine(yCursor);
      yCursor += 5;

      // --- Items ---
      doc.setFont('courier', 'normal');
      
      cart.forEach((item) => {
        const nameText = item.variant ? `${item.name} (${item.variant})` : item.name;
        // Wrap text for article name (max width ~35mm)
        const splitName = doc.splitTextToSize(nameText, 38);
        const dim = doc.getTextDimensions(splitName);
        let rowHeight = dim.h;

        doc.text(splitName, 4, yCursor);
        doc.text(item.price.toFixed(1), 45, yCursor, { align: 'right' });
        doc.text(item.quantity.toString(), 55, yCursor, { align: 'right' });
        doc.text(item.totalPrice.toFixed(1) + ' DH', 76, yCursor, { align: 'right' });

        yCursor += rowHeight + 2;

        if (item.selectedSauce) {
            doc.setFontSize(7);
            doc.text(`> ${item.selectedSauce}`, 6, yCursor - 1);
            doc.setFontSize(8);
            yCursor += 3;
        }
      });

      yCursor += 2;
      drawDashedLine(yCursor);
      yCursor += 6;

      // --- Totals ---
      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      
      if (isDelivery) {
        doc.text('Livraison :', 4, yCursor);
        doc.text(deliveryPrice.toFixed(2) + ' DH', 76, yCursor, { align: 'right' });
        yCursor += 5;
      }

      doc.setFontSize(14);
      doc.text('TOTAL :', 4, yCursor);
      doc.text(totalAmount.toFixed(2) + ' DH', 76, yCursor, { align: 'right' });
      yCursor += 8;

      // --- Footer ---
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      
      doc.text('Remise : 0,00 DH', 40, yCursor, { align: 'center' });
      yCursor += 4;
      doc.text('TVA : 0,00 DH', 40, yCursor, { align: 'center' });
      yCursor += 6;

      centerText('MERCI DE VOTRE VISITE', yCursor, 10, 'bold');
      yCursor += 5;
      centerText('*** Snip Taste ***', yCursor, 8);

      doc.save(`Ticket_SnipTaste_${orderNum}.pdf`);
      return true;
    } catch (error) {
      console.error("Error generating PDF", error);
      return false;
    }
  };

  const handleOrder = async () => {
    setIsProcessing(true);

    // 1. Generate and Download PDF
    await generateReceiptPDF();

    // 2. Prepare WhatsApp Message
    let message = "👋 Bonjour Snip Taste, je souhaite commander:\n\n";
    
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.name}`;
      if (item.variant) message += ` (${item.variant})`;
      if (item.selectedSauce) message += ` - Sauce: ${item.selectedSauce}`;
      message += ` - ${item.totalPrice.toFixed(2)} DH\n`;
    });
    
    if (isDelivery) {
        message += `\n🚚 Livraison à domicile: ${deliveryPrice.toFixed(2)} DH`;
    }

    message += `\n💰 *Total: ${totalAmount.toFixed(2)} DH*`;
    message += `\n\n(Mon ticket est téléchargé 🧾)`;

    const encodedMessage = encodeURIComponent(message);
    
    // 3. Open WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Sidebar Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="bg-snip-orange p-6 flex justify-between items-center shadow-md z-10">
          <h2 className="font-display text-3xl text-white uppercase tracking-wide">Votre Commande</h2>
          <button onClick={onClose} className="text-white hover:rotate-90 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-snip-bg bg-wood-pattern">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="font-display text-xl uppercase">Votre panier est vide</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative group animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display text-xl text-snip-black uppercase leading-tight">{item.name}</h4>
                      <div className="flex flex-col gap-1 mt-1">
                        {item.variant && (
                          <span className="text-sm font-body text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded-sm w-fit">
                            {item.variant}
                          </span>
                        )}
                        {item.selectedSauce && (
                           <span className="text-sm font-body font-bold text-snip-orange uppercase tracking-wide flex items-center gap-1">
                            <span className="text-xs">🥄</span> {item.selectedSauce}
                           </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(index)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <span className="font-body font-bold text-gray-600">x {item.quantity}</span>
                    <span className="font-display text-xl text-snip-orange font-bold">{item.totalPrice.toFixed(2)} DH</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] space-y-3">
          
          {/* Delivery Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={isDelivery} 
                  onChange={(e) => setIsDelivery(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-snip-orange"></div>
              </div>
              <span className="font-body font-bold text-gray-700 uppercase">Livraison à domicile</span>
            </label>
            <span className="font-display text-lg text-snip-orange">+10.00 DH</span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="font-body text-lg font-bold uppercase text-gray-600">Total à payer</span>
            <span className="font-display text-4xl text-snip-black font-bold">{totalAmount.toFixed(2)} DH</span>
          </div>

          {/* Combined Button */}
          <button
            onClick={handleOrder}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full py-4 rounded-lg font-display text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all transform shadow-lg ${
              cart.length === 0 || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#25D366] text-white hover:bg-[#128C7E] hover:scale-[1.02]'
            }`}
          >
             {isProcessing ? (
               <span className="animate-pulse">Traitement...</span>
             ) : (
               <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                Commander & Ticket
               </>
             )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

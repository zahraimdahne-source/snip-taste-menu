import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

interface PromoPopupProps {
  imageSrc: string;
  onClose: () => void;
  onAddToCart: () => void;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ imageSrc, onClose, onAddToCart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showChoice, setShowChoice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const generatePromoTicket = async (option: 'surplace' | 'emporter') => {
    const price = option === 'surplace' ? 18 : 20;
    const optionText = option === 'surplace' ? 'Sur place' : 'À emporter';

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 120],
      });

      const centerText = (
        text: string,
        y: number,
        fontSize: number = 10,
        fontStyle: string = 'normal'
      ) => {
        doc.setFont('courier', fontStyle);
        doc.setFontSize(fontSize);
        const textWidth = (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
        const x = (80 - textWidth) / 2;
        doc.text(text, x, y);
      };

      let yCursor = 10;

      try {
        const logoImg = new Image();
        logoImg.src = '/logo fire.gif';
        await new Promise((resolve) => {
          if (logoImg.complete) resolve(true);
          logoImg.onload = () => resolve(true);
          logoImg.onerror = () => resolve(false);
        });

        if (logoImg.complete && logoImg.naturalHeight !== 0) {
          doc.addImage(logoImg, 'PNG', 20, yCursor, 40, 40);
          yCursor += 42;
        }
      } catch (e) {
        console.warn('Logo failed to load for PDF', e);
      }

      centerText('SNIP TASTE', yCursor, 16, 'bold');
      yCursor += 8;
      centerText('*** SOUPE 3SSILA ***', yCursor, 12, 'bold');
      yCursor += 10;

      // Add promo image - smaller and centered
      try {
        const promoImg = new Image();
        promoImg.src = imageSrc;
        await new Promise((resolve) => {
          if (promoImg.complete) resolve(true);
          promoImg.onload = () => resolve(true);
          promoImg.onerror = () => resolve(false);
        });

        if (promoImg.complete && promoImg.naturalHeight !== 0) {
          // Draw border around image
          doc.setDrawColor(255, 107, 53); // Orange color
          doc.setLineWidth(0.5);
          doc.rect(14, yCursor - 1, 52, 32);

          // Add image - smaller size (50x30mm) centered
          doc.addImage(promoImg, 'JPEG', 15, yCursor, 50, 30);
          yCursor += 32;
        }
      } catch (e) {
        console.warn('Promo image failed to load for PDF', e);
      }

      yCursor += 4;

      // @ts-expect-error - setLineDash exists but may not be in type definitions
      doc.setLineDash([1, 1], 0);
      doc.line(4, yCursor, 76, yCursor);
      // @ts-expect-error - setLineDash exists but may not be in type definitions
      doc.setLineDash([], 0);
      yCursor += 6;

      doc.setFontSize(10);
      doc.setFont('courier', 'bold');
      centerText(`1x Soupe 3ssila (${optionText})`, yCursor, 9);
      yCursor += 6;

      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      centerText(`Prix: ${price} DH`, yCursor, 12, 'bold');
      yCursor += 8;

      doc.setFontSize(8);
      centerText('Tel: 0660542323', yCursor, 8);
      yCursor += 8;

      centerText('MERCI DE VOTRE VISITE', yCursor, 10, 'bold');
      yCursor += 5;
      centerText('*** Snip Taste ***', yCursor, 8);

      doc.save('Soupe_3ssila_SnipTaste.pdf');
      return true;
    } catch (error) {
      console.error('Error generating promo PDF', error);
      return false;
    }
  };

  const handleImageClick = () => {
    setShowChoice(true);
  };

  const handleOptionSelect = async (option: 'surplace' | 'emporter') => {
    const price = option === 'surplace' ? 18 : 20;
    const optionText = option === 'surplace' ? 'Sur place' : 'À emporter';

    // Add to cart
    onAddToCart();

    // Generate and download ticket
    await generatePromoTicket(option);

    // Open WhatsApp with promotional message
    const phoneNumber = '212660542323';
    const message = `Bghit Chi Soupe 3ssila 🍲\n\n${optionText}: ${price} DH`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    // Close popup after a short delay
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible && !isClosing) return null;

  return (
    <div
      className={`fixed top-4 left-4 z-[100] max-w-md transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
      }`}
    >
      {/* Simple Card */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-white transform transition-all duration-500 group ${
          isClosing ? 'scale-90' : 'scale-100 animate-in slide-in-from-left-8 fade-in'
        } ${!showChoice ? 'cursor-pointer hover:scale-105' : ''}`}
        onClick={!showChoice ? handleImageClick : undefined}
      >
        {/* Subtle Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-snip-orange via-snip-yellow to-snip-orange rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/70 hover:bg-snip-orange text-white rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 shadow-lg"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <div className="relative">
          <img
            src={imageSrc}
            alt="Soupe 3ssila"
            className={`w-full h-auto object-cover transition-transform duration-500 ${!showChoice ? 'group-hover:scale-105' : ''}`}
          />
        </div>

        {/* Choice Overlay */}
        {showChoice && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="w-full space-y-3">
              <h3 className="text-white font-display text-xl font-bold text-center mb-4 uppercase tracking-wide">
                Choisissez votre option
              </h3>

              {/* Sur place option */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect('surplace');
                }}
                className="w-full bg-white text-snip-black p-4 rounded-lg font-display font-bold text-lg hover:bg-snip-orange hover:text-white transition-all shadow-lg border-2 border-white"
              >
                <div className="flex items-center justify-between">
                  <span>Sur place</span>
                  <span className="text-snip-orange">18 DH</span>
                </div>
              </button>

              {/* À emporter option */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect('emporter');
                }}
                className="w-full bg-white text-snip-black p-4 rounded-lg font-display font-bold text-lg hover:bg-snip-orange hover:text-white transition-all shadow-lg border-2 border-white"
              >
                <div className="flex items-center justify-between">
                  <span>À emporter</span>
                  <span className="text-snip-orange">20 DH</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoPopup;

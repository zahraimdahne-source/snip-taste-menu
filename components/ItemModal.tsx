import React, { useState } from 'react';
import { MenuItem, CartItem, Supplement } from '../types';

interface ItemModalProps {
  item: MenuItem | null;
  availableSupplements: Supplement[];
  sectionId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cartItems: CartItem[]) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({
  item,
  availableSupplements,
  sectionId,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<'small' | 'large'>('small');
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>([]);
  const [selectedSauce, setSelectedSauce] = useState<string>('');

  const showSauces = ['tacos', 'kabab'].includes(sectionId);
  const sauceOptions = ['Sauce Algérienne', 'Sauce Bigy', 'Sauce Barbecue', 'Sauce Mixte'];

  if (!isOpen || !item) return null;

  const hasVariants = !!item.prices;

  const getBasePrice = () => {
    if (item.prices) {
      return item.prices[selectedVariant];
    }
    return item.price || 0;
  };

  const basePrice = getBasePrice();
  // Supplement price is added once, not multiplied by quantity
  const supplementsTotal = selectedSupplements.reduce((acc, supp) => acc + supp.price, 0);
  const total = basePrice * quantity + supplementsTotal;

  const toggleSupplement = (supplement: Supplement) => {
    if (selectedSupplements.find((s) => s.name === supplement.name)) {
      setSelectedSupplements(selectedSupplements.filter((s) => s.name !== supplement.name));
    } else {
      setSelectedSupplements([...selectedSupplements, supplement]);
    }
  };

  const handleConfirm = () => {
    const variantLabel = hasVariants
      ? selectedVariant === 'small'
        ? 'Petit'
        : 'Grand'
      : undefined;
    const timestamp = Date.now();

    const itemsToAdd: CartItem[] = [];

    // 1. Add the Main Item
    itemsToAdd.push({
      id: `${item.name}-${timestamp}-main`,
      name: item.name,
      price: basePrice,
      quantity: quantity,
      variant: variantLabel,
      selectedSupplements: [], // Supplements are now separate items
      totalPrice: basePrice * quantity,
      selectedSauce: showSauces ? selectedSauce : undefined,
    });

    // 2. Add Supplements as separate items (Quantity always 1)
    selectedSupplements.forEach((supp, index) => {
      itemsToAdd.push({
        id: `${item.name}-${supp.name}-${timestamp}-${index}`,
        name: `Supplément: ${supp.name}`,
        price: supp.price,
        quantity: 1, // "just let it one"
        variant: undefined,
        selectedSupplements: [],
        totalPrice: supp.price,
      });
    });

    onConfirm(itemsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-snip-bg bg-wood-pattern w-full max-w-md rounded-lg shadow-2xl overflow-hidden border-4 border-white transform scale-100 transition-transform max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-snip-black p-4 flex justify-between items-center shrink-0">
          <h3 className="font-display text-2xl text-snip-yellow uppercase tracking-wide truncate pr-4">
            {item.name}
          </h3>
          <button onClick={onClose} className="text-white hover:text-snip-orange transition-colors">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Variant Selector */}
          {hasVariants && (
            <div className="mb-6">
              <label className="block font-body font-bold text-gray-700 mb-2 uppercase">
                Choisir la taille:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedVariant('small')}
                  className={`py-3 px-4 rounded border-2 font-display text-lg transition-all ${
                    selectedVariant === 'small'
                      ? 'bg-snip-orange border-snip-orange text-white shadow-md transform scale-105'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-snip-orange'
                  }`}
                >
                  PETIT
                  <span className="block text-sm opacity-80">
                    {item.prices?.small.toFixed(2)} DH
                  </span>
                </button>
                <button
                  onClick={() => setSelectedVariant('large')}
                  className={`py-3 px-4 rounded border-2 font-display text-lg transition-all ${
                    selectedVariant === 'large'
                      ? 'bg-snip-orange border-snip-orange text-white shadow-md transform scale-105'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-snip-orange'
                  }`}
                >
                  GRAND
                  <span className="block text-sm opacity-80">
                    {item.prices?.large.toFixed(2)} DH
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Sauce Selector (Only for Tacos and Tex Mex) */}
          {showSauces && (
            <div className="mb-6">
              <label className="block font-body font-bold text-gray-700 mb-2 uppercase">
                Choix de la Sauce:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sauceOptions.map((sauce) => (
                  <button
                    key={sauce}
                    onClick={() => setSelectedSauce(sauce === selectedSauce ? '' : sauce)}
                    className={`py-2 px-3 rounded border-2 font-body text-sm font-bold uppercase transition-all ${
                      selectedSauce === sauce
                        ? 'bg-snip-orange border-snip-orange text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {sauce}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Supplements Selector */}
          {availableSupplements.length > 0 && (
            <div className="mb-6">
              <label className="block font-body font-bold text-gray-700 mb-2 uppercase">
                Suppléments (Ajouté séparément):
              </label>
              <div className="space-y-2">
                {availableSupplements.map((supp, index) => {
                  const isSelected = !!selectedSupplements.find((s) => s.name === supp.name);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleSupplement(supp)}
                      className={`flex items-center justify-between p-3 rounded border-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-orange-50 border-snip-orange'
                          : 'bg-white border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            isSelected
                              ? 'bg-snip-orange border-snip-orange'
                              : 'border-gray-400 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="font-body font-bold text-snip-black uppercase">
                          {supp.name}
                        </span>
                      </div>
                      <span className="font-display text-lg text-snip-orange">
                        +{supp.price.toFixed(2)} DH
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block font-body font-bold text-gray-700 mb-2 uppercase">
              Quantité (Article principal):
            </label>
            <div className="flex items-center justify-center bg-white rounded-lg border-2 border-gray-200 p-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-snip-black hover:bg-snip-orange hover:text-white transition-colors text-2xl font-bold"
              >
                -
              </button>
              <span className="flex-1 text-center font-display text-4xl text-snip-black">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-snip-black hover:bg-snip-orange hover:text-white transition-colors text-2xl font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Total & Action */}
        <div className="p-6 bg-white border-t-2 border-dashed border-gray-300 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 font-body uppercase font-bold">
              Total (avec suppléments)
            </span>
            <span className="font-display text-3xl text-snip-black font-bold">
              {total.toFixed(2)} DH
            </span>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full bg-snip-black text-snip-yellow px-6 py-3 rounded font-display text-xl uppercase tracking-wider hover:bg-gray-800 hover:scale-[1.02] transition-all shadow-lg"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;

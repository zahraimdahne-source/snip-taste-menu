import React from 'react';

interface CIHPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentConfirmed: () => void;
}

const CIHPaymentModal: React.FC<CIHPaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onPaymentConfirmed,
}) => {
  const bankInfo = {
    titulaire: 'SnipTaste',
  };

  const handlePaymentDone = () => {
    onPaymentConfirmed();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:rotate-90 duration-300"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <img src="/cih.jpg" alt="CIH Bank" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Paiement CIH Bank</h2>
              <p className="text-red-100 text-xs flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Paiement sécurisé
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Montant */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 text-center border-2 border-red-200">
            <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Montant à payer</p>
            <p className="text-4xl font-bold text-red-600">{totalAmount.toFixed(2)} DH</p>
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="bg-white p-3 rounded-xl shadow-md">
              <img src="/QR CIH.png" alt="QR Code CIH Bank" className="w-full h-auto rounded-lg" />
            </div>
            <p className="text-center text-xs text-gray-600 mt-2">
              Scannez avec l'application CIH Mobile
            </p>
          </div>

          {/* Titulaire Info */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Bénéficiaire</p>
            <p className="font-bold text-gray-800">{bankInfo.titulaire}</p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-xl">
            <p className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Instructions
            </p>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Scannez le QR code avec l'app CIH Mobile</li>
              <li>
                Payez <strong>{totalAmount.toFixed(2)} DH</strong>
              </li>
              <li>Prenez une capture d'écran du reçu</li>
              <li>Cliquez sur "J'ai payé" ci-dessous</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handlePaymentDone}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              J'ai payé - Envoyer commande
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CIHPaymentModal;

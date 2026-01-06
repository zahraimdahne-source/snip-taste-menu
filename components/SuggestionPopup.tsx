import React, { useEffect, useState } from 'react';
import { Suggestion } from '../utils/smartSuggestions';

interface SuggestionPopupProps {
  suggestion: Suggestion | null;
  onClose: () => void;
  onAccept: (item: string) => void;
  isVisible: boolean;
}

export const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
  suggestion,
  onClose,
  onAccept,
  isVisible,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible && suggestion) {
      setIsAnimating(true);

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, suggestion, onClose]);

  if (!suggestion || !isVisible) return null;

  // Get icon based on suggestion type
  const getIcon = () => {
    switch (suggestion.type) {
      case 'upsell':
        return '⬆️';
      case 'cross-sell':
        return '🔗';
      case 'combo':
        return '🎁';
      case 'popular':
        return '⭐';
      default:
        return '💡';
    }
  };

  // Get color based on suggestion type
  const getColorClass = () => {
    switch (suggestion.type) {
      case 'upsell':
        return 'from-purple-500 to-purple-600';
      case 'cross-sell':
        return 'from-blue-500 to-blue-600';
      case 'combo':
        return 'from-green-500 to-green-600';
      case 'popular':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-indigo-500 to-indigo-600';
    }
  };

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] transition-all duration-300 ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <div
        className={`bg-gradient-to-r ${getColorClass()} backdrop-blur-xl bg-opacity-95 rounded-2xl shadow-2xl p-4 border border-white/30 min-w-[320px] max-w-md`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">{getIcon()}</span>
            <div>
              <h3 className="text-white font-bold text-sm">Smart Suggestion</h3>
              <p className="text-white/80 text-xs">{suggestion.reason}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="text-white text-sm mb-3 leading-relaxed">{suggestion.message}</p>

        {/* Discount Badge */}
        {suggestion.discount && (
          <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
            <span className="text-yellow-300 text-lg">🏷️</span>
            <span className="text-white font-bold text-sm">-{suggestion.discount} DH</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {suggestion.items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onAccept(item);
                setIsAnimating(false);
                setTimeout(onClose, 300);
              }}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95 border border-white/30"
            >
              ✅ {item}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full animate-progress"
            style={{
              animation: 'progress 3s linear forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

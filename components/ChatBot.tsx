import React, { useState, useRef, useEffect } from 'react';
import { initialBotState, BotState } from '../bot/respondLocal';
import { processUserMessage } from '../bot/botBrain';
import { calculateDistance, RESTAURANT_COORDS, getDeliveryTier } from '../utils/distance';
import haptics, { triggerCustomHaptic } from '../utils/haptics';
import { getVoiceRecognition } from '../utils/voiceRecognition';
import { getSmartSuggestion, Suggestion } from '../utils/smartSuggestions';
import { getContextManager, detectIntent } from '../utils/contextManager';
import { getProactiveAssistant } from '../utils/proactiveAssistant';
import { SuggestionPopup } from './SuggestionPopup';
import { locationService, LocationData } from '../utils/locationService';
import { LocationAnalyticsDashboard } from './LocationAnalyticsDashboard';
import { LocationMapPicker } from './LocationMapPicker';
import MenuSection from './MenuSection';
import { MenuSectionData } from '../types';
import './ChatBot.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  options?: string[];
  imageUrl?: string;
  menuSection?: MenuSectionData; // Menu section to display
}

interface ChatBotProps {
  isCartOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({
  isCartOpen = false,
  isOpen: externalIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external control if provided, otherwise local state
  const isChatOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleToggle = (newState: boolean) => {
    // Vibrate based on open/close action
    if (newState) {
      // Opening chatbot - welcoming pulse
      triggerCustomHaptic([15, 50, 20]); // Welcome pulse
    } else {
      // Closing chatbot - satisfying close
      triggerCustomHaptic([20, 30, 15]); // Close tap
    }

    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalIsOpen(newState);
    }
  };

  // If cart is open, we shouldn't show the chatbot button to avoid overlap
  // if (isCartOpen) return null; // MOVED check to JSX to avoid hook violation

  // Initialize smart features
  const voiceRecognition = useRef(getVoiceRecognition());
  const contextManager = useRef(getContextManager());
  const proactiveAssistant = useRef(getProactiveAssistant());

  // Get personalized greeting
  const personalizedGreeting =
    contextManager.current.getPersonalizedGreeting() ||
    proactiveAssistant.current.getTimeBasedGreeting();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: personalizedGreeting,
      timestamp: new Date(),
      options: ['Voir le Menu', 'Pizza', 'Tacos', 'Jus'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botState, setBotState] = useState<BotState>(initialBotState);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [clientLocation, setClientLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Smart features state
  const [isListening, setIsListening] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pickerLocation, setPickerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  // Device Detection & Color Theme System
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  // Professional Color Themes
  const theme = {
    // Apple = Blue (iOS style), Android = Orange (warm brand colors)
    primary: isIOS ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600',
    primarySolid: isIOS ? 'bg-blue-500' : 'bg-orange-500',
    border: isIOS ? 'border-blue-500' : 'border-orange-500',
    ring: isIOS ? 'focus:ring-blue-500' : 'focus:ring-orange-500',
    lightBg: isIOS ? 'bg-blue-50' : 'bg-orange-50',
    lightText: isIOS ? 'text-blue-100' : 'text-orange-100',
    darkText: isIOS ? 'text-blue-800' : 'text-orange-800',
    mediumText: isIOS ? 'text-blue-700' : 'text-orange-700',
    optionBorder: isIOS ? 'border-blue-200' : 'border-orange-200',
    optionText: isIOS ? 'text-blue-600' : 'text-orange-600',
    optionHoverBg: isIOS ? 'hover:bg-blue-50' : 'hover:bg-orange-50',
    optionHoverBorder: isIOS ? 'hover:border-blue-300' : 'hover:border-orange-300',
    pulse: isIOS ? 'bg-blue-400' : 'bg-yellow-400',
    deviceName: isIOS ? 'iPhone/iPad' : isAndroid ? 'Android' : 'Desktop',
    icon: isIOS ? '🍎' : isAndroid ? '🤖' : '💻',
    glass:
      'backdrop-blur-xl bg-white/20 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
    primaryGlass: isIOS ? 'from-blue-500/80 to-blue-600/80' : 'from-orange-500/80 to-orange-600/80',
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const sendMessage = async (textInput?: string) => {
    const textToSend = textInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Track context
    const intent = detectIntent(textToSend);
    contextManager.current.addMessage('user', textToSend, intent);
    proactiveAssistant.current.updateActivity();

    // Vibrate when user sends message
    triggerCustomHaptic([15]); // Clear send feedback

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

    // Vibrate when bot starts typing (subtle pulse)
    triggerCustomHaptic([5, 50, 5]); // Typing indicator feel

    try {
      // Pass menuData as any to match the engine's expected type
      // Use the new BRAIN based processor which wraps handleUserMessage
      const {
        newState,
        reply,
        options,
        // imageUrl is not returned by brain yet, so we get it from standard flow if brain falls back,
        // OR we need to update brain to return it. For now, let's keep it simple:
        // Note: processUserMessage's signature needs to align. I'll act as if it returns compatible structure,
        // or effectively we might need to query handleUserMessage if brain fails.
        // ACTUALLY: The brain wraps handleUserMessage for fallback.
        intent,
      } = processUserMessage(textToSend, botState);

      // If the Brain returned a FUNCTIONAL_FLOW, it means it used handleUserMessage internally
      // but we need to ensure we capture any SIDE EFFECTS (like imageUrl from payment) that might be missing in typical brain response.
      // The current botBrain implementation returns { reply, newState, options, intent }.
      // It DOES NOT currently return imageUrl.
      // Let's patch this quickly in the logic below or rely on the brain state update.

      setBotState(newState);

      // Track bot response in context
      contextManager.current.addMessage('assistant', reply, intent);

      const assistantMessage: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
        options: options,
        // Hack: If we detect 'QR' in reply or state phase is final, we might want to show image.
        // For now, let's leave imageUrl undefined unless we add it to Brain.
        imageUrl: newState.phase === 'idle' && reply.includes('QR') ? '/QR CIH.png' : undefined,
        menuSection: newState.menuSection, // Pass menu section to message
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Check for smart suggestions after cart update - Show as POPUP
      if (newState.cart && newState.cart.length > 0) {
        proactiveAssistant.current.markCartActivity();

        const suggestion = getSmartSuggestion(newState.cart);
        if (suggestion) {
          // Show popup after a brief delay
          setTimeout(() => {
            setCurrentSuggestion(suggestion);
            setShowSuggestion(true);
            triggerCustomHaptic([10, 30, 10]); // Suggestion notification
          }, 500);
        }
      }

      // Vibrate when bot responds (notification feel)
      triggerCustomHaptic([10, 30, 10]); // Bot response notification
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Smah lia، kayn chi mochkil. 3awd tsawl 😅',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    // Reset to initial state
    setBotState(initialBotState);
    const greeting =
      contextManager.current.getPersonalizedGreeting() ||
      proactiveAssistant.current.getTimeBasedGreeting();
    setMessages([
      {
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
        options: ['Voir le Menu', 'Pizza', 'Tacos', 'Jus'],
      },
    ]);
    setInput('');
    contextManager.current.clearSession();
    proactiveAssistant.current.reset();
  };

  // Voice Recognition Handler
  const handleVoiceInput = async () => {
    if (!voiceRecognition.current.isSupported()) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Voice recognition machi supporté f navigateur dyalek.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    try {
      setIsListening(true);
      triggerCustomHaptic([15, 50, 15]); // Start listening vibration

      const result = await voiceRecognition.current.startListening('ar-MA');

      setIsListening(false);
      triggerCustomHaptic([20]); // Stop listening vibration

      if (result.transcript) {
        // Send the transcribed text
        sendMessage(result.transcript);
      }
    } catch (error: any) {
      setIsListening(false);
      triggerCustomHaptic([50, 50, 50]); // Error vibration

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Voice recognition error: ${error.message || 'Unknown error'}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleLocationShare = async () => {
    // Vibrate when initiating location share
    triggerCustomHaptic([12]); // Location button press

    // Check permission first
    const permStatus = await locationService.checkPermission();

    if (!permStatus.supported) {
      triggerCustomHaptic([50, 50, 50]); // Error vibration
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Geolocation machi supporté f navigateur dyalek.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    if (permStatus.permission === 'denied') {
      triggerCustomHaptic([50, 50, 50]); // Error vibration
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '🔒 Permission dyaal location m9fla f browser dyalek.\n\n📱 Bash t7elha:\n\n1️⃣ Klik 3la l\'icône 🔒 (lock) f address bar (f l3la)\n2️⃣ Klik 3la "Site settings" aw "Paramètres du site"\n3️⃣ F "Location", beddel mn "Block" l "Allow"\n4️⃣ Refresh la page (F5)\n5️⃣ 3awd tsift location',
          timestamp: new Date(),
          options: ['📊 View Location Analytics'],
        },
      ]);
      return;
    }

    setLocationLoading(true);

    // Vibrate when starting to fetch location
    triggerCustomHaptic([10, 50, 10]); // Fetching location pulse

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content:
          '📍 Kan9ad location dyalek b high accuracy...\n\n⚡ Kan3awd n7awl b multiple methods bash n9ad أدق location!',
        timestamp: new Date(),
      },
    ]);

    try {
      // Use enhanced location service with fallbacks
      const location = await locationService.getCurrentLocation({
        useCache: false,
        timeout: 15000,
      });

      setLocationData(location);
      const clientLoc = { lat: location.lat, lng: location.lng };
      setClientLocation(clientLoc);

      // Calculate distance
      const dist = calculateDistance(
        location.lat,
        location.lng,
        RESTAURANT_COORDS.lat,
        RESTAURANT_COORDS.lng
      );
      setDistance(dist);

      // Get suggested delivery tier
      const tier = getDeliveryTier(dist);

      // Update bot state with location
      setBotState((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          clientLocation: clientLoc,
          distance: dist,
          deliveryDistance: tier || prev.customer.deliveryDistance,
        },
      }));

      setLocationLoading(false);

      // SUCCESS VIBRATION - Location found!
      triggerCustomHaptic([20, 100, 20, 100, 40]); // Celebration!

      // Get quality assessment
      const quality = locationService.getLocationQuality(location);
      const qualityEmoji =
        quality.quality === 'excellent'
          ? '🟢'
          : quality.quality === 'good'
            ? '🔵'
            : quality.quality === 'fair'
              ? '🟡'
              : '🔴';

      // Show success message with distance and quality
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ Location m9yda!\n\n📍 GPS: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}\n📏 Distance: ${dist} km\n${qualityEmoji} Quality: ${quality.description}\n📡 Source: ${location.source.toUpperCase()}\n${tier ? `💰 Frais livraison suggéré: ${tier === '0-2km' ? '5 DH' : tier === '3-5km' ? '10 DH' : '15 DH'}` : '⚠️ Distance kbira bzaf (>10km)'}`,
          timestamp: new Date(),
          options: ['🗺️ Verify on Map', '📊 View Location Analytics'],
        },
      ]);
    } catch (error: any) {
      setLocationLoading(false);

      // ERROR VIBRATION
      triggerCustomHaptic([50, 50, 50]); // Warning buzz

      const errorMsg = `❌ Ma9dertch n9ad location dyalek.\n\n${error.message || 'Unknown error'}\n\n💡 Bash t7el l mochkil:\n1️⃣ Verifi GPS f téléphone dyalek\n2️⃣ Khroj l berra (open area)\n3️⃣ 3awd tsawl\n\n📊 Chof analytics bach tfhem l mochkil`;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMsg,
          timestamp: new Date(),
          options: ['🔄 3awd tsift location', '📊 View Location Analytics'],
        },
      ]);
    }
  };

  const handleMapConfirm = (lat: number, lng: number) => {
    // Update location with confirmed coordinates
    const newLoc = { lat, lng };
    setClientLocation(newLoc);
    setPickerLocation(newLoc);

    // Recalculate distance
    const dist = calculateDistance(lat, lng, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng);
    setDistance(dist);

    const tier = getDeliveryTier(dist);

    // Update bot state
    setBotState((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        clientLocation: newLoc,
        distance: dist,
        deliveryDistance: tier || prev.customer.deliveryDistance,
      },
    }));

    setShowMapPicker(false);
    triggerCustomHaptic([20, 50]); // Confirm haptic

    // Send confirmation message
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `✅ Location updated!\n\n📍 New GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}\n📏 New Distance: ${dist} km\n💰 Fee: ${tier ? (tier === '0-2km' ? '5 DH' : tier === '3-5km' ? '10 DH' : '15 DH') : 'N/A'}`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Smart Suggestion Popup */}
      <SuggestionPopup
        suggestion={currentSuggestion}
        isVisible={showSuggestion}
        onClose={() => {
          setShowSuggestion(false);
          setCurrentSuggestion(null);
        }}
        onAccept={(item) => {
          setShowSuggestion(false);
          setCurrentSuggestion(null);
          sendMessage(item);
        }}
      />

      {/* Floating Chat Button */}
      {!isCartOpen && (
        <button
          onClick={() => handleToggle(!isChatOpen)}
          className={`fixed bottom-6 left-6 z-50 w-16 h-16 bg-gradient-to-br ${theme.primaryGlass} backdrop-blur-sm border border-white/30 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group`}
          aria-label="فتح الشات"
        >
          {isChatOpen ? (
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <div className="relative">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span
                className={`absolute -top-1 -right-1 w-3 h-3 ${theme.pulse} rounded-full animate-pulse`}
              ></span>
            </div>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div
          className={`fixed bottom-24 left-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] ${theme.glass} rounded-2xl flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${theme.primaryGlass} backdrop-blur-md p-4 text-white border-b border-white/20`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-bold text-xl text-white tracking-wide">SnipTaste</h3>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-300 font-bold text-sm animate-pulse">
                    Merhba bik!
                  </span>
                  <img src="/logo.png" alt="Snip" className="w-5 h-5 inline-block animate-bounce" />
                </div>
              </div>
              <button
                onClick={clearChat}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                title="Clear Chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-snip-bg bg-wood-pattern chat-scroll">
            {messages.map((message, index) => {
              const waLinkMatch = message.content.match(/(https:\/\/wa\.me\/[^\s]+)/);
              const waLink = waLinkMatch ? waLinkMatch[0] : null;
              const displayText = waLink ? message.content.replace(waLink, '') : message.content;

              return (
                <div
                  key={index}
                  className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? `bg-gradient-to-br ${theme.primary} text-white`
                        : 'bg-white border border-gray-100 text-gray-800'
                    } msg-enter`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {displayText.split('{{LOGO}}').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <img
                              src="/logo.png"
                              alt="Snip"
                              className="inline-block w-5 h-5 mx-1 align-middle"
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </p>

                    {/* Display Image if present (CIH QR) */}
                    {message.imageUrl && (
                      <div className="mt-3 bg-white rounded-lg p-1">
                        <img
                          src={message.imageUrl}
                          alt="Bot Attachment"
                          className="w-full h-auto rounded-lg max-w-[200px] cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setZoomedImage(message.imageUrl!)}
                          title="Click to zoom"
                        />
                        <p className="text-xs text-center text-gray-500 mt-1">
                          👆 Click pour agrandir
                        </p>
                      </div>
                    )}

                    {/* WhatsApp button - show for all payments */}
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-4 rounded-xl font-bold transition-all shadow-md active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Commander par WhatsApp
                      </a>
                    )}

                    {/* Visual Menu Section - Same as Main App */}
                    {message.menuSection && (
                      <div className="mt-4 w-full -mx-4">
                        <MenuSection
                          section={message.menuSection}
                          compact={true} // Chatbot-optimized compact mode
                          onItemClick={(item, section) => {
                            // Clear the menu section from bot state before processing
                            setBotState((prev) => ({ ...prev, menuSection: undefined }));

                            // Handle item click - send formatted message
                            if (section.type === 'dual-price' && item.prices) {
                              // For dual-price items, send just the item name
                              // The bot will ask for size
                              sendMessage(item.name);
                            } else {
                              // For standard items, send just the item name
                              // The bot will ask for quantity
                              sendMessage(item.name);
                            }
                          }}
                        />
                      </div>
                    )}

                    <p
                      className={`text-[10px] mt-2 text-right ${
                        message.role === 'user' ? theme.lightText : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </p>
                  </div>

                  {/* Options Buttons */}
                  {message.role === 'assistant' &&
                    message.options &&
                    message.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">
                        {message.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              // Vibrate on option click
                              haptics.buttonClick();
                              // Check if this is the analytics dashboard button
                              if (option.includes('View Location Analytics')) {
                                setShowAnalyticsDashboard(true);
                              }
                              // Check if this is the map verification button
                              else if (option.includes('Verify on Map')) {
                                setShowMapPicker(true);
                              }
                              // Check if this is the retry location button
                              else if (option.includes('3awd tsift location')) {
                                handleLocationShare();
                              } else {
                                sendMessage(option);
                              }
                            }}
                            disabled={isLoading}
                            className={`bg-white/80 backdrop-blur-sm border text-sm ${theme.optionBorder} ${theme.optionText} px-4 py-2 rounded-full ${theme.optionHoverBg} ${theme.optionHoverBorder} transition-all shadow-sm active:scale-95 disabled:opacity-50`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full dot-breathing"></div>
                    <div
                      className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full dot-breathing"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full dot-breathing"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="كتب هنا (pizza, tacos, ...)"
                className={`flex-1 px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 ${theme.ring} focus:bg-white/60 focus:border-transparent transition-all`}
                disabled={isLoading}
              />
              {/* Voice Input Button */}
              <button
                onClick={handleVoiceInput}
                disabled={isLoading || isListening}
                className={`bg-gradient-to-br ${isListening ? 'from-red-500 to-red-600' : theme.primaryGlass} backdrop-blur-sm border border-white/30 text-white px-4 py-3 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px] min-h-[48px] shadow-lg ${isListening ? 'animate-pulse' : ''}`}
                aria-label="Voice Input"
                title={isListening ? 'Listening...' : 'Click to speak'}
              >
                {isListening ? (
                  <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowLocationModal(true)}
                disabled={locationLoading}
                className={`bg-gradient-to-br ${theme.primaryGlass} backdrop-blur-sm border border-white/30 text-white px-4 py-3 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px] min-h-[48px] shadow-lg`}
                aria-label="شارك الموقع"
                title="شارك الموقع"
              >
                {locationLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close zoom"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed QR Code"
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-4 text-sm">
              Scannez ce QR code pour payer via CIH Bank
            </p>
          </div>
        </div>
      )}

      {/* Location Permission Modal - Friendly & Easy */}
      {showLocationModal &&
        (() => {
          // Detect device type
          const userAgent = navigator.userAgent.toLowerCase();
          const isIOS = /iphone|ipad|ipod/.test(userAgent);
          const isAndroid = /android/.test(userAgent);

          return (
            <div
              className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4"
              onClick={() => setShowLocationModal(false)}
            >
              <div
                className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Device Icon */}
                <div
                  className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${theme.primary} rounded-full flex items-center justify-center`}
                >
                  {isIOS ? (
                    <span className="text-4xl">🍎</span>
                  ) : isAndroid ? (
                    <span className="text-4xl">🤖</span>
                  ) : (
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </div>

                {/* Title with device name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  📍 Partager ma position
                  {isIOS && (
                    <span className="text-sm font-normal text-gray-500 block">iPhone/iPad</span>
                  )}
                  {isAndroid && (
                    <span className="text-sm font-normal text-gray-500 block">Android</span>
                  )}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm">
                  Bghina n3rfo fin nta bach n7sbo frais livraison dyalek
                </p>

                {/* Device-specific Instructions */}
                <div className={`${theme.lightBg} rounded-xl p-4 mb-4 text-left`}>
                  {isIOS ? (
                    <>
                      <p className={`${theme.darkText} text-sm font-medium mb-2`}>
                        📱 iPhone/iPad:
                      </p>
                      <p className={`${theme.mediumText} text-sm`}>
                        Ghadi yban lik popup, klik 3la <strong>"Autoriser"</strong>
                      </p>
                    </>
                  ) : isAndroid ? (
                    <>
                      <p className={`${theme.darkText} text-sm font-medium mb-2`}>🤖 Android:</p>
                      <p className={`${theme.mediumText} text-sm`}>
                        Ghadi yban lik popup, klik 3la <strong>"Allow"</strong> aw{' '}
                        <strong>"Autoriser"</strong>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`${theme.darkText} text-sm font-medium mb-2`}>
                        ⚠️ Ghadi yban lik popup:
                      </p>
                      <p className={`${theme.mediumText} text-sm`}>
                        👆 Klik 3la <strong>"Autoriser"</strong> aw <strong>"Allow"</strong>
                      </p>
                    </>
                  )}
                </div>

                {/* Main Button */}
                <button
                  onClick={() => {
                    setShowLocationModal(false);
                    handleLocationShare();
                  }}
                  className={`w-full bg-gradient-to-r ${theme.primaryGlass} backdrop-blur-md border border-white/30 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform active:scale-95 mb-3`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Localisation Dyali
                  </span>
                </button>

                {/* Cancel Button */}
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
                >
                  Annuler
                </button>
              </div>
            </div>
          );
        })()}

      {/* Location Analytics Dashboard */}
      <LocationAnalyticsDashboard
        isOpen={showAnalyticsDashboard}
        onClose={() => setShowAnalyticsDashboard(false)}
      />
      {/* Location Map Picker */}
      <LocationMapPicker
        key={`${pickerLocation?.lat || RESTAURANT_COORDS.lat}-${pickerLocation?.lng || RESTAURANT_COORDS.lng}`}
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onConfirm={handleMapConfirm}
        initialLat={pickerLocation?.lat || RESTAURANT_COORDS.lat}
        initialLng={pickerLocation?.lng || RESTAURANT_COORDS.lng}
      />
    </>
  );
};

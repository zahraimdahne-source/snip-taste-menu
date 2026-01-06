import React, { useState, useEffect } from 'react';

const staticText = 'Menu';
const words = ['بنين', 'طري', 'واعر', 'ديال الدار', 'خطير', 'Snip Taste'];

const TypingTitle: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(
        isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500); // Pause at end
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <div className="relative mt-0 flex flex-col items-center gap-6">
      {/* Fixed "MENU" Text - Bigger and Centered */}
      <div>
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-hand text-snip-orange menu-shadow text-center">
          MENU
        </h1>
      </div>

      {/* Dynamic Typing Text Below - Professional and Centered */}
      <div className="relative min-h-[80px] flex items-center justify-center">
        <span className="text-6xl md:text-7xl lg:text-8xl font-arabic font-bold text-black text-center block relative px-4 typing-title-glow">
          {text}
          {/* Hand-drawn style underlines */}
          {text && (
            <svg
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-full h-4 pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 200 10"
            >
              {/* First underline - wavy */}
              <path
                d="M 0 3 Q 50 1, 100 3 T 200 3"
                stroke="#FF6B35"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Second underline - slightly offset and wavy */}
              <path
                d="M 0 6 Q 50 8, 100 6 T 200 6"
                stroke="#FF6B35"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default TypingTitle;

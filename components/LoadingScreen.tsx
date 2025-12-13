import React from 'react';

interface LoadingScreenProps {
  onLogoClick: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLogoClick }) => {
  return (
    <div className="loading-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Bungee&family=Reem+Kufi+Fun:wght@400;700&family=Bebas+Neue&family=Satisfy&display=swap');

          .loading-screen {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #F4F1EA 0%, #E8E5DC 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }

          .loading-text-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: center;
            align-items: center;
            font-family: 'Bungee', cursive;
            font-size: 52px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 3px;
            padding: 0 20px;
            max-width: 100%;
          }

          .loading-text-line {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
            align-items: center;
          }

          .loading-word {
            display: inline-block;
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            color: #1A1A1A;
            position: relative;
          }

          .loading-word.snip {
            color: #FFD700;
            font-family: 'Satisfy', cursive;
            font-size: 75px;
            font-weight: 700;
            text-transform: none;
            text-shadow:
              0 3px 0 rgba(0, 0, 0, 1),
              0 6px 0 rgba(0, 0, 0, 0.9),
              0 9px 0 rgba(0, 0, 0, 0.8),
              0 12px 0 rgba(0, 0, 0, 0.7),
              0 15px 0 rgba(0, 0, 0, 0.6);
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          .loading-word.jak {
            color: #FF0000;
            font-family: 'Bungee', cursive;
            font-size: 52px;
            font-weight: 400;
            position: relative;
            -webkit-text-stroke: 1.5px #990000;
            text-stroke: 1.5px #990000;
            text-shadow:
              0 0 8px rgba(255, 0, 0, 0.3),
              0 3px 6px rgba(0, 0, 0, 0.3);
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          /* First underline for Jak - Hand-drawn style */
          .loading-word.jak::before {
            content: '';
            position: absolute;
            bottom: -6px;
            left: -5%;
            width: 110%;
            height: 8px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 10'%3E%3Cpath d='M 2,5 Q 20,3 40,5 T 80,5 Q 120,6 160,5 T 198,5' fill='none' stroke='%23FF0000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='200' stroke-dashoffset='200'%3E%3Canimate attributeName='stroke-dashoffset' from='200' to='0' dur='0.8s' begin='0.4s' fill='freeze' /%3E%3C/path%3E%3C/svg%3E");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            animation:
              sketchAppear 0.8s 0.4s forwards,
              sketchGlow 2s ease-in-out 1.2s infinite;
            opacity: 0;
            filter: drop-shadow(0 1px 2px rgba(255, 0, 0, 0.3));
          }

          /* Second underline for Jak - Hand-drawn style */
          .loading-word.jak::after {
            content: '';
            position: absolute;
            bottom: -12px;
            left: -5%;
            width: 110%;
            height: 8px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 10'%3E%3Cpath d='M 198,5 Q 180,6 160,5 T 120,5 Q 80,4 40,5 T 2,5' fill='none' stroke='%23FF0000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='200' stroke-dashoffset='200'%3E%3Canimate attributeName='stroke-dashoffset' from='200' to='0' dur='0.8s' begin='0.8s' fill='freeze' /%3E%3C/path%3E%3C/svg%3E");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            animation:
              sketchAppear 0.8s 0.8s forwards,
              sketchGlow 2s ease-in-out 1.6s infinite;
            opacity: 0;
            filter: drop-shadow(0 1px 2px rgba(255, 0, 0, 0.3));
          }

          @keyframes sketchAppear {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 0.9;
            }
          }

          @keyframes sketchGlow {
            0%, 100% {
              opacity: 0.9;
              filter: drop-shadow(0 1px 2px rgba(255, 0, 0, 0.3));
            }
            50% {
              opacity: 0.75;
              filter: drop-shadow(0 2px 6px rgba(255, 0, 0, 0.6)) drop-shadow(0 0 12px rgba(255, 0, 0, 0.5));
            }
          }

          .loading-word.ysakket {
            color: #FFD700;
            font-family: 'Reem Kufi Fun', sans-serif;
            font-weight: 700;
            font-size: 85px;
            -webkit-text-stroke: 1.5px #B8860B;
            text-stroke: 1.5px #B8860B;
            text-shadow:
              0 0 6px rgba(255, 215, 0, 0.2),
              0 3px 5px rgba(0, 0, 0, 0.3);
            animation:
              bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55),
              arabicGlow 2.5s ease-in-out 1s infinite;
          }


          @keyframes arabicGlow {
            0%, 100% {
              text-shadow:
                0 0 6px rgba(255, 215, 0, 0.2),
                0 3px 5px rgba(0, 0, 0, 0.3);
              -webkit-text-stroke: 1.5px #B8860B;
            }
            50% {
              text-shadow:
                0 0 20px rgba(255, 215, 0, 0.6),
                0 0 40px rgba(255, 215, 0, 0.4),
                0 5px 10px rgba(0, 0, 0, 0.4);
              -webkit-text-stroke: 2px #CC9900;
            }
          }

          .loading-word.jooooo3 {
            color: #1A1A1A;
            position: relative;
            font-weight: 900;
          }

          /* First circle */
          .loading-word.jooooo3::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 115%;
            height: 125%;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'%3E%3Cpath d='M 8,38 Q 4,18 28,12 T 98,8 Q 168,6 192,22 T 196,38 Q 199,56 172,66 T 102,72 Q 32,74 8,56 T 6,38' fill='none' stroke='%23FF0000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='450' stroke-dashoffset='450'%3E%3Canimate attributeName='stroke-dashoffset' from='450' to='0' dur='0.7s' begin='0.3s' fill='freeze' /%3E%3C/path%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            pointer-events: none;
            z-index: -1;
            animation: circleAppear 0.7s 0.3s forwards, circleShimmer 2.5s ease-in-out 1.2s infinite;
            opacity: 0;
          }

          /* Second circle (slightly offset) */
          .loading-word.jooooo3::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-2deg);
            width: 118%;
            height: 128%;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'%3E%3Cpath d='M 10,42 Q 6,22 32,16 T 100,12 Q 170,10 194,26 T 198,42 Q 200,58 174,68 T 104,74 Q 34,76 10,58 T 8,42' fill='none' stroke='%23FF0000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='460' stroke-dashoffset='460'%3E%3Canimate attributeName='stroke-dashoffset' from='460' to='0' dur='0.7s' begin='0.6s' fill='freeze' /%3E%3C/path%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            pointer-events: none;
            z-index: -1;
            animation: circleAppear 0.7s 0.6s forwards, circleShimmer 2.5s ease-in-out 1.5s infinite;
            opacity: 0;
          }

          @keyframes circleAppear {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 0.85;
            }
          }

          @keyframes circleShimmer {
            0%, 100% {
              opacity: 0.85;
              filter: drop-shadow(0 2px 3px rgba(255, 0, 0, 0.25));
            }
            50% {
              opacity: 0.7;
              filter: drop-shadow(0 3px 5px rgba(255, 0, 0, 0.4)) drop-shadow(0 0 8px rgba(255, 0, 0, 0.3));
            }
          }

          .loading-word:nth-child(1) { animation-delay: 0s; }
          .loading-word:nth-child(2) { animation-delay: 0.1s; }
          .loading-word:nth-child(3) { animation-delay: 0.2s; }
          .loading-word:nth-child(4) { animation-delay: 0.3s; }
          .loading-word:nth-child(5) { animation-delay: 0.4s; }
          .loading-word:nth-child(6) { animation-delay: 0.5s; }
          .loading-word:nth-child(7) { animation-delay: 0.6s; }

          @keyframes bounceIn {
            0% {
              transform: scale(0) rotate(-180deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.2) rotate(10deg);
            }
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }

          /* Clickable Logo */
          .clickable-logo-container {
            margin-top: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            animation: fadeInUp 0.8s ease-out 1s backwards;
          }

          .clickable-logo {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            animation: logoPulse 2s ease-in-out infinite;
          }

          .clickable-logo:hover {
            transform: scale(1.1);
            box-shadow: 0 15px 50px rgba(255, 215, 0, 0.4);
          }

          .clickable-logo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .click-text {
            font-family: 'Righteous', cursive;
            font-size: 24px;
            color: #1A1A1A;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            animation: bounce 1.5s ease-in-out infinite;
          }

          @keyframes logoPulse {
            0%, 100% {
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            }
            50% {
              box-shadow: 0 15px 50px rgba(255, 215, 0, 0.3);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .loading-text-container {
              font-size: 32px;
              gap: 8px;
              max-width: 95%;
            }

            .loading-word.jak {
              font-size: 32px;
            }

            .loading-word.snip {
              font-size: 48px;
            }

            .loading-word.ysakket {
              font-size: 32px;
            }

            .loading-word.jooooo3 {
              font-size: 32px;
            }

            .clickable-logo {
              width: 160px;
              height: 160px;
            }

            .click-text {
              font-size: 20px;
            }
          }

          @media (max-width: 480px) {
            .loading-text-container {
              font-size: 24px;
              gap: 6px;
              letter-spacing: 1px;
              max-width: 98%;
            }

            .loading-word.jak {
              font-size: 24px;
            }

            .loading-word.snip {
              font-size: 38px;
            }

            .loading-word.ysakket {
              font-size: 24px;
            }

            .loading-word.jooooo3 {
              font-size: 24px;
            }

            .clickable-logo {
              width: 140px;
              height: 140px;
            }

            .click-text {
              font-size: 18px;
            }
          }
        `}
      </style>

      <div className="loading-text-container">
        <div className="loading-text-line">
          <span className="loading-word jak">Jak</span>
          <span className="loading-word jooooo3">JOOOOO3</span>
          <span className="loading-word">?</span>
        </div>
        <div className="loading-text-line">
          <span className="loading-word snip">Snip</span>
          <span className="loading-word ysakket">يسكّت</span>
          <span className="loading-word jooooo3">JOOOOO3</span>
          <span className="loading-word">!</span>
        </div>
      </div>

      <div className="clickable-logo-container" onClick={onLogoClick}>
        <div className="clickable-logo">
          <img src="/logo fire.gif" alt="Snip Taste Logo" />
        </div>
        <div className="click-text">Cliquer</div>
      </div>
    </div>
  );
};

export default LoadingScreen;

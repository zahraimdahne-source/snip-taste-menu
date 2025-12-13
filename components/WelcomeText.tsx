import React from 'react';

const WelcomeText: React.FC = () => {
  return (
    <div className="welcome-3d-container">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@900&display=swap');

          .welcome-3d-container {
            position: relative;
            width: 100%;
            height: 280px;
            display: flex;
            justify-content: center;
            align-items: center;
            perspective: 1000px;
            margin: 2rem 0;
            overflow: visible;
          }

          /* BOLD VISIBLE FIRE BACKGROUND */
          .fire-background {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 400px;
            z-index: 10;
            pointer-events: none;
          }

          .fire-particle {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 100%;
            background:
              radial-gradient(
                ellipse 200px 150px at 50% 100%,
                #ff4500 0%,
                #ff6b00 20%,
                #ff8c00 40%,
                #ffa500 60%,
                transparent 100%
              );
            animation: fireFlicker 2s ease-in-out infinite;
          }

          .fire-particle:nth-child(1) {
            animation-delay: 0s;
            opacity: 0.9;
          }

          .fire-particle:nth-child(2) {
            animation-delay: 0.4s;
            opacity: 0.8;
            width: 70%;
          }

          .fire-particle:nth-child(3) {
            animation-delay: 0.8s;
            opacity: 0.7;
            width: 85%;
          }

          .fire-particle:nth-child(4) {
            animation-delay: 1.2s;
            opacity: 0.75;
            width: 75%;
          }

          @keyframes fireFlicker {
            0% {
              transform: translateX(-50%) translateY(0) scaleY(1);
            }
            25% {
              transform: translateX(-48%) translateY(-50px) scaleY(1.2);
            }
            50% {
              transform: translateX(-52%) translateY(-100px) scaleY(1.4);
            }
            75% {
              transform: translateX(-50%) translateY(-150px) scaleY(1.3);
            }
            100% {
              transform: translateX(-50%) translateY(-200px) scaleY(1.1);
              opacity: 0;
            }
          }

          .rotating-box {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            animation: rotate3d 12s linear infinite;
            z-index: 5;
          }

          @keyframes rotate3d {
            0% {
              transform: rotateY(0deg);
            }
            100% {
              transform: rotateY(360deg);
            }
          }

          .text-face {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            font-family: 'Poppins', sans-serif;
            font-weight: 900;
            font-size: 80px;
            line-height: 1.1;
            text-transform: uppercase;
            letter-spacing: 4px;
            backface-visibility: visible;
            transform-style: preserve-3d;
          }

          /* Position each face around the cylinder */
          .text-face:nth-child(1) {
            transform: rotateY(0deg) translateZ(450px);
          }

          .text-face:nth-child(2) {
            transform: rotateY(60deg) translateZ(450px);
          }

          .text-face:nth-child(3) {
            transform: rotateY(120deg) translateZ(450px);
          }

          .text-face:nth-child(4) {
            transform: rotateY(180deg) translateZ(450px);
          }

          .text-face:nth-child(5) {
            transform: rotateY(240deg) translateZ(450px);
          }

          .text-face:nth-child(6) {
            transform: rotateY(300deg) translateZ(450px);
          }

          /* Solid colors - Black & Yellow */
          .word-merhba {
            color: #1A1A1A;
            text-shadow:
              0 0 10px rgba(0, 0, 0, 0.3),
              0 4px 8px rgba(0, 0, 0, 0.2);
            animation: pulseGlow1 3s ease-in-out infinite;
          }

          .word-bikom {
            color: #FFD700;
            -webkit-text-stroke: 2px #1A1A1A;
            text-stroke: 2px #1A1A1A;
            paint-order: stroke fill;
            text-shadow:
              0 0 20px rgba(255, 215, 0, 0.8),
              0 0 40px rgba(255, 215, 0, 0.6),
              0 4px 8px rgba(255, 215, 0, 0.4);
            animation: pulseGlow2 3s ease-in-out infinite 0.5s;
          }

          /* Logo styling */
          .logo-container {
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: logoFloat 2s ease-in-out infinite;
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
          }

          .logo-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            animation: logoPulse 3s ease-in-out infinite;
          }

          @keyframes logoFloat {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-5px) scale(1.05);
            }
          }

          @keyframes logoPulse {
            0%, 100% {
              filter: brightness(1);
            }
            50% {
              filter: brightness(1.2);
            }
          }

          @keyframes pulseGlow1 {
            0%, 100% {
              text-shadow:
                0 0 10px rgba(0, 0, 0, 0.3),
                0 4px 8px rgba(0, 0, 0, 0.2);
            }
            50% {
              text-shadow:
                0 0 15px rgba(0, 0, 0, 0.4),
                0 4px 12px rgba(0, 0, 0, 0.3);
            }
          }

          @keyframes pulseGlow2 {
            0%, 100% {
              text-shadow:
                0 0 20px rgba(255, 215, 0, 0.8),
                0 0 40px rgba(255, 215, 0, 0.6),
                0 4px 8px rgba(255, 215, 0, 0.4);
            }
            50% {
              text-shadow:
                0 0 30px rgba(255, 215, 0, 1),
                0 0 60px rgba(255, 215, 0, 0.8),
                0 4px 12px rgba(255, 215, 0, 0.6);
            }
          }

          /* Ambient glow background - Orange/Red for visibility */
          .welcome-3d-container::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 300px;
            background: radial-gradient(ellipse, rgba(255, 100, 0, 0.35) 0%, rgba(255, 140, 0, 0.15) 50%, transparent 70%);
            filter: blur(50px);
            animation: ambientPulse 4s ease-in-out infinite;
            z-index: -1;
          }

          @keyframes ambientPulse {
            0%, 100% {
              opacity: 0.5;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.8;
              transform: translate(-50%, -50%) scale(1.1);
            }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .welcome-3d-container {
              height: 220px;
              perspective: 800px;
            }

            .fire-background {
              width: 300px;
              height: 250px;
            }

            .text-face {
              font-size: 56px;
              letter-spacing: 2px;
              gap: 8px;
            }

            .logo-container {
              width: 90px;
              height: 90px;
            }

            .text-face:nth-child(1),
            .text-face:nth-child(2),
            .text-face:nth-child(3),
            .text-face:nth-child(4),
            .text-face:nth-child(5),
            .text-face:nth-child(6) {
              transform: rotateY(calc(var(--rotation, 0) * 1deg)) translateZ(350px);
            }

            .text-face:nth-child(1) { --rotation: 0; }
            .text-face:nth-child(2) { --rotation: 60; }
            .text-face:nth-child(3) { --rotation: 120; }
            .text-face:nth-child(4) { --rotation: 180; }
            .text-face:nth-child(5) { --rotation: 240; }
            .text-face:nth-child(6) { --rotation: 300; }
          }

          @media (max-width: 480px) {
            .welcome-3d-container {
              height: 180px;
              perspective: 600px;
            }

            .fire-background {
              width: 250px;
              height: 200px;
            }

            .text-face {
              font-size: 40px;
              letter-spacing: 1px;
              gap: 5px;
            }

            .logo-container {
              width: 70px;
              height: 70px;
            }

            .text-face:nth-child(1),
            .text-face:nth-child(2),
            .text-face:nth-child(3),
            .text-face:nth-child(4),
            .text-face:nth-child(5),
            .text-face:nth-child(6) {
              transform: rotateY(calc(var(--rotation, 0) * 1deg)) translateZ(250px);
            }
          }
        `}
      </style>

      {/* Transparent Fire Background */}
      <div className="fire-background">
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
      </div>

      <div className="rotating-box">
        {/* Create 6 faces of the rotating cylinder */}
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="text-face">
            <div className="word-merhba">Merhba</div>
            <div className="logo-container">
              <img src="/logo fire.gif" alt="Snip Taste" />
            </div>
            <div className="word-bikom">Bikom</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeText;

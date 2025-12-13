import React from 'react';

const FireEffect: React.FC = () => {
  return (
    <div className="fire-effect-container">
      <style>
        {`
          .fire-effect-container {
            position: relative;
            width: 100%;
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            overflow: hidden;
            margin: 3rem 0;
          }

          .fire-background {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 800px;
            height: 350px;
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
                ellipse 250px 180px at 50% 100%,
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

          .fire-particle:nth-child(5) {
            animation-delay: 1.6s;
            opacity: 0.85;
            width: 78%;
          }

          .fire-particle:nth-child(6) {
            animation-delay: 2s;
            opacity: 0.72;
            width: 82%;
          }

          @keyframes fireFlicker {
            0% {
              transform: translateX(-50%) translateY(0) scaleY(1);
            }
            25% {
              transform: translateX(-48%) translateY(-60px) scaleY(1.2);
            }
            50% {
              transform: translateX(-52%) translateY(-120px) scaleY(1.4);
            }
            75% {
              transform: translateX(-50%) translateY(-180px) scaleY(1.3);
            }
            100% {
              transform: translateX(-50%) translateY(-250px) scaleY(1.1);
              opacity: 0;
            }
          }

          /* Glow effect at the base */
          .fire-effect-container::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 150px;
            background: radial-gradient(
              ellipse at center,
              rgba(255, 100, 0, 0.4) 0%,
              rgba(255, 140, 0, 0.2) 50%,
              transparent 100%
            );
            filter: blur(30px);
            z-index: -1;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .fire-effect-container {
              height: 250px;
            }

            .fire-background {
              width: 600px;
              height: 300px;
            }
          }

          @media (max-width: 480px) {
            .fire-effect-container {
              height: 200px;
            }

            .fire-background {
              width: 400px;
              height: 250px;
            }
          }
        `}
      </style>

      <div className="fire-background">
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
      </div>
    </div>
  );
};

export default FireEffect;

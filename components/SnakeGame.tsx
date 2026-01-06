import React, { useState, useEffect, useCallback, useRef } from 'react';
import { triggerCustomHaptic } from '../utils/haptics';
import '../src/styles/SnakeGame.css';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  isOpen: boolean;
  onClose: () => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

const SnakeGame: React.FC<SnakeGameProps> = ({ isOpen, onClose }) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Position>(INITIAL_DIRECTION);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  // Check collision
  const checkCollision = (head: Position, snakeBody: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return snakeBody.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  // Game loop
  useEffect(() => {
    if (!isOpen || gameOver || isPaused || !gameStarted) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision
        if (checkCollision(newHead, prevSnake)) {
          setGameOver(true);
          triggerCustomHaptic([50, 50, 50, 100, 50, 50, 50]); // Game over vibration
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood());
          triggerCustomHaptic([15, 50, 25]); // Eat food vibration (same as add to cart!)
          return newSnake; // Don't remove tail (snake grows)
        }

        // Remove tail
        newSnake.pop();
        return newSnake;
      });
    }, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isOpen, gameOver, isPaused, gameStarted, food, generateFood, highScore]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen || gameOver) return;

      let newDirection: Position | null = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault(); // Prevent page scroll
          if (directionRef.current.y === 0) newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault(); // Prevent page scroll
          if (directionRef.current.y === 0) newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault(); // Prevent page scroll
          if (directionRef.current.x === 0) newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault(); // Prevent page scroll
          if (directionRef.current.x === 0) newDirection = { x: 1, y: 0 };
          break;
        case ' ':
          e.preventDefault(); // Prevent page scroll
          setIsPaused((prev) => !prev);
          triggerCustomHaptic([10]); // Pause vibration
          break;
      }

      if (newDirection) {
        directionRef.current = newDirection;
        setDirection(newDirection);
        triggerCustomHaptic([5]); // Direction change vibration
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, gameOver]);

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState<Position | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    let newDirection: Position | null = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 30 && directionRef.current.x === 0) {
        newDirection = { x: 1, y: 0 }; // Right
      } else if (deltaX < -30 && directionRef.current.x === 0) {
        newDirection = { x: -1, y: 0 }; // Left
      }
    } else {
      // Vertical swipe
      if (deltaY > 30 && directionRef.current.y === 0) {
        newDirection = { x: 0, y: 1 }; // Down
      } else if (deltaY < -30 && directionRef.current.y === 0) {
        newDirection = { x: 0, y: -1 }; // Up
      }
    }

    if (newDirection) {
      directionRef.current = newDirection;
      setDirection(newDirection);
      triggerCustomHaptic([5]); // Direction change vibration
    }

    setTouchStart(null);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood({ x: 15, y: 15 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
    triggerCustomHaptic([15, 50, 20]); // Restart vibration
  };

  const startGame = () => {
    setGameStarted(true);
    triggerCustomHaptic([20, 100, 20, 100, 40]); // Start game celebration
  };

  // Get rotation angle based on direction
  const getHeadRotation = () => {
    if (direction.x === 1) return 0; // Right
    if (direction.x === -1) return 180; // Left
    if (direction.y === 1) return 90; // Down
    if (direction.y === -1) return -90; // Up
    return 0;
  };

  if (!isOpen) return null;

  return (
    <div className="snake-game-overlay">
      <div className="snake-game-container">
        {/* Header */}
        <div className="snake-header">
          <div className="snake-title">
            <h2>لعبة الحنش ديال سنيب تايست</h2>
          </div>
          <button
            className="snake-close-btn"
            onClick={() => {
              triggerCustomHaptic([20, 30, 15]);
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        {/* Score */}
        <div className="snake-score">
          <div className="score-item">
            <span className="score-label">النقاط:</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-item">
            <span className="score-label">أحسن نقاط:</span>
            <span className="score-value high">{highScore}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="snake-board" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {/* Snake Body */}
          {snake.map((segment, index) => {
            if (index === 0) {
              // Snake Head with Logo
              return (
                <div
                  key={index}
                  className="snake-head"
                  style={{
                    left: `${segment.x * CELL_SIZE}px`,
                    top: `${segment.y * CELL_SIZE}px`,
                    transform: `rotate(${getHeadRotation()}deg)`,
                  }}
                >
                  <img src="/logo.png" alt="Snip" />
                </div>
              );
            } else {
              // Snake Body
              return (
                <div
                  key={index}
                  className="snake-segment"
                  style={{
                    left: `${segment.x * CELL_SIZE}px`,
                    top: `${segment.y * CELL_SIZE}px`,
                  }}
                />
              );
            }
          })}

          {/* Food */}
          <div
            className="snake-food"
            style={{
              left: `${food.x * CELL_SIZE}px`,
              top: `${food.y * CELL_SIZE}px`,
            }}
          >
            🍕
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h3>خسرتي! 💀</h3>
                <p className="final-score">النقاط: {score}</p>
                {score === highScore && score > 0 && (
                  <p className="new-record">🎉 رقم قياسي جديد! 🎉</p>
                )}
                <button className="restart-btn" onClick={resetGame}>
                  عاود اللعب
                </button>
              </div>
            </div>
          )}

          {/* Start Screen */}
          {!gameStarted && !gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h3>🐍 لعبة الحنش 🐍</h3>
                <p className="final-score">أحسن نقاط: {highScore}</p>
                <button className="restart-btn" onClick={startGame}>
                  ابدا اللعب
                </button>
              </div>
            </div>
          )}

          {/* Pause Overlay */}
          {isPaused && !gameOver && (
            <div className="pause-overlay">
              <h3>واقف ⏸️</h3>
              <p>دوز على SPACE باش تكمل</p>
            </div>
          )}
        </div>

        {/* Controls Info */}
        <div className="snake-controls">
          <div className="controls-section">
            <h4>الكومبيوتر:</h4>
            <p>الأسهم ولا WASD • SPACE باش توقف</p>
          </div>
          <div className="controls-section">
            <h4>التيليفون:</h4>
            <p>سويبي ولا استعمل الأزرار لتحت</p>
          </div>
        </div>

        {/* Mobile Control Buttons */}
        <div className="mobile-controls">
          <div className="control-row">
            <button
              className="control-btn"
              onClick={() => {
                if (directionRef.current.y === 0) {
                  directionRef.current = { x: 0, y: -1 };
                  setDirection({ x: 0, y: -1 });
                  triggerCustomHaptic([5]);
                }
              }}
            >
              ▲
            </button>
          </div>
          <div className="control-row">
            <button
              className="control-btn"
              onClick={() => {
                if (directionRef.current.x === 0) {
                  directionRef.current = { x: -1, y: 0 };
                  setDirection({ x: -1, y: 0 });
                  triggerCustomHaptic([5]);
                }
              }}
            >
              ◀
            </button>
            <button
              className="control-btn pause-btn"
              onClick={() => {
                setIsPaused((prev) => !prev);
                triggerCustomHaptic([10]);
              }}
            >
              {isPaused ? '▶' : '⏸'}
            </button>
            <button
              className="control-btn"
              onClick={() => {
                if (directionRef.current.x === 0) {
                  directionRef.current = { x: 1, y: 0 };
                  setDirection({ x: 1, y: 0 });
                  triggerCustomHaptic([5]);
                }
              }}
            >
              ▶
            </button>
          </div>
          <div className="control-row">
            <button
              className="control-btn"
              onClick={() => {
                if (directionRef.current.y === 0) {
                  directionRef.current = { x: 0, y: 1 };
                  setDirection({ x: 0, y: 1 });
                  triggerCustomHaptic([5]);
                }
              }}
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;

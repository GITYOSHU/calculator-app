"use client";

import { useState, useEffect } from "react";

// 固定のパーティクル位置（ハイドレーションエラー回避）
const particles = [
  { left: 5, top: 10, delay: 0.2, duration: 3.5 },
  { left: 15, top: 80, delay: 1.1, duration: 2.8 },
  { left: 25, top: 30, delay: 0.5, duration: 4.2 },
  { left: 35, top: 60, delay: 1.8, duration: 3.1 },
  { left: 45, top: 20, delay: 0.9, duration: 2.5 },
  { left: 55, top: 90, delay: 1.4, duration: 3.8 },
  { left: 65, top: 45, delay: 0.3, duration: 4.5 },
  { left: 75, top: 70, delay: 1.6, duration: 2.9 },
  { left: 85, top: 15, delay: 0.7, duration: 3.3 },
  { left: 95, top: 55, delay: 1.2, duration: 4.0 },
  { left: 10, top: 40, delay: 0.4, duration: 3.7 },
  { left: 30, top: 85, delay: 1.0, duration: 2.6 },
  { left: 50, top: 5, delay: 1.9, duration: 3.4 },
  { left: 70, top: 35, delay: 0.6, duration: 4.1 },
  { left: 90, top: 75, delay: 1.3, duration: 2.7 },
];

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (pressedButton) {
      const timer = setTimeout(() => setPressedButton(null), 100);
      return () => clearTimeout(timer);
    }
  }, [pressedButton]);

  const triggerAnimation = (buttonId: string) => {
    setIsAnimating(true);
    setPressedButton(buttonId);
  };

  const inputDigit = (digit: string) => {
    triggerAnimation(digit);
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    triggerAnimation(".");
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    triggerAnimation("AC");
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    triggerAnimation(nextOperator);
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string): number => {
    switch (op) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "*":
        return first * second;
      case "/":
        return second !== 0 ? first / second : 0;
      default:
        return second;
    }
  };

  const handleEquals = () => {
    if (operator === null || firstOperand === null) return;
    triggerAnimation("=");

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const toggleSign = () => {
    triggerAnimation("+/-");
    setDisplay(String(parseFloat(display) * -1));
  };

  const percentage = () => {
    triggerAnimation("%");
    setDisplay(String(parseFloat(display) / 100));
  };

  const Button = ({
    children,
    onClick,
    className = "",
    buttonId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    buttonId: string;
  }) => (
    <button
      onClick={onClick}
      className={`
        h-16 text-xl font-semibold rounded-xl
        transition-all duration-150 ease-out
        ${pressedButton === buttonId ? "scale-90 brightness-125" : "scale-100"}
        hover:scale-105 hover:brightness-110
        active:scale-90
        shadow-lg hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`
          bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl w-full max-w-xs
          border border-white/10
          transition-all duration-300
          ${isAnimating ? "scale-[1.02]" : "scale-100"}
          hover:shadow-purple-500/20 hover:shadow-3xl
        `}
      >
        {/* Display */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-4 mb-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div
            className={`
              text-right text-4xl font-light text-white truncate
              transition-all duration-150
              ${isAnimating ? "scale-110 text-amber-300" : "scale-100"}
            `}
          >
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Button
            onClick={clear}
            buttonId="AC"
            className="bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white"
          >
            AC
          </Button>
          <Button
            onClick={toggleSign}
            buttonId="+/-"
            className="bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
          >
            +/-
          </Button>
          <Button
            onClick={percentage}
            buttonId="%"
            className="bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
          >
            %
          </Button>
          <Button
            onClick={() => performOperation("/")}
            buttonId="/"
            className={`
              ${operator === "/"
                ? "bg-gradient-to-br from-amber-300 to-amber-400 ring-2 ring-amber-300"
                : "bg-gradient-to-br from-amber-500 to-amber-600"
              }
              hover:from-amber-400 hover:to-amber-500 text-white
            `}
          >
            ÷
          </Button>

          {["7", "8", "9"].map((num) => (
            <Button
              key={num}
              onClick={() => inputDigit(num)}
              buttonId={num}
              className="bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => performOperation("*")}
            buttonId="*"
            className={`
              ${operator === "*"
                ? "bg-gradient-to-br from-amber-300 to-amber-400 ring-2 ring-amber-300"
                : "bg-gradient-to-br from-amber-500 to-amber-600"
              }
              hover:from-amber-400 hover:to-amber-500 text-white
            `}
          >
            ×
          </Button>

          {["4", "5", "6"].map((num) => (
            <Button
              key={num}
              onClick={() => inputDigit(num)}
              buttonId={num}
              className="bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => performOperation("-")}
            buttonId="-"
            className={`
              ${operator === "-"
                ? "bg-gradient-to-br from-amber-300 to-amber-400 ring-2 ring-amber-300"
                : "bg-gradient-to-br from-amber-500 to-amber-600"
              }
              hover:from-amber-400 hover:to-amber-500 text-white
            `}
          >
            −
          </Button>

          {["1", "2", "3"].map((num) => (
            <Button
              key={num}
              onClick={() => inputDigit(num)}
              buttonId={num}
              className="bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => performOperation("+")}
            buttonId="+"
            className={`
              ${operator === "+"
                ? "bg-gradient-to-br from-amber-300 to-amber-400 ring-2 ring-amber-300"
                : "bg-gradient-to-br from-amber-500 to-amber-600"
              }
              hover:from-amber-400 hover:to-amber-500 text-white
            `}
          >
            +
          </Button>

          <Button
            onClick={() => inputDigit("0")}
            buttonId="0"
            className="col-span-2 bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            buttonId="."
            className="bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
          >
            .
          </Button>
          <Button
            onClick={handleEquals}
            buttonId="="
            className="bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white"
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
}

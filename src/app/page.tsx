"use client";

import { useState } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
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
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
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

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const Button = ({
    children,
    onClick,
    className = "",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`h-16 text-xl font-semibold rounded-xl transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl w-full max-w-xs">
        <div className="bg-slate-700 rounded-2xl p-4 mb-6">
          <div className="text-right text-4xl font-light text-white truncate">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Button
            onClick={clear}
            className="bg-rose-500 hover:bg-rose-400 text-white"
          >
            AC
          </Button>
          <Button
            onClick={() => setDisplay(String(parseFloat(display) * -1))}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            +/-
          </Button>
          <Button
            onClick={() => setDisplay(String(parseFloat(display) / 100))}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            %
          </Button>
          <Button
            onClick={() => performOperation("/")}
            className={`${
              operator === "/" ? "bg-amber-300" : "bg-amber-500"
            } hover:bg-amber-400 text-white`}
          >
            ÷
          </Button>

          <Button
            onClick={() => inputDigit("7")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            7
          </Button>
          <Button
            onClick={() => inputDigit("8")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            8
          </Button>
          <Button
            onClick={() => inputDigit("9")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            9
          </Button>
          <Button
            onClick={() => performOperation("*")}
            className={`${
              operator === "*" ? "bg-amber-300" : "bg-amber-500"
            } hover:bg-amber-400 text-white`}
          >
            ×
          </Button>

          <Button
            onClick={() => inputDigit("4")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            4
          </Button>
          <Button
            onClick={() => inputDigit("5")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            5
          </Button>
          <Button
            onClick={() => inputDigit("6")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            6
          </Button>
          <Button
            onClick={() => performOperation("-")}
            className={`${
              operator === "-" ? "bg-amber-300" : "bg-amber-500"
            } hover:bg-amber-400 text-white`}
          >
            −
          </Button>

          <Button
            onClick={() => inputDigit("1")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            1
          </Button>
          <Button
            onClick={() => inputDigit("2")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            2
          </Button>
          <Button
            onClick={() => inputDigit("3")}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            3
          </Button>
          <Button
            onClick={() => performOperation("+")}
            className={`${
              operator === "+" ? "bg-amber-300" : "bg-amber-500"
            } hover:bg-amber-400 text-white`}
          >
            +
          </Button>

          <Button
            onClick={() => inputDigit("0")}
            className="col-span-2 bg-slate-600 hover:bg-slate-500 text-white"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            className="bg-slate-600 hover:bg-slate-500 text-white"
          >
            .
          </Button>
          <Button
            onClick={handleEquals}
            className="bg-amber-500 hover:bg-amber-400 text-white"
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
}

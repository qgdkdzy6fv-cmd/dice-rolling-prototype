import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface CustomDieProps {
  onRoll: (value: number) => void;
  color?: string;
}

/**
 * CustomDie Component
 *
 * Allows users to select any number through:
 * 1. Direct text/number input
 * 2. Up/down arrow controls
 *
 * Features:
 * - Real-time synchronization between input methods
 * - Input validation (positive integers only, range: 1-9999)
 * - Accessible keyboard navigation
 * - Visual die-like interface
 * - Roll animation on button click
 */
export function CustomDie({ onRoll, color = '#8b5cf6' }: CustomDieProps) {
  const [value, setValue] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('1');
  const [isRolling, setIsRolling] = useState(false);

  // Minimum and maximum allowed values
  const MIN_VALUE = 1;
  const MAX_VALUE = 9999;

  /**
   * Validates and updates the value
   * Ensures the value stays within MIN_VALUE and MAX_VALUE range
   */
  const updateValue = (newValue: number) => {
    const clampedValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, Math.floor(newValue)));
    setValue(clampedValue);
    setInputValue(String(clampedValue));
  };

  /**
   * Handles arrow button clicks
   * Increments or decrements the value by the specified amount
   */
  const handleArrowClick = (delta: number) => {
    updateValue(value + delta);
  };

  /**
   * Handles direct input changes
   * Validates input and updates value in real-time
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;

    // Allow empty input for better UX while typing
    if (inputVal === '') {
      setInputValue('');
      return;
    }

    // Only allow digits (no decimals, no negative signs)
    if (!/^\d+$/.test(inputVal)) {
      return;
    }

    const numValue = parseInt(inputVal, 10);

    // Update input value immediately for responsive typing
    setInputValue(inputVal);

    // Validate and update internal value
    if (!isNaN(numValue) && numValue >= MIN_VALUE && numValue <= MAX_VALUE) {
      setValue(numValue);
    }
  };

  /**
   * Handles input blur event
   * Ensures a valid value is set when user leaves the input field
   */
  const handleInputBlur = () => {
    if (inputValue === '' || parseInt(inputValue, 10) < MIN_VALUE) {
      updateValue(MIN_VALUE);
    } else if (parseInt(inputValue, 10) > MAX_VALUE) {
      updateValue(MAX_VALUE);
    }
  };

  /**
   * Handles keyboard navigation
   * Arrow Up/Down keys increment/decrement value
   * Enter key triggers roll
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleArrowClick(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleArrowClick(-1);
    } else if (e.key === 'Enter') {
      handleRoll();
    }
  };

  /**
   * Handles roll button click
   * Generates a random number between 1 and the selected value
   */
  const handleRoll = () => {
    if (value < 1) return;

    setIsRolling(true);

    // Simulate rolling animation
    setTimeout(() => {
      const result = Math.floor(Math.random() * value) + 1;
      onRoll(result);
      setIsRolling(false);
    }, 500);
  };

  /**
   * Helper function to lighten a hex color
   */
  const lightenColor = (hex: string, percent: number) => {
    const hexToRgb = (h: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 139, g: 92, b: 246 };
    };

    const rgb = hexToRgb(hex);
    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-800 rounded-2xl border-2 border-slate-700">
      {/* Die Display */}
      <div
        className="w-full aspect-square rounded-2xl flex items-center justify-center text-6xl font-bold text-white shadow-xl transition-all duration-200"
        style={{
          backgroundColor: color,
          borderColor: lightenColor(color, 0.2),
          boxShadow: `0 10px 25px -5px ${color}80`
        }}
      >
        D{value}
      </div>

      {/* Custom Number Input Section */}
      <div className="w-full space-y-3">
        <label htmlFor="custom-die-input" className="block text-sm font-medium text-slate-400 text-center">
          Custom Number
        </label>

        {/* Arrow Controls and Input Container */}
        <div className="flex items-center gap-2">
          {/* Decrement Button */}
          <button
            onClick={() => handleArrowClick(-1)}
            disabled={value <= MIN_VALUE}
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center group"
            aria-label="Decrease value"
            title="Decrease value"
          >
            <ChevronDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Number Input Field */}
          <input
            id="custom-die-input"
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-center text-xl font-semibold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
            placeholder="Enter number"
            aria-label="Custom die value"
            min={MIN_VALUE}
            max={MAX_VALUE}
          />

          {/* Increment Button */}
          <button
            onClick={() => handleArrowClick(1)}
            disabled={value >= MAX_VALUE}
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center group"
            aria-label="Increase value"
            title="Increase value"
          >
            <ChevronUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Range Info */}
        <div className="text-xs text-slate-500 text-center">
          Range: {MIN_VALUE} - {MAX_VALUE}
        </div>
      </div>

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={isRolling || value < MIN_VALUE}
        className={`
          w-full px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200
          ${!isRolling && value >= MIN_VALUE
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/50 hover:scale-105'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }
        `}
      >
        {isRolling ? 'Rolling...' : 'Roll Custom Die'}
      </button>
    </div>
  );
}

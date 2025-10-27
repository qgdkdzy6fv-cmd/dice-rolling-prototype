import { useState } from 'react';
import { Dices, Palette } from 'lucide-react';

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface DiceState {
  type: DiceType;
  selected: boolean;
  result: number | null;
  count: number;
  rolls: number[];
  modifier: number;
  color: string;
}

function App() {
  const [dice, setDice] = useState<DiceState[]>([
    { type: 4, selected: false, result: null, count: 1, rolls: [], modifier: 0, color: '#64748b' },
    { type: 6, selected: false, result: null, count: 1, rolls: [], modifier: 0, color: '#64748b' },
    { type: 8, selected: false, result: null, count: 1, rolls: [], modifier: 0, color: '#64748b' },
    { type: 10, selected: false, result: null, count: 1, rolls: [], modifier: 0, color: '#64748b' },
    { type: 12, selected: false, result: null, count: 1, rolls: [], modifier: 0, color: '#64748b' },
    { type: 20, selected: false, result: null, count: 1, rolls: [], modifier: 0, color: '#64748b' },
    { type: 100, selected: false, result: null, count: 1, rolls: [], modifier: 0, color: '#64748b' },
  ]);

  const [isRolling, setIsRolling] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);

  const toggleDice = (index: number) => {
    setDice(prev => prev.map((d, i) =>
      i === index ? { ...d, selected: !d.selected } : d
    ));
  };

  const updateCount = (index: number, delta: number) => {
    setDice(prev => prev.map((d, i) => {
      if (i === index) {
        const newCount = Math.max(1, Math.min(10, d.count + delta));
        return { ...d, count: newCount };
      }
      return d;
    }));
  };

  const updateModifier = (index: number, delta: number) => {
    setDice(prev => prev.map((d, i) => {
      if (i === index) {
        const newModifier = Math.max(-20, Math.min(20, d.modifier + delta));
        return { ...d, modifier: newModifier };
      }
      return d;
    }));
  };

  const updateColor = (index: number, color: string) => {
    setDice(prev => prev.map((d, i) =>
      i === index ? { ...d, color } : d
    ));
  };

  const resetColors = () => {
    setDice(prev => prev.map(d => ({ ...d, color: '#eab308' })));
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 234, g: 179, b: 8 };
  };

  const rollDice = () => {
    const hasSelectedDice = dice.some(d => d.selected);
    if (!hasSelectedDice) return;

    setIsRolling(true);

    setTimeout(() => {
      setDice(prev => prev.map(d => {
        if (d.selected) {
          const rolls = Array.from({ length: d.count }, () =>
            Math.floor(Math.random() * d.type) + 1
          );
          const total = rolls.reduce((sum, roll) => sum + roll, 0) + d.modifier;
          return { ...d, result: total, rolls };
        }
        return { ...d, result: null, rolls: [] };
      }));
      setIsRolling(false);
    }, 500);
  };

  const resetAll = () => {
    setDice(prev => prev.map(d => ({ ...d, selected: false, result: null, count: 1, rolls: [], modifier: 0 })));
  };

  const lightenColor = (hex: string, percent: number) => {
    const rgb = hexToRgb(hex);
    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hasSelectedDice = dice.some(d => d.selected);
  const selectedDiceCount = dice.filter(d => d.selected).length;
  const totalSelectedDiceCount = dice.filter(d => d.selected).reduce((sum, d) => sum + d.count, 0);
  const hasResults = dice.some(d => d.result !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dices className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Dice Roller</h1>
          </div>
          <p className="text-slate-400 text-lg">Select your dice and roll to see the results</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {dice.map((d, index) => (
            <div key={d.type} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(showColorPicker === index ? null : index);
                }}
                className="absolute top-2 left-2 z-10 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700 transition-all group"
                title="Change color"
              >
                <Palette className="w-4 h-4 text-slate-300 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
              {showColorPicker === index && (
                <div className="absolute top-12 left-2 z-20 grid grid-cols-3 gap-1 p-2 bg-slate-700 rounded-lg shadow-xl">
                  {['#eab308', '#ef4444', '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'].map(color => (
                    <button
                      key={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateColor(index, color);
                        setShowColorPicker(null);
                      }}
                      className="w-6 h-6 rounded-full border-2 border-slate-500 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => toggleDice(index)}
                style={d.selected ? {
                  backgroundColor: d.color,
                  borderColor: lightenColor(d.color, 0.2),
                  boxShadow: `0 10px 25px -5px ${d.color}80`
                } : {}}
                className={`
                  w-full p-6 rounded-2xl border-2 transition-all duration-200
                  ${d.selected
                    ? 'scale-105'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750'
                  }
                `}
              >
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${d.selected ? 'text-white' : 'text-slate-300'}`}>
                    D{d.type}
                  </div>
                  {d.result !== null && (
                    <>
                      <div className={`text-sm mb-1 ${d.selected ? 'text-white opacity-90' : 'text-slate-400'}`}>
                        {d.rolls.length > 1 ? `[${d.rolls.join(' + ')}]` : d.rolls[0]}
                        {d.modifier !== 0 && (
                          <span className={d.modifier > 0 ? 'text-white opacity-80' : 'text-red-300'}>
                            {' '}{d.modifier > 0 ? '+' : ''}{d.modifier}
                          </span>
                        )}
                      </div>
                      <div className={`
                        text-5xl font-extrabold mt-2 animate-bounce
                        ${d.selected ? 'text-white' : ''}
                      `}
                      style={!d.selected ? { color: d.color } : {}}>
                        {d.result}
                      </div>
                    </>
                  )}
                  {d.selected && d.result === null && (
                    <div className="text-sm text-white opacity-90 mt-2">Selected</div>
                  )}
                </div>
              </button>

              <div className="space-y-2 mt-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500">Quantity</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateCount(index, -1)}
                      disabled={d.count <= 1}
                      className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      -
                    </button>
                    <span className="text-slate-300 font-semibold min-w-[3rem] text-center">
                      {d.count}x
                    </span>
                    <button
                      onClick={() => updateCount(index, 1)}
                      disabled={d.count >= 10}
                      className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500">Modifier</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateModifier(index, -1)}
                      disabled={d.modifier <= -20}
                      className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      -
                    </button>
                    <span className={`font-semibold min-w-[3rem] text-center ${
                      d.modifier > 0 ? 'text-emerald-400' : d.modifier < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {d.modifier > 0 ? '+' : ''}{d.modifier}
                    </span>
                    <button
                      onClick={() => updateModifier(index, 1)}
                      disabled={d.modifier >= 20}
                      className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={rollDice}
            disabled={!hasSelectedDice || isRolling}
            className={`
              px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200
              ${hasSelectedDice && !isRolling
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/50 hover:scale-105'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            {isRolling ? 'Rolling...' : `Roll Selected ${totalSelectedDiceCount === 1 ? 'Die' : 'Dice'}`}
          </button>

          {hasResults && (
            <button
              onClick={resetAll}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg shadow-red-500/50"
            >
              Reset Dice
            </button>
          )}

          <button
            onClick={resetColors}
            className="px-8 py-4 rounded-xl font-semibold text-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg shadow-red-500/50"
          >
            Reset Colors
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;

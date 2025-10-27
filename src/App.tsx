import { useState } from 'react';
import { Dices } from 'lucide-react';

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface DiceState {
  type: DiceType;
  selected: boolean;
  result: number | null;
  count: number;
  rolls: number[];
  modifier: number;
}

function App() {
  const [dice, setDice] = useState<DiceState[]>([
    { type: 4, selected: false, result: null, count: 1, rolls: [], modifier: 0 },
    { type: 6, selected: false, result: null, count: 1, rolls: [], modifier: 0 },
    { type: 8, selected: false, result: null, count: 1, rolls: [], modifier: 0 },
    { type: 10, selected: false, result: null, count: 1, rolls: [], modifier: 0 },
    { type: 12, selected: false, result: null, count: 1, rolls: [], modifier: 0 },
    { type: 20, selected: false, result: null, count: 1, rolls: [], modifier: 0 },
    { type: 100, selected: false, result: null, count: 1, rolls: [], modifier: 0 },
  ]);

  const [isRolling, setIsRolling] = useState(false);

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

  const hasSelectedDice = dice.some(d => d.selected);
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
                onClick={() => toggleDice(index)}
                className={`
                  w-full p-6 rounded-2xl border-2 transition-all duration-200
                  ${d.selected
                    ? 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50 scale-105'
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
                      <div className={`text-sm mb-1 ${d.selected ? 'text-yellow-100' : 'text-slate-400'}`}>
                        {d.rolls.length > 1 ? `[${d.rolls.join(' + ')}]` : d.rolls[0]}
                        {d.modifier !== 0 && (
                          <span className={d.modifier > 0 ? 'text-yellow-300' : 'text-red-300'}>
                            {' '}{d.modifier > 0 ? '+' : ''}{d.modifier}
                          </span>
                        )}
                      </div>
                      <div className={`
                        text-5xl font-extrabold mt-2 animate-bounce
                        ${d.selected ? 'text-white' : 'text-yellow-400'}
                      `}>
                        {d.result}
                      </div>
                    </>
                  )}
                  {d.selected && d.result === null && (
                    <div className="text-sm text-yellow-100 mt-2">Selected</div>
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
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/50 hover:scale-105'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            {isRolling ? 'Rolling...' : 'Roll Selected Dice'}
          </button>

          {hasResults && (
            <button
              onClick={resetAll}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200"
            >
              Reset
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;

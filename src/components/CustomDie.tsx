import { Palette, Plus, Minus } from 'lucide-react';

interface CustomDieProps {
  value: number;
  selected: boolean;
  result: number | null;
  count: number;
  rolls: number[];
  modifier: number;
  color: string;
  showColorPicker: boolean;
  onToggle: () => void;
  onUpdateValue: (newValue: number) => void;
  onValueInputChange: (value: string) => void;
  onUpdateCount: (delta: number) => void;
  onUpdateModifier: (delta: number) => void;
  onUpdateColor: (color: string) => void;
  onToggleColorPicker: () => void;
}

export function CustomDie({
  value,
  selected,
  result,
  count,
  rolls,
  modifier,
  color,
  showColorPicker,
  onToggle,
  onUpdateValue,
  onValueInputChange,
  onUpdateCount,
  onUpdateModifier,
  onUpdateColor,
  onToggleColorPicker,
}: CustomDieProps) {
  const MIN_VALUE = 1;
  const MAX_VALUE = 9999;

  const lightenColor = (hex: string, percent: number) => {
    const hexToRgb = (h: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 100, g: 116, b: 139 };
    };

    const rgb = hexToRgb(hex);
    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;

    if (inputVal === '') {
      onValueInputChange('');
      return;
    }

    if (!/^\d+$/.test(inputVal)) {
      return;
    }

    const numValue = parseInt(inputVal, 10);
    if (!isNaN(numValue) && numValue >= MIN_VALUE && numValue <= MAX_VALUE) {
      onValueInputChange(inputVal);
      onUpdateValue(numValue);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    if (inputVal === '' || parseInt(inputVal, 10) < MIN_VALUE) {
      onUpdateValue(MIN_VALUE);
      onValueInputChange(String(MIN_VALUE));
    } else if (parseInt(inputVal, 10) > MAX_VALUE) {
      onUpdateValue(MAX_VALUE);
      onValueInputChange(String(MAX_VALUE));
    }
  };

  return (
    <div>
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleColorPicker();
          }}
          className="absolute top-2 left-2 z-10 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700 transition-all group"
          title="Change color"
        >
          <Palette className="w-4 h-4 text-slate-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
        {showColorPicker && (
          <div className="absolute top-12 left-2 z-20 grid grid-cols-3 gap-1 p-2 bg-slate-700 rounded-lg shadow-xl">
            {['#eab308', '#ef4444', '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'].map(colorOption => (
              <button
                key={colorOption}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateColor(colorOption);
                  onToggleColorPicker();
                }}
                className="w-6 h-6 rounded-full border-2 border-slate-500 hover:scale-110 transition-transform"
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
        )}

        {/* Plus button - top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateValue(Math.min(MAX_VALUE, value + 1));
          }}
          disabled={value >= MAX_VALUE}
          className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700 transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
          title="Increase value"
        >
          <Plus className="w-4 h-4 text-slate-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Minus button - bottom right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateValue(Math.max(MIN_VALUE, value - 1));
          }}
          disabled={value <= MIN_VALUE}
          className="absolute bottom-2 right-2 z-10 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700 transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
          title="Decrease value"
        >
          <Minus className="w-4 h-4 text-slate-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <button
          onClick={onToggle}
          style={selected ? {
            backgroundColor: color,
            borderColor: lightenColor(color, 0.2),
            boxShadow: `0 10px 25px -5px ${color}80`
          } : {}}
          className={`
            w-full p-6 rounded-2xl border-2 transition-all duration-200
            ${selected
              ? 'scale-105'
              : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750'
            }
          `}
        >
          <div className="text-center">
            <div className={`text-xs -mb-1 ${selected ? 'text-white opacity-70' : 'text-slate-500'}`}>
              Custom
            </div>
            <div className={`text-4xl font-bold ${selected ? 'text-white' : 'text-slate-300'}`}>
              D{value}
            </div>
            {result !== null && (
              <>
                <div className={`text-sm mb-1 ${selected ? 'text-white opacity-90' : 'text-slate-400'}`}>
                  {rolls.length > 1 ? `[${rolls.join(' + ')}]` : rolls[0]}
                  {modifier !== 0 && (
                    <span className={modifier > 0 ? 'text-white opacity-80' : 'text-red-300'}>
                      {' '}{modifier > 0 ? '+' : ''}{modifier}
                    </span>
                  )}
                </div>
                <div className={`
                  text-5xl font-extrabold mt-2 animate-bounce
                  ${selected ? 'text-white' : ''}
                `}
                style={!selected ? { color: color } : {}}>
                  {result}
                </div>
              </>
            )}
          </div>
        </button>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-slate-500">Quantity</span>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onUpdateCount(-1)}
              disabled={count <= 1}
              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              -
            </button>
            <span className="text-slate-300 font-semibold min-w-[3rem] text-center">
              {count}x
            </span>
            <button
              onClick={() => onUpdateCount(1)}
              disabled={count >= 10}
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
              onClick={() => onUpdateModifier(-1)}
              disabled={modifier <= -20}
              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              -
            </button>
            <span className={`font-semibold min-w-[3rem] text-center ${
              modifier > 0 ? 'text-emerald-400' : modifier < 0 ? 'text-red-400' : 'text-slate-400'
            }`}>
              {modifier > 0 ? '+' : ''}{modifier}
            </span>
            <button
              onClick={() => onUpdateModifier(1)}
              disabled={modifier >= 20}
              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

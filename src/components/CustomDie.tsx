import { Palette } from 'lucide-react';

interface CustomDieProps {
  value: number;
  selected: boolean;
  result: number | null;
  rolls: number[];
  color: string;
  showColorPicker: boolean;
  onToggle: () => void;
  onUpdateValue: (newValue: number) => void;
  onValueInputChange: (value: string) => void;
  onUpdateColor: (color: string) => void;
  onToggleColorPicker: () => void;
}

export function CustomDie({
  value,
  selected,
  result,
  rolls,
  color,
  showColorPicker,
  onToggle,
  onUpdateValue,
  onValueInputChange,
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
          <div className={`text-4xl font-bold mb-2 ${selected ? 'text-white' : 'text-slate-300'}`}>
            D{value}
          </div>
          {result !== null && (
            <>
              <div className={`text-sm mb-1 ${selected ? 'text-white opacity-90' : 'text-slate-400'}`}>
                {rolls.length > 0 ? (rolls.length > 1 ? `[${rolls.join(' + ')}]` : rolls[0]) : result}
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
          {selected && result === null && (
            <div className="text-sm text-white opacity-90 mt-2">Selected</div>
          )}
        </div>
      </button>

      <div className="space-y-2 mt-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-slate-500">Custom Value</span>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onUpdateValue(Math.max(MIN_VALUE, value - 1))}
              disabled={value <= MIN_VALUE}
              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              -
            </button>
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onClick={(e) => e.stopPropagation()}
              className="w-16 px-2 py-1 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-center text-sm font-semibold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
              placeholder="Value"
            />
            <button
              onClick={() => onUpdateValue(Math.min(MAX_VALUE, value + 1))}
              disabled={value >= MAX_VALUE}
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

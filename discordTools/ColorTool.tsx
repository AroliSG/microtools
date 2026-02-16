import React, { useState } from 'react';
import { Palette, Copy, Check, Hash } from 'lucide-react';

const ColorTool: React.FC = () => {
  const [hex, setHex] = useState('#5865F2');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hexToInt = (h: string) => {
    const cleanHex = h.replace('#', '');
    return parseInt(cleanHex, 16);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const discordColors = [
    { name: 'Blurple', hex: '#5865F2', desc: 'Main brand color' },
    { name: 'Green', hex: '#57F287', desc: 'Online status / Success' },
    { name: 'Yellow', hex: '#FEE75C', desc: 'Idle status / Warning' },
    { name: 'Fuchsia', hex: '#EB459E', desc: 'Nitro / Boosting' },
    { name: 'Red', hex: '#ED4245', desc: 'DND status / Danger' },
    { name: 'Black', hex: '#23272A', desc: 'Old dark theme background' },
  ];

  const intValue = hexToInt(hex);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Color Guide & Converter</h2>
        <p className="text-[#B5BAC1]">{'Convert Hex colors to Decimal integers (required for API embeds/roles) and explore brand colors.'}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Hash size={16} className="text-[#5865F2]" /> Hex to Decimal
          </h3>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-[10px] text-[#B5BAC1] mb-2 uppercase font-bold">{'Pick Color'}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  className="w-12 h-12 bg-transparent border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  className="flex-1 bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-white mono uppercase"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#1E1F22] rounded-xl border border-[#3F4147] relative group">
            <p className="text-[10px] text-[#B5BAC1] font-bold uppercase mb-1">{'Decimal Integer'}</p>
            <div className="text-3xl font-black text-[#5865F2] mono">{isNaN(intValue) ? ('Invalid Hex') : intValue}</div>
            <button
              onClick={() => copy(intValue.toString(), 'main-int')}
              disabled={isNaN(intValue)}
              className="absolute top-4 right-4 p-2 bg-[#2B2D31] text-[#B5BAC1] hover:text-white rounded-lg transition-all"
            >
              {copiedKey === 'main-int' ? <Check size={16} className="text-[#23A559]" /> : <Copy size={16} />}
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4 px-2">
            <Palette size={16} className="text-[#5865F2]" /> {'Brand Palette'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {discordColors.map((color) => (
              <div
                key={color.name}
                className="bg-[#2B2D31] p-4 rounded-xl border border-[#3F4147] flex items-center gap-4 hover:border-[#5865F2] transition-all cursor-pointer group"
                onClick={() => setHex(color.hex)}
              >
                <div className="w-10 h-10 rounded-full shadow-inner" style={{ backgroundColor: color.hex }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{color.name}</p>
                  <p className="text-[10px] text-[#B5BAC1] truncate">{color.hex}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(color.hex, color.name);
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#B5BAC1] hover:text-white"
                >
                  {copiedKey === color.name ? <Check size={14} className="text-[#23A559]" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ColorTool;

import React, { useMemo, useState } from 'react';
import { Copy, Check, RefreshCw, Eraser } from 'lucide-react';

const smallCapsMap: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
  s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
};

const leetMap: Record<string, string> = {
  a: '4', b: '8', e: '3', g: '6', i: '1', l: '1', o: '0', s: '5', t: '7', z: '2',
};

const toMocking = (text: string) =>
  text
    .split('')
    .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
    .join('');

const toRegional = (text: string) =>
  text
    .toLowerCase()
    .split('')
    .map((char) => {
      if (char >= 'a' && char <= 'z') return `:regional_indicator_${char}:`;
      if (char === ' ') return '   ';
      return char;
    })
    .join(' ');

const toSmallCaps = (text: string) =>
  text
    .toLowerCase()
    .split('')
    .map((char) => smallCapsMap[char] || char)
    .join('');

const toTitleCase = (text: string) =>
  text
    .toLowerCase()
    .split(/\s+/)
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ''))
    .join(' ')
    .trim();

const toLeet = (text: string) =>
  text
    .toLowerCase()
    .split('')
    .map((char) => leetMap[char] || char)
    .join('');

const toSnakeCase = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, '_');

const toKebabCase = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-');

const TextTransformTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const transformations = useMemo(
    () => [
      { name: 'Mocking Case (sPoNgEbOb)', value: toMocking(input), key: 'mock' },
      { name: 'Regional Indicators (Emojis)', value: toRegional(input), key: 'emoji' },
      { name: 'Small Caps', value: toSmallCaps(input), key: 'small' },
      { name: 'UPPERCASE', value: input.toUpperCase(), key: 'upper' },
      { name: 'lowercase', value: input.toLowerCase(), key: 'lower' },
      { name: 'Title Case', value: toTitleCase(input), key: 'title' },
      { name: 'Reverse Text', value: input.split('').reverse().join(''), key: 'reverse' },
      { name: 'Leet Speak', value: toLeet(input), key: 'leet' },
      { name: 'snake_case', value: toSnakeCase(input), key: 'snake' },
      { name: 'kebab-case', value: toKebabCase(input), key: 'kebab' },
    ],
    [input]
  );

  const copy = async (text: string, key: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Text Transformer</h2>
        <p className="text-[#B5BAC1]">{'Convert your text into multiple Discord-ready styles and copy instantly.'}</p>
      </header>

      <div className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider">{'Input Text'}</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInput('')}
              className="inline-flex items-center gap-1 text-xs text-[#B5BAC1] hover:text-white bg-[#1E1F22] px-2 py-1 rounded"
            >
              <Eraser size={12} /> {'Clear'}
            </button>
            <button
              onClick={() => setInput((prev) => toMocking(prev))}
              disabled={!input}
              className="inline-flex items-center gap-1 text-xs text-[#B5BAC1] hover:text-white bg-[#1E1F22] px-2 py-1 rounded disabled:opacity-40"
            >
              <RefreshCw size={12} /> {'Mockify'}
            </button>
          </div>
        </div>
        <textarea
          rows={4}
          placeholder={'Type something here...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-4 text-white outline-none transition-all resize-y"
        />
      </div>

      <div className="space-y-4">
        {transformations.map((transform) => (
          <div key={transform.key} className="bg-[#2B2D31] p-5 rounded-xl border border-[#3F4147] group hover:border-[#5865F2] transition-all">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-white uppercase">{transform.name}</span>
              <button
                onClick={() => copy(transform.value, transform.key)}
                disabled={!input}
                className="p-2 bg-[#1E1F22] text-[#B5BAC1] hover:text-white rounded-lg transition-colors disabled:opacity-30"
              >
                {copiedKey === transform.key ? <Check size={16} className="text-[#23A559]" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="mono bg-[#1E1F22] p-4 rounded-lg text-sm text-[#DBDEE1] break-all min-h-[50px] flex items-center">
              {input ? transform.value : <span className="text-[#4E5058] italic">{'Results will appear here...'}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextTransformTool;

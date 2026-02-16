import React, { useMemo, useState } from 'react';
import { EmojiPicker } from 'frimousse';
import { Copy, Check, Smile } from 'lucide-react';

const PREFIXES = [
  '💬︱', '📢︱', '🔊︱', '📌︱', '📜︱', '🔒︱', '✨︱', '🔥︱', '💎︱', '🛠️︱', '🎮︱', '📷︱',
  '🧠︱', '🛡️︱', '🧩︱', '🎵︱', '📚︱', '🚀︱', '🎨︱', '💡︱', '✅︱', '❌︱', '👋︱',
];

const sanitizeChannelBase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '');

const FONTS: Record<string, (s: string) => string> = {
  Default: (s) => sanitizeChannelBase(s),
  'Small Caps': (s) => {
    const map: Record<string, string> = {
      a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
      k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ',
      u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
    };
    return sanitizeChannelBase(s)
      .split('')
      .map((char) => map[char] || char)
      .join('');
  },
  Monospace: (s) => sanitizeChannelBase(s),
  Compact: (s) => sanitizeChannelBase(s).replace(/-/g, ''),
};

const ChannelDecoratorTool: React.FC = () => {
  const [input, setInput] = useState('general chat');
  const [prefix, setPrefix] = useState('💬︱');
  const [font, setFont] = useState('Default');
  const [copied, setCopied] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const decorated = useMemo(() => `${prefix}${FONTS[font](input)}`, [prefix, font, input]);

  const copy = async () => {
    await navigator.clipboard.writeText(decorated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Channel Decorator</h2>
        <p className="text-[#B5BAC1]">{'Create stylized Discord channel names with prefix icons and quick formatting.'}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{'Channel Name'}</label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-4 text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#B5BAC1] uppercase mb-2">{'Emoji Picker'}</label>
                <div className="grid grid-cols-6 gap-2 mb-2 max-h-40 overflow-y-auto pr-1">
                  {PREFIXES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setPrefix(item)}
                      className={`p-2 rounded-lg text-sm transition-all border ${prefix === item ? 'bg-[#5865F2] border-[#5865F2] text-white' : 'bg-[#1E1F22] border-transparent text-[#B5BAC1] hover:border-[#4E5058]'}`}
                    >
                      {item.split('︱')[0]}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setPickerOpen((open) => !open)}
                    className="w-full py-2 bg-[#35373C] hover:bg-[#4E5058] rounded-lg text-xs font-bold text-white inline-flex items-center justify-center gap-2"
                  >
                    <Smile size={14} />
                    {'Open Emoji Picker'}
                  </button>
                  {pickerOpen && (
                    <div className="absolute z-20 mt-2 w-full min-w-[280px] rounded-xl border border-[#3F4147] bg-[#1E1F22] p-2 shadow-xl">
                      <EmojiPicker.Root
                        onEmojiSelect={({ emoji }) => {
                          setPrefix(`${emoji}︱`);
                          setPickerOpen(false);
                        }}
                      >
                        <EmojiPicker.Search
                          className="w-full bg-[#111214] border border-[#3F4147] rounded-lg px-3 py-2 text-xs text-white outline-none mb-2"
                          placeholder={'Search emoji...'}
                        />
                        <EmojiPicker.Viewport className="h-56 overflow-y-auto rounded-lg bg-[#111214] p-1">
                          <EmojiPicker.Loading className="p-3 text-xs text-[#B5BAC1]">{'Loading emojis...'}</EmojiPicker.Loading>
                          <EmojiPicker.Empty className="p-3 text-xs text-[#B5BAC1]">{'No emojis found.'}</EmojiPicker.Empty>
                          <EmojiPicker.List
                            className="select-none"
                            components={{
                              CategoryHeader: ({ category, ...props }) => (
                                <div {...props} className="px-2 py-1 text-[10px] uppercase text-[#9CA3AF] font-bold">
                                  {category.label}
                                </div>
                              ),
                              Row: (props) => <div {...props} className="grid grid-cols-8 gap-1 px-1" />,
                              Emoji: ({ emoji, ...props }) => (
                                <button
                                  {...props}
                                  className="h-8 w-8 rounded-md hover:bg-[#2B2D31] transition-colors text-lg flex items-center justify-center"
                                >
                                  {emoji.emoji}
                                </button>
                              ),
                            }}
                          />
                        </EmojiPicker.Viewport>
                      </EmojiPicker.Root>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#B5BAC1] uppercase mb-2">{'Font Style'}</label>
                <div className="space-y-2">
                  {Object.keys(FONTS).map((name) => (
                    <button
                      key={name}
                      onClick={() => setFont(name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all border ${font === name ? 'bg-[#5865F2] border-[#5865F2] text-white' : 'bg-[#1E1F22] border-transparent text-[#B5BAC1] hover:border-[#4E5058]'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#111214] rounded-xl border border-[#3F4147] flex items-center justify-between group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-[#35373C] flex items-center justify-center">
                  <span className="text-white text-lg">#</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight truncate">{decorated}</span>
              </div>
              <button
                onClick={copy}
                className="p-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-all shadow-lg shadow-[#5865F2]/20"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
            <h4 className="text-xs font-bold text-white uppercase mb-4">{'Tips'}</h4>
            <ul className="text-xs text-[#B5BAC1] space-y-3 list-disc list-inside">
              <li>{'Discord usually uses lowercase channel names.'}</li>
              <li>{'Spaces are converted to hyphens.'}</li>
              <li>{'Decorative Unicode may look better but can hurt searchability.'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDecoratorTool;

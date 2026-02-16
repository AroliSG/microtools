import React, { useState } from 'react';
import { Code, Quote, List, Eye, Copy, Check } from 'lucide-react';

const MarkdownTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const formats = [
    { label: 'Bold', code: '**text**', icon: <span className="font-bold text-lg">B</span> },
    { label: 'Italic', code: '*text*', icon: <span className="italic text-lg">I</span> },
    { label: 'Strikethrough', code: '~~text~~', icon: <span className="line-through text-lg">S</span> },
    { label: 'Spoiler', code: '||text||', icon: <Eye size={18} /> },
    { label: 'Header 1', code: '# text', icon: <span className="font-bold text-xs">H1</span> },
    { label: 'Header 2', code: '## text', icon: <span className="font-bold text-xs">H2</span> },
    { label: 'Quote', code: '> text', icon: <Quote size={18} /> },
    { label: 'Inline Code', code: '`text`', icon: <Code size={18} /> },
    { label: 'Code Block', code: '```js\ntext\n```', icon: <div className="text-[10px] font-mono border border-current rounded px-1">CODE</div> },
    { label: 'Bullet List', code: '- item', icon: <List size={18} /> },
    { label: 'Numbered List', code: '1. item', icon: <span className="text-xs">1.2.</span> },
  ];

  const applyFormat = (formatCode: string) => {
    setText((prev) => prev + (prev.length > 0 ? '\n' : '') + formatCode);
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Markdown Helper</h2>
        <p className="text-[#B5BAC1]">{'A quick playground to format your Discord messages with rich text markdown features.'}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-[#B5BAC1] uppercase tracking-wider">{'Editor'}</label>
              <button
                onClick={() => setText('')}
                className="text-xs text-[#F23F43] hover:underline"
              >
                {'Clear All'}
              </button>
            </div>

            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={'Start typing your message...'}
              className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-xl p-4 text-white outline-none resize-none mono text-sm leading-relaxed"
            />

            <div className="mt-6">
              <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-3">{'Quick Actions'}</label>
              <div className="flex flex-wrap gap-2">
                {formats.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => applyFormat(f.code)}
                    title={f.label}
                    className="w-10 h-10 flex items-center justify-center bg-[#35373C] hover:bg-[#5865F2] hover:text-white text-[#B5BAC1] rounded-lg transition-all"
                  >
                    {f.icon}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl flex flex-col h-full">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Eye size={16} className="text-[#5865F2]" /> {'Quick Reference'}
            </h4>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {formats.map((f) => (
                <div key={f.label} className="flex items-center justify-between p-3 bg-[#1E1F22] rounded-xl group">
                  <div>
                    <p className="text-xs font-bold text-white">{f.label}</p>
                    <code className="text-[10px] text-[#5865F2]">{f.code}</code>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(f.code)}
                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#B5BAC1] hover:text-white"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={copyToClipboard}
              disabled={!text}
              className={`
                w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                ${text ? 'bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg' : 'bg-[#4E5058] text-[#B5BAC1] cursor-not-allowed opacity-50'}
              `}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? ('Copied to Clipboard') : ('Copy Final Message')}</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MarkdownTool;

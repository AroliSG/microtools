
import React, { useState, useEffect } from 'react';
import { Copy, Check, Calendar } from 'lucide-react';

const FORMATS = [
  { label: 'Short Time', suffix: 't', example: '16:20' },
  { label: 'Long Time', suffix: 'T', example: '16:20:30' },
  { label: 'Short Date', suffix: 'd', example: '20/04/2024' },
  { label: 'Long Date', suffix: 'D', example: '20 April 2024' },
  { label: 'Short Date/Time', suffix: 'f', example: '20 April 2024 16:20' },
  { label: 'Long Date/Time', suffix: 'F', example: 'Saturday, 20 April 2024 16:20' },
  { label: 'Relative', suffix: 'R', example: '2 months ago' },
];

const TimestampTool: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const timestamp = Math.floor(new Date(date).getTime() / 1000);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Discord Timestamp Generator</h2>
        <p className="text-[#B5BAC1]">{"Easily generate dynamic timestamps that automatically adjust to each user's local time zone."}</p>
      </header>

      <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{'Pick a Date & Time'}</label>
            <div className="relative group">
              <input 
                type="datetime-local" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] hover:border-[#5865F2] focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] rounded-lg p-3 outline-none transition-all text-white appearance-none"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5BAC1] pointer-events-none group-hover:text-[#5865F2] transition-colors" size={18} />
            </div>
          </div>
          <button 
            onClick={() => setDate(new Date().toISOString().slice(0, 16))}
            className="px-6 py-3 bg-[#35373C] hover:bg-[#4E5058] text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            {'Set to Now'}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FORMATS.map((format, idx) => {
          const code = `<t:${timestamp}:${format.suffix}>`;
          return (
            <div key={idx} className="bg-[#2B2D31] p-4 rounded-xl border border-[#3F4147] group hover:border-[#5865F2] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{format.label}</h4>
                  <p className="text-xs text-[#B5BAC1]">{'Format'}: {format.suffix}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(code, idx)}
                  className="p-2 bg-[#1E1F22] text-[#B5BAC1] hover:text-white rounded-lg transition-colors"
                >
                  {copiedIndex === idx ? <Check size={16} className="text-[#23A559]" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="mono bg-[#1E1F22] p-3 rounded-lg text-[#5865F2] text-sm break-all font-medium border border-transparent group-hover:border-[#5865F2]/20 transition-all">
                {code}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimestampTool;

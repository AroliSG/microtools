
import React, { useState } from 'react';
import { DISCORD_EPOCH } from './constants';
import { Fingerprint, Info, Calendar, Clock } from 'lucide-react';

const SnowflakeTool: React.FC = () => {
  const [snowflake, setSnowflake] = useState('');
  
  const decodeSnowflake = (id: string) => {
    try {
      if (!id || !/^\d+$/.test(id)) return null;
      const bin = BigInt(id);
      const timestamp = Number((bin >> 22n) + BigInt(DISCORD_EPOCH));
      const workerId = (bin & 0x3E0000n) >> 17n;
      const processId = (bin & 0x1F000n) >> 12n;
      const increment = bin & 0xFFFn;
      
      const date = new Date(timestamp);
      return {
        date,
        workerId: Number(workerId),
        processId: Number(processId),
        increment: Number(increment)
      };
    } catch {
      return null;
    }
  };

  const result = decodeSnowflake(snowflake);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Snowflake Decoder</h2>
        <p className="text-[#B5BAC1]">{'Convert Discord IDs (Snowflakes) into their creation dates and internal metadata.'}</p>
      </header>

      <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
        <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{'Discord ID / Snowflake'}</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="e.g. 104245678901234567"
            value={snowflake}
            onChange={(e) => setSnowflake(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] rounded-lg p-4 pl-12 outline-none transition-all text-white mono"
          />
          <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B5BAC1]" size={20} />
        </div>
      </section>

      {result ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] flex gap-4">
            <div className="w-12 h-12 bg-[#5865F2]/10 rounded-xl flex items-center justify-center text-[#5865F2]">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#B5BAC1] uppercase">{'Creation Date'}</p>
              <p className="text-xl font-bold text-white">{result.date.toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
              <p className="text-sm text-[#B5BAC1]">{result.date.toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] flex gap-4">
            <div className="w-12 h-12 bg-[#FEE75C]/10 rounded-xl flex items-center justify-center text-[#FEE75C]">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#B5BAC1] uppercase">Unix Timestamp</p>
              <p className="text-xl font-bold text-white mono">{Math.floor(result.date.getTime() / 1000)}</p>
              <p className="text-sm text-[#B5BAC1]">{'Milliseconds'}: {result.date.getTime()}</p>
            </div>
          </div>

          <div className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] md:col-span-2 grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-[#1E1F22]">
              <p className="text-[10px] font-bold text-[#B5BAC1] uppercase mb-1">Worker ID</p>
              <p className="text-xl font-bold text-white mono">{result.workerId}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[#1E1F22]">
              <p className="text-[10px] font-bold text-[#B5BAC1] uppercase mb-1">Process ID</p>
              <p className="text-xl font-bold text-white mono">{result.processId}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[#1E1F22]">
              <p className="text-[10px] font-bold text-[#B5BAC1] uppercase mb-1">Increment</p>
              <p className="text-xl font-bold text-white mono">{result.increment}</p>
            </div>
          </div>
        </div>
      ) : snowflake.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-[#F23F43]/10 border border-[#F23F43]/20 rounded-xl text-[#F23F43]">
          <Info size={20} />
          <p className="font-medium text-sm">{'Please enter a valid numeric Discord Snowflake ID.'}</p>
        </div>
      )}
      
      {!snowflake && (
        <div className="flex items-start gap-4 p-6 bg-[#35373C] rounded-2xl text-[#B5BAC1]">
          <Info className="flex-shrink-0 mt-1" size={20} />
          <div className="text-sm space-y-2">
            <p>{'Discord uses "Snowflakes" as unique IDs. They carry information about when they were created.'}</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>{'First 42 bits are the timestamp since Discord Epoch (Jan 1, 2015).'}</li>
              <li>{'Next 5 bits are internal worker IDs.'}</li>
              <li>{'Next 5 bits are internal process IDs.'}</li>
              <li>{'Final 12 bits are an increment for IDs created in the same millisecond.'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnowflakeTool;

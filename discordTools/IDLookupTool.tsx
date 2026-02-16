import React, { useMemo, useState } from 'react';
import { DISCORD_EPOCH } from './constants';
import { Search, Calendar, ShieldCheck, Info, Globe, ExternalLink, Copy, Check } from 'lucide-react';

const IDLookupTool: React.FC = () => {
  const [id, setId] = useState('');
  const [copied, setCopied] = useState(false);

  const decodeSnowflake = (snowflakeId: string) => {
    try {
      if (!snowflakeId || !/^\d+$/.test(snowflakeId)) return null;
      const bin = BigInt(snowflakeId);
      const timestamp = Number((bin >> 22n) + BigInt(DISCORD_EPOCH));
      return new Date(timestamp);
    } catch {
      return null;
    }
  };

  const creationDate = useMemo(() => decodeSnowflake(id), [id]);
  const yearsOld = creationDate
    ? Math.max(0, Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24 * 365)))
    : null;

  const parsedData = useMemo(() => {
    if (!id || !/^\d+$/.test(id) || !creationDate) return null;
    try {
      const bin = BigInt(id);
      const workerId = Number((bin & 0x3e0000n) >> 17n);
      const processId = Number((bin & 0x1f000n) >> 12n);
      const increment = Number(bin & 0xfffn);
      return {
        id,
        createdAtISO: creationDate.toISOString(),
        createdAtUnix: Math.floor(creationDate.getTime() / 1000),
        createdAtMs: creationDate.getTime(),
        ageYears: yearsOld,
        snowflake: {
          workerId,
          processId,
          increment,
        },
      };
    } catch {
      return null;
    }
  }, [id, creationDate, yearsOld]);

  const copyJson = async () => {
    if (!parsedData) return;
    await navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openAssetCdn = () => {
    if (!id) return;
    const params = new URLSearchParams();
    params.set('tool', 'asset-cdn');
    params.set('id', id);
    params.set('type', 'avatar');
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">ID Lookup</h2>
        <p className="text-[#B5BAC1]">{'Analyze a Discord ID locally: creation date, age and JSON data.'}</p>
      </header>

      <div className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
        <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{'Discord ID'}</label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. 104245678901234567"
            value={id}
            onChange={(e) => setId(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-4 pl-12 text-white mono outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B5BAC1]" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase mb-6 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#5865F2]" /> {'Technical Data'}
            </h3>

            {creationDate ? (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#5865F2]/10 rounded-lg flex items-center justify-center text-[#5865F2]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#B5BAC1] uppercase">{'Created On'}</p>
                    <p className="text-white font-bold">{creationDate.toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    <p className="text-xs text-[#B5BAC1]">{creationDate.toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#3F4147]">
                  <p className="text-[10px] font-bold text-[#B5BAC1] uppercase mb-2">{'Age'}</p>
                  <p className="text-2xl font-black text-white">{yearsOld} Years</p>
                  <p className="text-xs text-[#B5BAC1]">{'old entity'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[#4E5058]">
                <Info size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs">{'Enter a valid ID above'}</p>
              </div>
            )}
          </section>

          <div className="bg-[#5865F2]/5 p-6 rounded-2xl border border-[#5865F2]/10">
            <h4 className="text-xs font-bold text-[#5865F2] mb-2">{'Tip'}</h4>
            <p className="text-[11px] text-[#B5BAC1] leading-relaxed">
              {'This lookup does not confirm ownership or identity. It only interprets snowflake metadata.'}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <section className="bg-[#2B2D31] h-full p-6 rounded-2xl border border-[#3F4147] shadow-xl flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase mb-6 flex items-center gap-2">
              <Globe size={16} className="text-[#FEE75C]" /> {'Asset & JSON'}
            </h3>

            {id ? (
              <div className="space-y-4">
                <button
                  onClick={openAssetCdn}
                  className="w-full flex items-center justify-between p-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg text-sm text-white transition-all"
                >
                  <span>{'Open Asset CDN with this ID'}</span>
                  <ExternalLink size={14} />
                </button>

                <div className="bg-[#1E1F22] border border-[#3F4147] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold uppercase text-[#B5BAC1]">JSON Data</p>
                    <button
                      onClick={copyJson}
                      disabled={!parsedData}
                      className="p-2 bg-[#2B2D31] text-[#B5BAC1] hover:text-white rounded-lg transition-all disabled:opacity-40"
                    >
                      {copied ? <Check size={14} className="text-[#23A559]" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre className="mono text-[11px] text-[#DBDEE1] whitespace-pre-wrap break-all">
                    {parsedData ? JSON.stringify(parsedData, null, 2) : '{\n  "error": "invalid_id"\n}'}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#4E5058] py-12 text-center">
                <Globe size={48} className="mb-4 opacity-10" />
                <p className="text-sm font-medium">{'Enter an ID to unlock actions.'}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default IDLookupTool;

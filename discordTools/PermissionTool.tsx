
import React, { useState, useMemo } from 'react';
import { DISCORD_PERMISSIONS } from './constants';
import { ShieldAlert, Copy, Check, Search } from 'lucide-react';

const PermissionTool: React.FC = () => {
  const [total, setTotal] = useState<bigint>(0n);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const togglePermission = (value: bigint) => {
    if ((total & value) === value) {
      setTotal(total & ~value);
    } else {
      setTotal(total | value);
    }
  };

  const filteredPermissions = useMemo(() => {
    return DISCORD_PERMISSIONS.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const copyResult = () => {
    navigator.clipboard.writeText(total.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Permission Calculator</h2>
        <p className="text-[#B5BAC1]">{"Select the permissions you want to grant, and we'll calculate the bitwise integer for you."}</p>
      </header>

      {/* Calculator Result Sticky Header */}
      <div className="sticky top-4 z-10 bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <p className="text-[10px] font-bold text-[#B5BAC1] uppercase tracking-wider mb-1">{'Calculated Permission Integer'}</p>
          <div className="mono text-4xl font-black text-[#5865F2] truncate">
            {total.toString()}
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={copyResult}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-lg transition-all"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            <span>{copied ? ('Copied') : ('Copy ID')}</span>
          </button>
          <button 
            onClick={() => setTotal(0n)}
            className="px-6 py-3 bg-[#35373C] hover:bg-[#F23F43] text-white font-bold rounded-lg transition-all"
          >
            {'Reset'}
          </button>
        </div>
      </div>

      <div className="bg-[#2B2D31] rounded-2xl border border-[#3F4147] overflow-hidden">
        <div className="p-4 bg-[#232428] border-b border-[#3F4147]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B5BAC1]" size={18} />
            <input 
              type="text" 
              placeholder={'Search permissions...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1E1F22] border-none focus:ring-1 focus:ring-[#5865F2] rounded-lg py-2 pl-10 pr-4 text-sm text-white outline-none"
            />
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3F4147]">
            {filteredPermissions.map((perm) => {
              const isActive = (total & perm.value) === perm.value;
              return (
                <div 
                  key={perm.name}
                  onClick={() => togglePermission(perm.value)}
                  className={`
                    p-4 cursor-pointer transition-colors flex items-start gap-3
                    ${isActive ? 'bg-[#5865F2]/10' : 'hover:bg-[#35373C]'}
                  `}
                >
                  <div className={`
                    mt-1 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all
                    ${isActive ? 'bg-[#5865F2] border-[#5865F2]' : 'border-[#4E5058] bg-[#1E1F22]'}
                  `}>
                    {isActive && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-[#DBDEE1]'}`}>{perm.name}</p>
                    <p className="text-[11px] text-[#B5BAC1] leading-tight mt-0.5">{perm.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredPermissions.length === 0 && (
            <div className="p-12 text-center text-[#B5BAC1]">
              <ShieldAlert className="mx-auto mb-2 opacity-20" size={48} />
              <p>{'No permissions found matching your search.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionTool;

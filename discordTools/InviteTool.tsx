import React, { useState } from 'react';
import { Copy, Check, Link as LinkIcon, Info, Bot } from 'lucide-react';

const InviteTool: React.FC = () => {
  const [clientId, setClientId] = useState('');
  const [permissions, setPermissions] = useState('8');
  const [scopes, setScopes] = useState(['bot', 'applications.commands']);
  const [copied, setCopied] = useState(false);

  const availableScopes = [
    'bot',
    'applications.commands',
    'identify',
    'guilds',
    'guilds.join',
    'gdm.join',
    'messages.read',
    'rpc',
  ];

  const toggleScope = (scope: string) => {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${clientId || 'CLIENT_ID'}&permissions=${permissions || '0'}&scope=${scopes.join('%20')}`;

  const copyToClipboard = () => {
    if (!clientId) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Bot Invite Generator</h2>
        <p className="text-[#B5BAC1]">{'Generate an OAuth2 authorization link to add your bot to a server with specific permissions.'}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{'Application (Client) ID'}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 104245678901234567"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] rounded-lg p-3 pl-10 outline-none transition-all text-white mono"
                />
                <Bot className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B5BAC1]" size={18} />
              </div>
              <p className="mt-2 text-[10px] text-[#B5BAC1]">You can find this in the <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">Discord Developer Portal</a>.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">Permissions Integer</label>
              <input
                type="text"
                placeholder="8"
                value={permissions}
                onChange={(e) => setPermissions(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-sm text-white mono"
              />
              <p className="mt-2 text-[10px] text-[#B5BAC1]">Use the "Permission Calc" tool if you don't know this number.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-4">Scopes</label>
              <div className="grid grid-cols-2 gap-3">
                {availableScopes.map((scope) => (
                  <label
                    key={scope}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border
                      ${scopes.includes(scope) ? 'bg-[#5865F2]/10 border-[#5865F2] text-white' : 'bg-[#1E1F22] border-[#1E1F22] text-[#B5BAC1] hover:bg-[#35373C]'}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={scopes.includes(scope)}
                      onChange={() => toggleScope(scope)}
                    />
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${scopes.includes(scope) ? 'bg-[#5865F2]' : 'bg-[#2B2D31]'}`}>
                      {scopes.includes(scope) && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-xs font-medium">{scope}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <LinkIcon size={16} className="text-[#5865F2]" /> Generated Invite Link
            </h4>

            <div
              className={`
              mono p-4 rounded-xl text-xs break-all transition-all border
              ${clientId ? 'bg-[#1E1F22] text-[#5865F2] border-[#5865F2]/20' : 'bg-[#1E1F22]/50 text-[#B5BAC1] border-transparent'}
            `}
            >
              {inviteLink}
            </div>

            <button
              onClick={copyToClipboard}
              disabled={!clientId}
              className={`
                w-full mt-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                ${clientId ? 'bg-[#5865F2] hover:bg-[#4752C4] text-white' : 'bg-[#4E5058] text-[#B5BAC1] cursor-not-allowed opacity-50'}
              `}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? ('Copied Link') : ('Copy Invite Link')}</span>
              </button>
          </section>

          <div className="bg-[#5865F2]/5 p-6 rounded-2xl border border-[#5865F2]/10 flex gap-4">
            <Info className="flex-shrink-0 text-[#5865F2]" size={20} />
            <div className="text-xs text-[#B5BAC1] space-y-2 leading-relaxed">
              <p>For most bots, you only need <code className="bg-[#1E1F22] px-1 rounded text-white">bot</code> and <code className="bg-[#1E1F22] px-1 rounded text-white">applications.commands</code> scopes.</p>
              <p>The permissions integer 8 grants "Administrator" access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteTool;

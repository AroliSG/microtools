import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2, User, Globe } from 'lucide-react';

const WebhookTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const sendWebhook = async () => {
    if (!url) return;
    setStatus('sending');
    setErrorMsg('');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username: username || undefined,
          avatar_url: avatarUrl || undefined,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send webhook');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-white mb-2">Webhook Sender</h2>
        <p className="text-[#B5BAC1]">{'Test and manage Discord webhooks by sending test payloads directly from your browser.'}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2 flex items-center gap-2">
                <Globe size={14} /> Webhook URL
              </label>
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] rounded-lg p-3 outline-none transition-all text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{'Message Content'}</label>
              <textarea
                rows={5}
                placeholder={'Hello from Discord Microtools!'}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] rounded-lg p-3 outline-none transition-all text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User size={14} /> {'Override Username'}
                </label>
                <input
                  type="text"
                  placeholder={'Optional'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{'Override Avatar URL'}</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-sm text-white"
                />
              </div>
            </div>

            <button
              onClick={sendWebhook}
              disabled={!url || !content || status === 'sending'}
              className={`
                w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all
                ${status === 'sending' ? 'bg-[#4E5058] cursor-wait' : 'bg-[#5865F2] hover:bg-[#4752C4] shadow-lg shadow-[#5865F2]/20'}
                ${(!url || !content) && 'opacity-50 cursor-not-allowed'}
              `}
            >
              {status === 'sending' ? ('Sending...') : (
                <>
                  <Send size={18} />
                  {'Send Message'}
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-3 p-4 bg-[#23A559]/10 border border-[#23A559]/20 rounded-xl text-[#23A559] animate-in zoom-in-95">
                <CheckCircle2 size={20} />
                <p className="font-medium text-sm">{'Message sent successfully!'}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 bg-[#F23F43]/10 border border-[#F23F43]/20 rounded-xl text-[#F23F43] animate-in zoom-in-95">
                <AlertCircle size={20} />
                <p className="font-medium text-sm">{errorMsg}</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl">
            <h4 className="text-sm font-bold text-white mb-4">{'How to use?'}</h4>
            <ol className="text-sm text-[#B5BAC1] space-y-3 list-decimal list-inside">
              <li>{'In Discord, go to'} <span className="text-white">Server Settings &gt; Integrations</span>.</li>
              <li>{'Create a new Webhook and copy its URL.'}</li>
              <li>{'Paste the URL in the input on the left.'}</li>
              <li>{'Type a message and click Send!'}</li>
            </ol>
          </div>

          <div className="bg-[#23A559]/5 p-6 rounded-2xl border border-[#23A559]/10">
            <h4 className="text-sm font-bold text-[#23A559] mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} /> {'Privacy Note'}
            </h4>
            <p className="text-xs text-[#B5BAC1]">{"Your Webhook URLs are never stored. Requests are sent directly from your browser to Discord's servers."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookTool;

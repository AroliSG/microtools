import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImageIcon, Copy, Check, ExternalLink } from 'lucide-react';
import { FieldLabel, PrimaryButton, ToolCard, ToolHeader, ToolShell } from './ui';

const AssetHelperTool: React.FC = () => {
  const initialParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialTypeParam = initialParams.get('type');
  const initialType: 'avatar' | 'icon' | 'banner' =
    initialTypeParam === 'avatar' || initialTypeParam === 'icon' || initialTypeParam === 'banner'
      ? initialTypeParam
      : 'avatar';
  const initialId = (initialParams.get('id') || '').replace(/\D/g, '');

  const [type, setType] = useState<'avatar' | 'icon' | 'banner'>(initialType);
  const [targetId, setTargetId] = useState(initialId);
  const [assetHash, setAssetHash] = useState('');
  const [rawDiscordJson, setRawDiscordJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [resolveLoading, setResolveLoading] = useState(false);
  const [resolveError, setResolveError] = useState('');
  const [size, setSize] = useState('1024');
  const [copied, setCopied] = useState(false);
  const autoAvatarUrl = targetId ? `https://unavatar.io/discord/${targetId}` : '';
  const defaultAvatarIndex = targetId ? Number((BigInt(targetId) >> 22n) % 6n) : 0;
  const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  const didAutoResolve = useRef(false);

  const getUrl = () => {
    if (!targetId || !assetHash) return '';
    const base = 'https://cdn.discordapp.com';
    switch (type) {
      case 'avatar':
        return `${base}/avatars/${targetId}/${assetHash}.png?size=${size}`;
      case 'icon':
        return `${base}/icons/${targetId}/${assetHash}.png?size=${size}`;
      case 'banner':
        return `${base}/banners/${targetId}/${assetHash}.png?size=${size}`;
      default:
        return '';
    }
  };

  const url = getUrl();
  const downloadUrl = url || (type === 'avatar' && targetId ? autoAvatarUrl : '');

  const copy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = async () => {
    if (!downloadUrl) return;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Could not download image.');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const extension = blob.type.includes('gif') ? 'gif' : blob.type.includes('webp') ? 'webp' : 'png';
      link.download = `${type}-${size}px.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const extractHashFromJson = () => {
    try {
      const parsed = JSON.parse(rawDiscordJson) as Record<string, unknown>;
      const keyByType: Record<'avatar' | 'icon' | 'banner', string> = {
        avatar: 'avatar',
        icon: 'icon',
        banner: 'banner',
      };
      const hash = parsed[keyByType[type]];
      if (typeof hash === 'string' && hash.length > 0) {
        setAssetHash(hash);
        setJsonError('');
      } else {
        setJsonError(`Could not find "${keyByType[type]}" in the JSON.`);
      }
    } catch {
      setJsonError('Invalid JSON.');
    }
  };

  const resolveFromId = async () => {
    if (!targetId) return;
    setResolveLoading(true);
    setResolveError('');
    try {
      const response = await fetch(`https://gatecord.com/wp-json/discord/profile/${targetId}`);
      if (!response.ok) {
        throw new Error('Could not resolve this ID.');
      }
      const data = (await response.json()) as { id?: string; avatar?: string; banner?: string };

      const hash = type === 'avatar' ? data.avatar : type === 'banner' ? data.banner : '';
      if (!hash) {
        throw new Error(`No public ${type} found for this ID.`);
      }
      setAssetHash(hash);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resolve the hash.';
      setResolveError(message);
    } finally {
      setResolveLoading(false);
    }
  };

  useEffect(() => {
    if (didAutoResolve.current) return;
    if (!targetId || assetHash) return;
    if (type !== 'avatar' && type !== 'banner') return;
    if (targetId.length < 17) return;
    didAutoResolve.current = true;
    void resolveFromId();
  }, [targetId, assetHash, type]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('id') && !params.has('type')) return;
    params.delete('id');
    params.delete('type');
    params.delete('assetHash');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  const clearAll = () => {
    setTargetId('');
    setAssetHash('');
    setRawDiscordJson('');
    setJsonError('');
    setResolveError('');
    didAutoResolve.current = false;
  };

  return (
    <ToolShell>
      <ToolHeader title="Asset CDN Helper" description="Build official Discord CDN links for avatars, server icons, and banners." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ToolCard className="space-y-5">
          <div>
            <FieldLabel className="mb-3">{'Asset Type'}</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {(['avatar', 'icon', 'banner'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize transition-all border ${type === t ? 'bg-[#5865F2] text-white border-[#5865F2]' : 'bg-[#1E1F22] text-[#B5BAC1] border-transparent hover:border-[#4E5058]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>{type === 'avatar' ? ('User ID') : ('Server ID')}</FieldLabel>
            <input
              type="text"
              placeholder="e.g. 104245678901234567"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-white mono text-sm"
            />
            <PrimaryButton
              onClick={clearAll}
              className="mt-2 py-2 bg-[#35373C] hover:bg-[#4E5058] text-xs"
            >
              {'Clear'}
            </PrimaryButton>
          </div>

          <div>
            <FieldLabel>Asset Hash</FieldLabel>
            <input
              type="text"
              placeholder={`e.g. ${type === 'avatar' ? 'a_abc123...' : 'abc123...'}`}
              value={assetHash}
              onChange={(e) => setAssetHash(e.target.value)}
              className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-white mono text-sm"
            />
            <p className="mt-2 text-[11px] text-[#B5BAC1]">
              {'This hash comes from Discord JSON field'} <span className="mono text-white">{type}</span>.
            </p>
            <PrimaryButton
              onClick={resolveFromId}
              disabled={!targetId || resolveLoading || type === 'icon'}
              className="mt-2 py-2 text-xs"
            >
              {resolveLoading ? ('Resolving...') : ('Resolve hash by ID')}
            </PrimaryButton>
            <p className="mt-2 text-[10px] text-[#9CA3AF]">
              Powered by API: <span className="mono">gatecord.com/wp-json/discord/profile</span>
            </p>
            {type === 'icon' && (
              <p className="mt-2 text-[11px] text-[#B5BAC1]">{'Server icons need a guild endpoint (not a user ID).'}</p>
            )}
            {resolveError && <p className="mt-2 text-[11px] text-[#ED4245]">{resolveError}</p>}
          </div>

          <div>
            <FieldLabel>{'Discord JSON (optional)'}</FieldLabel>
            <textarea
              rows={4}
              value={rawDiscordJson}
              onChange={(e) => setRawDiscordJson(e.target.value)}
              placeholder={'Paste JSON object containing "avatar", "icon" or "banner"...'}
              className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-white mono text-xs outline-none resize-y"
            />
            <PrimaryButton
              onClick={extractHashFromJson}
              className="mt-2 py-2 bg-[#35373C] hover:bg-[#4E5058] text-xs"
            >
              {'Extract hash from JSON'}
            </PrimaryButton>
            {jsonError && <p className="mt-2 text-[11px] text-[#ED4245]">{jsonError}</p>}
          </div>

          <div>
            <FieldLabel>{'Image Size'}</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-white outline-none"
              >
                {['128', '256', '512', '1024', '2048', '4096'].map((s) => <option key={s} value={s}>{s} px</option>)}
              </select>
              <PrimaryButton
                onClick={downloadImage}
                disabled={!downloadUrl}
                className="text-xs px-3"
              >
                {'Download image'}
              </PrimaryButton>
            </div>
          </div>
        </ToolCard>

        <ToolCard className="flex flex-col items-center justify-center text-center">
          {url ? (
            <div className="w-full space-y-6">
              <div className="relative group mx-auto w-40 h-40">
                <img
                  src={url}
                  alt="Preview"
                  className={`w-full h-full object-cover shadow-2xl transition-all ${type === 'avatar' ? 'rounded-full' : 'rounded-2xl'}`}
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150/2B2D31/5865F2?text=Invalid+Asset')}
                />
              </div>

              <div className="mono bg-[#1E1F22] p-4 rounded-xl text-[10px] text-[#5865F2] break-all border border-[#5865F2]/20">
                {url}
              </div>

              <div className="flex gap-3">
                <PrimaryButton
                  onClick={copy}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? ('Copied') : ('Copy URL')}
                </PrimaryButton>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-[#35373C] hover:bg-[#4E5058] text-white rounded-lg transition-all"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
          ) : targetId ? (
            <div className="w-full space-y-6">
              <div className="relative group mx-auto w-40 h-40">
                <img
                  src={autoAvatarUrl}
                  alt="Auto avatar preview"
                  className="w-full h-full object-cover rounded-full shadow-2xl transition-all"
                  onError={(e) => {
                    if (e.currentTarget.src !== defaultAvatarUrl) {
                      e.currentTarget.src = defaultAvatarUrl;
                    } else {
                      e.currentTarget.src = 'https://via.placeholder.com/150/2B2D31/5865F2?text=No+Avatar';
                    }
                  }}
                />
              </div>
              <div className="bg-[#1E1F22] p-4 rounded-xl text-xs text-[#B5BAC1] border border-[#3F4147]">
                {'ID preview (unavatar -> default avatar). For official CDN URL you still need'} <span className="mono text-white">asset hash</span>.
              </div>
              <a
                href={autoAvatarUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-lg transition-all inline-flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                {'Open image'}
              </a>
            </div>
          ) : (
            <div className="text-[#4E5058]">
              <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">{'Enter a target ID and asset hash to generate the CDN link and see a preview.'}</p>
            </div>
          )}
        </ToolCard>
      </div>
    </ToolShell>
  );
};

export default AssetHelperTool;

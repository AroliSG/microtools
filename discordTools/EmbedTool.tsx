import React, { useRef, useState } from 'react';
import { EmbedData } from './types';
import { Layout, Palette, Type, Plus, Trash2, Send, Wand2, Download, Eraser, Upload } from 'lucide-react';
import { ToolCard, ToolHeader, ToolShell } from './ui';

const createDefaultEmbed = (): EmbedData => ({
  title: 'Welcome to Microtools!',
  description: 'This is an example embed. You can customize title, description, color, media and footer.',
  color: '#5865F2',
  fields: [
    { name: 'Field Name', value: 'This is a value. You can add up to 25 fields.', inline: true },
    { name: 'Inline Field', value: 'I am right next to it!', inline: true },
  ],
  author: { name: 'Embed Master' },
  footer: { text: 'Crafted with passion for Discord users' },
});

const EmbedTool: React.FC = () => {
  const [embed, setEmbed] = useState<EmbedData>(createDefaultEmbed());
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateEmbed = (key: keyof EmbedData, value: unknown) => {
    setEmbed((prev) => ({ ...prev, [key]: value }));
  };

  const addField = () => {
    if (embed.fields.length >= 25) return;
    updateEmbed('fields', [...embed.fields, { name: 'New Field', value: 'Value', inline: false }]);
  };

  const removeField = (index: number) => {
    const newFields = [...embed.fields];
    newFields.splice(index, 1);
    updateEmbed('fields', newFields);
  };

  const updateField = (index: number, key: 'name' | 'value' | 'inline', value: unknown) => {
    const newFields = [...embed.fields];
    newFields[index] = { ...newFields[index], [key]: value };
    updateEmbed('fields', newFields);
  };

  const toggleTimestamp = (enabled: boolean) => {
    updateEmbed('timestamp', enabled ? new Date().toISOString() : undefined);
  };

  const exportJson = () => {
    const payload = { embeds: [embed] };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'embed.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const clearEmbed = () => {
    setEmbed({
      title: '',
      description: '',
      color: '#5865F2',
      fields: [],
      author: { name: '', icon_url: '' },
      footer: { text: '', icon_url: '' },
      url: '',
      image: { url: '' },
      thumbnail: { url: '' },
      timestamp: undefined,
    });
  };

  const normalizeImportedEmbed = (input: unknown): EmbedData | null => {
    if (!input || typeof input !== 'object') return null;

    const source = input as Record<string, unknown>;
    const candidate =
      Array.isArray(source.embeds) && source.embeds.length > 0
        ? (source.embeds[0] as Record<string, unknown>)
        : source;

    if (!candidate || typeof candidate !== 'object') return null;

    return {
      title: typeof candidate.title === 'string' ? candidate.title : '',
      description: typeof candidate.description === 'string' ? candidate.description : '',
      url: typeof candidate.url === 'string' ? candidate.url : '',
      color: typeof candidate.color === 'string' ? candidate.color : '#5865F2',
      timestamp: typeof candidate.timestamp === 'string' ? candidate.timestamp : undefined,
      author:
        candidate.author && typeof candidate.author === 'object'
          ? {
              name: typeof (candidate.author as Record<string, unknown>).name === 'string' ? ((candidate.author as Record<string, unknown>).name as string) : '',
              url: typeof (candidate.author as Record<string, unknown>).url === 'string' ? ((candidate.author as Record<string, unknown>).url as string) : undefined,
              icon_url:
                typeof (candidate.author as Record<string, unknown>).icon_url === 'string'
                  ? ((candidate.author as Record<string, unknown>).icon_url as string)
                  : undefined,
            }
          : { name: '' },
      footer:
        candidate.footer && typeof candidate.footer === 'object'
          ? {
              text: typeof (candidate.footer as Record<string, unknown>).text === 'string' ? ((candidate.footer as Record<string, unknown>).text as string) : '',
              icon_url:
                typeof (candidate.footer as Record<string, unknown>).icon_url === 'string'
                  ? ((candidate.footer as Record<string, unknown>).icon_url as string)
                  : undefined,
            }
          : { text: '' },
      image:
        candidate.image && typeof candidate.image === 'object' && typeof (candidate.image as Record<string, unknown>).url === 'string'
          ? { url: (candidate.image as Record<string, unknown>).url as string }
          : { url: '' },
      thumbnail:
        candidate.thumbnail && typeof candidate.thumbnail === 'object' && typeof (candidate.thumbnail as Record<string, unknown>).url === 'string'
          ? { url: (candidate.thumbnail as Record<string, unknown>).url as string }
          : { url: '' },
      fields: Array.isArray(candidate.fields)
        ? (candidate.fields as unknown[])
            .filter((f) => f && typeof f === 'object')
            .map((f) => {
              const field = f as Record<string, unknown>;
              return {
                name: typeof field.name === 'string' ? field.name : '',
                value: typeof field.value === 'string' ? field.value : '',
                inline: Boolean(field.inline),
              };
            })
            .slice(0, 25)
        : [],
    };
  };

  const importJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const normalized = normalizeImportedEmbed(parsed);
      if (!normalized) throw new Error('Invalid format');
      setEmbed(normalized);
      setImportError('');
    } catch {
      setImportError('Invalid JSON file. Expected an embed object or { embeds: [...] }.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <ToolShell>
      <ToolHeader title="Embed Creator" description="Build rich Discord embeds with complete data and export/import JSON." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <ToolCard className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#B5BAC1] uppercase tracking-wider flex items-center gap-2">
                <Type size={16} /> Content
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-lg bg-[#35373C] hover:bg-[#4E5058] text-white text-xs font-bold inline-flex items-center gap-1"
                >
                  <Upload size={14} />
                  Import JSON
                </button>
                <button onClick={exportJson} className="px-3 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold inline-flex items-center gap-1">
                  <Download size={14} />
                  Export JSON
                </button>
                <button onClick={clearEmbed} className="px-3 py-2 rounded-lg bg-[#35373C] hover:bg-[#4E5058] text-white text-xs font-bold inline-flex items-center gap-1">
                  <Eraser size={14} />
                  Clear
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={importJson}
              className="hidden"
            />
            {importError && <p className="text-xs text-[#ED4245]">{importError}</p>}

            <div className="space-y-3">
              <input
                placeholder="Author Name"
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-sm text-white outline-none"
                value={embed.author?.name || ''}
                onChange={(e) => updateEmbed('author', { ...embed.author, name: e.target.value })}
              />
              <input
                placeholder="Author Icon URL"
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-sm text-white outline-none"
                value={embed.author?.icon_url || ''}
                onChange={(e) => updateEmbed('author', { ...embed.author, icon_url: e.target.value })}
              />
              <input
                placeholder="Embed Title"
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 font-bold text-sm text-white outline-none"
                value={embed.title || ''}
                onChange={(e) => updateEmbed('title', e.target.value)}
              />
              <input
                placeholder="Title URL (optional)"
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-sm text-white outline-none"
                value={embed.url || ''}
                onChange={(e) => updateEmbed('url', e.target.value)}
              />
              <textarea
                placeholder="Embed Description (Markdown supported)"
                rows={4}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-sm text-white outline-none resize-none"
                value={embed.description || ''}
                onChange={(e) => updateEmbed('description', e.target.value)}
              />
            </div>

            <h3 className="text-sm font-bold text-[#B5BAC1] uppercase tracking-wider pt-2 flex items-center gap-2">
              <Palette size={16} /> Appearance & Media
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#B5BAC1] mb-1">Sidebar Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="h-10 w-12 bg-transparent border-none outline-none cursor-pointer"
                    value={embed.color || '#5865F2'}
                    onChange={(e) => updateEmbed('color', e.target.value)}
                  />
                  <input
                    className="flex-1 bg-[#1E1F22] border border-[#1E1F22] rounded-lg px-3 text-xs text-white uppercase"
                    value={embed.color || ''}
                    onChange={(e) => updateEmbed('color', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-xs text-[#B5BAC1]">
                  <input
                    type="checkbox"
                    checked={Boolean(embed.timestamp)}
                    onChange={(e) => toggleTimestamp(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Include timestamp
                </label>
              </div>
              <input
                placeholder="Thumbnail URL"
                className="bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-xs text-white outline-none"
                value={embed.thumbnail?.url || ''}
                onChange={(e) => updateEmbed('thumbnail', { url: e.target.value })}
              />
              <input
                placeholder="Image URL"
                className="bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-xs text-white outline-none"
                value={embed.image?.url || ''}
                onChange={(e) => updateEmbed('image', { url: e.target.value })}
              />
              <input
                placeholder="Footer text"
                className="bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-xs text-white outline-none"
                value={embed.footer?.text || ''}
                onChange={(e) => updateEmbed('footer', { ...embed.footer, text: e.target.value })}
              />
              <input
                placeholder="Footer icon URL"
                className="bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-xs text-white outline-none"
                value={embed.footer?.icon_url || ''}
                onChange={(e) => updateEmbed('footer', { ...embed.footer, icon_url: e.target.value })}
              />
            </div>
          </ToolCard>

          <ToolCard className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#B5BAC1] uppercase tracking-wider flex items-center gap-2">
                <Layout size={16} /> Fields ({embed.fields.length}/25)
              </h3>
              <button
                onClick={addField}
                className="p-1.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {embed.fields.map((field, idx) => (
                <div key={idx} className="bg-[#1E1F22] p-4 rounded-xl space-y-3 relative group">
                  <button
                    onClick={() => removeField(idx)}
                    className="absolute top-2 right-2 text-[#F23F43] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#F23F43]/10 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Name"
                      className="bg-[#2B2D31] border-none rounded-md p-2 text-xs text-white outline-none"
                      value={field.name}
                      onChange={(e) => updateField(idx, 'name', e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`inline-${idx}`}
                        checked={field.inline}
                        onChange={(e) => updateField(idx, 'inline', e.target.checked)}
                        className="rounded border-none text-[#5865F2] focus:ring-0 w-4 h-4"
                      />
                      <label htmlFor={`inline-${idx}`} className="text-[10px] text-[#B5BAC1]">Inline</label>
                    </div>
                  </div>
                  <textarea
                    placeholder="Value"
                    className="w-full bg-[#2B2D31] border-none rounded-md p-2 text-xs text-white outline-none resize-none"
                    value={field.value}
                    onChange={(e) => updateField(idx, 'value', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </ToolCard>
        </div>

        <div className="lg:sticky lg:top-4 space-y-6">
          <ToolCard className="p-8 shadow-2xl">
            <h4 className="text-xs font-bold text-[#B5BAC1] uppercase mb-6 flex items-center gap-2">
              <Wand2 size={14} className="text-[#5865F2]" /> Real-time Preview
            </h4>

            <div className="bg-[#313338] rounded-md p-4 flex gap-4 border border-[#232428] max-w-full">
              <div className="w-10 h-10 rounded-full bg-[#5865F2] flex-shrink-0 flex items-center justify-center text-white">
                <Send size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-white text-sm">Microtools Bot</span>
                  <span className="bg-[#5865F2] text-[10px] font-bold text-white px-1 rounded-sm">BOT</span>
                  <span className="text-[10px] text-[#B5BAC1]">Today at 4:20 PM</span>
                </div>

                <div className="flex rounded-md overflow-hidden bg-[#2B2D31] border-l-4" style={{ borderLeftColor: embed.color || '#5865F2' }}>
                  <div className="p-3 pr-4 flex-1">
                    {embed.author?.name && (
                      <div className="flex items-center gap-2 mb-2">
                        {embed.author.icon_url && <img src={embed.author.icon_url} className="w-6 h-6 rounded-full" alt="" />}
                        <span className="text-xs font-bold text-white">{embed.author.name}</span>
                      </div>
                    )}
                    {embed.title && (
                      <a href={embed.url || '#'} target={embed.url ? '_blank' : undefined} rel="noreferrer" className="text-sm font-bold text-white mb-2 hover:underline cursor-pointer inline-block">
                        {embed.title}
                      </a>
                    )}
                    {embed.description && <div className="text-sm text-[#DBDEE1] whitespace-pre-wrap mb-3 leading-relaxed">{embed.description}</div>}

                    {embed.fields.length > 0 && (
                      <div className="grid grid-cols-12 gap-x-2 gap-y-3 mt-3">
                        {embed.fields.map((f, i) => (
                          <div key={i} className={`${f.inline ? 'col-span-4' : 'col-span-12'}`}>
                            <div className="text-xs font-bold text-white mb-1">{f.name}</div>
                            <div className="text-xs text-[#DBDEE1]">{f.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {embed.image?.url && (
                      <img src={embed.image.url} alt="" className="mt-3 rounded-md max-h-56 w-full object-cover" />
                    )}

                    {(embed.footer?.text || embed.timestamp) && (
                      <div className="mt-4 flex items-center gap-2">
                        {embed.footer?.icon_url && <img src={embed.footer.icon_url} className="w-4 h-4 rounded-full" alt="" />}
                        {embed.footer?.text && <span className="text-[10px] text-[#DBDEE1]">{embed.footer.text}</span>}
                        {embed.timestamp && <span className="text-[10px] text-[#B5BAC1]">• {new Date(embed.timestamp).toLocaleString()}</span>}
                      </div>
                    )}
                  </div>
                  {embed.thumbnail?.url && (
                    <div className="p-3">
                      <img src={embed.thumbnail.url} alt="" className="w-20 h-20 rounded-md object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ToolCard>

          <ToolCard>
            <h4 className="text-xs font-bold text-[#B5BAC1] uppercase mb-4">JSON Output</h4>
            <pre className="mono bg-[#1E1F22] p-4 rounded-xl text-[10px] text-[#B5BAC1] overflow-x-auto">
              {JSON.stringify({ embeds: [embed] }, null, 2)}
            </pre>
          </ToolCard>
        </div>
      </div>
    </ToolShell>
  );
};

export default EmbedTool;

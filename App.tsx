
import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { ToolType } from './discordTools/types';
import TimestampTool from './discordTools/TimestampTool';
import SnowflakeTool from './discordTools/SnowflakeTool';
import PermissionTool from './discordTools/PermissionTool';
import EmbedTool from './discordTools/EmbedTool';
import InviteTool from './discordTools/InviteTool';
import MarkdownTool from './discordTools/MarkdownTool';
import ChannelDecoratorTool from './discordTools/ChannelDecoratorTool';
import WebhookTool from './discordTools/WebhookTool';
import TextTransformTool from './discordTools/TextTransformTool';
import AssetHelperTool from './discordTools/AssetHelperTool';
import ColorTool from './discordTools/ColorTool';
import EmojiMakerTool from './discordTools/EmojiMakerTool';
import { 
  Clock, 
  Fingerprint, 
  ShieldCheck, 
  Link2,
  Type,
  Sparkles,
  RefreshCw,
  ImageIcon,
  Palette,
  Smile,
  Layout, 
  Webhook, 
  Search,
  ScanSearch,
  SunMoon,
  Coffee,
  LifeBuoy,
  Menu, 
  X,
  ArrowRight,
  Home,
  MessageCircle
} from 'lucide-react';

type ThemeMode = 'dark' | 'light';
type Collection = 'home' | 'discord' | 'whatsapp';

interface ToolDefinition {
  key: ToolType;
  icon: React.ReactNode;
  section: 'discovery' | 'creativity' | 'utilities';
  comingSoon?: boolean;
}

interface SearchableTool {
  key: ToolType;
  label: string;
  section: ToolDefinition['section'];
}

const IDLookupTool = lazy(() => import('./discordTools/IDLookupTool'));

const DiscordLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3a13.952 13.952 0 0 0-.598 1.214 18.27 18.27 0 0 0-5.574 0A13.582 13.582 0 0 0 9.115 3a19.736 19.736 0 0 0-4.433 1.37C1.885 8.58 1.128 12.686 1.5 16.732a19.9 19.9 0 0 0 5.43 2.77 13.275 13.275 0 0 0 1.165-1.908 12.991 12.991 0 0 1-1.84-.88c.154-.111.305-.227.451-.345 3.548 1.653 7.397 1.653 10.903 0 .147.12.298.236.452.345-.585.34-1.2.635-1.842.88.34.678.728 1.316 1.165 1.908a19.848 19.848 0 0 0 5.432-2.77c.437-4.69-.747-8.757-3.183-12.363ZM9.47 14.248c-1.06 0-1.933-.98-1.933-2.179 0-1.2.853-2.179 1.933-2.179 1.089 0 1.953.99 1.934 2.179 0 1.198-.854 2.179-1.934 2.179Zm5.06 0c-1.06 0-1.933-.98-1.933-2.179 0-1.2.853-2.179 1.934-2.179 1.088 0 1.953.99 1.933 2.179 0 1.198-.844 2.179-1.933 2.179Z" />
  </svg>
);

const getInitialCollectionFromUrl = (): Collection => {
  const params = new URLSearchParams(window.location.search);
  const suite = params.get('suite');
  if (suite === 'discord' || suite === 'whatsapp') return suite;

  const fromUrlTool = params.get('tool');
  const validTools = new Set(Object.values(ToolType));
  if (fromUrlTool && validTools.has(fromUrlTool as ToolType)) return 'discord';

  return 'home';
};

const getInitialToolFromUrl = (): ToolType => {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('tool');
  const validTools = new Set(Object.values(ToolType));
  return fromUrl && validTools.has(fromUrl as ToolType) ? (fromUrl as ToolType) : ToolType.TIMESTAMP;
};

const getInitialTheme = (): ThemeMode => {
  const stored = window.localStorage.getItem('mt.theme');
  return stored === 'light' ? 'light' : 'dark';
};

const toolLabel = (key: ToolType): string => {
  const labels: Record<ToolType, string> = {
    [ToolType.TIMESTAMP]: 'Timestamps',
    [ToolType.SNOWFLAKE]: 'Snowflake Decoder',
    [ToolType.ID_LOOKUP]: 'ID Lookup',
    [ToolType.PERMISSIONS]: 'Permission Calc',
    [ToolType.INVITE]: 'Invite Generator',
    [ToolType.MARKDOWN]: 'Markdown Helper',
    [ToolType.CHANNEL_DECORATOR]: 'Channel Decorator',
    [ToolType.EMOJI_MAKER]: 'Emoji Maker',
    [ToolType.TEXT_TRANSFORM]: 'Text Transform',
    [ToolType.ASSET_CDN]: 'Asset CDN Helper',
    [ToolType.COLOR_GUIDE]: 'Color Guide',
    [ToolType.EMBED]: 'Embed Creator',
    [ToolType.WEBHOOK]: 'Webhook Tool',
  };

  return labels[key];
};

const App: React.FC = () => {
  const [activeCollection, setActiveCollection] = useState<Collection>(getInitialCollectionFromUrl);
  const [activeTool, setActiveTool] = useState<ToolType>(getInitialToolFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => window.innerWidth >= 768);
  const [search, setSearch] = useState('');
  const [homeSearch, setHomeSearch] = useState('');
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  const tools: ToolDefinition[] = [
    { key: ToolType.SNOWFLAKE, icon: <Fingerprint size={20} />, section: 'discovery' },
    { key: ToolType.ID_LOOKUP, icon: <ScanSearch size={20} />, section: 'discovery' },
    { key: ToolType.ASSET_CDN, icon: <ImageIcon size={20} />, section: 'discovery' },
    { key: ToolType.COLOR_GUIDE, icon: <Palette size={20} />, section: 'discovery' },
    { key: ToolType.MARKDOWN, icon: <Type size={20} />, section: 'creativity' },
    { key: ToolType.CHANNEL_DECORATOR, icon: <Sparkles size={20} />, section: 'creativity' },
    { key: ToolType.EMOJI_MAKER, icon: <Smile size={20} />, section: 'creativity' },
    { key: ToolType.TEXT_TRANSFORM, icon: <RefreshCw size={20} />, section: 'creativity' },
    { key: ToolType.EMBED, icon: <Layout size={20} />, section: 'creativity' },
    { key: ToolType.TIMESTAMP, icon: <Clock size={20} />, section: 'utilities' },
    { key: ToolType.PERMISSIONS, icon: <ShieldCheck size={20} />, section: 'utilities' },
    { key: ToolType.INVITE, icon: <Link2 size={20} />, section: 'utilities' },
    { key: ToolType.WEBHOOK, icon: <Webhook size={20} />, section: 'utilities' },
  ];

  const visibleTools = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return tools;
    return tools.filter((tool) => toolLabel(tool.key).toLowerCase().includes(normalized));
  }, [search]);

  const searchableTools = useMemo<SearchableTool[]>(() => {
    return tools.map((tool) => ({
      key: tool.key,
      label: toolLabel(tool.key),
      section: tool.section,
    }));
  }, [tools]);

  const homeSearchResults = useMemo(() => {
    const normalized = homeSearch.trim().toLowerCase();
    if (!normalized) return [];
    return searchableTools.filter((tool) => {
      const sectionText = tool.section.toLowerCase();
      return tool.label.toLowerCase().includes(normalized) || sectionText.includes(normalized);
    });
  }, [homeSearch, searchableTools]);

  const groupedTools = useMemo(() => {
    const sectionOrder: Array<ToolDefinition['section']> = ['discovery', 'creativity', 'utilities'];
    const sectionLabel: Record<ToolDefinition['section'], string> = {
      discovery: 'Discovery',
      creativity: 'Creativity',
      utilities: 'Utilities',
    };

    return sectionOrder
      .map((section) => ({
        key: section,
        label: sectionLabel[section],
        items: visibleTools.filter((tool) => tool.section === section),
      }))
      .filter((group) => group.items.length > 0);
  }, [visibleTools]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (activeCollection === 'home') {
      params.delete('suite');
      params.delete('tool');
    } else if (activeCollection === 'discord') {
      params.set('suite', 'discord');
      params.set('tool', activeTool);
    } else if (activeCollection === 'whatsapp') {
      params.set('suite', 'whatsapp');
      params.delete('tool');
    }

    const query = params.toString();
    window.history.replaceState({}, '', query ? `${window.location.pathname}?${query}` : window.location.pathname);
  }, [activeCollection, activeTool]);

  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  useEffect(() => {
    window.localStorage.setItem('mt.theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.TIMESTAMP:
        return <TimestampTool />;
      case ToolType.SNOWFLAKE:
        return <SnowflakeTool />;
      case ToolType.ID_LOOKUP:
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[60vh] text-[#B5BAC1]">
                Loading ID Lookup...
              </div>
            }
          >
            <IDLookupTool />
          </Suspense>
        );
      case ToolType.PERMISSIONS:
        return <PermissionTool />;
      case ToolType.INVITE:
        return <InviteTool />;
      case ToolType.MARKDOWN:
        return <MarkdownTool />;
      case ToolType.CHANNEL_DECORATOR:
        return <ChannelDecoratorTool />;
      case ToolType.EMOJI_MAKER:
        return <EmojiMakerTool />;
      case ToolType.TEXT_TRANSFORM:
        return <TextTransformTool />;
      case ToolType.ASSET_CDN:
        return <AssetHelperTool />;
      case ToolType.COLOR_GUIDE:
        return <ColorTool />;
      case ToolType.EMBED:
        return <EmbedTool />;
      case ToolType.WEBHOOK:
        return <WebhookTool />;
      default:
        return <TimestampTool />;
    }
  };

  const controls = (
    <div className="flex items-center gap-2 bg-[#2B2D31]/95 border border-[#3F4147] rounded-xl px-2 py-2 shadow-lg backdrop-blur">
      <a
        href="https://discord.gg/GmYTrawxCH"
        target="_blank"
        rel="noreferrer"
        className="h-9 w-9 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white inline-flex items-center justify-center"
        title="Support"
        aria-label="Support"
      >
        <LifeBuoy size={16} />
      </a>
      <a
        href="https://www.paypal.com/paypalme/arolyreyes"
        target="_blank"
        rel="noreferrer"
        className="h-9 w-9 rounded-lg bg-[#35373C] hover:bg-[#4E5058] text-white inline-flex items-center justify-center"
        title="Buy me a coffee"
        aria-label="Buy me a coffee"
      >
        <Coffee size={16} />
      </a>
      {activeCollection !== 'home' && (
        <button
          onClick={() => setActiveCollection('home')}
          className="h-9 w-9 rounded-lg bg-[#35373C] hover:bg-[#4E5058] text-white inline-flex items-center justify-center"
          title="Back to home"
          aria-label="Back to home"
        >
          <Home size={16} />
        </button>
      )}
      <button
        onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        className="h-9 w-9 rounded-lg bg-[#35373C] hover:bg-[#4E5058] text-white inline-flex items-center justify-center"
        title={theme === 'dark' ? 'Enable light mode' : 'Enable dark mode'}
        aria-label={theme === 'dark' ? 'Enable light mode' : 'Enable dark mode'}
      >
        <SunMoon size={16} />
      </button>
    </div>
  );

  if (activeCollection === 'home') {
    return (
      <div className="min-h-screen bg-[#1E1F22] text-[#DBDEE1] flex flex-col">
        <header className="sticky top-0 z-40 border-b border-[#3F4147] bg-[#1E1F22]/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <button onClick={() => setActiveCollection('home')} className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-[#5865F2] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Webhook size={20} />
              </div>
              <div>
                <p className="font-bold text-white leading-tight">Microtools</p>
                <p className="text-xs text-[#9CA3AF]">Tools hub</p>
              </div>
            </button>

            {controls}
          </div>
        </header>

        <main className="max-w-6xl w-full mx-auto px-4 py-14 md:py-20 flex-1">
          <div className="max-w-2xl mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Microtools</h1>
            </div>
            <p className="mt-4 text-[#B5BAC1] text-base md:text-lg">
              Platform-based tool collections. Today: Discord. Next: WhatsApp and more.
            </p>
          </div>

          <section className="mb-8">
            <label className="relative block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={homeSearch}
                onChange={(event) => setHomeSearch(event.target.value)}
                placeholder="Search across all tools..."
                className="w-full bg-[#2B2D31] border border-[#3A3F48] focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] rounded-lg py-3 pl-9 pr-3 outline-none text-sm text-white"
              />
            </label>

            {homeSearch.trim() && (
              <div className="mt-3 bg-[#2B2D31] border border-[#3F4147] rounded-xl overflow-hidden">
                {homeSearchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-[#9CA3AF]">
                    No tools found.
                  </p>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    {homeSearchResults.map((result) => (
                      <button
                        key={result.key}
                        onClick={() => {
                          setActiveCollection('discord');
                          setActiveTool(result.key);
                          setHomeSearch('');
                        }}
                        className="w-full text-left px-4 py-3 border-b last:border-b-0 border-[#3F4147] hover:bg-[#35373C] transition-colors"
                      >
                        <p className="text-sm font-semibold text-white">{result.label}</p>
                        <p className="text-xs text-[#B5BAC1]">
                          Discord - {result.section.charAt(0).toUpperCase() + result.section.slice(1)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setActiveCollection('discord')}
              className="text-left bg-[#2B2D31] rounded-2xl border border-[#3F4147] p-6 hover:border-[#5865F2] transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#5865F2] rounded-xl flex items-center justify-center text-white">
                  <DiscordLogo size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Discord Tools</h2>
                  <p className="text-xs text-[#B5BAC1]">
                    Active collection
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#B5BAC1] mb-6">
                Timestamps, embeds, webhook, assets, markdown and more.
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                Enter <ArrowRight size={16} />
              </span>
            </button>

            <div className="bg-[#2B2D31] rounded-2xl border border-[#3F4147] p-6 opacity-80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center text-white">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">WhatsApp Tools</h2>
                  <p className="text-xs text-[#B5BAC1]">
                    Coming soon
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#B5BAC1] mb-6">
                Generators and utilities for messages, formatting and automation.
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveCollection('whatsapp')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#DBDEE1]"
                >
                  Enter <ArrowRight size={16} />
                </button>
                <span className="inline-flex items-center text-xs px-2 py-1 rounded bg-[#FEE75C]/15 text-[#FEE75C] uppercase tracking-wide">
                  Soon
                </span>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#3F4147] bg-[#2B2D31]">
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white font-semibold">Microtools</p>
              <p className="mt-2 text-sm text-[#B5BAC1]">
                Platform collections for creators and admins.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold">Collections</p>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <button onClick={() => setActiveCollection('discord')} className="text-left text-[#B5BAC1] hover:text-white">
                  Discord Tools
                </button>
                <button onClick={() => setActiveCollection('whatsapp')} className="text-left text-[#B5BAC1] hover:text-white">
                  WhatsApp Tools
                </button>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold">Author</p>
              <p className="mt-2 text-sm text-[#B5BAC1]">AroliSG</p>
              <a
                href="https://discord.gg/GmYTrawxCH"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-[#5865F2] hover:underline"
              >
                Contact
              </a>
              <p className="mt-2 text-xs text-[#9CA3AF]">© {new Date().getFullYear()} Microtools</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (activeCollection === 'whatsapp') {
    return (
      <div className="min-h-screen bg-[#1E1F22] text-[#DBDEE1] flex flex-col">
        <header className="sticky top-0 z-40 border-b border-[#3F4147] bg-[#1E1F22]/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <button onClick={() => setActiveCollection('home')} className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-[#5865F2] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Webhook size={20} />
              </div>
              <div>
                <p className="font-bold text-white leading-tight">Microtools</p>
                <p className="text-xs text-[#9CA3AF]">Tools hub</p>
              </div>
            </button>
            {controls}
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-24 text-center flex-1">
          <div className="w-14 h-14 mx-auto bg-[#25D366] rounded-2xl flex items-center justify-center text-white mb-6">
            <MessageCircle size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            WhatsApp Tools
          </h1>
          <p className="mt-4 text-[#B5BAC1]">
            This collection will be available soon.
          </p>
          <button
            onClick={() => setActiveCollection('home')}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold"
          >
            <Home size={16} />
            Back to Home
          </button>
        </main>

        <footer className="border-t border-[#3F4147] bg-[#2B2D31]">
          <div className="max-w-6xl mx-auto px-4 py-5 text-sm text-[#B5BAC1]">
            Creator: putmr
            {' • '}
            <a
              href="https://discord.gg/GmYTrawxCH"
              target="_blank"
              rel="noreferrer"
              className="text-[#5865F2] hover:underline"
            >
              Discord Server
            </a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#1E1F22] text-[#DBDEE1]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-[#5865F2] rounded-full shadow-lg text-white"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed md:relative z-40 h-full transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-64 md:w-72 bg-[#2B2D31] flex flex-col border-r border-[#1E1F22]
      `}>
        <div className="p-6 flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5865F2] rounded-xl flex items-center justify-center text-white shadow-lg">
                <DiscordLogo size={22} />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-white">Discord Tools</h1>
                <p className="text-xs text-[#9CA3AF]">Discord collection</p>
              </div>
            </div>
 
   
          </div>

          <label className="relative block mb-5">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tool..."
              className="w-full bg-[#1E1F22] border border-[#3A3F48] focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] rounded-lg py-2.5 pl-9 pr-3 outline-none text-sm text-white"
            />
          </label>

          <nav className="space-y-1">
            {visibleTools.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] px-2 py-2">No matching tools found.</p>
            ) : (
              groupedTools.map((group) => (
                <div key={group.key} className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] px-2 mb-1">{group.label}</p>
                  <div className="space-y-1">
                    {group.items.map((tool) => (
                      <SidebarItem
                        key={tool.key}
                        icon={tool.icon}
                        label={toolLabel(tool.key)}
                        active={activeTool === tool.key}
                        comingSoon={tool.comingSoon}
                        onClick={() => {
                          setActiveTool(tool.key);
                          if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-[#1E1F22]">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#35373C] transition-colors">
            <div className="rounded-full w-8 h-8 bg-[#5865F2] grid place-items-center text-xs font-bold text-white">
              MT
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Workspace Local</p>
              <p className="text-xs text-[#B5BAC1] truncate">v1.1 - React Edition</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-[#313338] relative">
        <div className="sticky top-3 z-30 flex justify-end p-3 pb-0">{controls}</div>
        <div className="max-w-6xl mx-auto p-4 md:p-8 relative">{renderTool()}</div>
      </main>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  comingSoon?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, comingSoon, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200
      ${active 
        ? 'bg-[#404249] text-white shadow-sm' 
        : 'text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1]'}
    `}
  >
    <span className={active ? 'text-[#5865F2]' : ''}>{icon}</span>
    <span className="font-medium text-sm">{label}</span>
    {comingSoon && <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#FEE75C]/15 text-[#FEE75C]">Soon</span>}
    {active && <div className="ml-auto w-1 h-4 bg-[#5865F2] rounded-full" />}
  </button>
);

export default App;




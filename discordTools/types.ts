export enum ToolType {
  TIMESTAMP = 'timestamp',
  SNOWFLAKE = 'snowflake',
  ID_LOOKUP = 'id-lookup',
  PERMISSIONS = 'permissions',
  INVITE = 'invite',
  MARKDOWN = 'markdown',
  CHANNEL_DECORATOR = 'channel-decorator',
  EMOJI_MAKER = 'emoji-maker',
  TEXT_TRANSFORM = 'text-transform',
  ASSET_CDN = 'asset-cdn',
  COLOR_GUIDE = 'color-guide',
  EMBED = 'embed',
  WEBHOOK = 'webhook',
}

export interface Permission {
  name: string;
  value: bigint;
  description: string;
}

export interface EmbedData {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  timestamp?: string;
  footer?: { text: string; icon_url?: string };
  image?: { url: string };
  thumbnail?: { url: string };
  author?: { name: string; url?: string; icon_url?: string };
  fields: Array<{ name: string; value: string; inline?: boolean }>;
}

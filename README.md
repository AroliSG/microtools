# Microtools

Microtools is a growing collection of practical web tools for multiple platforms (Discord, WhatsApp, Telegram, and more).

Current focus: **Discord Tools**.

## What's New

- `v1.0.0` released (see `CHANGELOG.md`)
- New Emoji Maker
- Shared UI refactor for major tools

## Features (Current)

- Timestamp Generator
- Snowflake Decoder
- ID Lookup
- Permission Calculator
- Invite Generator
- Markdown Helper
- Channel Decorator
- Text Transform
- Asset CDN Helper
- Color Guide
- Embed Creator
- Webhook Sender
- Emoji Maker

## Tech Stack

- React + TypeScript
- Vite
- Tailwind utility classes (inline)
- Lucide icons

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

Build output is generated in:

`dist/`

## Deployment (Manual VPS)

1. Run `npm run build`
2. Upload `dist/` contents to your web root (example):
   - `/www/wwwroot/microtools.arolisg.dev/`
3. Replace existing files
4. Clear CDN cache (if enabled)

## SEO

Includes:

- `public/robots.txt`
- `public/sitemap.xml`
- canonical metadata in `index.html`

## Roadmap

- See `ROADMAP.md`

## Project Docs

- `CHANGELOG.md`
- `ROADMAP.md`
- `DEPLOY_CHECKLIST.md`
- `OPERATIONS_CHECKLIST.md`
- `ANALYTICS_SETUP.md`

## License

MIT

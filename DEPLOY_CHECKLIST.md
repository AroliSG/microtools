# Deploy Checklist

## Pre-deploy

- `npm install`
- `npm run build`
- Verify `dist/` includes:
  - `index.html`
  - `assets/`
  - `robots.txt`
  - `sitemap.xml`
  - `favicon.svg`
  - `og-cover.svg`

## SEO quick check

- `index.html` canonical points to:
  - `https://microtools.arolisg.dev/`
- `public/robots.txt` sitemap URL is correct
- `public/sitemap.xml` root URL is correct

## Deploy to aaPanel

1. Upload **contents of `dist/`** to:
   - `/www/wwwroot/microtools.arolisg.dev/`
2. Ensure Nginx SPA fallback:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Post-deploy QA

- Landing loads on desktop/mobile
- Home search opens the right tool
- Dark/light mode works
- Core tools:
  - Timestamp
  - Snowflake
  - ID Lookup
  - Asset CDN
  - Embed
  - Webhook
  - Emoji Maker

## Cache

- Hard refresh (`Ctrl+F5`)
- Purge CDN cache if enabled

# Operations Checklist

## Release Checklist

1. Update `CHANGELOG.md`.
2. Run:
   - `npm install`
   - `npm run build`
3. Validate core tools manually:
   - Timestamp
   - Snowflake
   - ID Lookup
   - Asset CDN
   - Embed
   - Webhook
4. Push to `main`.
5. Tag release (`vX.Y.Z`).
6. Create GitHub release notes from changelog.

## Manual Deploy Checklist (aaPanel)

1. Build locally: `npm run build`
2. Upload contents of `dist/` to:
   - `/www/wwwroot/microtools.arolisg.dev/`
3. Ensure SPA fallback on Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

4. Hard refresh and verify production.

## Backup Checklist

### Before deploy
- Backup current web root folder.
- Backup Nginx vhost config.

### Weekly
- Backup `/www/wwwroot/microtools.arolisg.dev/`
- Backup SSL cert path
- Backup aaPanel database/config export (if used)

### Restore drill (monthly)
- Restore latest backup to test path
- Verify site loads
- Verify at least 3 critical tools

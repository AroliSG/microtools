# Deploy Checklist

## 1) Pre-deploy

- [ ] Instalar dependencias
  - `npm install`
- [ ] Compilar producción
  - `npm run build`
- [ ] Confirmar que `dist/` contiene:
  - `index.html`
  - `assets/`
  - `robots.txt`
  - `sitemap.xml`
  - `favicon.svg`
  - `og-cover.svg`

## 2) SEO mínimo obligatorio

- [ ] Reemplazar dominio `example.com` por tu dominio real en:
  - `index.html` (`canonical`)
  - `public/robots.txt` (`Sitemap`)
  - `public/sitemap.xml` (`loc`)
- [ ] Recompilar después del cambio:
  - `npm run build`

## 3) Deploy (aaPanel / Nginx static)

- [ ] Tipo de sitio: `Static` (no PHP)
- [ ] Subir **contenido de `dist/`** al Document Root
- [ ] Configurar SPA fallback:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

- [ ] Si usas `AssetHelper` con endpoint `/api/pfpfinder/user/...`, agregar proxy:

```nginx
location /api/pfpfinder/user/ {
  proxy_pass https://pfpfinder.com/api/discord/user/;
  proxy_set_header Host pfpfinder.com;
  proxy_ssl_server_name on;
}
```

- [ ] Recargar Nginx

## 4) QA rápida post-deploy

- [ ] Landing carga bien (desktop/mobile)
- [ ] Botones navbar/footer funcionan
- [ ] Search del landing abre tools correctas
- [ ] Toggle idioma funciona en todas las vistas
- [ ] Toggle dark/light sin estilos rotos
- [ ] Discord suite:
  - [ ] Timestamp
  - [ ] Snowflake
  - [ ] Permission
  - [ ] Invite
  - [ ] Markdown
  - [ ] Text Transform
  - [ ] Embed (export JSON + clear)
  - [ ] Webhook
  - [ ] Asset CDN (preview + download)
  - [ ] ID Lookup

## 5) Cache / hard refresh

- [ ] Probar con hard refresh (`Ctrl + F5`)
- [ ] Si no actualiza, limpiar cache del navegador/CDN

## 6) Opcional recomendado

- [ ] SSL con Let's Encrypt
- [ ] Analytics (Plausible/Umami)
- [ ] Error tracking (Sentry)
- [ ] Script de deploy automático (`rsync` o zip + upload)


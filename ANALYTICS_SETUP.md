# Analytics Setup

This project can use lightweight analytics to understand:
- Most used tools
- Entry/exit pages
- Device split (mobile vs desktop)

## Option A: Plausible (recommended for simplicity)

1. Create site in Plausible for `microtools.arolisg.dev`.
2. Add script in `index.html`:

```html
<script defer data-domain="microtools.arolisg.dev" src="https://plausible.io/js/script.js"></script>
```

3. Deploy and verify events appear.

## Option B: Google Analytics 4

1. Create GA4 property.
2. Add gtag snippet to `index.html`.
3. Track custom events for tool opens.

## Suggested Events

- `tool_open`
  - params: `tool_key`, `suite`
- `tool_action`
  - params: `tool_key`, `action`
- `donation_click`
  - params: `provider` (`paypal`)

## Privacy Notes

- Avoid collecting personally identifiable data.
- Avoid storing raw webhook URLs or user IDs in analytics payloads.

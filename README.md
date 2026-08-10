# Kavach

A responsive, accessible editorial site explaining India’s vehicle-to-vehicle communication rollout in plain language. The static React/TypeScript site includes a Markdown-driven homepage, the first two chapters of a ten-part series, and an About page, all presented in a warm newsprint design system with supplied cinematic road artwork.

## Routes

- `/` — series overview, road-safety facts, support, and newsletter demo
- `/chapter-1/` — “The 502 Problem” long-form article
- `/chapter-2/` — “How Your Car Gossips” long-form article
- `/about/` — author, mission, contact, and support details

## Run locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Editorial image contract

Every current and future hero or inline editorial image must be an exact 16:9 crop. Publish a full `1664×936` WebP and a responsive `832×468` WebP named with the `-832.webp` suffix. Declare those intrinsic dimensions in markup, keep meaningful alt text and captions outside the artwork, and do not ship an uncropped upload.

On desktop, hero figures render at no more than `960×540`, and inline article figures render at no more than `900px` wide while preserving 16:9. These display caps do not replace the full/responsive asset pair or change the existing tablet and mobile behavior.

## Responsive typography contract

Kavach uses the platform system sans stack for interface text, body copy, and long-form reading. Libre Caslon Display is reserved for editorial headings, pull quotes, opening drop caps, and key numerals. Type scales in `rem` so browser text-size preferences remain effective.

Computed desktop/tablet/mobile targets are `64/54/42px` for the homepage H1, `56/48/40px` for article and About H1s, and `44/38/32px` for major section headings. Homepage prose remains `16px`; long-form prose resolves to `18/17/16px`. The wordmark is `20px`, primary navigation is `14px`, compact labels never fall below a `12px` equivalent, and pill controls retain a minimum `44px` target.

The newsletter is a browser-only demo shared by the homepage and both chapters. Submitted email addresses are stored locally under `kavach-reader-email`; no backend, email delivery, payment, or analytics service is connected.

# Codebase Summary

## Product surfaces

- `/`: Markdown-driven Kavach homepage with an editorial hero, road-safety facts, ten-chapter series index, trust/support copy, UPI-copy feedback, and a newsletter demo.
- `/chapter-1/`: “The 502 Problem,” rendered from Markdown with responsive imagery, sources, and reading interactions.
- `/chapter-2/`: “How Your Car Gossips,” rendered by the shared article page with its own metadata, hero, sources, and chapter navigation.
- `/about/`: Markdown-backed About page with Kavach mission, authorship, contact/support actions, and responsive hero artwork.
- unsupported paths: minimal branded 404 state with a home link.

## Primary files

| File or directory | Responsibility |
| --- | --- |
| `src/App.tsx` | Small pathname selector for Home, Chapters 1–2, About, and not-found surfaces |
| `src/HomePage.tsx` | Homepage frontmatter/section parsing, Markdown rendering, metadata, responsive hero, subscription, hash navigation, and UPI-copy behavior |
| `src/ArticlePage.tsx` | Shared Chapter 1/2 configuration, frontmatter extraction, Markdown transforms/renderers, route metadata, progress, share, chapter navigation, and subscription behavior |
| `src/AboutPage.tsx` | About frontmatter/content preparation, Markdown rendering, metadata, responsive hero, and contact/support actions |
| `src/readerStorage.ts` | Defensive browser-local read/write helpers for the shared newsletter demo email |
| `src/content/homepage.md` | Homepage headline, facts, chapter list, trust/support copy, newsletter copy, and closing tagline |
| `src/content/chapter-1-the-502-problem.md` | Chapter 1 frontmatter, narrative, citations, and sources |
| `src/content/chapter-2-how-your-car-gossips.md` | Chapter 2 frontmatter, V2V explainer narrative, and six external sources |
| `src/content/about.md` | About frontmatter, author story, editorial promise, mission, and source copy |
| `src/styles.css` | Shared tokens plus homepage, article, About, responsive, focus, and reduced-motion styles |
| `index.html` | Home HTML entry and homepage/social metadata |
| `chapter-1/index.html` | Chapter 1 HTML entry, article metadata, and social preview fields |
| `chapter-2/index.html` | Chapter 2 HTML entry, article metadata, and `b6.webp` social preview fields |
| `about/index.html` | About HTML entry, route metadata, and social preview fields |
| `404.html` | Static-host not-found entry |
| `static/images/home/` | Deployable 1664×936 and 832×468 WebP homepage hero assets |
| `static/images/chapter-1/` | Deployable 1664×936 and 832×468 WebP article assets |
| `static/images/chapter-2/` | Deployable 1664×936 and 832×468 WebP Chapter 2 hero assets |
| `static/images/about/` | Deployable 1664×936 and 832×468 WebP About hero assets |
| `public/images/chapter-1/` | Retained PNG working assets and generated image copies |
| `vite.config.ts` | React integration, `static/` public directory, and five-entry Rollup build |

## State and browser capabilities

- `kavach-reader-email`: shared homepage and Chapter 1/2 newsletter-demo email in `localStorage`; guarded reads/writes keep all three surfaces usable if storage is unavailable.
- Clipboard API / `document.execCommand('copy')`: homepage and About-page UPI-copy actions, plus the active chapter’s share fallback.
- Web Share API: native sharing of the active chapter when supported.
- Initial hash handling: Home and both chapters scroll to their target after React mounts, supporting links such as `/#subscribe`, `/#series`, `/chapter-1/#subscribe`, and `/chapter-2/#sources`.
- Scroll events: passive reading-progress updates on both chapters.

No server, database, authentication provider, analytics service, payment processor, or newsletter integration is present.

## Build and verification

```bash
npm run lint
npm run build
npm run preview
```

The production build emits all five HTML entries and copies twelve WebP renditions to `dist/images/`: two homepage assets, six Chapter 1 assets, two Chapter 2 assets, and two About assets.

Expected production entries are `dist/index.html`, `dist/chapter-1/index.html`, `dist/chapter-2/index.html`, `dist/about/index.html`, and `dist/404.html`. Chapter 2 media are `dist/images/chapter-2/b6.webp` and `dist/images/chapter-2/b6-832.webp`.

Manual smoke coverage should include homepage Chapter 1/2, About, and source links; direct Chapter 1, Chapter 2, and About loads/refreshes; the platform-sans/editorial-serif type roles and responsive `64/54/42`, `56/48/40`, `44/38/32`, and `18/17/16` computed scales; browser text-size preference behavior; 20px wordmark, 14px navigation, 12px-equivalent label floor, and 44px pill targets; responsive image selection; 960×540 desktop hero caps and 900px-wide inline article caps with 16:9 preserved; unchanged tablet/mobile image behavior; keyboard and skip-link behavior; newsletter persistence across all three subscribing surfaces; homepage and About UPI-copy feedback; route-correct article share feedback; hash-target scrolling; all external citations; chapter previous/next states; and an unsupported route.

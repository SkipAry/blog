# Project Overview

## Purpose

Kavach is a responsive, multi-page editorial prototype about India’s vehicle-to-vehicle communication rollout. It combines a Markdown-driven series homepage, the first two chapters of the ten-part Kavach series, and an About page that introduces the author, editorial promise, and mission.

## User experience

- Lead with the road-safety problem and explain Kavach’s V2V premise in direct, human language.
- Use Kavach consistently as the public wordmark across home, article, About, and not-found surfaces.
- Route the homepage reading CTA to the canonical Chapter 1 URL, `/chapter-1/`.
- Present the supplied `b5` artwork as a responsive, captioned homepage panorama without overlay text.
- Summarize the problem in a scannable facts grid and distinguish Chapters 1–2 as live while Chapters 3–10 remain “Coming soon.”
- Render the supplied Chapter 1 and Chapter 2 Markdown as long-form articles with route-specific metadata, bylines, responsive editorial imagery, citations, and source links.
- Render the supplied About Markdown at `/about/`, with route-specific metadata, responsive hero artwork, and concise editorial transformations for web presentation.
- Provide both articles with a reading-progress indicator, source jump link, native share/copy behavior, and shared email subscription demo.
- Connect primary navigation and footers to the series, About, both live chapters, sources, email, and subscription sections.
- Provide homepage and About-page support actions that copy the UPI ID with visible feedback.
- Store a submitted demo email locally, share it between Home and both chapters, and show an in-page confirmation.
- Support direct hash navigation after React mounts, including `/#series`, `/#subscribe`, `/chapter-1/#subscribe`, and `/chapter-2/#subscribe`.
- Adapt navigation, heroes, article typography, imagery, newsletter/support regions, and footers for desktop and mobile.
- Use a preference-respecting `rem` type scale with platform system sans for UI/body/prose and Libre Caslon Display only for editorial headings, pull quotes, opening drop caps, and key numerals.
- Keep computed responsive targets at `64/54/42px` for the homepage H1, `56/48/40px` for article/About H1s, `44/38/32px` for major section headings, `16px` for homepage prose, and `18/17/16px` for long-form prose.
- Enforce exact 16:9 for every current and future hero or inline editorial upload, with full 1664×936 and responsive 832×468 WebP renditions.
- Keep desktop imagery editorially proportioned: hero figures cap at 960×540 and inline article figures cap at 900px wide, without changing the established tablet/mobile layouts.

## Scope and constraints

This is a front-end prototype. It has no API, account system, content feed, analytics, email delivery, payment integration, or server-side persistence.

- Homepage, Chapter 1, and Chapter 2 subscriptions all write only to `localStorage` key `kavach-reader-email`.
- Chapter sharing uses the Web Share API when available and falls back to copying the active chapter’s canonical URL.
- Homepage and About support actions copy `garududit@ybl` to the clipboard, with a temporary-textarea fallback when the Clipboard API is unavailable.
- Email and newsletter actions use `mailto:`, same-page hashes, or in-site hashes; no message, payment, or subscription is submitted to a service.
- The Chapter 3–10 labels are informational; Chapters 1 and 2 are implemented.

Do not treat the local newsletter form as email delivery, authentication, membership enrollment, or a real subscription.

## Routes and deliverables

| Route | Entry document | Experience |
| --- | --- | --- |
| `/` | `index.html` | Kavach overview, facts, series index, support, and newsletter demo |
| `/chapter-1/` | `chapter-1/index.html` | Chapter 1 long-form article |
| `/chapter-2/` | `chapter-2/index.html` | Chapter 2 long-form article |
| `/about/` | `about/index.html` | About Kavach, author mission, contact, and support actions |
| Any unsupported client path | `404.html` / application fallback | Branded not-found state |

The production build emits all five HTML entry points plus the shared React bundle and optimized Home, Chapter 1, Chapter 2, and About images.

## Acceptance checks

Run `npm run lint` and `npm run build`. Confirm that `dist/` contains `index.html`, `chapter-1/index.html`, `chapter-2/index.html`, `about/index.html`, `404.html`, `images/home/b5*.webp`, `images/chapter-1/*.webp`, `images/chapter-2/b6*.webp`, and `images/about/b4*.webp`.

Manually verify:

- the homepage CTA opens `/chapter-1/`, its series marks Chapters 1–2 live, the Chapter 2 and footer links open `/chapter-2/`, and the Subscribe link reaches `#subscribe`;
- direct homepage hash loads scroll to their target after React mounts;
- the homepage About and Sources links resolve to `/about/` and the Chapter 1 sources section;
- browser refresh preserves the Chapter 1, Chapter 2, and About entries and their route-specific metadata;
- keyboard focus, skip links, visible focus states, and reduced-motion behavior;
- browser text-size preferences remain effective; the wordmark resolves to `20px`, primary navigation to `14px`, compact labels to at least a `12px` equivalent, and pill controls retain `44px` targets;
- Home and both chapters share one local email success state and remain usable when browser storage is blocked;
- homepage and About UPI-copy feedback;
- both articles’ reading progress, source navigation, share/copy fallback, external-source links, canonical metadata, and previous/next states;
- Chapter 1’s next link and newsletter point to live Chapter 2, while Chapter 2 links back to Chapter 1 and labels Chapter 3 coming soon;
- desktop hero figures do not exceed 960×540, inline article figures do not exceed 900px wide, and both preserve 16:9;
- responsive image selection and layouts, including `b5-832.webp` and `b6-832.webp` at 900px and below and `b4-832.webp` below 680px;
- the unsupported-path 404 experience.

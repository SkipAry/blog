# Design Guidelines

## Direction

The interface should feel like a cream broadsheet: text-first, flat, spacious, and almost entirely monochrome. The homepage’s connected-highway panorama, Chapter 1’s warm cinematic road scenes, Chapter 2’s night-time chai-stall V2V scene, and the About page’s night-time author portrait supply the chromatic accents. Kavach is the shared editorial identity and wordmark throughout.

## Core tokens

| Role | Value |
| --- | --- |
| Canvas | `#f7f4ed` |
| Paper surface | `#ffffff` |
| Primary ink | `#242424` |
| Body text | `#333333` |
| Filled control | `#191919` |
| Muted text | `#6b6b6b` |
| Illustration green | `#78a850` |

Use the platform system sans stack for interface text, body copy, and long-form reading. Reserve Libre Caslon Display with Georgia/Times fallbacks for editorial headings, pull quotes, opening drop caps, and key numerals. Keep display headings regular-weight, tightly tracked, and tightly led; use weight, spacing, and contrast instead of oversized type to establish hierarchy.

## Composition

- Constrain primary content to 1200px with generous side gutters.
- Use a two-column homepage hero on wide screens and a single column on narrower screens; follow it with the broad `b5` highway artwork and an external caption.
- Organize homepage content as numbered editorial sections: facts, ten-chapter series, trust, support, newsletter, and closing navigation.
- Keep each chapter header broad, cap desktop hero figures at 960×540, and constrain long-form copy to a comfortable reading measure of about 710px.
- Apply the same broad-image/constrained-prose rhythm to About, then allow the contact/support region to expand into two balanced columns on wide screens.
- Allow inline story figures to break wider than the prose column but cap them at 900px wide on desktop; always pair them with useful alt text and concise captions.
- Preserve the shared chapter hierarchy: series/chapter kicker, display headline, deck, byline, route-specific hero, story body and sources, subscription panel, then previous/next navigation.
- Keep content surfaces square and flat; reserve the full pill radius for buttons and compact status marks.
- Separate surfaces by color and rules rather than shadow or blur.
- Do not reuse illustration green for interactive UI.

## Typography and media

- Scale typography in `rem` so browser text-size preferences remain effective. The computed desktop/tablet/mobile targets are `64/54/42px` for the homepage H1, `56/48/40px` for article and About H1s, and `44/38/32px` for major section headings.
- Keep homepage prose at a computed `16px` across breakpoints. Long-form prose resolves to `18px` on desktop, `17px` on tablet, and `16px` on mobile, with relaxed leading and a comfortable reading measure.
- Keep the wordmark at a computed `20px` and primary navigation at `14px`. Compact metadata and labels must never fall below a `12px` equivalent.
- Use Libre Caslon Display only for editorial headings, pull quotes, opening drop caps, and key numerals. Use the platform system sans stack for navigation, controls, metadata, supporting copy, homepage body copy, and article prose.
- Treat exact 16:9 as a site-wide, non-optional contract for every current and future hero or inline editorial upload. Crop before publishing; never rely on CSS to conceal a non-16:9 source.
- Produce two WebP renditions for each editorial image: full `1664×936` and responsive `832×468`, with the responsive file named `*-832.webp`.
- Treat source dimensions and display dimensions separately: retain both asset renditions, then cap every desktop hero at 960×540 and every inline article figure at 900px wide while preserving 16:9. Keep the existing tablet and mobile rules unchanged.
- Use first-letter treatment only on the opening story paragraph, never after every heading.
- Keep citations legible and visibly linked. Source-list density may be tighter than narrative copy but must remain readable.
- Render the homepage hero through `<picture>` with the responsive `b5-832.webp` at or below 900px and full `b5.webp` above it; declare 1664×936 intrinsic dimensions, load it eagerly, and keep explanatory text outside the image.
- Render Chapter 1 inline images through `<picture>` with the responsive 832×468 WebP below 680px and the full 1664×936 WebP elsewhere; use the 900px hero breakpoint shared by both chapters.
- Render the Chapter 2 hero through `<picture>` with responsive `b6-832.webp` at or below 900px and full `b6.webp` above it; declare 1664×936 intrinsic dimensions and keep its explanatory caption outside the artwork.
- Render the About hero through `<picture>` with responsive `b4-832.webp` below 680px and full `b4.webp` otherwise; declare 1664×936 intrinsic dimensions and meaningful alt text.
- Do not add text overlays to the supplied artwork; captions carry context outside the image.

## Interaction and accessibility

- Preserve skip links, semantic landmarks, visible focus rings, labels, and status feedback.
- Preserve homepage landmark structure, meaningful highway-art alt text, labelled newsletter form, `#series`/`#subscribe` anchors, and UPI-copy feedback.
- Preserve both chapters’ skip link, live share-result label, semantic `<article>`, `<figure>`/`<figcaption>`, byline time element, source heading target, labelled subscription region, and route-aware previous/next navigation.
- Preserve the About skip link, semantic article/figure structure, labelled contact/support regions, mail link, and live copy-result label.
- Maintain at least a 44px target for pill controls and other primary interactive elements.
- Keep hover feedback subtle and respect `prefers-reduced-motion`.
- Decorative motion must never be required to understand or use the page.
- The reading-progress bar is supplemental and remains hidden from assistive technology.

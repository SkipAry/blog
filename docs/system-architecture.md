# System Architecture

## Runtime

The project is a static React client application built with TypeScript and Vite. Each HTML entry supplies route-specific metadata, font loading, and the shared `#root` mount point. `src/main.tsx` mounts the application in React strict mode, and `src/App.tsx` selects the Kavach surface from `window.location.pathname`.

## Application structure

```text
index.html                    home entry and social metadata
chapter-1/index.html          article entry and social metadata
chapter-2/index.html          Chapter 2 entry and social metadata
about/index.html              About entry and social metadata
404.html                      not-found entry
└── src/main.tsx              shared React mount
    ├── src/App.tsx           path selection and 404 UI
    ├── src/HomePage.tsx      homepage content transforms, UI, metadata, copy/subscribe state
    ├── src/ArticlePage.tsx   shared chapter config, transforms, UI, navigation, share/subscribe state
    ├── src/AboutPage.tsx     About transforms, UI, metadata, contact/support state
    ├── src/readerStorage.ts  shared defensive newsletter storage helpers
    ├── src/content/
    │   ├── homepage.md
    │   ├── chapter-1-the-502-problem.md
    │   ├── chapter-2-how-your-car-gossips.md
    │   └── about.md
    └── src/styles.css        tokens, page layouts, components, motion, breakpoints

static/images/home/           production-served full and responsive WebP homepage hero
static/images/chapter-1/      production-served full and responsive WebP article assets
static/images/chapter-2/      production-served full and responsive WebP Chapter 2 hero
static/images/about/          production-served full and responsive WebP About hero
public/images/chapter-1/      retained PNG working assets and generated copies
```

Route selection is deliberately small and dependency-free:

- `/` renders `HomePage`.
- `/chapter-1` and `/chapter-1/` render `ArticlePage` after trailing-slash normalization.
- `/chapter-2` and `/chapter-2/` render the same `ArticlePage` after trailing-slash normalization.
- `/about` and `/about/` render `AboutPage` after trailing-slash normalization.
- every other path renders `NotFoundPage`.

The separate HTML documents make the static production build deployable without a client router. Home receives website metadata and the `b5.webp` social image, Chapters 1 and 2 receive route-specific article metadata and preview images, and About receives its own description, Open Graph fields, and `b4.webp` preview.

## Markdown content pipelines

`HomePage.tsx` imports `src/content/homepage.md` with Vite’s `?raw` suffix. At module load it reads the homepage `title` and `description` frontmatter. The preparation step then:

1. removes frontmatter and authoring comments;
2. extracts the Markdown H1 as the structural page title;
3. treats copy before the first H2 as the hero introduction;
4. splits every H2 into a stable slugged editorial section;
5. normalizes legacy internal links to `/chapter-1/` and `/about/`;
6. removes the placeholder subscription link and splits the closing copy at the horizontal rule; and
7. passes each content block to `react-markdown` with `remark-gfm`.

The component renders the `b5` hero structurally, builds the numbered facts/series/trust/support sections from the parsed map, and supplies accessible newsletter and UPI-copy controls. On mount it synchronizes title, description, and canonical URL, then resolves an initial hash target after the React tree exists.

`ArticlePage.tsx` imports both chapter Markdown files with the same raw-Markdown mechanism. A route-specific `ArticleConfig` pairs each source with its canonical path, hero metadata, source anchor, and previous/next links while shared frontmatter parsing supplies title, chapter number, date, author, description, reading time, and series. The preparation step removes duplicate title/byline/hero placeholders from both sources, then applies the Chapter 1-only inline `b2`/`b3` figure and UPI transformations. Custom Markdown renderers provide stable heading IDs, safe external-link behavior, and responsive figures. Chapter 2’s `## Sources` section therefore resolves to `#sources` and exposes its six cited primary/standards links without a separate page implementation.

`AboutPage.tsx` similarly reads About frontmatter, removes duplicate/placeholder structural content, adjusts QR-specific support wording to match the implemented UPI-copy action, and replaces the Markdown contact block with accessible live actions.

Content changes belong in the Markdown files; presentational transforms and asset metadata belong in their page components.

## Image pipeline

Runtime markup requests WebP assets from `/images/`, which maps to `static/images/` because `vite.config.ts` sets `publicDir: 'static'`.

- Every current and future hero or inline editorial image follows an exact 16:9 output contract: full 1664×936 WebP plus responsive 832×468 WebP named with the `-832.webp` suffix.
- Desktop layout caps hero figures at 960×540 and inline article figures at 900px wide, preserving 16:9. These CSS display limits do not alter the asset contract or the established tablet/mobile behavior.
- Home uses full-size `b5.webp` above 900px and responsive `b5-832.webp` at or below 900px. The hero declares 1664×936 intrinsic dimensions and eager/high-priority loading.
- Chapter 1 uses a full-size and responsive rendition for each of `b1`, `b2`, and `b3`; `b1` loads eagerly and the inline figures load lazily.
- Chapter 2 uses full-size `b6.webp` and responsive `b6-832.webp`; the hero switches at 900px and loads eagerly at high priority.
- About uses full-size `b4.webp` and responsive `b4-832.webp`; its hero loads eagerly at high priority.

All supplied artwork has meaningful alt text, external captions, explicit dimensions to reduce layout shift, and must be cropped to exact 16:9 before entering the production image directories.

## Data and integrations

- No backend or application data API is used.
- Home and both chapters read and write the same browser `localStorage` key, `kavach-reader-email`, through `readerStorage.ts`. Exceptions are caught so blocked storage does not break rendering or submission feedback.
- Home and About copy the fixed UPI ID `garududit@ybl` with the Clipboard API or a temporary-textarea fallback and report transient feedback.
- Both chapters share their route-correct canonical URL through `navigator.share` when supported, then the Clipboard API or the same textarea fallback.
- Home and both chapters resolve initial hash targets after mounting; About currently links to `/chapter-1/#subscribe` for the shared newsletter state.
- Chapter 1’s next navigation and subscription panel link to live Chapter 2. Chapter 2 links back to Chapter 1 and presents Chapter 3 as coming soon.
- About contact and homepage footer links use `mailto:`; no contact data is stored.
- Libre Caslon Display is loaded from Google Fonts for the limited editorial roles. Interface text, body copy, and long-form prose use the platform system sans stack and require no web-font request.
- Markdown source links navigate to external pages in new tabs with `rel="noreferrer"`.

## Build output

`npm run build` type-checks with `tsc -b` and asks Rollup to build five entries: `home`, `chapterOne`, `chapterTwo`, `about`, and `notFound`. Vite emits the static production bundle to `dist/` and copies `static/` into the output root. A static host must serve `/chapter-1/index.html` for `/chapter-1/`, `/chapter-2/index.html` for `/chapter-2/`, `/about/index.html` for `/about/`, and `404.html` for missing routes; no SPA-wide rewrite is required.

## Extension points

For production newsletter delivery, payments, or contact handling, replace local/demo actions with API boundaries and add explicit loading/error states. Additional chapters can follow the current Markdown-plus-`ArticleConfig` pattern; if the series expands much further, move config into a content manifest, generate route entries, and centralize image metadata. Add a client router only when route count or navigation behavior warrants it.

import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import homepageSource from './content/homepage.md?raw'
import { readReaderEmail, saveReaderEmail } from './readerStorage'

const frontmatterPattern = /^---[\s\S]*?---\s*/

function frontmatterValue(source: string, key: string) {
  const value = source.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? ''
  return value.replace(/^"(.*)"$/, '$1')
}

const homeMeta = {
  title: frontmatterValue(homepageSource, 'title'),
  description: frontmatterValue(homepageSource, 'description'),
}

type HomeSection = { title: string; slug: string; content: string }

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function parseHomepage(source: string) {
  const cleaned = source
    .replace(frontmatterPattern, '')
    .replace(/<!--[^]*?-->/g, '')

  const heading = cleaned.match(/^\s*# (.+)$/m)?.[1] ?? 'Kavach'
  const withoutHeading = cleaned.replace(/^\s*# .+\r?\n+/, '')
  const firstSection = withoutHeading.search(/^## /m)
  const hero = firstSection >= 0 ? withoutHeading.slice(0, firstSection).trim() : withoutHeading.trim()
  const sectionSource = firstSection >= 0 ? withoutHeading.slice(firstSection) : ''
  const matches = [...sectionSource.matchAll(/^## (.+)$/gm)]
  const sections: HomeSection[] = matches.map((match, index) => {
    const title = match[1].trim()
    const start = (match.index ?? 0) + match[0].length
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? sectionSource.length) : sectionSource.length
    return { title, slug: slugify(title), content: sectionSource.slice(start, end).trim() }
  })

  return { heading, hero, sections }
}

function normalizeHref(href: string) {
  if (href === '/the-502-problem') return '/chapter-1/'
  if (href === '/about') return '/about/'
  return href
}

const markdownComponents: Components = {
  a: ({ href = '', children }) => {
    const normalized = normalizeHref(href)
    const external = normalized.startsWith('http')
    return <a href={normalized} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}</a>
  },
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const field = document.createElement('textarea')
    field.value = value
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.append(field)
    field.select()
    const copied = document.execCommand('copy')
    field.remove()
    return copied
  }
}

function MarkdownBlock({ children }: { children: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{children}</ReactMarkdown>
}

function HomePage() {
  const parsed = useMemo(() => parseHomepage(homepageSource), [])
  const sections = useMemo(() => new Map(parsed.sections.map((section) => [section.slug, section])), [parsed.sections])
  const [copyLabel, setCopyLabel] = useState('Copy UPI ID')
  const [email, setEmail] = useState(readReaderEmail)
  const [subscribed, setSubscribed] = useState(() => Boolean(readReaderEmail()))

  useEffect(() => {
    document.title = homeMeta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', homeMeta.description)
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.head.appendChild(document.createElement('link'))
    canonical.rel = 'canonical'
    canonical.href = new URL('/', window.location.origin).toString()
    const hashTarget = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null
    if (hashTarget) window.requestAnimationFrame(() => hashTarget.scrollIntoView())
  }, [])

  const copyUpi = async () => {
    setCopyLabel(await copyText('garududit@ybl') ? 'UPI ID copied' : 'Copy failed')
    window.setTimeout(() => setCopyLabel('Copy UPI ID'), 2200)
  }

  const whyExists = sections.get('why-this-site-exists')
  const whatV2V = sections.get('what-v2v-actually-is')
  const whatProposed = sections.get('what-india-has-just-proposed')
  const series = sections.get('the-series-one-chapter-every-week')
  const trust = sections.get('who-s-writing-this')
  const coffee = sections.get('the-coffee-thing')
  const newsletter = sections.get('get-every-chapter-in-your-inbox')
  const [newsletterCopy = '', closingCopy = ''] = newsletter?.content.replace('[Subscribe →](#subscribe)', '').split(/^---$/m) ?? []

  return (
    <div className="home-page">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="home-topbar">
        <nav className="home-nav" aria-label="Primary navigation">
          <a className="wordmark" href="/" aria-label="Kavach home">Kavach</a>
          <div>
            <a href="#series">The Series</a>
            <a href="/about/">About</a>
            <a href="/chapter-1/#sources-yes-i-actually-read-these">Sources</a>
            <a className="pill pill-small" href="#subscribe">Subscribe</a>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero-copy">
            <p className="article-kicker">India’s V2V revolution, explained</p>
            <h1 id="home-title">{parsed.heading}</h1>
          </div>
          <div className="home-hero-intro"><MarkdownBlock>{parsed.hero}</MarkdownBlock></div>
        </section>

        <figure className="home-hero-image">
          <picture>
            <source media="(max-width: 900px)" srcSet="/images/home/b5-832.webp" />
            <img src="/images/home/b5.webp" alt="A busy Indian expressway at sunset where cars, buses, trucks, auto-rickshaws, and motorcycles are visualized sharing connected safety signals" width="1664" height="936" fetchPriority="high" decoding="async" />
          </picture>
          <figcaption>Connected today, protected tomorrow: every vehicle becomes part of the safety network.</figcaption>
        </figure>

        {whyExists && (
          <section className="home-section facts-section" aria-labelledby={whyExists.slug}>
            <div className="home-section-heading"><p className="section-index">01</p><h2 id={whyExists.slug}>{whyExists.title}</h2></div>
            <div className="facts-content"><MarkdownBlock>{whyExists.content}</MarkdownBlock></div>
          </section>
        )}

        {whatV2V && (
          <section className="home-section facts-section" aria-labelledby={whatV2V.slug}>
            <div className="home-section-heading"><p className="section-index">02</p><h2 id={whatV2V.slug}>{whatV2V.title}</h2></div>
            <div className="facts-content"><MarkdownBlock>{whatV2V.content}</MarkdownBlock></div>
          </section>
        )}

        {whatProposed && (
          <section className="home-section facts-section" aria-labelledby={whatProposed.slug}>
            <div className="home-section-heading"><p className="section-index">03</p><h2 id={whatProposed.slug}>{whatProposed.title}</h2></div>
            <div className="facts-content"><MarkdownBlock>{whatProposed.content}</MarkdownBlock></div>
          </section>
        )}

        {series && (
          <section className="home-section series-section" id="series" aria-labelledby={series.slug}>
            <div className="home-section-heading"><p className="section-index">04</p><h2 id={series.slug}>{series.title}</h2></div>
            <div className="series-list"><MarkdownBlock>{series.content}</MarkdownBlock></div>
          </section>
        )}

        <div className="home-duo">
          {trust && (
            <section className="home-section trust-section" aria-labelledby={trust.slug}>
              <div className="home-section-heading"><p className="section-index">05</p><h2 id={trust.slug}>{trust.title}</h2></div>
              <div className="home-prose"><MarkdownBlock>{trust.content}</MarkdownBlock></div>
            </section>
          )}
          {coffee && (
            <section className="home-section coffee-section" aria-labelledby={coffee.slug}>
              <div className="home-section-heading"><p className="section-index">06</p><h2 id={coffee.slug}>{coffee.title}</h2></div>
              <div className="home-prose"><MarkdownBlock>{coffee.content}</MarkdownBlock></div>
              <button className="pill" type="button" onClick={copyUpi} aria-live="polite">{copyLabel}</button>
            </section>
          )}
        </div>

        <section className="home-newsletter" id="subscribe" aria-labelledby="home-subscribe-title">
          <div>
            <p className="article-kicker">One thoughtful email a week</p>
            <h2 id="home-subscribe-title">{newsletter?.title ?? 'Get every chapter in your inbox'}</h2>
            <div className="home-prose"><MarkdownBlock>{newsletterCopy}</MarkdownBlock></div>
          </div>
          {subscribed ? (
            <div className="home-subscribe-success" role="status"><span aria-hidden="true">✓</span><p><strong>You’re on the list.</strong><br />{email} is saved on this device for the demo.</p></div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); saveReaderEmail(email); setSubscribed(true) }}>
              <label htmlFor="home-email">Email address</label>
              <input id="home-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
              <button className="pill" type="submit">Subscribe</button>
              <small>Demo signup: your email stays in this browser.</small>
            </form>
          )}
        </section>

        <footer className="home-closing">
          <MarkdownBlock>{closingCopy}</MarkdownBlock>
          <nav aria-label="Footer navigation"><a href="/about/">About</a><a href="/chapter-1/">Chapter 1</a><a href="/chapter-2/">Chapter 2</a><a href="mailto:codeninja4545@gmail.com">Email</a></nav>
        </footer>
      </main>
    </div>
  )
}

export default HomePage

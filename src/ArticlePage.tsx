import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import chapterOneSource from './content/chapter-1-the-502-problem.md?raw'
import chapterTwoSource from './content/chapter-2-how-your-car-gossips.md?raw'
import { readReaderEmail, saveReaderEmail } from './readerStorage'

const sourcePattern = /^---[\s\S]*?---\s*/

function frontmatterValue(source: string, key: string) {
  const value = source.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? ''
  return value.replace(/^"(.*)"$/, '$1')
}

type ArticleConfig = {
  source: string
  path: string
  title: string
  chapter: string
  date: string
  author: string
  description: string
  readingTime: string
  series: string
  heroBase: string
  heroAlt: string
  heroCaption: string
  navLabel: string
  navHref: string
  previous?: { label: string; href: string }
  next: { label: string; href?: string }
}

function createConfig(source: string, details: Omit<ArticleConfig, 'source' | 'title' | 'chapter' | 'date' | 'author' | 'description' | 'readingTime' | 'series'>): ArticleConfig {
  return {
    source,
    title: frontmatterValue(source, 'title'),
    chapter: frontmatterValue(source, 'chapter'),
    date: frontmatterValue(source, 'date'),
    author: frontmatterValue(source, 'author'),
    description: frontmatterValue(source, 'description'),
    readingTime: frontmatterValue(source, 'readingTime'),
    series: frontmatterValue(source, 'series'),
    ...details,
  }
}

const chapterOne = createConfig(chapterOneSource, {
  path: '/chapter-1/',
  heroBase: '/images/chapter-1/b1',
  heroAlt: 'A crowded Indian intersection at sunset filled with scooters, auto-rickshaws, cars, and a city bus',
  heroCaption: 'On a crowded road, danger rarely arrives with a clear line of sight.',
  navLabel: 'Sources',
  navHref: '#sources-yes-i-actually-read-these',
  next: { label: 'How Your Car Gossips', href: '/chapter-2/' },
})

const chapterTwo = createConfig(chapterTwoSource, {
  path: '/chapter-2/',
  heroBase: '/images/chapter-2/b6',
  heroAlt: 'Two cars outside a Pune chai stall at night exchanging glowing message bubbles as a visual metaphor for vehicle-to-vehicle communication',
  heroCaption: 'No tower. No cloud. Just two vehicles sharing what they are doing, directly and in real time.',
  navLabel: 'Sources',
  navHref: '#sources',
  previous: { label: 'The 502 Problem', href: '/chapter-1/' },
  next: { label: 'Seven Times Your Car Will Save Your Life' },
})

const imageDetails: Record<string, { alt: string; caption: string }> = {
  '/images/chapter-1/b2.png': {
    alt: 'Two college students riding a scooter through dense evening traffic in an Indian city',
    caption: 'Two-wheelers make up the most exposed part of India’s road story.',
  },
  '/images/chapter-1/b3.png': {
    alt: 'Two cars approaching a blind corner while a blue visualization shows them sharing a real-time wireless signal',
    caption: 'V2V lets vehicles warn each other before either driver can see the danger.',
  },
}

function prepareChapter(source: string, chapter: string) {
  let prepared = source
    .replace(sourcePattern, '')
    .replace(/^\s*# .+\r?\n+/, '')
    .replace(/^\*\*By a college student who fell down a rabbit hole\*\*\s*/m, '')
    .replace(/<!-- refer b(?:1|6)\.png[^]*?-->/, '')
    .replace(/```\s*$/, '')

  if (chapter === '1') {
    prepared = prepared
      .replace(/<!-- refer b2\.png image here\s*-->/, '![Two students riding a scooter through heavy traffic](/images/chapter-1/b2.png)')
      .replace(/<!-- refer b3\.png image here\s*-->/, '![Cars sharing a wireless safety signal around a blind turn](/images/chapter-1/b3.png)')
      .replace('Scan to fund Chapter 2:', 'Use this UPI ID to fund Chapter 3:')
      .replace('![Support this blog — UPI ID](garududit@ybl)', '**UPI ID:** `garududit@ybl`')
  }

  return prepared.trim()
}

function ArticleImage({ src = '', alt = '' }: { src?: string; alt?: string }) {
  const detail = imageDetails[src]
  const imageBase = src.replace(/\.png$/, '')
  return (
    <figure className="story-figure story-figure-wide">
      <picture>
        <source media="(max-width: 680px)" srcSet={`${imageBase}-832.webp`} />
        <img src={`${imageBase}.webp`} alt={detail?.alt ?? alt} width="1664" height="936" loading="lazy" decoding="async" />
      </picture>
      {detail?.caption && <figcaption>{detail.caption}</figcaption>}
    </figure>
  )
}

const markdownComponents: Components = {
  p: ({ node, children }) => {
    const firstChild = node?.children[0]
    const isImageOnly = node?.children.length === 1 && firstChild && 'tagName' in firstChild && firstChild.tagName === 'img'
    return isImageOnly ? <>{children}</> : <p>{children}</p>
  },
  img: ({ src, alt }) => <ArticleImage src={typeof src === 'string' ? src : ''} alt={alt ?? ''} />,
  a: ({ href = '', children }) => {
    const external = href.startsWith('http')
    return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}</a>
  },
  h2: ({ children }) => {
    const label = String(children)
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return <h2 id={id}>{children}</h2>
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

function ArticlePage() {
  const config = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') === '/chapter-2' ? chapterTwo : chapterOne
  const [progress, setProgress] = useState(0)
  const [shareLabel, setShareLabel] = useState('Share')
  const [email, setEmail] = useState(readReaderEmail)
  const [subscribed, setSubscribed] = useState(() => Boolean(readReaderEmail()))
  const chapter = useMemo(() => prepareChapter(config.source, config.chapter), [config])
  const displayDate = useMemo(
    () => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${config.date}T00:00:00Z`)),
    [config.date],
  )

  useEffect(() => {
    document.title = `${config.title} — Chapter ${config.chapter}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.description)
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.head.appendChild(document.createElement('link'))
    canonical.rel = 'canonical'
    canonical.href = new URL(config.path, window.location.origin).toString()
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight
      setProgress(available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    const hashTarget = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null
    if (hashTarget) window.requestAnimationFrame(() => hashTarget.scrollIntoView())
    return () => window.removeEventListener('scroll', updateProgress)
  }, [config])

  const shareArticle = async () => {
    const canonicalUrl = new URL(config.path, window.location.origin).toString()
    const shareData = { title: config.title, text: config.description, url: canonicalUrl }
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData)
        setShareLabel('Shared')
      } else {
        setShareLabel(await copyText(canonicalUrl) ? 'Link copied' : 'Copy failed')
      }
    } catch {
      setShareLabel(await copyText(canonicalUrl) ? 'Link copied' : 'Copy failed')
    }
    window.setTimeout(() => setShareLabel('Share'), 2200)
  }

  const emailId = `chapter-${config.chapter}-email`
  const liveNextChapter = config.next.href
  const newsletterTitle = liveNextChapter ? `${config.next.label} is ready.` : `Chapter ${Number(config.chapter) + 1} is next.`

  return (
    <div className="article-page">
      <div className="reading-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
      <a className="skip-link" href="#article-content">Skip to article</a>

      <header className="article-topbar">
        <nav className="article-nav" aria-label={`Chapter ${config.chapter} navigation`}>
          <a className="wordmark" href="/" aria-label="Kavach home">Kavach</a>
          <div className="article-nav-actions">
            <a href={config.navHref}>{config.navLabel}</a>
            <button className="text-button share-button" type="button" onClick={shareArticle} aria-live="polite">{shareLabel}</button>
          </div>
        </nav>
      </header>

      <main id="article-content" tabIndex={-1}>
        <article>
          <header className="article-header">
            <a className="back-link" href="/" aria-label="Back to home">← Back to home</a>
            <p className="article-kicker">{config.series.split('—')[0].trim()} · Chapter {config.chapter}</p>
            <h1>{config.title}</h1>
            <p className="article-deck">{config.description}</p>
            <div className="byline">
              <span className="author-mark" aria-hidden="true">CN</span>
              <div><strong>{config.author}</strong><span>{config.readingTime} · <time dateTime={config.date}>{displayDate}</time></span></div>
            </div>
          </header>

          <figure className="article-hero-image">
            <picture>
              <source media="(max-width: 900px)" srcSet={`${config.heroBase}-832.webp`} />
              <img src={`${config.heroBase}.webp`} alt={config.heroAlt} width="1664" height="936" fetchPriority="high" decoding="async" />
            </picture>
            <figcaption>{config.heroCaption}</figcaption>
          </figure>

          <div className="article-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{chapter}</ReactMarkdown>
          </div>

          <section className="subscribe-panel" id="subscribe" aria-labelledby="subscribe-title">
            {subscribed ? (
              <div role="status">
                <p className="article-kicker">You’re on the list</p>
                <h2 id="subscribe-title">{newsletterTitle}</h2>
                <p>{liveNextChapter && <><a href={liveNextChapter}>Read Chapter {Number(config.chapter) + 1}</a>, then </>}we’ll keep <strong>{email}</strong> ready for the next release on this device.</p>
              </div>
            ) : (
              <>
                <div>
                  <p className="article-kicker">Continue the series</p>
                  <h2 id="subscribe-title">{newsletterTitle}</h2>
                  <p>{liveNextChapter ? <><a href={liveNextChapter}>Read Chapter {Number(config.chapter) + 1} now</a>, then subscribe for the next release.</> : <>One chapter a week. No jargon, no spam.</>}</p>
                </div>
                <form onSubmit={(event) => { event.preventDefault(); saveReaderEmail(email); setSubscribed(true) }}>
                  <label htmlFor={emailId}>Email address</label>
                  <div>
                    <input id={emailId} type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
                    <button className="pill" type="submit">Subscribe</button>
                  </div>
                </form>
              </>
            )}
          </section>

          <nav className="chapter-nav" aria-label="Chapter navigation">
            {config.previous ? <><a href={config.previous.href}>← Previous: {config.previous.label}</a><span>Chapter {config.chapter} of 10</span></> : <span>Chapter {config.chapter} of 10</span>}
            {config.next.href ? <a href={config.next.href}>Next: {config.next.label} →</a> : <span>Next: {config.next.label} · Coming soon</span>}
          </nav>
        </article>
      </main>
    </div>
  )
}

export default ArticlePage

import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import aboutSource from './content/about.md?raw'

const frontmatterPattern = /^---[\s\S]*?---\s*/

function frontmatterValue(source: string, key: string) {
  const value = source.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? ''
  return value.replace(/^"(.*)"$/, '$1')
}

const aboutMeta = {
  title: frontmatterValue(aboutSource, 'title'),
  description: frontmatterValue(aboutSource, 'description'),
}

const aboutHeading = aboutSource.match(/^# (.+)$/m)?.[1] ?? 'About Kavach'

function prepareAbout(source: string) {
  const prepared = source
    .replace(frontmatterPattern, '')
    .replace(/<!-- refer image b4\.png here\s*-->/, '')
    .replace(/^\s*# .+\r?\n+/, '')
    .replace("At the end of every chapter there's a UPI QR code.", "At the end of every chapter there’s a UPI ID.")
    .replace('you can scan it and send', 'you can use it to send')

  const contactHeading = prepared.search(/^## Say Hello\s*$/m)
  return contactHeading >= 0 ? prepared.slice(0, contactHeading).trim() : prepared
}

const markdownComponents: Components = {
  h2: ({ children }) => {
    const label = String(children)
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return <h2 id={id}>{children}</h2>
  },
  a: ({ href = '', children }) => {
    const external = href.startsWith('http')
    return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}</a>
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

function AboutPage() {
  const [copyLabel, setCopyLabel] = useState('Copy UPI ID')
  const content = useMemo(() => prepareAbout(aboutSource), [])

  useEffect(() => {
    document.title = `${aboutMeta.title} Kavach`
    document.querySelector('meta[name="description"]')?.setAttribute('content', aboutMeta.description)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = new URL('/about/', window.location.origin).toString()
  }, [])

  const copyUpi = async () => {
    setCopyLabel(await copyText('garududit@ybl') ? 'UPI ID copied' : 'Copy failed')
    window.setTimeout(() => setCopyLabel('Copy UPI ID'), 2200)
  }

  return (
    <div className="about-page">
      <a className="skip-link" href="#about-content">Skip to content</a>
      <header className="article-topbar">
        <nav className="article-nav" aria-label="About navigation">
          <a className="wordmark" href="/" aria-label="Kavach home">Kavach</a>
          <div className="article-nav-actions">
            <a href="/chapter-1/">Chapter 1</a>
            <a className="pill pill-small" href="/chapter-1/#subscribe">Subscribe</a>
          </div>
        </nav>
      </header>

      <main id="about-content" tabIndex={-1}>
        <article>
          <header className="about-header">
            <a className="back-link" href="/">← Back to home</a>
            <p className="article-kicker">About Kavach</p>
            <h1>{aboutHeading}</h1>
            <p>{aboutMeta.description}</p>
          </header>

          <figure className="about-hero-image">
            <picture>
              <source media="(max-width: 680px)" srcSet="/images/about/b4-832.webp" />
              <img src="/images/about/b4.webp" alt="A college student researching vehicle-to-vehicle communication over chai at a roadside stall at night" width="1664" height="936" fetchPriority="high" decoding="async" />
            </picture>
            <figcaption>Research, chai, and the question that started Kavach.</figcaption>
          </figure>

          <div className="article-body about-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{content}</ReactMarkdown>
          </div>

          <div className="about-contact">
            <section aria-labelledby="say-hello-title">
              <p className="article-kicker">Corrections, questions, disagreements</p>
              <h2 id="say-hello-title">Say hello.</h2>
              <p>I read everything and reply to most. Tips about your city’s worst intersection are especially welcome.</p>
              <a className="contact-link" href="mailto:codeninja4545@gmail.com">codeninja4545@gmail.com</a>
              <a className="contact-link secondary-contact-link" href="/chapter-1/#subscribe">Subscribe to the newsletter</a>
            </section>
            <section aria-labelledby="support-title">
              <p className="article-kicker">Keep Kavach going</p>
              <h2 id="support-title">Buy me a chai.</h2>
              <p>Everything stays free. If the work helped, you can support the next chapter.</p>
              <code>garududit@ybl</code>
              <button className="pill" type="button" onClick={copyUpi} aria-live="polite">{copyLabel}</button>
            </section>
          </div>

          <footer className="about-signoff">
            <p><em>The vehicles are about to start talking. Stick around — I’ll tell you what they’re saying.</em></p>
            <p>— <strong>Code Ninja</strong><br /><span>Student, chai enthusiast, AI engineer, accidental road-safety nerd</span></p>
            <a className="pill" href="/chapter-1/">Read Chapter 1</a>
          </footer>
        </article>
      </main>
    </div>
  )
}

export default AboutPage

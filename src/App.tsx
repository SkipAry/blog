import { useEffect } from 'react'
import AboutPage from './AboutPage'
import ArticlePage from './ArticlePage'
import HomePage from './HomePage'

function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found — Kavach'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'The requested page could not be found.')
  }, [])

  return (
    <main className="not-found" id="main">
      <p className="section-label">404 · Page not found</p>
      <h1>This page wandered off.</h1>
      <a className="pill" href="/">Return home</a>
    </main>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '')
  if (path === '') return <HomePage />
  if (path === '/chapter-1') return <ArticlePage />
  if (path === '/chapter-2') return <ArticlePage />
  if (path === '/about') return <AboutPage />
  return <NotFoundPage />
}

export default App

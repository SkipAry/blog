const readerEmailKey = 'kavach-reader-email'

export function readReaderEmail() {
  try {
    return window.localStorage.getItem(readerEmailKey) ?? ''
  } catch {
    return ''
  }
}

export function saveReaderEmail(email: string) {
  try {
    window.localStorage.setItem(readerEmailKey, email)
  } catch {
    // The demo remains usable when storage is blocked; it just cannot persist.
  }
}

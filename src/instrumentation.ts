export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { writeSearchIndex } = await import('./lib/search-index')
    writeSearchIndex()
  }
}

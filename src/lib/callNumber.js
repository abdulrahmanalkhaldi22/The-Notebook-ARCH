// Generates a card-catalog-style call number, e.g. "FIC-2026-4821"
export function generateCallNumber(genre) {
  const year = new Date().getFullYear()
  const code = (genre || 'GEN').slice(0, 3).toUpperCase()
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `${code}-${year}-${suffix}`
}

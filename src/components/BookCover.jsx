const swatchNames = {
  '#7A3B2E': 'Oxblood',
  '#1F3327': 'Forest',
  '#2C4534': 'Moss',
  '#3A3226': 'Walnut',
  '#4A3B6B': 'Plum',
  '#1E3A52': 'Navy',
}

export const COVER_COLORS = Object.keys(swatchNames)

export function coverColorName(hex) {
  return swatchNames[hex] || 'Custom'
}

export default function BookCover({
  title,
  authorName,
  color = '#7A3B2E',
  mode = 'spine', // 'spine' | 'cover'
}) {
  if (mode === 'cover') {
    return (
      <div className="book-cover book-cover--front" style={{ background: color }}>
        <div className="book-cover-frame">
          <p className="book-cover-title">{title || 'Untitled'}</p>
          <span className="book-cover-rule" />
          <p className="book-cover-author">{authorName || 'Unknown author'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="book-cover book-cover--spine" style={{ background: color }}>
      <span className="book-spine-title">{title || 'Untitled'}</span>
    </div>
  )
}

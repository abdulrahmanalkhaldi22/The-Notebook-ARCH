import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { generateCallNumber } from '../lib/callNumber'
import AppShell from '../components/AppShell'
import BookCover, { COVER_COLORS, coverColorName } from '../components/BookCover'
import '../components/BookCover.css'
import './NewBookPage.css'

const GENRES = [
  'Fiction',
  'Nonfiction',
  'Poetry',
  'Memoir',
  'Journal',
  'Fantasy',
  'Essay',
  'Other',
]

export default function NewBookPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { data, error } = await supabase
      .from('books')
      .insert({
        owner_id: user.id,
        title: title.trim(),
        author_name: authorName.trim(),
        genre: genre || null,
        description: description.trim() || null,
        call_number: generateCallNumber(genre),
        content: { pages: [{ id: 'p1', text: '' }] },
        cover_config: { color: coverColor },
      })
      .select('id')
      .single()

    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate(`/books/${data.id}`)
  }

  return (
    <AppShell>
      <p className="newbook-eyebrow">New entry</p>
      <h1 className="newbook-title">Start a book</h1>
      <p className="newbook-subtitle">
        Give it a title and a cover. You can write the pages after.
      </p>

      <div className="newbook-layout">
        <form onSubmit={handleSubmit} className="newbook-form">
          <label className="newbook-field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The name on the cover"
              required
            />
          </label>

          <label className="newbook-field">
            <span>Author name</span>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="How you'll be credited"
              required
            />
          </label>

          <label className="newbook-field">
            <span>Genre</span>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">Choose a genre (optional)</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="newbook-field">
            <span>Short description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A line or two about what this book holds"
              rows={3}
            />
          </label>

          <div className="newbook-field">
            <span>Cover color</span>
            <div className="newbook-swatches">
              {COVER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={
                    'newbook-swatch' + (color === coverColor ? ' is-selected' : '')
                  }
                  style={{ background: color }}
                  onClick={() => setCoverColor(color)}
                  aria-label={coverColorName(color)}
                  title={coverColorName(color)}
                />
              ))}
            </div>
          </div>

          {error && <p className="newbook-error">{error}</p>}

          <div className="newbook-actions">
            <button
              type="button"
              className="newbook-cancel"
              onClick={() => navigate('/library')}
            >
              Cancel
            </button>
            <button type="submit" className="newbook-submit" disabled={submitting}>
              {submitting ? 'Placing on shelf…' : 'Create book'}
            </button>
          </div>
        </form>

        <div className="newbook-preview">
          <p className="newbook-preview-label">Cover preview</p>
          <BookCover title={title} authorName={authorName} color={coverColor} mode="cover" />
        </div>
      </div>
    </AppShell>
  )
}

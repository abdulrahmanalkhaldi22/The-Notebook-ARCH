import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AppShell from '../components/AppShell'
import './BookEditorPage.css'

export default function BookEditorPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [pages, setPages] = useState([{ id: 'p1', text: '' }])
  const [pageIndex, setPageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const pagesRef = useRef(pages)
  pagesRef.current = pages

  useEffect(() => {
    let active = true

    async function loadBook() {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single()

      if (!active) return

      if (error) {
        navigate('/library', { replace: true })
        return
      }

      setBook(data)
      const loadedPages = data.content?.pages?.length
        ? data.content.pages
        : [{ id: 'p1', text: '' }]
      setPages(loadedPages)
      setLoading(false)
    }

    loadBook()
    return () => {
      active = false
    }
  }, [bookId, navigate])

  const persistPages = useCallback(
    async (nextPages) => {
      setSaveState('saving')
      const { error } = await supabase
        .from('books')
        .update({ content: { pages: nextPages } })
        .eq('id', bookId)

      setSaveState(error ? 'error' : 'saved')
    },
    [bookId]
  )

  const handleTextChange = (text) => {
    setPages((prev) => {
      const next = [...prev]
      next[pageIndex] = { ...next[pageIndex], text }
      return next
    })
  }

  const handleBlurSave = () => {
    persistPages(pagesRef.current)
  }

  const goToPrevious = () => {
    persistPages(pagesRef.current)
    setPageIndex((i) => Math.max(0, i - 1))
  }

  const goToNext = () => {
    persistPages(pagesRef.current)
    setPageIndex((i) => {
      if (i + 1 < pagesRef.current.length) return i + 1

      const newPage = { id: `p${pagesRef.current.length + 1}`, text: '' }
      const nextPages = [...pagesRef.current, newPage]
      setPages(nextPages)
      persistPages(nextPages)
      return i + 1
    })
  }

  const toggleField = async (field) => {
    const nextValue = !book[field]
    setBook((prev) => ({ ...prev, [field]: nextValue }))
    await supabase.from('books').update({ [field]: nextValue }).eq('id', bookId)
  }

  if (loading) {
    return (
      <AppShell>
        <p className="editor-loading">Fetching the page…</p>
      </AppShell>
    )
  }

  const currentPage = pages[pageIndex]

  return (
    <AppShell>
      <div className="editor-header">
        <div>
          <span className="editor-call-number">{book.call_number}</span>
          <h1 className="editor-title">{book.title}</h1>
          <p className="editor-byline">by {book.author_name}</p>
        </div>
        <span className="editor-save-state">
          {saveState === 'saving' && 'Saving…'}
          {saveState === 'saved' && 'Saved'}
          {saveState === 'error' && 'Could not save'}
        </span>
      </div>

      <div className="book-open">
        <div className="book-page">
          <textarea
            className="book-page-text"
            value={currentPage?.text ?? ''}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleBlurSave}
            placeholder="Begin writing…"
          />
        </div>
      </div>

      <div className="book-pagination">
        <button
          type="button"
          className="book-page-btn"
          onClick={goToPrevious}
          disabled={pageIndex === 0}
        >
          ‹ Previous page
        </button>
        <span className="book-page-indicator">
          Page {pageIndex + 1} of {pages.length}
        </span>
        <button type="button" className="book-page-btn" onClick={goToNext}>
          Next page ›
        </button>
      </div>

      <div className="editor-visibility">
        <h2>Visibility</h2>
        <p className="editor-visibility-hint">
          Private books only appear in your own library. Publish it to show it
          on your profile, where other authors can request to borrow it.
        </p>

        <label className="editor-toggle">
          <input
            type="checkbox"
            checked={book.is_visible}
            onChange={() => toggleField('is_visible')}
          />
          <span>Show this book on my profile</span>
        </label>

        <label className="editor-toggle">
          <input
            type="checkbox"
            checked={book.description_visible}
            disabled={!book.is_visible}
            onChange={() => toggleField('description_visible')}
          />
          <span>Show description</span>
        </label>

        <label className="editor-toggle">
          <input
            type="checkbox"
            checked={book.cover_visible}
            disabled={!book.is_visible}
            onChange={() => toggleField('cover_visible')}
          />
          <span>Show cover</span>
        </label>
      </div>
    </AppShell>
  )
}

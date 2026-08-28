import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import AppShell from '../components/AppShell'
import BookCover from '../components/BookCover'
import '../components/BookCover.css'
import './LibraryPage.css'

export default function LibraryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadBooks() {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author_name, genre, call_number, is_visible, cover_config, updated_at')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false })

      if (active) {
        if (!error) setBooks(data)
        setLoading(false)
      }
    }

    loadBooks()
    return () => {
      active = false
    }
  }, [user.id])

  return (
    <AppShell>
      <div className="library-header">
        <div>
          <p className="library-eyebrow">Your shelves</p>
          <h1>My Library</h1>
        </div>
        <Link to="/books/new" className="library-new-btn">
          + Write a book
        </Link>
      </div>

      {loading ? (
        <p className="library-loading">Opening the stacks…</p>
      ) : books.length === 0 ? (
        <div className="library-empty">
          <p className="library-empty-mark">◆</p>
          <h2>Your shelves are empty</h2>
          <p>
            Nothing's been catalogued yet. Start your first book and it'll
            take its place on the shelf.
          </p>
          <Link to="/books/new" className="library-new-btn">
            + Write your first book
          </Link>
        </div>
      ) : (
        <div className="shelf">
          <div className="shelf-row">
            {books.map((book) => (
              <div
                key={book.id}
                className="shelf-slot"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <BookCover
                  title={book.title}
                  authorName={book.author_name}
                  color={book.cover_config?.color}
                  mode="spine"
                />
                {book.is_visible && <span className="shelf-slot-badge">On profile</span>}
              </div>
            ))}
          </div>
          <div className="shelf-board" />
        </div>
      )}
    </AppShell>
  )
}

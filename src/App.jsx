import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import LibraryPage from './pages/LibraryPage'
import NewBookPage from './pages/NewBookPage'
import BookEditorPage from './pages/BookEditorPage'

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  return <Navigate to={user ? '/library' : '/welcome'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/welcome" element={<AuthPage />} />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/new"
        element={
          <ProtectedRoute>
            <NewBookPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/:bookId"
        element={
          <ProtectedRoute>
            <BookEditorPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

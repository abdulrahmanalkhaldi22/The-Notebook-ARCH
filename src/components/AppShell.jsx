import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AppShell.css'

export default function AppShell({ children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <Link to="/library" className="shell-brand">
          <span className="shell-brand-mark">◆</span>
          The Notebook Archive
        </Link>
        <nav className="shell-nav">
          <Link to="/library">My Library</Link>
          <button type="button" onClick={handleSignOut} className="shell-signout">
            Sign out
          </button>
        </nav>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  )
}

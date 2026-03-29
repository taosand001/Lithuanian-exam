import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, LogOut, LayoutDashboard, Settings, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLang, LANGUAGES } from '../../context/LanguageContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLang } = useLang()
  const currentLang = LANGUAGES.find(l => l.code === lang)!

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-violet-600 font-bold text-xl">
            <BookOpen size={24} />
            <span>LT Egzaminai</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/exams" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'}`}>
              Egzaminai
            </NavLink>
            <NavLink to="/grammar" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'}`}>
              🇱🇹 Linksniai
            </NavLink>
            <NavLink to="/constitution" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'}`}>
              📜 Konstitucija
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'}`}>
                Valdymo panelė
              </NavLink>
            )}
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-violet-600' : 'text-slate-600 hover:text-violet-600'}`}>
                Administracija
              </NavLink>
            )}
          </div>

          {/* Desktop right side: Language picker + auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language picker */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-violet-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden lg:inline font-medium">{currentLang.label}</span>
                <ChevronDown size={13} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[160px] py-1 overflow-hidden">
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false) }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${lang === l.code ? 'text-violet-600 font-semibold bg-violet-50/40' : 'text-slate-700'}`}
                      >
                        <span className="text-base">{l.flag}</span>
                        <span>{l.label}</span>
                        {lang === l.code && <span className="ml-auto text-violet-500 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-600 hover:text-violet-600 transition-colors">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                  <LogOut size={15} />
                  Atsijungti
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
                  Prisijungti
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 rounded-lg">
                  Registruotis
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: language + menu */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm text-slate-600 px-2 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200"
            >
              <span>{currentLang.flag}</span>
              <ChevronDown size={12} />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-14 top-14 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[150px] py-1">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 ${lang === l.code ? 'text-violet-600 font-semibold' : 'text-slate-700'}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          <NavLink to="/exams" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 font-medium">
            <BookOpen size={16} /> Egzaminai
          </NavLink>
          <NavLink to="/grammar" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 font-medium">
            🇱🇹 Linksniai
          </NavLink>
          <NavLink to="/constitution" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 font-medium">
            📜 Konstitucija
          </NavLink>
          {user && (
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 font-medium">
              <LayoutDashboard size={16} /> Valdymo panelė
            </NavLink>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-slate-700 font-medium">
              <Settings size={16} /> Administracija
            </NavLink>
          )}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="flex items-center gap-2 py-2 text-red-500 font-medium w-full">
              <LogOut size={16} /> Atsijungti
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2 text-slate-700 font-medium">Prisijungti</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm py-2 rounded-lg">Registruotis</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

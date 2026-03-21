import { useState, FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { useTranslations } from '../context/LanguageContext'

const SOURCE = {
  heading: 'Prisijungti',
  subtitle: 'Sveiki sugrįžę! Prisijunkite prie savo paskyros.',
  emailLabel: 'El. pašto adresas',
  passwordLabel: 'Slaptažodis',
  submitBtn: 'Prisijungti',
  noAccount: 'Neturite paskyros?',
  registerLink: 'Registruotis',
}

export default function Login() {
  const t = useTranslations(SOURCE)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'Prisijungimo klaida. Patikrinkite el. paštą ir slaptažodį.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-violet-600 font-bold text-2xl">
            <BookOpen size={28} /> LT Egzaminai
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-1">{t.heading}</h1>
          <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{t.emailLabel}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="input-field" placeholder="jusu@pastas.lt" />
            </div>
            <div>
              <label className="label">{t.passwordLabel}</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="input-field pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full text-base py-3">
              {t.submitBtn}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              {t.noAccount}{' '}
              <Link to="/register" className="text-violet-600 font-semibold hover:text-violet-700">
                {t.registerLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

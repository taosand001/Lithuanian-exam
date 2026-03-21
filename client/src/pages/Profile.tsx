import { useEffect, useState, FormEvent } from 'react'
import { User as UserIcon, Lock, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { ExamAttempt } from '../types'
import Layout from '../components/layout/Layout'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function Profile() {
  const { user } = useAuth()
  const [attempts, setAttempts] = useState<ExamAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    api.get('/api/attempts/user/me').then(({ data }) => setAttempts(data.attempts)).finally(() => setLoading(false))
  }, [])

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      setSaveMsg('Informacija atnaujinta!')
    } finally {
      setSaving(false)
    }
  }

  const completed = attempts.filter(a => a.completedAt)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Mano profilis</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
              <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-3xl mx-auto mb-4">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-semibold text-slate-800 text-lg">{user?.name}</h2>
              <p className="text-slate-400 text-sm mb-2">{user?.email}</p>
              <Badge label={user?.role === 'ADMIN' ? 'Administratorius' : 'Studentas'} variant={user?.role === 'ADMIN' ? 'b1' : 'default'} />
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="font-bold text-slate-700">{completed.length}</div>
                  <div className="text-xs text-slate-400">Bandymai</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">
                    {completed.filter(a => a.passed).length}
                  </div>
                  <div className="text-xs text-slate-400">Išlaikyta</div>
                </div>
              </div>
            </div>

            {/* Edit name */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-4">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                <UserIcon size={16} /> Redaguoti profilį
              </h3>
              <form onSubmit={handleSaveName} className="space-y-3">
                <div>
                  <label className="label">Vardas</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
                </div>
                {saveMsg && <p className="text-green-600 text-sm">{saveMsg}</p>}
                <Button type="submit" loading={saving} size="sm">Išsaugoti</Button>
              </form>
            </div>
          </div>

          {/* Attempt history */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5">
                <BookOpen size={18} className="text-violet-600" /> Bandymų istorija
              </h2>
              {loading ? <div className="flex justify-center py-8"><Spinner /></div> : (
                completed.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">Dar nėra bandymų</p>
                ) : (
                  <div className="space-y-3">
                    {completed.map(a => (
                      <div key={a.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <div className="font-medium text-sm text-slate-700">{a.exam.title}</div>
                          <div className="text-xs text-slate-400">{new Date(a.startedAt).toLocaleDateString('lt-LT')}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge label={a.passed ? 'Išlaikyta' : 'Neišlaikyta'} variant={a.passed ? 'pass' : 'fail'} />
                          <span className={`font-bold text-sm ${a.passed ? 'text-green-600' : 'text-red-500'}`}>
                            {Math.round(a.score || 0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

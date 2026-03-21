import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, BarChart2, TrendingUp } from 'lucide-react'
import api from '../../api/axios'
import Layout from '../../components/layout/Layout'
import Badge, { levelVariant } from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

interface Stats {
  totalUsers: number; totalExams: number; totalAttempts: number
  recentAttempts: Array<{ id: string; score: number | null; passed: boolean | null; startedAt: string; user: { name: string }; exam: { title: string; level: string } }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Administravimo panelė</h1>
          <div className="flex gap-3">
            <Link to="/admin/exams" className="btn-outline text-sm py-2 px-4 rounded-xl">Egzaminai</Link>
            <Link to="/admin/questions" className="btn-outline text-sm py-2 px-4 rounded-xl">Klausimai</Link>
            <Link to="/admin/users" className="btn-primary text-sm py-2 px-4 rounded-xl">Vartotojai</Link>
          </div>
        </div>

        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Users className="text-violet-600" size={22} />, label: 'Vartotojai', value: stats.totalUsers, bg: 'bg-violet-50' },
                { icon: <BookOpen className="text-amber-500" size={22} />, label: 'Egzaminai', value: stats.totalExams, bg: 'bg-amber-50' },
                { icon: <BarChart2 className="text-green-600" size={22} />, label: 'Bandymai', value: stats.totalAttempts, bg: 'bg-green-50' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
                  <div className="text-3xl font-bold text-slate-800">{s.value}</div>
                  <div className="text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-violet-600" /> Paskutiniai bandymai
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">Vartotojas</th>
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">Egzaminas</th>
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">Rezultatas</th>
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">Data</th>
                  </tr></thead>
                  <tbody>
                    {stats.recentAttempts.map(a => (
                      <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-3 px-3 font-medium text-slate-700">{a.user.name}</td>
                        <td className="py-3 px-3"><div className="flex items-center gap-2">
                          <Badge label={a.exam.level} variant={levelVariant(a.exam.level)} size="sm" />{a.exam.title}
                        </div></td>
                        <td className="py-3 px-3">
                          {a.score != null ? (
                            <span className={`font-bold ${a.passed ? 'text-green-600' : 'text-red-500'}`}>{Math.round(a.score)}%</span>
                          ) : '—'}
                        </td>
                        <td className="py-3 px-3 text-slate-400">{new Date(a.startedAt).toLocaleDateString('lt-LT')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

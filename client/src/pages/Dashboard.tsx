import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Trophy, Clock, TrendingUp, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { ExamAttempt, Exam } from '../types'
import Badge, { levelVariant } from '../components/ui/Badge'
import Layout from '../components/layout/Layout'
import Spinner from '../components/ui/Spinner'
import { useTranslations } from '../context/LanguageContext'

const SOURCE = {
  hello: 'Sveiki,',
  subtitle: 'Tęskite pasiruošimą egzaminui',
  statAttempts: 'Bandymai',
  statBest: 'Geriausias',
  statPassed: 'Išlaikyta',
  statExams: 'Egzaminai',
  recentAttempts: 'Paskutiniai bandymai',
  newExam: 'Naujas egzaminas →',
  noAttempts: 'Dar nėra bandymų. Pradėkite pirmąjį egzaminą!',
  startExam: 'Pradėti egzaminą',
  quickStart: 'Greitai pradėti',
  review: 'Peržiūrėti',
  skill1: 'Skaitymas',
  skill2: 'Klausymas',
  skill3: 'Rašymas',
  skill4: 'Kalbėjimas',
  skill5: 'Gramatika',
}

export default function Dashboard() {
  const t = useTranslations(SOURCE)
  const { user } = useAuth()
  const [attempts, setAttempts] = useState<ExamAttempt[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  const skillLabels: Record<string, string> = {
    READING: t.skill1, LISTENING: t.skill2, WRITING: t.skill3, SPEAKING: t.skill4, GRAMMAR: t.skill5,
  }

  useEffect(() => {
    Promise.all([
      api.get('/api/attempts/user/me'),
      api.get('/api/exams'),
    ]).then(([a, e]) => {
      setAttempts(a.data.attempts)
      setExams(e.data.exams)
    }).finally(() => setLoading(false))
  }, [])

  const completedAttempts = attempts.filter(a => a.completedAt)
  const bestScore = completedAttempts.length > 0 ? Math.max(...completedAttempts.map(a => a.score || 0)) : 0
  const passedCount = completedAttempts.filter(a => a.passed).length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            {t.hello} {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <BookOpen className="text-violet-600" size={20} />, label: t.statAttempts, value: completedAttempts.length, bg: 'bg-violet-50' },
                { icon: <Trophy className="text-amber-500" size={20} />, label: t.statBest, value: `${Math.round(bestScore)}%`, bg: 'bg-amber-50' },
                { icon: <CheckCircle className="text-green-600" size={20} />, label: t.statPassed, value: passedCount, bg: 'bg-green-50' },
                { icon: <TrendingUp className="text-blue-600" size={20} />, label: t.statExams, value: exams.length, bg: 'bg-blue-50' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
                  <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                  <div className="text-slate-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent attempts */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-slate-800">{t.recentAttempts}</h2>
                    <Link to="/exams" className="text-sm text-violet-600 hover:text-violet-700 font-medium">{t.newExam}</Link>
                  </div>
                  {completedAttempts.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
                      <p className="text-sm">{t.noAttempts}</p>
                      <Link to="/exams" className="inline-block mt-4 btn-primary text-sm py-2">{t.startExam}</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedAttempts.slice(0, 8).map((a) => (
                        <div key={a.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-3">
                            {a.passed
                              ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                              : <XCircle size={18} className="text-red-400 flex-shrink-0" />}
                            <div>
                              <div className="font-medium text-sm text-slate-700">{a.exam.title}</div>
                              <div className="text-xs text-slate-400">
                                {new Date(a.startedAt).toLocaleDateString('lt-LT')}
                                {a.timeSpent && ` · ${Math.round(a.timeSpent / 60)} min`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge label={a.passed ? 'Išlaikyta' : 'Neišlaikyta'} variant={a.passed ? 'pass' : 'fail'} />
                            <span className={`font-bold text-sm ${a.passed ? 'text-green-600' : 'text-red-500'}`}>
                              {Math.round(a.score || 0)}%
                            </span>
                            <Link to={`/results/${a.id}`} className="text-xs text-violet-600 hover:underline">{t.review}</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick start */}
              <div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="font-semibold text-slate-800 mb-4">{t.quickStart}</h2>
                  <div className="space-y-3">
                    {exams.map((exam) => (
                      <Link key={exam.id} to={`/exam/${exam.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-violet-50 transition-colors group border border-slate-100 hover:border-violet-200">
                        <div className="flex items-center gap-3">
                          <Badge label={exam.level === 'CONSTITUTION' ? 'KONST' : exam.level} variant={levelVariant(exam.level)} size="sm" />
                          <div>
                            <div className="text-sm font-medium text-slate-700 group-hover:text-violet-700">{exam.title}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={10} /> {exam.timeLimit} min · {exam._count?.questions} kl.
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-violet-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

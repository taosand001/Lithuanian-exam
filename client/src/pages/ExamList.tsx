import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, BookOpen, Users } from 'lucide-react'
import api from '../api/axios'
import { Exam } from '../types'
import Badge, { levelVariant } from '../components/ui/Badge'
import Layout from '../components/layout/Layout'
import Spinner from '../components/ui/Spinner'
import { useTranslations } from '../context/LanguageContext'

type FilterLevel = 'ALL' | 'A2' | 'B1' | 'CONSTITUTION'

const SOURCE = {
  title: 'Egzaminai',
  subtitle: 'Pasirinkite egzaminą ir pradėkite ruoštis',
  filterAll: 'Visi',
  filterConstitution: 'Konstitucija',
  statQuestions: 'Klausimai',
  statMinutes: 'Minutės',
  statPassing: 'Išlaikymui',
  startExam: 'Pradėti egzaminą →',
}

export default function ExamList() {
  const t = useTranslations(SOURCE)
  const [exams, setExams] = useState<Exam[]>([])
  const [filter, setFilter] = useState<FilterLevel>('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/exams').then(({ data }) => setExams(data.exams)).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? exams : exams.filter(e => e.level === filter)

  const levelColors: Record<string, string> = {
    A2: 'from-amber-400 to-orange-400',
    B1: 'from-violet-500 to-violet-600',
    B2: 'from-blue-500 to-blue-600',
    C1: 'from-indigo-500 to-indigo-600',
    CONSTITUTION: 'from-slate-600 to-slate-700',
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.title}</h1>
          <p className="text-slate-500">{t.subtitle}</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['ALL', 'A2', 'B1', 'CONSTITUTION'] as FilterLevel[]).map((lvl) => (
            <button key={lvl} onClick={() => setFilter(lvl)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === lvl ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'
              }`}>
              {lvl === 'ALL' ? t.filterAll : lvl === 'CONSTITUTION' ? t.filterConstitution : lvl}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col">
                <div className={`bg-gradient-to-r ${levelColors[exam.level] || 'from-violet-500 to-violet-600'} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge label={exam.level === 'CONSTITUTION' ? 'KONSTITUCIJA' : exam.level} variant={levelVariant(exam.level)} />
                    <span className="text-white/70 text-xs font-medium uppercase tracking-wide">{exam.category}</span>
                  </div>
                  <h2 className="text-xl font-bold mt-2">{exam.title}</h2>
                  {exam.titleEn && <p className="text-white/70 text-sm mt-1">{exam.titleEn}</p>}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {exam.description && <p className="text-slate-500 text-sm mb-4 flex-1">{exam.description}</p>}
                  <div className="grid grid-cols-3 gap-2 mb-5 text-center">
                    <div className="bg-slate-50 rounded-xl p-2.5">
                      <div className="font-bold text-slate-700 text-sm">{exam._count?.questions || 0}</div>
                      <div className="text-slate-400 text-xs">{t.statQuestions}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5">
                      <div className="font-bold text-slate-700 text-sm flex items-center justify-center gap-1">
                        <Clock size={11} /> {exam.timeLimit}
                      </div>
                      <div className="text-slate-400 text-xs">{t.statMinutes}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5">
                      <div className="font-bold text-slate-700 text-sm">{exam.passingScore}%</div>
                      <div className="text-slate-400 text-xs">{t.statPassing}</div>
                    </div>
                  </div>
                  <Link to={`/exam/${exam.id}`}
                    className="btn-primary text-center block text-sm py-3 rounded-xl">
                    {t.startExam}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

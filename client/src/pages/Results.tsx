import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ArrowLeft, RotateCcw } from 'lucide-react'
import api from '../api/axios'
import { ExamAttempt, AttemptAnswer } from '../types'
import Layout from '../components/layout/Layout'
import Badge, { skillVariant } from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslations } from '../context/LanguageContext'

const SOURCE = {
  passed: '🎉 Sveikiname! Išlaikėte!',
  failed: 'Nepavyko šį kartą',
  needed: 'Reikėjo:',
  time: 'Laikas:',
  skillBreakdown: 'Rezultatai pagal įgūdžius',
  questionReview: 'Klausimų peržiūra',
  correct: 'Teisingas',
  yourAnswer: 'Jūsų atsakymas',
  yourAnswerText: 'Jūsų atsakymas:',
  notFound: 'Rezultatai nerasti.',
  backToExams: 'Grįžti į egzaminus',
  tryAgain: 'Bandyti dar kartą',
  dashboard: 'Valdymo panelė',
  result: 'Rezultatas',
  skill1: 'Skaitymas',
  skill2: 'Klausymas',
  skill3: 'Rašymas',
  skill4: 'Kalbėjimas',
  skill5: 'Gramatika',
}

export default function Results() {
  const t = useTranslations(SOURCE)
  const { attemptId } = useParams<{ attemptId: string }>()
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const skillLabels: Record<string, string> = {
    READING: t.skill1, LISTENING: t.skill2, WRITING: t.skill3, SPEAKING: t.skill4, GRAMMAR: t.skill5,
  }

  useEffect(() => {
    api.get(`/api/attempts/${attemptId}`)
      .then(({ data }) => setAttempt(data.attempt))
      .finally(() => setLoading(false))
  }, [attemptId])

  if (loading) return (
    <Layout><div className="flex justify-center py-20"><Spinner size="lg" /></div></Layout>
  )
  if (!attempt) return (
    <Layout><div className="p-8 text-center text-slate-500">{t.notFound}</div></Layout>
  )

  const score = Math.round(attempt.score || 0)
  const passed = attempt.passed

  // Skill breakdown
  const skillStats: Record<string, { correct: number; total: number }> = {}
  ;(attempt.answers || []).forEach((ans: AttemptAnswer) => {
    const skill = ans.question?.skill || 'GRAMMAR'
    if (!skillStats[skill]) skillStats[skill] = { correct: 0, total: 0 }
    skillStats[skill].total++
    if (ans.isCorrect) skillStats[skill].correct++
  })
  const chartData = Object.entries(skillStats).map(([skill, s]) => ({
    name: skillLabels[skill] || skill,
    score: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
  }))

  const toggleExpand = (id: string) => {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pass/Fail banner */}
        <div className={`rounded-2xl p-8 text-white mb-8 ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
          <div className="flex items-center gap-4">
            {passed
              ? <CheckCircle size={48} className="flex-shrink-0" />
              : <XCircle size={48} className="flex-shrink-0" />}
            <div>
              <h1 className="text-2xl font-bold mb-1">{passed ? t.passed : t.failed}</h1>
              <p className="text-white/80">{attempt.exam.title}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-5xl font-bold">{score}%</div>
              <div className="text-white/70 text-sm">{t.needed} {attempt.exam.passingScore}%</div>
            </div>
          </div>
          {attempt.timeSpent && (
            <div className="mt-4 text-white/70 text-sm">
              {t.time} {Math.floor(attempt.timeSpent / 60)} min {attempt.timeSpent % 60} sek
            </div>
          )}
        </div>

        {/* Skill breakdown chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
            <h2 className="font-semibold text-slate-800 mb-4">{t.skillBreakdown}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, t.result]} />
                <Bar dataKey="score" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Question review */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">{t.questionReview}</h2>
          <div className="space-y-3">
            {(attempt.answers || []).map((ans: AttemptAnswer, idx: number) => {
              if (!ans.question) return null
              const isExpanded = expanded.has(ans.id)
              const q = ans.question
              return (
                <div key={ans.id} className={`border rounded-xl overflow-hidden ${ans.isCorrect === false ? 'border-red-200' : ans.isCorrect ? 'border-green-200' : 'border-slate-200'}`}>
                  <button onClick={() => toggleExpand(ans.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {ans.isCorrect === true
                        ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        : ans.isCorrect === false
                        ? <XCircle size={16} className="text-red-400 flex-shrink-0" />
                        : <div className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0" />}
                      <Badge label={skillLabels[q.skill] || q.skill} variant={skillVariant(q.skill)} size="sm" />
                      <span className="text-sm text-slate-700 truncate">{idx + 1}. {q.content}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      {q.passage && (
                        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">{q.passage}</div>
                      )}
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isSelected = ans.selectedOption === opt.id
                          const isCorrectOpt = opt.isCorrect
                          return (
                            <div key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              isCorrectOpt ? 'bg-green-50 text-green-800 font-medium' :
                              isSelected && !isCorrectOpt ? 'bg-red-50 text-red-700' : 'text-slate-600'
                            }`}>
                              {isCorrectOpt ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> :
                               isSelected ? <XCircle size={14} className="text-red-400 flex-shrink-0" /> :
                               <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />}
                              {opt.content}
                              {isCorrectOpt && <span className="ml-auto text-xs text-green-600">{t.correct}</span>}
                              {isSelected && !isCorrectOpt && <span className="ml-auto text-xs text-red-500">{t.yourAnswer}</span>}
                            </div>
                          )
                        })}
                        {ans.textAnswer && (
                          <div className="bg-slate-50 rounded-lg p-3 text-sm">
                            <span className="text-slate-400 text-xs">{t.yourAnswerText} </span>
                            <span className="text-slate-700">{ans.textAnswer}</span>
                          </div>
                        )}
                      </div>
                      {q.explanation && (
                        <div className="bg-violet-50 border border-violet-100 rounded-lg p-3 text-sm text-violet-800">
                          💡 {q.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link to="/exams" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} /> {t.backToExams}
          </Link>
          <Link to={`/exam/${attempt.examId}`} className="btn-outline flex items-center gap-2">
            <RotateCcw size={16} /> {t.tryAgain}
          </Link>
          <Link to="/dashboard" className="btn-primary flex items-center gap-2">
            {t.dashboard}
          </Link>
        </div>
      </div>
    </Layout>
  )
}

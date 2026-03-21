import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Send, Menu, X, LogOut, Home, ChevronDown } from 'lucide-react'
import api from '../api/axios'
import { Exam, Question } from '../types'
import ExamTimer from '../components/exam/ExamTimer'
import QuestionNavigator from '../components/exam/QuestionNavigator'
import QuestionPanel from '../components/exam/QuestionPanel'
import ListeningSectionPanel from '../components/exam/ListeningSectionPanel'
import ProgressBar from '../components/exam/ProgressBar'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { useTimer } from '../hooks/useTimer'
import { useLang, LANGUAGES } from '../context/LanguageContext'

export default function ExamSession() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lang, setLang } = useLang()
  const [langOpen, setLangOpen] = useState(false)
  const currentLang = LANGUAGES.find(l => l.code === lang)!

  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | null>>({})
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleExpire = useCallback(() => setShowSubmitModal(true), [])
  const totalSeconds = exam ? exam.timeLimit * 60 : 0
  const { timeLeft, formatted } = useTimer(totalSeconds, handleExpire)

  // Stop TTS only when leaving a non-listening question
  useEffect(() => {
    if (questions[currentIndex]?.skill !== 'LISTENING') {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [currentIndex, questions])

  useEffect(() => {
    const init = async () => {
      try {
        const { data: examData } = await api.get(`/api/exams/${id}`)
        setExam(examData.exam)
        const { data: attemptData } = await api.post('/api/attempts', { examId: id })
        setAttemptId(attemptData.attempt.id)
        setQuestions(attemptData.attempt.questions || [])
      } catch {
        setError('Nepavyko užkrauti egzamino. Bandykite dar kartą.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id])

  const currentQuestion = questions[currentIndex]

  // Group listening questions by section (taskType). Each section = one shared audio panel.
  const listeningGroups = useMemo(() => {
    const order = ['L1_MCQ', 'L2_MCQ', 'L3_MCQ', 'L4_FILL']
    return order
      .map((type, i) => ({ type, number: i + 1, questions: questions.filter(q => q.taskType === type) }))
      .filter(g => g.questions.length > 0)
  }, [questions])

  const currentListeningGroup = currentQuestion?.skill === 'LISTENING'
    ? listeningGroups.find(g => g.type === currentQuestion.taskType) ?? null
    : null

  // Navigation that jumps section-by-section for listening
  const handleBack = () => {
    if (currentListeningGroup) {
      const gIdx = listeningGroups.indexOf(currentListeningGroup)
      if (gIdx > 0) {
        // Go to first question of previous listening section
        const prevGroup = listeningGroups[gIdx - 1]
        const firstIdx = questions.findIndex(q => q.id === prevGroup.questions[0].id)
        if (firstIdx >= 0) { setCurrentIndex(firstIdx); return }
      }
      // Go to last non-listening question before listening
      const firstListeningIdx = questions.findIndex(q => q.skill === 'LISTENING')
      if (firstListeningIdx > 0) setCurrentIndex(firstListeningIdx - 1)
      return
    }
    setCurrentIndex(i => Math.max(0, i - 1))
  }

  const handleNext = () => {
    if (currentListeningGroup) {
      const gIdx = listeningGroups.indexOf(currentListeningGroup)
      if (gIdx < listeningGroups.length - 1) {
        // Go to first question of next listening section
        const nextGroup = listeningGroups[gIdx + 1]
        const firstIdx = questions.findIndex(q => q.id === nextGroup.questions[0].id)
        if (firstIdx >= 0) { setCurrentIndex(firstIdx); return }
      }
      // After last listening section, go to first non-listening question after listening
      const lastListeningIdx = [...questions].reverse().findIndex(q => q.skill === 'LISTENING')
      const afterListening = questions.length - 1 - lastListeningIdx + 1
      if (afterListening < questions.length) { setCurrentIndex(afterListening); return }
      return
    }
    setCurrentIndex(i => Math.min(questions.length - 1, i + 1))
  }

  const isFirstStep = currentListeningGroup
    ? listeningGroups.indexOf(currentListeningGroup) === 0 && questions.findIndex(q => q.skill === 'LISTENING') === 0
    : currentIndex === 0
  const isLastStep = currentListeningGroup
    ? listeningGroups.indexOf(currentListeningGroup) === listeningGroups.length - 1 &&
      questions.slice(currentIndex).every(q => q.skill === 'LISTENING')
    : currentIndex === questions.length - 1
  const answeredCount = Object.values(answers).filter(Boolean).length +
    Object.values(textAnswers).filter(t => t.trim()).length

  const sectionLabels: Record<string, string> = {
    READING: '📖 I dalis: Skaitymas',
    LISTENING: '🎧 II dalis: Klausymas',
    WRITING: '✍️ III dalis: Rašymas',
    GRAMMAR: '📝 IV dalis: Gramatika',
  }
  const sectionLabel = currentQuestion ? sectionLabels[currentQuestion.skill] : null

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleTextChange = (questionId: string, text: string) => {
    setTextAnswers(prev => ({ ...prev, [questionId]: text }))
  }

  // Single-question wrappers for QuestionPanel (still uses currentQuestion.id)
  const handleSelectOptionSingle = (optionId: string) => handleSelectOption(currentQuestion.id, optionId)
  const handleTextChangeSingle = (text: string) => handleTextChange(currentQuestion.id, text)

  const handleToggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev)
      next.has(currentQuestion.id) ? next.delete(currentQuestion.id) : next.add(currentQuestion.id)
      return next
    })
  }

  const handleSubmit = async () => {
    if (!attemptId) return
    setSubmitting(true)
    try {
      const answerPayload = questions.map(q => ({
        questionId: q.id,
        selectedOption: answers[q.id] || null,
        textAnswer: textAnswers[q.id] || null,
      }))
      const timeSpent = totalSeconds - timeLeft
      await api.patch(`/api/attempts/${attemptId}/submit`, { answers: answerPayload, timeSpent })
      navigate(`/results/${attemptId}`)
    } catch {
      setError('Nepavyko pateikti egzamino. Bandykite dar kartą.')
      setSubmitting(false)
      setShowSubmitModal(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-8 max-w-md text-center">
        <p className="font-semibold mb-2">Klaida</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  )

  if (!loading && !error && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-8 max-w-md text-center">
          <p className="text-3xl mb-3">📭</p>
          <p className="font-semibold text-lg mb-2">Klausimai nerasti</p>
          <p className="text-sm mb-4">Šiam egzaminui dar nėra klausimų. Susisiekite su administratoriumi.</p>
          <button onClick={() => window.history.back()} className="btn-primary text-sm px-4 py-2 rounded-xl">← Grįžti</button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  const unanswered = questions.filter(q =>
    !answers[q.id] && !textAnswers[q.id]?.trim()
  ).length

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => setShowNav(!showNav)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
          {showNav ? <X size={18} /> : <Menu size={18} />}
        </button>
        {/* Exit button */}
        <button
          onClick={() => setShowExitModal(true)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-slate-200 hover:border-red-200 flex-shrink-0"
          title="Baigti egzaminą"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Baigti</span>
        </button>
        {/* Language picker */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-violet-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <span>{currentLang.flag}</span>
            <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[150px] py-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${lang === l.code ? 'text-violet-600 font-semibold bg-violet-50/40' : 'text-slate-700'}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === l.code && <span className="ml-auto text-violet-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-slate-800 text-sm truncate">{exam?.title}</h1>
          {sectionLabel && (
            <span className="inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {sectionLabel}
            </span>
          )}
          <div className="hidden sm:block">
            <ProgressBar current={currentIndex + 1} total={questions.length} answered={answeredCount} />
          </div>
        </div>
        <ExamTimer timeLeft={timeLeft} formatted={formatted} />
        <button onClick={() => setShowSubmitModal(true)}
          className="hidden sm:flex items-center gap-2 btn-primary text-sm py-2 px-4 rounded-xl">
          <Send size={14} /> Pateikti
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigator */}
        <aside className={`${showNav ? 'flex' : 'hidden'} lg:flex flex-col w-56 flex-shrink-0 border-r border-slate-100 overflow-y-auto bg-white absolute lg:relative z-30 h-full`}>
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            answers={answers as Record<string, string>}
            flagged={flagged}
            onNavigate={(i) => { setCurrentIndex(i); setShowNav(false) }}
          />
        </aside>

        {/* Main question area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {currentListeningGroup ? (
              <ListeningSectionPanel
                sectionQuestions={currentListeningGroup.questions}
                sectionNumber={currentListeningGroup.number}
                answers={answers as Record<string, string | null>}
                textAnswers={textAnswers}
                onSelectOption={handleSelectOption}
                onTextChange={handleTextChange}
              />
            ) : (
              <QuestionPanel
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                selectedOption={answers[currentQuestion.id] || null}
                textAnswer={textAnswers[currentQuestion.id] || ''}
                isFlagged={flagged.has(currentQuestion.id)}
                onSelectOption={handleSelectOptionSingle}
                onTextChange={handleTextChangeSingle}
                onToggleFlag={handleToggleFlag}
              />
            )}
          </div>
        </main>
      </div>

      {/* Bottom navigation */}
      <footer className="bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button variant="secondary" onClick={handleBack} disabled={isFirstStep}>
          <ChevronLeft size={16} /> Atgal
        </Button>
        <span className="text-sm text-slate-400">
          {currentListeningGroup
            ? `II dalis: Skyrius ${currentListeningGroup.number} / ${listeningGroups.length}`
            : `${currentIndex + 1} / ${questions.length}`}
        </span>
        {!isLastStep ? (
          <Button onClick={handleNext}>
            Toliau <ChevronRight size={16} />
          </Button>
        ) : (
          <Button onClick={() => setShowSubmitModal(true)}>
            <Send size={14} /> Pateikti egzaminą
          </Button>
        )}
      </footer>

      {/* Submit modal */}
      <Modal isOpen={showSubmitModal} onClose={() => !submitting && setShowSubmitModal(false)} title="Pateikti egzaminą?">
        <div className="space-y-4">
          {unanswered > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              ⚠️ Dar <strong>{unanswered}</strong> {unanswered === 1 ? 'klausimas be' : 'klausimai be'} atsakymo.
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
              ✅ Visi klausimai atsakyti!
            </div>
          )}
          <p className="text-sm text-slate-500">Pateikus egzaminą jo nebegalėsite keisti. Ar tikrai norite pateikti?</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowSubmitModal(false)} disabled={submitting} className="flex-1">
              Grįžti
            </Button>
            <Button onClick={handleSubmit} loading={submitting} className="flex-1">
              Taip, pateikti
            </Button>
          </div>
        </div>
      </Modal>

      {/* Exit modal */}
      <Modal isOpen={showExitModal} onClose={() => setShowExitModal(false)} title="Baigti egzaminą?">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            ⚠️ Jūsų atsakymai <strong>nebus išsaugoti</strong>. Egzaminas bus nutrauktas.
          </div>
          <p className="text-sm text-slate-500">Ar tikrai norite grįžti į pradžią ir nutraukti egzaminą?</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowExitModal(false)} className="flex-1">
              Tęsti egzaminą
            </Button>
            <Button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel()
                navigate('/')
              }}
              className="flex-1 !bg-red-500 hover:!bg-red-600"
            >
              <Home size={14} /> Grįžti į pradžią
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

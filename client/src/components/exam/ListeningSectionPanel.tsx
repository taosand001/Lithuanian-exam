import { useState, useRef, useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Question } from '../../types'

interface Props {
  sectionQuestions: Question[]
  sectionNumber: number
  answers: Record<string, string | null>
  textAnswers: Record<string, string>
  onSelectOption: (questionId: string, optionId: string) => void
  onTextChange: (questionId: string, text: string) => void
  revealedAnswers: Set<string>
  onReveal: (questionId: string) => void
}

export default function ListeningSectionPanel({
  sectionQuestions,
  sectionNumber,
  answers,
  textAnswers,
  onSelectOption,
  onTextChange,
  revealedAnswers,
  onReveal,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [ttsProgress, setTtsProgress] = useState(0)
  const [ttsElapsed, setTtsElapsed] = useState(0)
  const [ttsTotalSecs, setTtsTotalSecs] = useState(0)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ttsStartRef = useRef<number>(0)

  // Stop audio when unmounted
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  const firstQ = sectionQuestions[0]
  if (!firstQ) return null

  const isL4 = firstQ.taskType === 'L4_FILL'
  const rawPassage = firstQ.passage ?? ''
  const speakerMatch = rawPassage.match(/^\|\|(.+?)\|\|\n?/)
  const speakers = speakerMatch ? speakerMatch[1] : null
  const transcript = speakerMatch ? rawPassage.replace(speakerMatch[0], '').trim() : rawPassage

  const handlePlay = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    const text = transcript
    const wordCount = text.split(/\s+/).filter(Boolean).length
    const estimatedSecs = Math.max(Math.round(wordCount / 1.42), 5)
    setTtsTotalSecs(estimatedSecs)
    setTtsProgress(0)
    setTtsElapsed(0)
    ttsStartRef.current = Date.now()
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    progressIntervalRef.current = setInterval(() => {
      const elapsedMs = Date.now() - ttsStartRef.current
      setTtsElapsed(Math.floor(elapsedMs / 1000))
      setTtsProgress(Math.min((elapsedMs / (estimatedSecs * 1000)) * 100, 99))
    }, 300)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'lt-LT'
    utterance.rate = 0.85
    utterance.onend = () => {
      setIsPlaying(false)
      setTtsProgress(100)
      setTtsElapsed(estimatedSecs)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
    utterance.onerror = () => {
      setIsPlaying(false)
      setTtsProgress(0)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  const handleStop = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setIsPlaying(false)
    setTtsProgress(0)
    setTtsElapsed(0)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  const formatSecs = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
            🎧 Užduotis {sectionNumber}: Klausymas {sectionNumber}
          </span>
          <p className="text-xs text-sky-500 mt-0.5">
            {isL4 ? 'Klausykite ir įrašykite trūkstamus žodžius' : 'Klausykite ir atsakykite į klausimus'}
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-sky-600 text-white whitespace-nowrap">
          Galite klausytis: 2 kartus
        </span>
      </div>

      {/* Speakers */}
      {speakers && (
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-600 bg-white rounded-lg px-3 py-2 border border-sky-100">
          <span>🧑‍🤝‍🧑 <span className="font-semibold">Kalbėtojai:</span> {speakers}</span>
        </div>
      )}

      {/* Audio player */}
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">🔊 Garso įrašas</div>
      <div className="flex items-center gap-3 mb-2">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            ▶ Klausyti
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            ⏹ Sustabdyti
          </button>
        )}
        {isPlaying && <span className="text-xs text-sky-600 font-medium animate-pulse">● Groja...</span>}
      </div>

      {/* Progress bar */}
      {(isPlaying || ttsProgress > 0) && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-sky-500 mb-1">
            <span>{formatSecs(ttsElapsed)}</span>
            <span>{formatSecs(ttsTotalSecs)}</span>
          </div>
          <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-500 h-2 rounded-full transition-all duration-300" style={{ width: `${ttsProgress}%` }} />
          </div>
        </div>
      )}

      {/* Transcript toggle */}
      <button
        onClick={() => setShowTranscript(v => !v)}
        className="text-xs text-sky-400 underline hover:text-sky-600"
      >
        {showTranscript ? 'Slėpti tekstą' : 'Rodyti tekstą'}
      </button>
      {showTranscript && (
        <div className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-3 border border-sky-100 max-h-44 overflow-y-auto">
          {transcript}
        </div>
      )}

      {/* L4: full transcript with gaps */}
      {isL4 && (
        <div className="mt-3 text-sm text-slate-700 leading-loose bg-white rounded-lg p-3 border border-amber-200">
          <div className="text-xs font-semibold text-amber-600 mb-2">📝 Pranešimas su tarpais</div>
          {transcript.split(/\[(\d+)\]/).map((part, i) =>
            /^\d+$/.test(part) ? (
              <span key={i} className="inline-block mx-1 px-2 py-0.5 rounded border-2 border-slate-300 bg-slate-50 text-slate-500 text-xs font-bold">
                [{part}]
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      )}

      {/* Divider before questions */}
      <div className="border-t border-sky-200 my-4" />

      {/* Questions */}
      <div className="space-y-5">
        {sectionQuestions.map((q, idx) => {
          const selected = answers[q.id] ?? null
          const isRevealed = revealedAnswers.has(q.id)
          return (
            <div key={q.id} className="bg-white rounded-xl border border-sky-100 p-4">
              {/* Question text */}
              <p className="text-sm font-semibold text-slate-800 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold mr-2 flex-shrink-0">
                  {idx + 1}
                </span>
                {q.content}
              </p>

              {/* L1/L2/L3: MCQ options */}
              {q.type === 'MULTIPLE_CHOICE' && (
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const label = OPTION_LABELS[oi]
                    const isSelected = selected === opt.id
                    const isCorrect = opt.isCorrect === true
                    const isRightAnswer = isRevealed && isCorrect
                    const isWrongSelection = isRevealed && isSelected && !isCorrect
                    return (
                      <button
                        key={opt.id}
                        onClick={() => !isRevealed && onSelectOption(q.id, opt.id)}
                        disabled={isRevealed}
                        className={`flex items-center justify-between text-left px-3 py-2.5 rounded-xl border-2 text-sm transition-all ${
                          isRightAnswer
                            ? 'border-green-500 bg-green-50 text-green-800 font-medium'
                            : isWrongSelection
                            ? 'border-red-400 bg-red-50 text-red-800 font-medium'
                            : isSelected
                            ? 'border-sky-500 bg-sky-50 text-sky-900 font-medium'
                            : isRevealed
                            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-default'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/40'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                            isRightAnswer ? 'bg-green-600 text-white' :
                            isWrongSelection ? 'bg-red-500 text-white' :
                            isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {label}
                          </span>
                          {opt.content}
                        </span>
                        {isRightAnswer && <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />}
                        {isWrongSelection && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* L4: fill-blank input */}
              {q.type === 'FILL_BLANK' && (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={textAnswers[q.id] ?? ''}
                      onChange={(e) => !isRevealed && onTextChange(q.id, e.target.value)}
                      readOnly={isRevealed}
                      placeholder={`Žodis [${q.content.match(/\[(\d+)\]/)?.[1] ?? ''}]...`}
                      className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-400 focus:outline-none focus:ring-0 bg-white"
                    />
                    {!isRevealed && (textAnswers[q.id] ?? '').trim() && (
                      <button
                        onClick={() => onReveal(q.id)}
                        className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
                      >
                        Tikrinti
                      </button>
                    )}
                  </div>
                  {isRevealed && (() => {
                    const correctAnswer = q.options.find(o => o.isCorrect)?.content ?? ''
                    const userCorrect = correctAnswer.toLowerCase().trim() === (textAnswers[q.id] ?? '').toLowerCase().trim()
                    return (
                      <div className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${userCorrect ? 'text-green-700' : 'text-red-600'}`}>
                        {userCorrect
                          ? <><CheckCircle2 size={15} /> Teisingai!</>
                          : <><XCircle size={15} /> Neteisinga. Teisingas atsakymas: <span className="font-bold">„{correctAnswer}"</span></>
                        }
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

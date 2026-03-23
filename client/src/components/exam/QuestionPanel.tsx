import { useState, useEffect, useRef } from 'react'
import { Flag, Loader2, Mic, MicOff, CheckCircle2, XCircle } from 'lucide-react'
import { Question, Option } from '../../types'
import Badge, { skillVariant } from '../ui/Badge'
import { useLang } from '../../context/LanguageContext'

interface QuestionPanelProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedOption: string | null
  textAnswer: string
  isFlagged: boolean
  isRevealed: boolean
  onSelectOption: (optionId: string) => void
  onTextChange: (text: string) => void
  onToggleFlag: () => void
  onReveal: () => void
}

const skillLabels: Record<string, string> = {
  READING: 'Skaitymas', LISTENING: 'Klausymas', WRITING: 'Rašymas', SPEAKING: 'Kalbėjimas', GRAMMAR: 'Gramatika',
}

function RenderWithBlank({ content }: { content: string }) {
  const parts = content.split('___')
  if (parts.length === 1) return <>{content}</>
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="font-bold underline text-violet-600 mx-1">___</span>
          )}
        </span>
      ))}
    </>
  )
}

export default function QuestionPanel({
  question, questionNumber, totalQuestions, selectedOption, textAnswer,
  isFlagged, isRevealed, onSelectOption, onTextChange, onToggleFlag, onReveal,
}: QuestionPanelProps) {
  const { lang, translateText } = useLang()

  // TTS state
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [ttsProgress, setTtsProgress] = useState(0)
  const [ttsElapsed, setTtsElapsed] = useState(0)
  const [ttsTotalSecs, setTtsTotalSecs] = useState(0)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ttsStartRef = useRef<number>(0)

  // Speaking / recording state
  const [isRecording, setIsRecording] = useState(false)
  const [speechSupported] = useState(() =>
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
  const recognitionRef = useRef<any>(null)

  // Translation state
  const [translatedContent, setTranslatedContent] = useState<string | null>(null)
  const [translatedPassage, setTranslatedPassage] = useState<string | null>(null)
  const [translatedOptions, setTranslatedOptions] = useState<Option[] | null>(null)
  const [translating, setTranslating] = useState(false)

  // Reset TTS + translation + recording when question or language changes
  useEffect(() => {
    setIsPlaying(false)
    setShowTranscript(false)
    setTtsProgress(0)
    setTtsElapsed(0)
    setTranslatedContent(null)
    setTranslatedPassage(null)
    setTranslatedOptions(null)
    setIsRecording(false)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (recognitionRef.current) recognitionRef.current.stop()
  }, [question.id, lang])

  // Auto-translate when a non-Lithuanian language is selected
  useEffect(() => {
    if (lang === 'lt') return
    let cancelled = false
    const run = async () => {
      setTranslating(true)
      try {
        const textsToTranslate = [
          question.content,
          question.passage ?? '',
          ...question.options.map(o => o.content),
        ]
        const results = await Promise.all(textsToTranslate.map(t => t ? translateText(t, lang) : Promise.resolve('')))
        if (cancelled) return
        setTranslatedContent(results[0])
        if (question.passage) setTranslatedPassage(results[1])
        if (question.options.length > 0) {
          setTranslatedOptions(
            question.options.map((o, i) => ({ ...o, content: results[2 + i] }))
          )
        }
      } catch {
        // Silently fall back to Lithuanian on error
      } finally {
        if (!cancelled) setTranslating(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [question.id, lang])
  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const rawText = question.passage || ''
    // Strip ||speakers|| prefix for TTS
    const text = rawText.replace(/^\|\|.+?\|\|\n?/, '').trim()
    // Estimate: ~100 words/min at rate 0.85 ≈ 1.42 words/sec
    const wordCount = text.split(/\s+/).filter(Boolean).length
    const estimatedSecs = Math.max(Math.round(wordCount / 1.42), 5)
    setTtsTotalSecs(estimatedSecs)
    setTtsProgress(0)
    setTtsElapsed(0)
    ttsStartRef.current = Date.now()

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    progressIntervalRef.current = setInterval(() => {
      const elapsedMs = Date.now() - ttsStartRef.current
      const elapsedS = Math.floor(elapsedMs / 1000)
      const pct = Math.min((elapsedMs / (estimatedSecs * 1000)) * 100, 99)
      setTtsElapsed(elapsedS)
      setTtsProgress(pct)
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
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setTtsProgress(0)
    setTtsElapsed(0)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  const handleStartRecording = () => {
    if (!speechSupported) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.lang = 'lt-LT'
    recognition.continuous = true
    recognition.interimResults = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      onTextChange(transcript)
    }
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsRecording(false)
  }

  const formatSecs = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const wordCount = textAnswer.trim().split(/\s+/).filter(Boolean).length

  const displayContent = translatedContent ?? question.content
  const displayPassage = translatedPassage ?? question.passage
  const displayOptions = translatedOptions ?? question.options

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Badge label={skillLabels[question.skill] || question.skill} variant={skillVariant(question.skill)} />
          <span className="text-sm text-slate-400">Klausimas {questionNumber} iš {totalQuestions}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Auto-translation status indicator */}
          {lang !== 'lt' && (
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${
              translating
                ? 'border-blue-200 bg-blue-50 text-blue-500'
                : 'border-green-200 bg-green-50 text-green-600'
            }`}>
              {translating
                ? <><Loader2 size={11} className="animate-spin" /> Verčiama...</>
                : <>✓ Išversta</>}
            </span>
          )}
          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              isFlagged ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            <Flag size={13} /> {isFlagged ? 'Pažymėta' : 'Pažymėti'}
          </button>
        </div>
      </div>

      {/* P5_NOTICES: Three notice cards (A, B, C) + A/B/C choice */}
      {question.taskType === 'P5_NOTICES' && displayPassage && (() => {
        const parts = displayPassage.split(/§([ABC])§/).filter(Boolean)
        const notices: { label: string; text: string }[] = []
        for (let i = 0; i < parts.length - 1; i += 2) {
          notices.push({ label: parts[i], text: parts[i + 1]?.trim() ?? '' })
        }
        const colors: Record<string, string> = {
          A: 'border-blue-300 bg-blue-50',
          B: 'border-green-300 bg-green-50',
          C: 'border-orange-300 bg-orange-50',
        }
        const labelColors: Record<string, string> = {
          A: 'bg-blue-500 text-white',
          B: 'bg-green-500 text-white',
          C: 'bg-orange-500 text-white',
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {notices.map(n => (
              <div key={n.label} className={`border-2 rounded-xl p-4 ${colors[n.label] ?? 'border-slate-200 bg-white'}`}>
                <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mb-2 ${labelColors[n.label] ?? 'bg-slate-500 text-white'}`}>
                  {n.label}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>
        )
      })()}

      {/* P3_DIALOGUE: Show dialogue with current gap highlighted */}
      {question.taskType === 'P3_DIALOGUE' && displayPassage && (() => {
        // Extract gap number from question content e.g. "[12]"
        const gapMatch = question.content.match(/\[(\d+)\]/)
        const gapNum = gapMatch ? gapMatch[1] : null
        return (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">💬 Dialogas</div>
            <div className="space-y-2 text-sm">
              {displayPassage.split('\n').map((line, i) => {
                const isK = line.startsWith('K:')
                const isD = line.startsWith('D:')
                const highlighted = gapNum ? line.replace(`[${gapNum}]`, `▶▶▶`) : line
                const hasGap = gapNum ? line.includes(`[${gapNum}]`) : false
                return (
                  <div key={i} className={`flex ${isK ? 'justify-start' : isD ? 'justify-end' : 'justify-center'}`}>
                    {(isK || isD) && (
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                        hasGap
                          ? 'bg-amber-100 border-2 border-amber-400 text-amber-900 font-semibold'
                          : isK ? 'bg-blue-500 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}>
                        <span className="font-bold mr-1 opacity-70">{isK ? 'K' : 'D'}:</span>
                        {hasGap
                          ? line.replace(/^[KD]: /, '').replace(`[${gapNum}]`, ' _____ ')
                          : line.replace(/^[KD]: /, '')}
                      </div>
                    )}
                    {!isK && !isD && <span className="text-slate-400 text-xs italic">{line}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* P1_MATCH / P2_DEF_MATCH: Regular passage as context header */}
      {(question.taskType === 'P1_MATCH' || question.taskType === 'P2_DEF_MATCH') && displayPassage && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-4">
          <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">📖 Kontekstas</div>
          <p className="text-sm text-indigo-800">{displayPassage}</p>
        </div>
      )}

      {/* Standard reading passage (not a special task type) */}
      {question.skill === 'READING' && question.passage && !question.taskType && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-5">
          <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">📖 Tekstas skaitymui</div>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto pr-1">
            {displayPassage}
          </div>
        </div>
      )}

      {/* P4_TRUE_FALSE: Show passage as main reading text */}
      {question.taskType === 'P4_TRUE_FALSE' && displayPassage && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-5">
          <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">📖 Tekstas</div>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {displayPassage}
          </div>
        </div>
      )}

      {/* NSA Listening panel — L1/L2/L3 (MCQ) and L4 (fill) */}
      {question.skill === 'LISTENING' && question.passage && (() => {
        const rawPassage = displayPassage ?? ''
        // Parse optional ||speakers|| prefix
        const speakerMatch = rawPassage.match(/^\|\|(.+?)\|\|\n?/)
        const speakers = speakerMatch ? speakerMatch[1] : null
        const transcript = speakerMatch ? rawPassage.replace(speakerMatch[0], '').trim() : rawPassage
        // Section number from taskType
        const sectionNum = question.taskType === 'L1_MCQ' ? 1 : question.taskType === 'L2_MCQ' ? 2 : question.taskType === 'L3_MCQ' ? 3 : 4
        const isL4 = question.taskType === 'L4_FILL'

        return (
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-5">
            {/* Section header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  🎧 Užduotis {sectionNum}: Klausymas {sectionNum}
                </span>
                <p className="text-xs text-sky-500 mt-0.5">
                  {isL4 ? 'Klausykite ir įrašykite trūkstamus žodžius' : 'Klausykite ir atsakykite į klausimus'}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-sky-600 text-white">
                Galite klausytis: 2 kartus
              </span>
            </div>

            {/* Speakers info */}
            {speakers && (
              <div className="flex items-center gap-2 mb-3 text-xs text-slate-600 bg-white rounded-lg px-3 py-2 border border-sky-100">
                <span>🧑‍🤝‍🧑 <span className="font-semibold">Kalbėtojai:</span> {speakers}</span>
              </div>
            )}

            {/* Garso įrašas label */}
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">🔊 Garso įrašas</div>

            {/* Player controls */}
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
              className="text-xs text-sky-400 underline hover:text-sky-600 mt-1"
            >
              {showTranscript ? 'Slėpti tekstą' : 'Rodyti tekstą'}
            </button>
            {showTranscript && (
              <div className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-3 border border-sky-100 max-h-44 overflow-y-auto">
                {transcript}
              </div>
            )}

            {/* L4: Show passage with gap highlighted */}
            {isL4 && (() => {
              const gapMatch = question.content.match(/\[(\d+)\]/)
              return (
                <div className="mt-3 text-sm text-slate-700 leading-loose bg-white rounded-lg p-3 border border-amber-200">
                  <div className="text-xs font-semibold text-amber-600 mb-2">📝 Pranešimas su tarpais</div>
                  {transcript.split(/\[(\d+)\]/).map((part, i) => {
                    if (/^\d+$/.test(part)) {
                      const isCurrentGap = gapMatch && part === gapMatch[1]
                      return (
                        <span key={i} className={`inline-block mx-1 px-2 py-0.5 rounded border-2 text-xs font-bold ${
                          isCurrentGap ? 'border-amber-400 bg-amber-100 text-amber-900' : 'border-slate-300 bg-slate-50 text-slate-500'
                        }`}>
                          [{part}] {isCurrentGap ? '◀' : ''}
                        </span>
                      )
                    }
                    return <span key={i}>{part}</span>
                  })}
                </div>
              )
            })()}
          </div>
        )
      })()}

      {/* Speaking panel — S_SPEAK */}
      {question.taskType === 'S_SPEAK' && (() => {
        const lines = question.content.split('\n').filter(Boolean)
        const title = lines[0]
        const body = lines.slice(1).join('\n').trim()
        const isImageTask = !!question.imageUrl || (question.passage && question.passage.startsWith('http'))
        const imgUrl = question.imageUrl || (question.passage?.startsWith('http') ? question.passage : null)
        return (
          <div className="mb-5">
            {/* Task card */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex-shrink-0">
                  {questionNumber}
                </span>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Kalbėjimo užduotis</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{title}</p>
              {body && <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{body}</p>}
            </div>
            {/* Image for picture description tasks */}
            {isImageTask && imgUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={imgUrl}
                  alt="Paveikslėlis kalbėjimo užduočiai"
                  className="rounded-xl max-h-56 object-cover border border-slate-200 shadow"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
          </div>
        )
      })()}

      {/* Legacy real audio file support */}
      {question.audioUrl && (
        <div className="mb-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Garso įrašas</div>
          <audio controls src={question.audioUrl} className="w-full rounded-xl" />
        </div>
      )}

      {/* W1_FILL: Passage with inline gap highlighted + type input */}
      {question.taskType === 'W1_FILL' && displayPassage && (() => {
        const gapMatch = question.content.match(/\[(\d+)\]/)
        const gapNum = gapMatch ? gapMatch[1] : null
        return (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-2">✏️ Įrašykite trūkstamą žodį</div>
            <div className="text-sm text-slate-700 leading-loose">
              {gapNum ? displayPassage.split(`[${gapNum}]`).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="inline-block mx-1 px-2 py-0.5 rounded border-2 border-violet-400 bg-amber-100 text-amber-900 font-bold text-xs">
                      [{gapNum}] ▶
                    </span>
                  )}
                </span>
              )) : displayPassage}
            </div>
          </div>
        )
      })()}

      {/* W2_SELECT: Passage with inline gap highlighted + choice buttons */}
      {question.taskType === 'W2_SELECT' && displayPassage && (() => {
        const gapMatch = question.content.match(/\[(\d+)\]/)
        const gapNum = gapMatch ? gapMatch[1] : null
        return (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">📝 Pasirinkite tinkamą žodį</div>
            <div className="text-sm text-slate-700 leading-loose">
              {gapNum ? displayPassage.split(`[${gapNum}]`).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="inline-block mx-1 px-2 py-0.5 rounded border-2 border-green-400 bg-amber-100 text-amber-900 font-bold text-xs">
                      [{gapNum}] ▶
                    </span>
                  )}
                </span>
              )) : displayPassage}
            </div>
          </div>
        )
      })()}

      {/* W3_FORM: Show the form context header */}
      {question.taskType === 'W3_FORM' && displayPassage && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 mb-4">
          <div className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">📋 Formos pildymas</div>
          <p className="text-sm text-sky-800">{displayPassage}</p>
        </div>
      )}

      {/* W4_FREE: Full prompt with bullet points + word target */}
      {question.taskType === 'W4_FREE' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">✍️ Laisvas rašymas</div>
        </div>
      )}

      {/* Fill-blank instructions (non-W1 FILL_BLANK) */}
      {question.type === 'FILL_BLANK' && !question.taskType?.startsWith('W') && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-4 text-sm text-violet-700 font-medium">
          ✏️ Įrašykite trūkstamą žodį į laukelį
        </div>
      )}

      {/* Question text — skip for W4_FREE (content IS the prompt, shown below) */}
      {question.taskType !== 'W4_FREE' && (
        <p className={`text-base font-semibold text-slate-800 mb-5 leading-relaxed whitespace-pre-wrap ${
          question.taskType === 'W3_FORM' ? 'text-lg' : ''
        }`}>
          {question.type === 'FILL_BLANK'
            ? <RenderWithBlank content={displayContent} />
            : displayContent}
        </p>
      )}

      {/* W4_FREE: Prompt card + textarea */}
      {question.taskType === 'W4_FREE' && (() => {
        const lines = displayContent.split('\n').filter(Boolean)
        const title = lines[0] || ''
        const situation = lines[2] || ''
        const bullets = lines.slice(4).filter(l => l.startsWith('•'))
        const target = lines.find(l => l.includes('žodžių') && !l.startsWith('•')) || ''
        return (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
            <div className="bg-white border border-amber-200 rounded-xl p-4 mb-4 text-sm text-slate-700">
              <p className="font-semibold mb-2">{situation}</p>
              {bullets.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-600 mb-1">Parašykite:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {bullets.map((b, i) => <li key={i}>{b.replace('• ', '')}</li>)}
                  </ul>
                </div>
              )}
              {target && <p className="text-xs text-amber-600 mt-2 font-medium">{target}</p>}
            </div>
          </div>
        )
      })()}

      {/* Multiple choice options — 2-col grid for P1/P2 (many options) */}
      {(question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') && (
        <div className={`${displayOptions.length > 5 ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : 'space-y-2'}`}>
          {displayOptions.map((opt, idx) => {
            const isSelected = selectedOption === opt.id
            const isCorrect = opt.isCorrect === true
            const isWrongSelection = isRevealed && isSelected && !isCorrect
            const isRightAnswer = isRevealed && isCorrect
            const label = question.taskType === 'P5_NOTICES'
              ? opt.content
              : String.fromCharCode(65 + idx)
            return (
              <button
                key={opt.id}
                onClick={() => !isRevealed && onSelectOption(opt.id)}
                disabled={isRevealed}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 text-sm font-medium flex items-center justify-between ${
                  isRightAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : isWrongSelection
                    ? 'border-red-400 bg-red-50 text-red-800'
                    : isSelected
                    ? 'border-violet-500 bg-violet-50 text-violet-800'
                    : isRevealed
                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-default'
                    : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                    isRightAnswer ? 'bg-green-600 text-white' :
                    isWrongSelection ? 'bg-red-500 text-white' :
                    isSelected ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {label}
                  </span>
                  {opt.content}
                </span>
                {isRightAnswer && <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />}
                {isWrongSelection && <XCircle size={18} className="text-red-500 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}

      {/* Explanation box — shown after MCQ/TRUE_FALSE is revealed and user was wrong */}
      {(question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') && isRevealed && question.explanation && (() => {
        const userWasWrong = question.options.find(o => o.id === selectedOption)?.isCorrect === false
        if (!userWasWrong) return null
        return (
          <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex gap-3">
            <span className="text-blue-500 text-lg flex-shrink-0 mt-0.5">💡</span>
            <div>
              <p className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">Why is this the correct answer?</p>
              <p className="text-sm text-blue-800 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        )
      })()}

      {/* Fill blank input */}
      {question.type === 'FILL_BLANK' && (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => !isRevealed && onTextChange(e.target.value)}
              readOnly={isRevealed}
              placeholder="Įveskite trūkstamą žodį..."
              className={`input-field flex-1 ${isRevealed ? 'cursor-default' : ''}`}
            />
            {!isRevealed && textAnswer.trim() && (
              <button
                onClick={onReveal}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0"
              >
                Tikrinti
              </button>
            )}
          </div>
          {isRevealed && (() => {
            const correctAnswer = question.options.find(o => o.isCorrect)?.content ?? ''
            const userCorrect = correctAnswer.toLowerCase().trim() === textAnswer.toLowerCase().trim()
            return (
              <>
                <div className={`mt-2 flex items-center gap-2 text-sm font-medium ${userCorrect ? 'text-green-700' : 'text-red-600'}`}>
                  {userCorrect
                    ? <><CheckCircle2 size={16} /> Teisingai!</>
                    : <><XCircle size={16} /> Neteisinga. Teisingas atsakymas: <span className="font-bold">„{correctAnswer}"</span></>
                  }
                </div>
                {!userCorrect && question.explanation && (
                  <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex gap-3">
                    <span className="text-blue-500 text-lg flex-shrink-0 mt-0.5">💡</span>
                    <div>
                      <p className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">Why is this the correct answer?</p>
                      <p className="text-sm text-blue-800 leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}

      {/* Text input — W3_FORM, W4_FREE, generic letter, OR S_SPEAK with microphone recorder */}
      {question.type === 'TEXT_INPUT' && (() => {
        if (question.taskType === 'S_SPEAK') {
          return (
            <div>
              {/* Recording area */}
              <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-4 transition-colors ${
                isRecording ? 'border-orange-400 bg-orange-50' : 'border-slate-300 bg-slate-50'
              }`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isRecording ? 'bg-orange-100 border-2 border-orange-400 animate-pulse' : 'bg-slate-200'
                }`}>
                  {isRecording ? <Mic size={28} className="text-orange-500" /> : <MicOff size={28} className="text-slate-400" />}
                </div>
                {!isRecording ? (
                  <button
                    onClick={speechSupported ? handleStartRecording : undefined}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors shadow"
                  >
                    <Mic size={16} /> Pradėti įrašymą
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors shadow"
                  >
                    <MicOff size={16} /> Sustabdyti įrašymą
                  </button>
                )}
                <p className="text-xs text-slate-500 text-center">
                  {speechSupported
                    ? (isRecording ? '🔴 Įrašoma... Kalbėkite aiškiai į mikrofoną' : 'Paspauskite mygtuką ir kalbėkite aiškiai į mikrofoną')
                    : '⚠️ Jūsų naršyklė nepalaiko kalbos atpažinimo. Parašykite savo atsakymą žemiau.'}
                </p>
              </div>
              {/* Transcript / manual text area */}
              {(textAnswer || !speechSupported) && (
                <div className="mt-3">
                  <div className="text-xs text-slate-500 mb-1 font-medium">
                    {speechSupported ? '📝 Atpažintas tekstas (galite redaguoti):' : '✍️ Jūsų atsakymas:'}
                  </div>
                  <textarea
                    value={textAnswer}
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder="Čia pasirodys jūsų kalbos tekstas..."
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
              )}
            </div>
          )
        }
        const isForm = question.taskType === 'W3_FORM'
        const isFree = question.taskType === 'W4_FREE'
        const minW = isFree ? 20 : 50
        const maxW = isFree ? 30 : 80
        const warnColor = wordCount === 0 ? 'text-slate-400'
          : (wordCount < minW || wordCount > maxW) ? 'text-red-500'
          : (wordCount < minW + 5 || wordCount > maxW - 5) ? 'text-amber-500'
          : 'text-green-600'
        return (
          <div>
            <textarea
              value={textAnswer}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={isForm ? 'Jūsų atsakymas...' : 'Rašykite čia...'}
              rows={isForm ? 3 : 8}
              className="input-field resize-none"
            />
            <div className={`flex justify-between text-xs mt-1 font-medium ${warnColor}`}>
              <span>{wordCount} {isForm ? 'žodžiai' : `žodžių / ${minW}–${maxW}`}</span>
              {!isForm && <span className="text-slate-400">{textAnswer.length}/600</span>}
            </div>
          </div>
        )
      })()}
    </div>
  )
}




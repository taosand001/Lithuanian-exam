import { Flag, CheckCircle2, XCircle } from 'lucide-react'
import { Question } from '../../types'

interface QuestionNavigatorProps {
  questions: Question[]
  currentIndex: number
  answers: Record<string, string | null>
  textAnswers: Record<string, string>
  flagged: Set<string>
  revealedAnswers: Set<string>
  onNavigate: (index: number) => void
}

const skillLabels: Record<string, string> = {
  READING: 'Skaitymas', LISTENING: 'Klausymas', WRITING: 'Rašymas', SPEAKING: 'Kalbėjimas', GRAMMAR: 'Gramatika',
}

function getCorrectness(q: Question, answers: Record<string, string | null>, textAnswers: Record<string, string>): boolean | null {
  if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE' || q.type === 'MULTI_SELECT') {
    const selected = answers[q.id]
    if (!selected) return null
    const correct = q.options.find(o => o.isCorrect)
    return correct?.id === selected
  }
  if (q.type === 'FILL_BLANK') {
    const typed = textAnswers[q.id]?.toLowerCase().trim()
    if (!typed) return null
    const correct = q.options.find(o => o.isCorrect)?.content?.toLowerCase().trim()
    return !!correct && typed === correct
  }
  return null
}

export default function QuestionNavigator({ questions, currentIndex, answers, textAnswers, flagged, revealedAnswers, onNavigate }: QuestionNavigatorProps) {
  const grouped: Record<string, Question[]> = {}
  questions.forEach((q) => {
    if (!grouped[q.skill]) grouped[q.skill] = []
    grouped[q.skill].push(q)
  })

  return (
    <div className="bg-white border-r border-slate-100 h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Klausimai</h3>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Neatsakyta</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Teisingai</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Neteisingai</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-200 inline-block" /> Pažymėta</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-600 inline-block" /> Dabartinis</span>
        </div>

        {Object.entries(grouped).map(([skill, qs]) => (
          <div key={skill} className="mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              {skillLabels[skill] || skill}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {qs.map((q) => {
                const globalIdx = questions.findIndex((gq) => gq.id === q.id)
                const isCurrent = globalIdx === currentIndex
                const isFlagged = flagged.has(q.id)
                const isRevealed = revealedAnswers.has(q.id)
                const correctness = isRevealed ? getCorrectness(q, answers, textAnswers) : null

                let cls = 'nav-btn '
                if (isCurrent) cls += 'current'
                else if (isFlagged) cls += 'flagged'
                else if (isRevealed && correctness === true) cls += 'correct'
                else if (isRevealed && correctness === false) cls += 'wrong'
                else if (answers[q.id] || textAnswers[q.id]?.trim()) cls += 'answered'
                else cls += 'unanswered'

                return (
                  <button key={q.id} onClick={() => onNavigate(globalIdx)} className={cls} title={`Klausimas ${globalIdx + 1}`}>
                    {isFlagged && !isCurrent ? <Flag size={10} /> :
                     isRevealed && correctness === true && !isCurrent ? <CheckCircle2 size={11} /> :
                     isRevealed && correctness === false && !isCurrent ? <XCircle size={11} /> :
                     globalIdx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

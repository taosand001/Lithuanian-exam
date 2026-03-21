import { Flag } from 'lucide-react'
import { Question } from '../../types'

interface QuestionNavigatorProps {
  questions: Question[]
  currentIndex: number
  answers: Record<string, string | null>
  flagged: Set<string>
  onNavigate: (index: number) => void
}

const skillLabels: Record<string, string> = {
  READING: 'Skaitymas', LISTENING: 'Klausymas', WRITING: 'Rašymas', SPEAKING: 'Kalbėjimas', GRAMMAR: 'Gramatika',
}

export default function QuestionNavigator({ questions, currentIndex, answers, flagged, onNavigate }: QuestionNavigatorProps) {
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
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block" /> Atsakyta</span>
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
                const isAnswered = !!answers[q.id]
                const isFlagged = flagged.has(q.id)
                let cls = 'nav-btn '
                if (isCurrent) cls += 'current'
                else if (isFlagged) cls += 'flagged'
                else if (isAnswered) cls += 'answered'
                else cls += 'unanswered'
                return (
                  <button key={q.id} onClick={() => onNavigate(globalIdx)} className={cls} title={`Klausimas ${globalIdx + 1}`}>
                    {isFlagged && !isCurrent ? <Flag size={10} /> : globalIdx + 1}
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

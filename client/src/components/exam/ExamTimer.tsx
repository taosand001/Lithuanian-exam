import { Clock } from 'lucide-react'

interface ExamTimerProps {
  timeLeft: number
  formatted: string
}

export default function ExamTimer({ timeLeft, formatted }: ExamTimerProps) {
  const isWarning = timeLeft <= 300 && timeLeft > 60
  const isDanger = timeLeft <= 60

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg transition-all ${
      isDanger
        ? 'bg-red-100 text-red-700 animate-pulse'
        : isWarning
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-700'
    }`}>
      <Clock size={18} className={isDanger ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-500'} />
      {formatted}
    </div>
  )
}

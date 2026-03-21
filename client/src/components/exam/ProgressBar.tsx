interface ProgressBarProps {
  current: number
  total: number
  answered: number
}

export default function ProgressBar({ current, total, answered }: ProgressBarProps) {
  const pct = total > 0 ? (answered / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 whitespace-nowrap">{answered}/{total} atsakyta</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[80px]">
        <div
          className="bg-violet-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap">{Math.round(pct)}%</span>
    </div>
  )
}

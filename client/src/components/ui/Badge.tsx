interface BadgeProps {
  label: string
  variant?: 'a2' | 'b1' | 'b2' | 'c1' | 'constitution' | 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'pass' | 'fail' | 'default'
  size?: 'sm' | 'md'
}

const variants: Record<string, string> = {
  a2: 'bg-amber-100 text-amber-800',
  b1: 'bg-violet-100 text-violet-800',
  b2: 'bg-blue-100 text-blue-800',
  c1: 'bg-indigo-100 text-indigo-800',
  constitution: 'bg-slate-100 text-slate-700',
  reading: 'bg-sky-100 text-sky-800',
  listening: 'bg-purple-100 text-purple-800',
  writing: 'bg-emerald-100 text-emerald-800',
  speaking: 'bg-orange-100 text-orange-800',
  grammar: 'bg-pink-100 text-pink-800',
  pass: 'bg-green-100 text-green-800',
  fail: 'bg-red-100 text-red-800',
  default: 'bg-slate-100 text-slate-600',
}

export default function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'} ${variants[variant] || variants.default}`}>
      {label}
    </span>
  )
}

export function levelVariant(level: string): BadgeProps['variant'] {
  const map: Record<string, BadgeProps['variant']> = {
    A2: 'a2', B1: 'b1', B2: 'b2', C1: 'c1', CONSTITUTION: 'constitution',
  }
  return map[level] || 'default'
}

export function skillVariant(skill: string): BadgeProps['variant'] {
  const map: Record<string, BadgeProps['variant']> = {
    READING: 'reading', LISTENING: 'listening', WRITING: 'writing', SPEAKING: 'speaking', GRAMMAR: 'grammar',
  }
  return map[skill] || 'default'
}

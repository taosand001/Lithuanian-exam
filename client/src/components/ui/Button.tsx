import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  outline: 'border-2 border-violet-600 text-violet-600 hover:bg-violet-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}
const sizes = {
  sm: 'text-sm py-1.5 px-3 rounded-lg',
  md: 'text-sm py-2.5 px-5 rounded-xl',
  lg: 'text-base py-3 px-7 rounded-xl',
}

export default function Button({
  variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

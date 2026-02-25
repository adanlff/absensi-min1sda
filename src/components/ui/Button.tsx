'use client'

import React from 'react'

type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'ghost-danger' | 'success' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90',
  danger: 'bg-danger text-white hover:bg-danger/90 dark:bg-danger dark:hover:bg-danger/90',
  ghost: 'bg-primary/10 text-primary hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-primary dark:hover:bg-slate-700',
  'ghost-danger': 'bg-danger/5 text-danger hover:bg-danger hover:text-white dark:bg-danger/10 dark:text-danger dark:hover:bg-danger',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500',
  outline: 'border border-gray-200 dark:border-slate-800 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs rounded-xl',
  md: 'px-6 py-3 text-sm rounded-2xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
  icon: 'w-10 h-10 p-0 flex items-center justify-center rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className={`animate-spin h-4 w-4 ${children ? 'mr-2' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className={children ? 'mr-2' : ''}>{icon}</span>
      ) : null}
      {children}
    </button>
  )
}

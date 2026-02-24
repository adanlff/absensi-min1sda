'use client'

import React from 'react'
import { Search } from 'lucide-react'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBox({ value, onChange, placeholder = 'Cari...', className = '' }: SearchBoxProps) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
        <Search className="h-5 w-5" />
      </div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} 
        className="block w-full h-[52px] pl-12 pr-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-sm text-gray-900 dark:text-white font-bold shadow-none" 
      />
    </div>
  )
}

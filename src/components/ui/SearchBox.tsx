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
      <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
        <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
      </div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} 
        className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm focus:outline-none text-base md:text-lg transition-all" 
      />
    </div>
  )
}

'use client'

import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, ReactNode } from 'react'

export interface DropdownOption {
  value: string
  label: string
}

interface StaggeredDropDownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: ReactNode
  required?: boolean
  name?: string
  className?: string
}

export function StaggeredDropDown({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi',
  icon,
  required,
  name,
  className = '',
}: StaggeredDropDownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find(o => o.value === value)?.label || ''

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden input for form compatibility */}
      {name && (
        <input type="hidden" name={name} value={value} />
      )}
      {required && !value && (
        <input
          tabIndex={-1}
          autoComplete="off"
          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
          value={value}
          required={required}
          onChange={() => {}}
        />
      )}

      <button
        type="button"
        onClick={() => setOpen(pv => !pv)}
        className="flex items-center w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-bold text-left cursor-pointer relative"
      >
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <span className={`flex-1 truncate text-sm ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial="closed"
            animate="open"
            exit="closed"
            variants={wrapperVariants}
            style={{ originY: 'top' }}
            className="flex flex-col gap-1 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 absolute top-[calc(100%+6px)] left-0 w-full z-50 overflow-hidden max-h-60 overflow-y-auto"
          >
            {options.map(option => (
              <motion.li
                key={option.value}
                variants={itemVariants}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex items-center gap-2 w-full p-2.5 px-4 text-sm font-semibold whitespace-nowrap rounded-xl cursor-pointer transition-colors ${
                  value === option.value
                    ? 'bg-primary/10 text-primary dark:text-primary'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 hover:text-primary'
                }`}
              >
                <motion.span variants={actionIconVariants} className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                <span className="truncate">{option.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StaggeredDropDown

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: 'afterChildren',
    },
  },
}

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
}

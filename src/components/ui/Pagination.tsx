'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Determine which page numbers to show
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages
    
    if (currentPage <= 3) return [...pages.slice(0, 4), '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', ...pages.slice(totalPages - 4)]
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900 w-10 h-10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-2">
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 text-gray-400 font-bold">...</span>
            ) : (
              <Button
                variant={currentPage === page ? 'primary' : 'outline'}
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 rounded-xl font-bold text-sm ${
                  currentPage === page 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900'
                }`}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900 w-10 h-10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

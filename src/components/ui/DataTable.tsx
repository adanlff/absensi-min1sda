'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './Card'

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T, index: number) => React.ReactNode)
  className?: string
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
  renderMobileCard?: (item: T, index: number) => React.ReactNode
  onRowClick?: (item: T) => void
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  emptyMessage = 'Tidak ada data ditemukan',
  renderMobileCard,
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className="w-full">
      {data.length === 0 ? (
        <Card className="text-center py-12 md:py-20">
          <p className="text-gray-500 text-lg md:text-xl font-medium">{emptyMessage}</p>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden">
            <Card noPadding className="border-b-primary/50">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      {columns.map((col, i) => (
                        <th 
                          key={i} 
                          className={`px-4 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider ${col.className || ''}`}
                          style={col.width ? { width: col.width } : {}}
                        >
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence mode="popLayout">
                      {data.map((item, index) => (
                        <motion.tr
                          key={keyExtractor(item)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => onRowClick?.(item)}
                          className={`transition-all duration-300 hover:bg-gray-50 border-l-4 border-transparent hover:border-primary ${onRowClick ? 'cursor-pointer' : ''}`}
                        >
                          {columns.map((col, i) => (
                            <td key={i} className={`px-4 py-4 whitespace-nowrap ${col.className || ''}`}>
                              {typeof col.accessor === 'function' 
                                ? col.accessor(item, index) 
                                : (item[col.accessor] as React.ReactNode)}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            <AnimatePresence mode="popLayout">
              {data.map((item, index) => (
                <motion.div
                  key={keyExtractor(item)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onRowClick?.(item)}
                >
                  {renderMobileCard ? (
                    renderMobileCard(item, index)
                  ) : (
                    <Card className="p-4 hover:border-primary border-l-4 border-l-transparent transition-all">
                      <div className="space-y-2">
                        {columns.map((col, i) => (
                          <div key={i} className="flex justify-between items-start gap-4">
                            <span className="text-xs font-bold text-gray-400 uppercase">{col.header}</span>
                            <div className="text-sm font-medium text-gray-900 text-right">
                              {typeof col.accessor === 'function' 
                                ? col.accessor(item, index) 
                                : (item[col.accessor] as React.ReactNode)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  )
}

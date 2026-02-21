'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function WalikelasLayout({
  children,
  tahunAjaran,
  kelasName
}: {
  children: React.ReactNode
  tahunAjaran: string
  kelasName: string
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const sidebarWidth = isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        role="walikelas" 
        tahunAjaran={tahunAjaran}
        kelasName={kelasName}
      />
      <div className={`transition-all duration-500 ease-in-out ${sidebarWidth}`}>
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

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

  return (
    <>
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          role="walikelas" 
          tahunAjaran={tahunAjaran}
          kelasName={kelasName}
        />
        <main className="flex-1 lg:ml-64 p-4 md:p-8">
          {children}
        </main>
      </div>
    </>
  )
}

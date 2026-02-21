'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  role: 'admin' | 'walikelas'
  tahunAjaran?: string
  kelasName?: string
}

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" /></> },
  { href: '/admin/siswa', label: 'Kelola Siswa', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></> },
  { href: '/admin/walikelas', label: 'Kelola Wali Kelas', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></> },
  { href: '/admin/tahun-ajaran', label: 'Tahun Ajaran', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></> },
]

const walikelasLinks = [
  { href: '/walikelas/dashboard', label: 'Dashboard', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" /></> },
  { href: '/walikelas/input-absen', label: 'Input Absen', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></> },
  { href: '/walikelas/cetak-absen', label: 'Cetak Absen', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></> },
]

export default function Sidebar({ isOpen, setIsOpen, role, tahunAjaran, kelasName }: SidebarProps) {
  const pathname = usePathname()
  const links = role === 'admin' ? adminLinks : walikelasLinks
  const profilPath = role === 'admin' ? '/admin/profil' : '/walikelas/profil'

  return (
    <>
      <nav className={`w-full lg:w-64 bg-white shadow-2xl h-screen border-r border-gray-200 fixed top-0 left-0 z-50 transform transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 overflow-y-auto h-full">

          <div className="mb-8 text-center animate-fadeIn">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg flex items-center justify-center animate-float overflow-hidden">
                <img src="/assets/gambar/min1.png" alt="MIN 1 Sidoarjo" className="h-10 w-10 object-contain" onError={(e) => { e.currentTarget.style.display='none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display='flex'; }} />
                <div className="h-10 w-10 bg-white rounded-xl items-center justify-center text-primary font-bold text-lg hidden flex-col">
                  MIN
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">MIN 1 Sidoarjo</h3>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 mb-2">
              <div className="w-2 h-2 bg-secondary rounded-full mr-2 animate-pulse-gentle"></div>
              <p className="text-xs text-secondary font-semibold">
                TA {tahunAjaran || 'Belum Ada'}
              </p>
            </div>
            {role === 'walikelas' && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <p className="text-xs text-blue-700 font-semibold">
                    {kelasName || 'Belum Ada Kelas'}
                </p>
            </div>
            )}
          </div>

          <ul className="space-y-2">
            {links.map((link, idx) => {
              const active = pathname === link.href
              return (
                <li key={link.href} className="animate-slideUp" style={{ animationDelay: `\${0.1 + idx * 0.1}s` }}>
                  <Link href={link.href} className={`\${active ? 'bg-gradient-to-r from-primary to-secondary text-gray-700 shadow-lg transform scale-105' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'} flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden`}>
                    {active && <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse-gentle"></div>}
                    <div className={`p-2 rounded-lg \${active ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-primary/10'} mr-3 transition-all duration-300`}>
                      <svg className={`h-4 w-4 \${active ? 'text-gray-700' : 'text-gray-500 group-hover:text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {link.icon}
                      </svg>
                    </div>
                    <span className="relative z-10">{link.label}</span>
                    {active && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce-gentle"></div>
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
            
            <li className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
                <div className="my-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
            </li>

            <li className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
              <Link href={profilPath} className={`\${pathname === profilPath ? 'bg-gradient-to-r from-primary to-secondary text-gray-700 shadow-lg transform scale-105' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'} flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden`}>
                {pathname === profilPath && <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse-gentle"></div>}
                <div className={`p-2 rounded-lg \${pathname === profilPath ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-primary/10'} mr-3 transition-all duration-300`}>
                  <svg className={`h-4 w-4 \${pathname === profilPath ? 'text-gray-700' : 'text-gray-500 group-hover:text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <span className="relative z-10">Edit Profil</span>
                {pathname === profilPath && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce-gentle"></div>
                  </div>
                )}
              </Link>
            </li>

            <li className="animate-slideUp" style={{ animationDelay: '0.6s' }}>
              <button onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                window.location.href = '/login'
              }} className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 group relative overflow-hidden">
                <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 mr-3 transition-all duration-300">
                  <svg className="h-4 w-4 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </div>
                <span>Logout</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </button>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-200 animate-slideUp" style={{ animationDelay: '0.8s' }}>
            <div className="text-center">
              <p className="text-xs text-gray-400">© 2025 MIN 1 Sidoarjo</p>
            </div>
          </div>

        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
        ></div>
      )}
    </>
  )
}

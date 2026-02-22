'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Calendar, 
  ClipboardCheck, 
  Printer, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  UserCog,
  Sun,
  Moon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import { SuccessAlert } from '@/components/ui/SuccessAlert'
import SweetAlert from '@/components/ui/SweetAlert'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
  role: 'admin' | 'walikelas'
  tahunAjaran?: string
  kelasName?: string
}

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/siswa', label: 'Kelola Siswa', icon: Users },
  { href: '/admin/walikelas', label: 'Kelola Wali Kelas', icon: UserCircle },
  { href: '/admin/tahun-ajaran', label: 'Tahun Ajaran', icon: Calendar },
]

const walikelasLinks = [
  { href: '/walikelas/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/walikelas/absen', label: 'Input Absen', icon: ClipboardCheck },
  { href: '/walikelas/cetak-absen', label: 'Cetak Absen', icon: Printer },
]

export default function Sidebar({ 
  isOpen, 
  setIsOpen, 
  isCollapsed, 
  setIsCollapsed, 
  role, 
  tahunAjaran, 
  kelasName 
}: SidebarProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = role === 'admin' ? adminLinks : walikelasLinks
  const profilPath = role === 'admin' ? '/admin/profil' : '/walikelas/profil'

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-[280px]'

  return (
    <>
      <aside 
        className={`bg-white dark:bg-slate-900 shadow-sm h-screen border-r border-gray-100 dark:border-slate-800 fixed top-0 left-0 z-50 transition-all duration-500 ease-in-out transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarWidth}`}
      >
        <div className="flex flex-col h-full relative">
          
          {/* Toggle Button - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-10 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-md w-6 h-6 rounded-full items-center justify-center text-gray-400 hover:text-primary transition-colors z-50"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Logo Section */}
          <div className={`px-6 pt-8 flex items-center ${isCollapsed ? 'justify-center mb-6' : 'justify-start space-x-4 mb-6'}`}>
            <div className={`flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <img src="/assets/gambar/min1.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h2 className="font-extrabold text-gray-900 dark:text-white tracking-tight leading-none text-lg">MIN 1</h2>
                <p className="text-[10px] font-bold text-primary tracking-widest uppercase mt-1">Sidoarjo</p>
              </motion.div>
            )}
          </div>

          {/* Academic Info - Now always visible but styles change */}
          <div className={`px-6 mb-6 transition-all duration-500 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {isCollapsed ? (
              <div className="flex flex-col items-center space-y-1 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl p-2.5 border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-primary leading-none uppercase tracking-tighter">
                  {tahunAjaran ? tahunAjaran.replace(/20/g, '') : '...'}
                </span>
              </div>
            ) : (
              <div className="bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Informasi Akses</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    <Calendar size={13} className="text-secondary dark:text-secondary/80 mr-2" />
                    <span>TA {tahunAjaran ? tahunAjaran.replace(/20/g, '') : '...'}</span>
                  </div>
                  {role === 'walikelas' && (
                    <div className="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      <UserCircle size={13} className="text-primary mr-2" />
                      <span>{kelasName || '...'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 overflow-y-auto no-scrollbar py-2">
            <ul className="space-y-1.5">
              {links.map((link) => {
                const active = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className={`group flex items-center transition-all duration-300 rounded-xl ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3.5 space-x-4'} ${active ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      <link.icon 
                        size={active ? 20 : 18} 
                        className={`transition-all duration-300 ${active ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} 
                      />
                      {!isCollapsed && (
                        <motion.span 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-sm font-bold tracking-tight whitespace-nowrap"
                        >
                          {link.label}
                        </motion.span>
                      )}
                      {active && !isCollapsed && (
                        <motion.div 
                          layoutId="active-pill"
                          className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm"
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className={`my-6 ${isCollapsed ? 'px-2' : ''}`}>
              <div className="h-px bg-gray-100 dark:bg-slate-800" />
            </div>

            <ul className="space-y-1.5">
              {/* Profile Link */}
              <li>
                <Link 
                  href={profilPath}
                  className={`group flex items-center transition-all duration-300 rounded-xl ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3.5 space-x-4'} ${pathname === profilPath ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <UserCog 
                    size={pathname === profilPath ? 20 : 18} 
                    className={`transition-all duration-300 ${pathname === profilPath ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} 
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">Edit Profil</span>
                  )}
                </Link>
              </li>

              {/* Theme Toggle */}
              <li>
                <button 
                  onClick={toggleTheme}
                  className={`w-full group flex items-center transition-all duration-300 rounded-xl ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3.5 space-x-4'} text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white`}
                >
                  <div className="transition-all duration-300 group-hover:rotate-12">
                    {mounted ? (
                      theme === 'light' ? (
                        <Moon size={18} className="text-gray-400 group-hover:text-primary" />
                      ) : (
                        <Sun size={18} className="text-yellow-500" />
                      )
                    ) : (
                      <div className="w-[18px] h-[18px]" />
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                    {mounted ? (theme === 'light' ? 'Mode Gelap' : 'Mode Terang') : '...'}
                    </span>
                  )}
                </button>
              </li>

              {/* Logout Button */}
              <li>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className={`w-full group flex items-center transition-all duration-300 rounded-xl ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3.5 space-x-4'} text-red-500 hover:bg-red-50`}
                >
                  <LogOut 
                    size={18} 
                    className="group-hover:translate-x-0.5 transition-transform" 
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">Keluar</span>
                  )}
                </button>
              </li>
            </ul>
          </nav>

          {/* Footer - Only when expanded */}
          {!isCollapsed && (
            <div className="p-6 border-t border-gray-50">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-300 tracking-widest">© 2025 MIN 1 SDA</p>
                <p className="text-[8px] font-medium text-gray-300 mt-1 uppercase">Sistem Absensi v1.0</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)} 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {showLogoutConfirm && (
        <SweetAlert
          type="warning"
          title="Konfirmasi Keluar"
          message="Apakah Anda yakin ingin keluar dari sistem?"
          show={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          duration={0}
        >
          <div className="flex gap-3 mt-6">
            <button
              onClick={async () => {
                setShowLogoutConfirm(false)
                await fetch('/api/auth/logout', { method: 'POST' })
                setShowLogoutAlert(true)
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-red-200 dark:shadow-none"
            >
              Ya, Keluar
            </button>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-2xl transition-all"
            >
              Batal
            </button>
          </div>
        </SweetAlert>
      )}

      {showLogoutAlert && (
        <SuccessAlert 
          message="Anda telah berhasil keluar dari sistem. Sampai jumpa kembali!" 
          onButtonClick={() => window.location.href = '/login'}
          buttonText="Ke Halaman Login"
        />
      )}
    </>
  )
}

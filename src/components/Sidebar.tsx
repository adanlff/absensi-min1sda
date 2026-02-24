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
  Moon,
  CloudUpload
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import SweetAlert, { AlertType } from '@/components/ui/SweetAlert'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
  role: 'admin' | 'walikelas'
}

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/walikelas', label: 'Wali Kelas', icon: UserCircle },
  { href: '/admin/kelas', label: 'Kelas', icon: Users },
  { href: '/admin/siswa', label: 'Siswa', icon: CloudUpload },
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
  role
}: SidebarProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showConfirmAlert, setShowConfirmAlert] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{
    type: AlertType
    title: string
    message: string
  }>({
    type: "success",
    title: "",
    message: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = role === 'admin' ? adminLinks : walikelasLinks
  const profilPath = role === 'admin' ? '/admin/profil' : '/walikelas/profil'

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      showSweetAlert(
        "success",
        "Logout Berhasil!",
        "Anda telah berhasil keluar dari sistem. Sampai jumpa kembali!"
      )
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (error) {
      showSweetAlert("error", "Logout Gagal", "Terjadi kesalahan saat mencoba keluar.")
    } finally {
      setIsLoggingOut(false)
      setShowConfirmAlert(false)
    }
  }

  const showSweetAlert = (type: AlertType, title: string, message: string) => {
    setAlertConfig({ type, title, message })
    setShowAlert(true)
  }

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
                <h2 className="font-bold text-gray-900 dark:text-white tracking-tight leading-none text-lg">MIN 1</h2>
                <p className="text-[10px] font-bold text-primary tracking-widest uppercase mt-1">Sidoarjo</p>
              </motion.div>
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
              {/* Profile Link - Only for Admin */}
              {role === 'admin' && (
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
              )}

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
                  onClick={() => setShowConfirmAlert(true)}
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

      {/* SweetAlert Component for notifications */}
      <SweetAlert
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        show={showAlert}
        onClose={() => setShowAlert(false)}
        duration={alertConfig.type === "success" ? 2000 : 3000}
        showCloseButton={true}
      />

      {/* SweetAlert for logout confirmation (RED THEME) */}
      <SweetAlert
        type="error"
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari sistem? Anda akan diarahkan ke halaman login."
        show={showConfirmAlert}
        onClose={() => setShowConfirmAlert(false)}
        duration={0}
        showCloseButton={true}
      >
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowConfirmAlert(false)}
            disabled={isLoggingOut}
            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50 font-bold"
          >
            Batal
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 py-3 px-4 bg-[#D93025] hover:bg-[#c41c1c] text-white rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center font-bold"
          >
            {isLoggingOut ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sedang logout...
              </>
            ) : (
              "Ya, Logout"
            )}
          </button>
        </div>
      </SweetAlert>
    </>
  )
}

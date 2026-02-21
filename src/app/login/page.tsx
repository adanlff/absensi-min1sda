'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, GraduationCap, User, Lock, LogIn, Phone, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'walikelas' | ''>('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const selectRole = (role: 'admin' | 'walikelas') => {
    setSelectedRole(role)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRole) {
      setError('Silakan pilih peran terlebih dahulu!')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: selectedRole }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push(data.redirect)
        router.refresh()
      } else {
        setError(data.error || 'Login gagal')
        setLoading(false)
      }
    } catch (error) {
      setError('Terjadi kesalahan pada server')
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 flex items-center justify-center"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl w-full max-w-6xl grid lg:grid-cols-5 overflow-hidden"
      >
          {/* Hero Section */}
          <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden items-center justify-center p-12">
              {/* Geometric Shapes */}
              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-100px] right-[-100px] w-[200px] h-[200px] bg-white/10 rounded-full"
              />
              <motion.div 
                animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-75px] left-[-75px] w-[150px] h-[150px] bg-white/10 rounded-full"
              />
              
              <div className="text-center space-y-8 z-10 relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/95 backdrop-blur-md border border-white/30 shadow-xl w-28 h-28 mx-auto rounded-full flex items-center justify-center cursor-default"
                  >
                      <img src="/assets/gambar/min1.png" alt="MIN 1 Sidoarjo" className="w-20 h-20 object-contain" onError={(e) => { e.currentTarget.style.display='none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display='flex'; }} />
                      <div className="w-20 h-20 bg-white rounded-full items-center justify-center text-primary font-bold text-2xl hidden flex-col">
                          MIN
                      </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white space-y-6"
                  >
                      <div className="space-y-3">
                          <h2 className="text-4xl font-bold leading-tight">Selamat Datang</h2>
                          <p className="text-xl font-light opacity-90">Sistem Informasi Sekolah</p>
                      </div>
                      <div className="w-20 h-1 bg-white mx-auto rounded-full opacity-70"></div>
                      <div className="space-y-2">
                          <p className="text-lg font-medium">MIN 1 Sidoarjo</p>
                          <p className="text-base opacity-80">Kelola data dengan mudah dan efisien</p>
                      </div>
                  </motion.div>
              </div>
          </div>
          
          {/* Form Section */}
          <div className="lg:col-span-3 p-8 lg:p-16 flex flex-col justify-center">
              <div className="w-full max-w-lg mx-auto space-y-8">
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:hidden text-center mb-8"
                  >
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg flex items-center justify-center mb-4 overflow-hidden">
                          <img src="/assets/gambar/min1.png" alt="MIN 1 Sidoarjo" className="w-14 h-14 object-contain" onError={(e) => { e.currentTarget.style.display='none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display='flex'; }} />
                          <div className="w-14 h-14 bg-white rounded-full items-center justify-center text-primary font-bold text-lg hidden flex-col">
                              MIN
                          </div>
                      </div>
                      <h3 className="text-primary font-semibold text-lg tracking-wide">MIN 1 SIDOARJO</h3>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center lg:text-left"
                  >
                      <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
                        {selectedRole === 'admin' ? 'Masuk sebagai Admin' : selectedRole === 'walikelas' ? 'Masuk sebagai Wali Kelas' : 'Masuk ke Sistem'}
                      </h1>
                      <p className="text-gray-600 text-lg">Pilih peran dan masukkan kredensial Anda</p>
                  </motion.div>
                  
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg"
                      >
                          <div className="flex items-center">
                              <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                              <span className="font-medium">{error}</span>
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                      <label className="block text-sm font-semibold text-primary mb-4">Pilih Peran Anda</label>
                      <div className="grid grid-cols-2 gap-4">
                          <button type="button" 
                                  className={`group p-6 rounded-2xl text-center border-2 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${selectedRole === 'admin' ? 'bg-white border-primary shadow-[0_10px_25px_-8px_rgba(64,81,59,0.3)]' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-primary/30'}`} 
                                  onClick={() => selectRole('admin')}>
                              <div className="flex flex-col items-center space-y-3">
                                  <div className={`p-3 rounded-xl shadow-lg transition-transform ${selectedRole === 'admin' ? 'bg-primary text-white scale-110' : 'bg-blue-500 text-white group-hover:scale-110'}`}>
                                      <ShieldCheck className="w-6 h-6" />
                                  </div>
                                  <span className={`font-semibold transition-colors ${selectedRole === 'admin' ? 'text-primary' : 'text-gray-700'}`}>Admin</span>
                              </div>
                          </button>
                          <button type="button" 
                                  className={`group p-6 rounded-2xl text-center border-2 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${selectedRole === 'walikelas' ? 'bg-white border-primary shadow-[0_10px_25px_-8px_rgba(64,81,59,0.3)]' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-primary/30'}`} 
                                  onClick={() => selectRole('walikelas')}>
                              <div className="flex flex-col items-center space-y-3">
                                  <div className={`p-3 rounded-xl shadow-lg transition-transform ${selectedRole === 'walikelas' ? 'bg-primary text-white scale-110' : 'bg-green-500 text-white group-hover:scale-110'}`}>
                                      <GraduationCap className="w-6 h-6" />
                                  </div>
                                  <span className={`font-semibold transition-colors ${selectedRole === 'walikelas' ? 'text-primary' : 'text-gray-700'}`}>Wali Kelas</span>
                              </div>
                          </button>
                      </div>
                  </motion.div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="relative group"
                      >
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400">
                              <User className="h-5 w-5" />
                          </div>
                          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required 
                                 className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-700 font-medium bg-gradient-to-br from-white to-slate-50" 
                                 placeholder="Nama Pengguna" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="relative group"
                      >
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400">
                              <Lock className="h-5 w-5" />
                          </div>
                          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
                                 className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-700 font-medium bg-gradient-to-br from-white to-slate-50" 
                                 placeholder="Kata Sandi" />
                      </motion.div>
                      
                      <motion.button 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-right text-white font-bold text-lg tracking-wide shadow-lg hover:shadow-primary/40 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group relative"
                      >
                          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-600 group-hover:left-[100%]" />
                          {loading ? (
                              <div className="flex items-center justify-center space-x-3">
                                  <Loader2 className="animate-spin h-5 w-5" />
                                  <span className="font-bold">Memproses...</span>
                              </div>
                          ) : (
                              <span className="flex items-center justify-center space-x-3">
                                  <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                  <span>M A S U K</span>
                              </span>
                          )}
                      </motion.button>
                  </form>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center space-y-4"
                  >
                      <p className="text-gray-500 text-sm">Butuh bantuan?</p>
                      <motion.a 
                        whileHover={{ scale: 1.05 }}
                        href="https://wa.me/08123456789" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-secondary hover:text-primary text-sm font-semibold inline-flex items-center space-x-2 transition-all duration-300 group"
                      >
                          <Phone className="w-4 h-4 transition-transform group-hover:rotate-12" />
                          <span>Hubungi Admin</span>
                      </motion.a>
                  </motion.div>
              </div>
          </div>
      </motion.div>
    </motion.div>
  )
}

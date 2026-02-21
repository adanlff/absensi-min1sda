'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, User, AtSign, Mail, Phone, MapPin, Lock, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminData {
  nama: string
  username: string
  email?: string | null
  telepon?: string | null
  alamat?: string | null
}

export default function ProfilForm({ admin }: { admin: AdminData }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: admin.nama,
    username: admin.username,
    email: admin.email || '',
    telepon: admin.telepon || '',
    alamat: admin.alamat || '',
    password: ''
  })
  
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/admin/profil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message)
        setFormData(prev => ({ ...prev, password: '' })) // Clear password field
        router.refresh()
      } else {
        setError(data.error || 'Gagal mengupdate profil')
      }
    } catch (err) {
      setError('Terjadi kesalahan pada jaringan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 md:px-6 py-4 rounded-xl md:rounded-2xl mb-6 md:mb-8"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-full flex-shrink-0">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
              </div>
              <p className="font-semibold text-sm md:text-base">{message}</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 text-red-800 px-4 md:px-6 py-4 rounded-xl md:rounded-2xl mb-6 md:mb-8"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                <X className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
              </div>
              <p className="font-semibold text-sm md:text-base">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-1 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] border-b-secondary"
      >
        <div className="overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8 md:mb-12">
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl flex items-center justify-center bg-gradient-to-br from-primary to-secondary shadow-[0_10px_25px_-5px_rgba(64,81,59,0.4)]"
              >
                <span className="text-2xl md:text-4xl font-bold text-white">
                  {formData.nama.substring(0, 2).toUpperCase()}
                </span>
              </motion.div>
              <div className="text-center md:text-left">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl md:text-3xl font-bold text-gray-900 mb-2"
                >
                  {formData.nama}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-base md:text-lg text-gray-600 mb-2"
                >
                  Administrator MIN 1 Sidoarjo
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center md:justify-start space-x-2"
                >
                  <motion.div 
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                  <span className="text-xs md:text-sm font-medium text-emerald-600">Status Aktif</span>
                </motion.div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Nama Lengkap */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Nama Lengkap</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <User className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input type="text" name="nama" value={formData.nama} onChange={handleChange} required 
                           className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg" />
                  </div>
                </motion.div>

                {/* Username */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <AtSign className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required 
                           className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg" />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <Mail className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                           className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg"
                           placeholder="admin@min1sidoarjo.sch.id" />
                  </div>
                </motion.div>

                {/* Telepon */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Nomor Telepon</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <Phone className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input type="tel" name="telepon" value={formData.telepon} onChange={handleChange}
                           className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg"
                           placeholder="08123456789" />
                  </div>
                </motion.div>
              </div>

              {/* Alamat */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Alamat</label>
                <div className="relative group">
                  <div className="absolute top-3 md:top-4 left-3 md:left-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <textarea name="alamat" rows={4} value={formData.alamat} onChange={handleChange}
                            className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg resize-none"
                            placeholder="Masukkan alamat lengkap..."></textarea>
                </div>
              </motion.div>

              {/* Password */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Password Baru <span className="text-xs md:text-sm font-normal text-gray-500">(kosongkan jika tidak diubah)</span></label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                         className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg"
                         placeholder="Masukkan password baru..." />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex justify-end pt-4 md:pt-6"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-br from-primary to-secondary text-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-semibold transition-all duration-400 flex items-center space-x-2 md:space-x-3 shadow-lg w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
                >
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%]" />
                  {loading ? (
                    <Loader2 className="w-5 h-5 md:h-6 md:w-6 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5 md:h-6 md:w-6" />
                  )}
                  <span className="relative z-10">{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  )
}

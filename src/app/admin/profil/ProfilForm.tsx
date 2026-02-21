'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, User, AtSign, Mail, Phone, MapPin, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

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
        setFormData(prev => ({ ...prev, password: '' }))
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
            className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-6 py-4 rounded-2xl mb-8"
          >
            <div className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-emerald-600" />
              <p className="font-bold">{message}</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-100 text-red-800 px-6 py-4 rounded-2xl mb-8"
          >
            <div className="flex items-center space-x-3">
              <X className="h-5 w-5 text-red-600" />
              <p className="font-bold">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center bg-primary flex-shrink-0">
            <span className="text-2xl md:text-3xl font-black text-white">
              {formData.nama.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              {formData.nama}
            </h3>
            <p className="text-base text-gray-500 font-medium mb-2">
              Administrator MIN 1 Sidoarjo
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-sm font-bold text-emerald-600">Status Aktif</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} required 
                       className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <AtSign className="h-5 w-5" />
                </div>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required 
                       className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                       className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium"
                       placeholder="admin@min1sidoarjo.sch.id" />
              </div>
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Nomor Telepon</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input type="tel" name="telepon" value={formData.telepon} onChange={handleChange}
                       className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium"
                       placeholder="08123456789" />
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Alamat</label>
            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                <MapPin className="h-5 w-5" />
              </div>
              <textarea name="alamat" rows={4} value={formData.alamat} onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium resize-none"
                        placeholder="Masukkan alamat lengkap..."></textarea>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Password Baru <span className="text-xs font-normal text-gray-400">(kosongkan jika tidak diubah)</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                     className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium"
                     placeholder="Masukkan password baru..." />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" loading={loading} icon={<Check className="h-5 w-5" />} fullWidth className="md:w-auto">
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}

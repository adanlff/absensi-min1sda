'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Plus, User, AtSign, Building2, MoreVertical, Pencil, Trash2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WaliKelasClient({ walikelasList, kelasList }: { walikelasList: any[], kelasList: any[] }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    username: '',
    password: '',
    id_kelas: ''
  })

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  const handleAction = async (payload: any) => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await fetch('/api/admin/walikelas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (res.ok) {
        setMessage(result.message)
        setIsCreateModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        setFormData({ id: '', nama: '', username: '', password: '', id_kelas: '' })
        router.refresh()
      } else {
        setError(result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      setError('Terjadi kesalahan pada jaringan')
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (wk: any) => {
    setSelectedItem(wk)
    setFormData({
      id: wk.id,
      nama: wk.nama,
      username: wk.username,
      password: '',
      id_kelas: wk.id_kelas ? wk.id_kelas.toString() : ''
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (wk: any) => {
    setSelectedItem(wk)
    setIsDeleteModalOpen(true)
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-1 shadow-xl"
      >
        <div className="overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-1 md:mb-2">Daftar Wali Kelas</h3>
                <p className="text-gray-600 text-sm md:text-base">Total {walikelasList.length} wali kelas terdaftar</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData({ id: '', nama: '', username: '', password: '', id_kelas: '' })
                    setIsCreateModalOpen(true)
                  }} 
                  className="bg-gradient-to-br from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-right text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-sm font-semibold transition-all duration-500 flex items-center space-x-2 md:space-x-3 w-full sm:w-auto justify-center shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%] z-0" />
                  <Plus className="h-4 w-4 md:h-5 md:w-5 relative z-10" />
                  <span className="relative z-10">Tambah Wali Kelas</span>
                </motion.button>
              </div>
            </div>
            
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Nama</span>
                      </div>
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <AtSign className="h-4 w-4 text-gray-500" />
                        <span>Username</span>
                      </div>
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>Kelas</span>
                      </div>
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                        <span>Aksi</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {walikelasList.map((wk, index) => (
                    <motion.tr 
                      key={wk.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="transition-all duration-300 hover:bg-gray-50 border-l-4 border-transparent hover:border-primary"
                    >
                      <td className="px-4 md:px-6 py-4 md:py-6 whitespace-nowrap">
                        <p className="text-base md:text-lg font-semibold text-gray-900">{wk.nama}</p>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6 whitespace-nowrap">
                        <span className="text-base md:text-lg text-gray-700 font-medium">{wk.username}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6 whitespace-nowrap">
                        {wk.Kelas ? (
                          <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-100">
                            <Building2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            {wk.Kelas.nama_kelas}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                            <X className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            Tiada kelas
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditModal(wk)} 
                            className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs md:text-sm font-semibold rounded-xl shadow-sm"
                          >
                            <Pencil className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            Edit
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openDeleteModal(wk)} 
                            className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs md:text-sm font-semibold rounded-xl shadow-sm"
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            Hapus
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {walikelasList.map((wk, index) => (
                <motion.div 
                  key={wk.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-4 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">{wk.nama}</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <AtSign className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{wk.username}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{wk.Kelas ? wk.Kelas.nama_kelas : 'Tidak ada kelas'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-3 border-t border-gray-100 gap-2">
                      <button onClick={() => openEditModal(wk)} className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg">
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button onClick={() => openDeleteModal(wk)} className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </motion.div>

      {/* Modals with AnimatePresence */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 w-full max-w-md shadow-2xl relative z-10"
             >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-primary pl-3">Tambah Wali Kelas</h3>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">Buat akun baru untuk wali kelas</p>
                  </div>
                  <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition duration-200">
                    <X className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                  </button>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'create', ...formData }) }} className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                    <input type="text" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} 
                           className="block w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                    <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} 
                           className="block w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                           className="block w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kelas</label>
                    <select value={formData.id_kelas} onChange={e => setFormData({...formData, id_kelas: e.target.value})} 
                            className="block w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all bg-white">
                      <option value="">Pilih Kelas</option>
                      {kelasList.map(k => (
                        <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 mt-6 md:mt-8 pt-4">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200 font-semibold order-2 sm:order-1">Batal</button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-right text-white rounded-xl font-semibold shadow-lg order-1 sm:order-2 disabled:opacity-50 transition-all duration-500 min-w-[120px] flex items-center justify-center">
                      {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Simpan'}
                    </button>
                  </div>
                </form>
             </motion.div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 w-full max-w-md shadow-2xl relative z-10"
             >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">Edit Wali Kelas</h3>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">Perbarui informasi wali kelas</p>
                  </div>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition duration-200">
                    <X className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                  </button>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'update', ...formData }) }} className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                    <input type="text" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} 
                           className="block w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                    <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} 
                           className="block w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password <span className="text-xs font-normal text-gray-500">(kosongkan jika tidak diubah)</span></label>
                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                           className="block w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kelas</label>
                    <select value={formData.id_kelas} onChange={e => setFormData({...formData, id_kelas: e.target.value})} 
                            className="block w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all bg-white">
                      <option value="">Pilih Kelas</option>
                      {kelasList.map(k => (
                        <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 mt-6 md:mt-8 pt-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200 font-semibold order-2 sm:order-1">Batal</button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg order-1 sm:order-2 disabled:opacity-50 min-w-[120px] flex items-center justify-center">
                      {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Update'}
                    </button>
                  </div>
                </form>
             </motion.div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md mx-auto w-full shadow-2xl relative z-10 text-center"
             >
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                   <Trash2 className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Konfirmasi Hapus</h3>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Hapus wali kelas <span className="font-semibold text-primary">{selectedItem?.nama}</span>?</p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                   <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200 font-semibold order-2 sm:order-1">Batal</button>
                   <button onClick={() => handleAction({ action: 'delete', id: selectedItem?.id })} disabled={loading} className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-lg order-1 sm:order-2 disabled:opacity-50 min-w-[120px] flex items-center justify-center">
                     {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Hapus'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

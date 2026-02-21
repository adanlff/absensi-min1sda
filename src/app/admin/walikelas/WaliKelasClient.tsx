'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Plus, User, AtSign, Building2, Pencil, Trash2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">Daftar Wali Kelas</h3>
            <p className="text-gray-500 text-sm font-medium">Total {walikelasList.length} wali kelas terdaftar</p>
          </div>
          <button 
            onClick={() => {
              setFormData({ id: '', nama: '', username: '', password: '', id_kelas: '' })
              setIsCreateModalOpen(true)
            }} 
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Plus className="h-5 w-5" />
            <span>Tambah Wali Kelas</span>
          </button>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {walikelasList.map((wk, index) => (
                <motion.tr 
                  key={wk.id} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="font-black text-gray-900 text-base">{wk.nama}</p>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="font-mono text-gray-500 font-bold tracking-wider text-sm">{wk.username}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {wk.Kelas ? (
                      <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-primary/5 text-primary">
                        <Building2 className="h-4 w-4 mr-2" />
                        {wk.Kelas.nama_kelas}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-500">
                        <X className="h-4 w-4 mr-2" />
                        Tidak ada kelas
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openEditModal(wk)} 
                        className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all text-sm"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button 
                        onClick={() => openDeleteModal(wk)} 
                        className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {walikelasList.map((wk, index) => (
            <motion.div 
              key={wk.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-gray-50/50 rounded-2xl p-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 text-sm truncate">{wk.nama}</h4>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <AtSign className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{wk.username}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{wk.Kelas ? wk.Kelas.nama_kelas : 'Tidak ada kelas'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-3 border-t border-gray-100 gap-2">
                  <button onClick={() => openEditModal(wk)} className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl">
                    <Pencil className="h-3 w-3 mr-1.5" />
                    Edit
                  </button>
                  <button onClick={() => openDeleteModal(wk)} className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl">
                    <Trash2 className="h-3 w-3 mr-1.5" />
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Modals */}
      <AnimatePresence>
        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl relative z-10"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Tambah Wali Kelas</h3>
                  <p className="text-gray-500 text-sm font-medium mt-1">Buat akun baru untuk wali kelas</p>
                </div>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'create', ...formData }) }} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Nama Lengkap</label>
                  <input type="text" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} 
                         className="block w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Username</label>
                  <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} 
                         className="block w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Password</label>
                  <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                         className="block w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Kelas</label>
                  <select value={formData.id_kelas} onChange={e => setFormData({...formData, id_kelas: e.target.value})} 
                          className="block w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium appearance-none">
                    <option value="">Pilih Kelas</option>
                    {kelasList.map(k => (
                      <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-bold flex-1">Batal</button>
                  <button type="submit" disabled={loading} className="px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 flex items-center justify-center flex-1 disabled:opacity-50">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl relative z-10"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Pencil className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Edit Wali Kelas</h3>
                  <p className="text-gray-500 text-sm font-medium mt-1">Perbarui informasi wali kelas</p>
                </div>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'update', ...formData }) }} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Nama Lengkap</label>
                  <input type="text" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} 
                         className="block w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Username</label>
                  <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} 
                         className="block w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Password <span className="text-xs font-normal text-gray-400">(kosongkan jika tidak diubah)</span></label>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                         className="block w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Kelas</label>
                  <select value={formData.id_kelas} onChange={e => setFormData({...formData, id_kelas: e.target.value})} 
                          className="block w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium appearance-none">
                    <option value="">Pilih Kelas</option>
                    {kelasList.map(k => (
                      <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-bold flex-1">Batal</button>
                  <button type="submit" disabled={loading} className="px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 flex items-center justify-center flex-1 disabled:opacity-50">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    {loading ? 'Menyimpan...' : 'Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] p-10 max-w-md mx-auto w-full shadow-2xl relative z-10 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-[30px] flex items-center justify-center text-red-500">
                <Trash2 className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">Hapus Wali Kelas?</h3>
              <p className="text-gray-500 mb-10 font-bold leading-relaxed">Wali kelas <span className="text-red-500">{selectedItem?.nama}</span> akan dihapus dari daftar.</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-bold flex-1">Batal</button>
                <button onClick={() => handleAction({ action: 'delete', id: selectedItem?.id })} disabled={loading} className="px-8 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-bold shadow-lg shadow-red-200 flex items-center justify-center flex-1 disabled:opacity-50">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Plus, User, AtSign, Building2, Pencil, Trash2, UserCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import SweetAlert from '@/components/ui/SweetAlert'

export default function WaliKelasClient({ walikelasList, kelasList }: { walikelasList: any[], kelasList: any[] }) {
  const router = useRouter()
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

  // State for SweetAlert
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  })

  // Helper to show alert
  const showAlert = (type: 'success' | 'error', title: string, message: string) => {
    setAlertConfig({ show: true, type, title, message })
  }

  const handleAction = async (payload: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/walikelas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (res.ok) {
        setIsCreateModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        setFormData({ id: '', nama: '', username: '', password: '', id_kelas: '' })
        router.refresh()
        showAlert('success', 'Berhasil', result.message)
      } else {
        showAlert('error', 'Gagal', result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      showAlert('error', 'Error', 'Terjadi kesalahan pada jaringan')
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
      <SweetAlert 
        show={alertConfig.show}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))}
      />

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
              <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Wali Kelas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Total {walikelasList.length} wali kelas terdaftar</p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setFormData({ id: '', nama: '', username: '', password: '', id_kelas: '' })
              setIsCreateModalOpen(true)
            }}
            icon={<Plus className="h-5 w-5" />}
          >
            Tambah Wali Kelas
          </Button>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800">
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {walikelasList.map((wk, index) => (
                <motion.tr 
                  key={wk.id} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="font-black text-gray-900 dark:text-white text-base">{wk.nama}</p>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="font-mono text-gray-500 dark:text-gray-400 font-bold tracking-wider text-sm">{wk.username}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {wk.Kelas ? (
                      <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-light">
                        <Building2 className="h-4 w-4 mr-2" />
                        {wk.Kelas.nama_kelas}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                        <X className="h-4 w-4 mr-2" />
                        Tidak ada kelas
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => openEditModal(wk)} icon={<Pencil className="h-3.5 w-3.5" />}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost-danger" onClick={() => openDeleteModal(wk)} icon={<Trash2 className="h-3.5 w-3.5" />}>
                        Hapus
                      </Button>
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
              className="bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 dark:text-white text-sm truncate">{wk.nama}</h4>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <AtSign className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{wk.username}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{wk.Kelas ? wk.Kelas.nama_kelas : 'Tidak ada kelas'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-slate-800 gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(wk)} icon={<Pencil className="h-3 w-3" />}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost-danger" onClick={() => openDeleteModal(wk)} icon={<Trash2 className="h-3 w-3" />}>
                    Hapus
                  </Button>
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
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Tambah Wali Kelas</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Buat akun baru untuk wali kelas</p>
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
                  <Button variant="ghost" size="lg" fullWidth onClick={() => setIsCreateModalOpen(false)} type="button" className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">Batal</Button>
                  <Button size="lg" fullWidth loading={loading} type="submit" className="flex-1">Simpan</Button>
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
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Edit Wali Kelas</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Perbarui informasi wali kelas</p>
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
                  <Button variant="ghost" size="lg" fullWidth onClick={() => setIsEditModalOpen(false)} type="button" className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700">Batal</Button>
                  <Button size="lg" fullWidth loading={loading} type="submit" className="flex-1">Update</Button>
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
              className="bg-white dark:bg-slate-900 rounded-[40px] p-10 max-w-md mx-auto w-full shadow-2xl relative z-10 text-center border border-gray-100 dark:border-slate-800"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-[30px] flex items-center justify-center text-red-500">
                <Trash2 className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Hapus Wali Kelas?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold leading-relaxed">Wali kelas <span className="text-red-500">{selectedItem?.nama}</span> akan dihapus dari daftar.</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button variant="ghost" size="lg" fullWidth onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700">Batal</Button>
                <Button variant="danger" size="lg" fullWidth loading={loading} onClick={() => handleAction({ action: 'delete', id: selectedItem?.id })} className="flex-1">Ya, Hapus</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

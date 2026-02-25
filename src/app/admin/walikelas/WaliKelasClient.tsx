'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, User, AtSign, Building2, Pencil, Trash2, UserCheck, Lock as LockIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/Table'
import { StaggeredDropDown } from '@/components/ui/StaggeredDropDown'
import SweetAlert, { AlertType } from '@/components/ui/SweetAlert'

export default function WaliKelasClient({ walikelasList, kelasList }: { walikelasList: any[], kelasList: any[] }) {
  const router = useRouter()
  const MotionTableRow = motion(TableRow)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{
    show: boolean;
    type: AlertType;
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  })

  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    action: () => {}
  })

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlert({ show: true, type, title, message })
  }

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    username: '',
    password: '',
    id_kelas: ''
  })



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
        showAlert('success', 'Berhasil', result.message)
        setIsCreateModalOpen(false)
        setIsEditModalOpen(false)
        setFormData({ id: '', nama: '', username: '', password: '', id_kelas: '' })
        router.refresh()
      } else {
        showAlert('error', 'Gagal', result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      showAlert('error', 'Kesalahan', 'Terjadi kesalahan pada jaringan')
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



  return (
    <>
      <Card className="mb-8 md:mb-12 shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Wali Kelas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">Total {walikelasList.length} wali kelas terdaftar</p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setFormData({ id: '', nama: '', username: '', password: '', id_kelas: '' })
              setIsCreateModalOpen(true)
            }}
            icon={<Plus className="h-5 w-5" />}
            className="w-full md:w-auto h-[48px] md:h-[52px] rounded-2xl font-bold text-base px-6"
          >
            Tambah Wali Kelas
          </Button>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-[24px] border border-gray-100 dark:border-slate-800">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
              <TableRow>
                <TableHead className="w-[30%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                  <div className="flex items-center justify-center">Nama</div>
                </TableHead>
                <TableHead className="w-[25%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                  <div className="flex items-center justify-center">Username</div>
                </TableHead>
                <TableHead className="w-[25%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                  <div className="flex items-center justify-center">Kelas</div>
                </TableHead>
                <TableHead className="w-[20%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                  <div className="flex items-center justify-center">Aksi</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walikelasList.map((wk, index) => (
                <MotionTableRow 
                  key={wk.id} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-4 text-left px-8">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{wk.nama}</p>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="font-mono text-gray-500 dark:text-gray-400 font-bold tracking-wider text-sm">{wk.username}</span>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {wk.Kelas ? (
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {wk.Kelas.nama_kelas}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        Kosong
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openEditModal(wk)} 
                        icon={<Pencil className="h-4 w-4" />}
                        className="h-9 w-9 p-0 rounded-xl text-primary hover:bg-emerald-500 hover:text-white"
                        title="Edit Wali Kelas"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost-danger" 
                        onClick={() => setConfirmConfig({
                          show: true,
                          title: 'Hapus Wali Kelas',
                          message: `Apakah Anda yakin ingin menghapus wali kelas ${wk.nama}?`,
                          action: () => handleAction({ action: 'delete', id: wk.id })
                        })} 
                        icon={<Trash2 className="h-4 w-4" />}
                        className="h-9 w-9 p-0 rounded-xl"
                        title="Hapus Wali Kelas"
                      />
                    </div>
                  </TableCell>
                </MotionTableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {walikelasList.map((wk, index) => (
            <motion.div 
              key={wk.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-5 shadow-none"
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama</span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{wk.nama}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</span>
                    <span className="font-mono text-gray-500 dark:text-gray-400 font-bold tracking-wider text-sm">{wk.username}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kelas</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {wk.Kelas ? wk.Kelas.nama_kelas : 'Kosong'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200/50 dark:border-slate-800/50 gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => openEditModal(wk)} 
                    icon={<Pencil className="h-4 w-4" />}
                    className="h-9 w-9 p-0 rounded-xl text-primary hover:bg-emerald-500 hover:text-white"
                    title="Edit Wali Kelas"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost-danger" 
                    onClick={() => setConfirmConfig({
                      show: true,
                      title: 'Hapus Wali Kelas',
                      message: `Apakah Anda yakin ingin menghapus wali kelas ${wk.nama}?`,
                      action: () => handleAction({ action: 'delete', id: wk.id })
                    })} 
                    icon={<Trash2 className="h-4 w-4" />}
                    className="h-9 w-9 p-0 rounded-xl"
                    title="Hapus Wali Kelas"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Modals */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Tambah Wali Kelas"
        description="Daftarkan wali kelas baru ke dalam sistem"
        icon={<UserCheck className="h-6 w-6" />}
        onSave={() => handleAction({ action: 'create', ...formData })}
        loading={loading}
        saveLabel="Tambah Wali Kelas"
        footerText="Wali kelas akan mendapatkan akses dashboard"
      >
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Nama Lengkap</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input type="text" placeholder="Nama Lengkap" required value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <AtSign className="h-5 w-5" />
                </div>
                <input type="text" placeholder="username" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-mono font-bold" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <LockIcon className="h-5 w-5" />
                </div>
                <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Pilih Kelas</label>
              <StaggeredDropDown
                required
                value={formData.id_kelas}
                onChange={(val) => setFormData({ ...formData, id_kelas: val })}
                placeholder="Pilih Kelas"
                icon={<Building2 className="h-5 w-5" />}
                options={kelasList.map(k => ({ value: k.id.toString(), label: k.nama_kelas }))}
                triggerClassName="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-bold"
              />
            </div>
          </div>
        </CardContent>
      </Modal>

      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Wali Kelas"
        description="Perbarui informasi akun wali kelas"
        icon={<Pencil className="h-6 w-6" />}
        onSave={() => handleAction({ action: 'update', ...formData })}
        loading={loading}
        saveLabel="Simpan Perubahan"
        footerText="Password kosongkan jika tidak ingin diubah"
      >
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Nama Lengkap</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input type="text" placeholder="Nama Lengkap" required value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <AtSign className="h-5 w-5" />
                </div>
                <input type="text" placeholder="username" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-mono font-bold" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Password Baru</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <LockIcon className="h-5 w-5" />
                </div>
                <input type="password" placeholder="Kosongkan jika tidak berubah" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Pilih Kelas</label>
              <StaggeredDropDown
                required
                value={formData.id_kelas}
                onChange={(val) => setFormData({ ...formData, id_kelas: val })}
                placeholder="Pilih Kelas"
                icon={<Building2 className="h-5 w-5" />}
                options={kelasList.map(k => ({ value: k.id.toString(), label: k.nama_kelas }))}
                triggerClassName="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-bold"
              />
            </div>
          </div>
        </CardContent>
      </Modal>

      <SweetAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {confirmConfig.show && (
        <SweetAlert
          type="error"
          title={confirmConfig.title}
          message={confirmConfig.message}
          show={confirmConfig.show}
          onClose={() => setConfirmConfig({ ...confirmConfig, show: false })}
          duration={0}
        >
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                confirmConfig.action()
                setConfirmConfig({ ...confirmConfig, show: false })
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-[20px] transition-all shadow-lg shadow-red-200 dark:shadow-none"
            >
              Ya, Hapus
            </button>
            <button
              onClick={() => setConfirmConfig({ ...confirmConfig, show: false })}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-[20px] transition-all"
            >
              Batal
            </button>
          </div>
        </SweetAlert>
      )}
    </>
  )
}

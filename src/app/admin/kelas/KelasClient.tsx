'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Plus, 
  Trash2, 
  Hash, 
  User, 
  FileSpreadsheet
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import SweetAlert, { AlertType } from '@/components/ui/SweetAlert'

export default function KelasClient({ kelasList }: { kelasList: any[] }) {
  const router = useRouter()
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

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [students, setStudents] = useState<any[]>([])
  
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)

  const [namaKelas, setNamaKelas] = useState('')
  const [studentForm, setStudentForm] = useState({ no: '', nis: '', nama: '' })

  const fetchStudents = async (kelasId: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/siswa?kelas_id=${kelasId}`)
      const data = await res.json()
      if (res.ok) {
        setStudents(data.students)
      } else {
        showAlert('error', 'Gagal', data.error || 'Gagal memuat data siswa')
      }
    } catch (err) {
      showAlert('error', 'Kesalahan', 'Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  const handleClassClick = (id: number) => {
    setSelectedClassId(id)
    fetchStudents(id)
  }

  const handleAction = async (payload: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (res.ok) {
        showAlert('success', 'Berhasil', result.message)
        setIsAddClassModalOpen(false)
        setIsAddStudentModalOpen(false)
        setNamaKelas('')
        setStudentForm({ no: '', nis: '', nama: '' })
        
        router.refresh()
        
        if (payload.action === 'add_student' || payload.action === 'delete_student') {
           if (selectedClassId) {
             fetchStudents(selectedClassId)
           }
        }
        if (payload.action === 'delete_class' && selectedClassId === payload.id) {
           setSelectedClassId(null)
           setStudents([])
        }
      } else {
        showAlert('error', 'Gagal', result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      showAlert('error', 'Kesalahan', 'Terjadi kesalahan pada jaringan')
    } finally {
      setLoading(false)
    }
  }

  const selectedClassInfo = kelasList.find(k => k.id === selectedClassId)

  const columns = [
    { 
      header: 'No', 
      accessor: (item: any) => (
        <div className="flex items-center justify-center w-9 h-9 bg-primary/5 text-primary rounded-2xl font-bold text-sm">
          {item.no}
        </div>
      ),
      width: '80px',
      className: 'text-center'
    },
    { 
      header: 'NIS', 
      accessor: (item: any) => <span className="font-mono text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-sm">{item.nis}</span>,
      width: '200px'
    },
    { 
      header: 'Nama', 
      accessor: (item: any) => <p className="font-semibold text-gray-900 dark:text-white text-base">{item.nama}</p> 
    },
    { 
      header: 'Aksi', 
      accessor: (item: any) => (
        <Button 
          size="sm" 
          variant="ghost-danger" 
          onClick={() => setConfirmConfig({
            show: true,
            title: 'Hapus Siswa',
            message: `Apakah Anda yakin ingin menghapus data siswa ${item.nama}?`,
            action: () => handleAction({ action: 'delete_student', id: item.id })
          })} 
          icon={<Trash2 className="h-3.5 w-3.5" />}
        >
          Hapus
        </Button>
      ),
      width: '140px'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <PageHeader 
        title="Kelola Kelas"
        description="Kelola struktur kelas dalam satu tempat yang profesional"
        className="mb-8 md:mb-12"
      />

      <Card className="mb-8 md:mb-12">
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
            <Building2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Kelas</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Pilih kelas untuk mengelola data siswa</p>
              </div>
              <Button onClick={() => setIsAddClassModalOpen(true)} icon={<Plus className="h-5 w-5" />} className="w-full md:w-auto">
                Tambah Kelas Baru
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {kelasList.map((kelas, index) => (
            <motion.div 
              key={kelas.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative group"
            >
              <button 
                onClick={() => handleClassClick(kelas.id)} 
                className={`w-full p-4 md:p-6 rounded-[32px] text-center transition-all border-2 ${selectedClassId === kelas.id ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-gray-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 border-transparent dark:border-slate-800 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedClassId === kelas.id ? 'bg-white/20' : 'bg-primary/5'}`}>
                    <Building2 className={`h-6 w-6 ${selectedClassId === kelas.id ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-sm md:text-base leading-tight truncate w-full">{kelas.nama_kelas}</p>
                    <p className={`text-xs mt-1 font-semibold ${selectedClassId === kelas.id ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>{kelas.jumlah_siswa} Siswa</p>
                  </div>
                </div>
              </button>
              
              {kelas.jumlah_siswa === 0 && (
                <button 
                  onClick={() => setConfirmConfig({
                    show: true,
                    title: 'Hapus Kelas',
                    message: `Apakah Anda yakin ingin menghapus kelas ${kelas.nama_kelas}?`,
                    action: () => handleAction({ action: 'delete_class', id: kelas.id })
                  })} 
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {selectedClassId && (
          <motion.div 
            key={selectedClassId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Card noPadding className="mb-8 md:mb-12 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800">
              <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center space-x-4 mb-6 md:mb-8">
                  <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          Siswa {selectedClassInfo?.nama_kelas}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Total {students.length} Siswa Terdaftar</p>
                      </div>
                      <Button onClick={() => setIsAddStudentModalOpen(true)} icon={<Plus className="h-5 w-5" />} className="w-full md:w-auto">
                        Tambah Siswa
                      </Button>
                    </div>
                  </div>
                </div>

                <DataTable 
                  data={students}
                  columns={columns}
                  keyExtractor={(item) => item.id}
                  emptyMessage={`Belum ada data siswa di kelas ${selectedClassInfo?.nama_kelas}`}
                  renderMobileCard={(student, index) => (
                    <div className="bg-gray-50/50 dark:bg-slate-900/50 p-6 rounded-[32px] border border-transparent dark:border-slate-800 hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm mb-4">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl flex-shrink-0 text-primary font-bold">
                            {student.no}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-base mb-1">{student.nama}</h4>
                            <div className="flex items-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                              <span className="font-mono tracking-wider">{student.nis}</span>
                            </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-5 mt-5 border-t border-gray-100 dark:border-slate-800">
                          <Button 
                            size="sm" 
                            variant="ghost-danger" 
                            onClick={() => setConfirmConfig({
                              show: true,
                              title: 'Hapus Siswa',
                              message: `Apakah Anda yakin ingin menghapus data siswa ${student.nama}?`,
                              action: () => handleAction({ action: 'delete_student', id: student.id })
                            })} 
                            icon={<Trash2 className="h-3 w-3" />}
                          >
                            Hapus
                          </Button>
                      </div>
                    </div>
                  )}
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <Modal
        open={isAddClassModalOpen}
        onOpenChange={setIsAddClassModalOpen}
        title="Tambah Kelas"
        description="Buat kelas baru untuk tahun ajaran ini"
        icon={<Building2 className="h-6 w-6" />}
        onSave={() => handleAction({ action: 'add_class', nama_kelas: namaKelas })}
        loading={loading}
        saveLabel="Tambah Kelas"
        footerText="Nama kelas harus unik"
      >
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1 text-center">Nama Kelas</label>
            <div className="relative group max-w-sm mx-auto">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Building2 className="h-6 w-6" />
              </div>
              <input 
                type="text" 
                placeholder="Contoh: KELAS 1A" 
                required 
                value={namaKelas} 
                onChange={e => setNamaKelas(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-8 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 dark:text-white font-bold text-center text-lg" 
                autoFocus
              />
            </div>
          </div>
        </CardContent>
      </Modal>

      <Modal
        open={isAddStudentModalOpen}
        onOpenChange={setIsAddStudentModalOpen}
        title="Tambah Siswa"
        description={`Sekolah Menengah Pertama • Kelas ${selectedClassInfo?.nama_kelas}`}
        icon={<User className="h-6 w-6" />}
        onSave={() => handleAction({ action: 'add_student', ...studentForm, kelas_id: selectedClassId })}
        loading={loading}
        saveLabel="Simpan Data"
        footerText="PASTIKAN DATA SUDAH BENAR SEBELUM DISIMPAN"
      >
        <CardContent className="space-y-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Nomor Urut</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Hash className="h-6 w-6" />
                </div>
                <input 
                  type="number" 
                  required 
                  value={studentForm.no} 
                  onChange={e => setStudentForm({ ...studentForm, no: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-8 focus:ring-primary/5 focus:outline-none transition-all font-mono font-bold text-lg" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">NIS / NISN</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={studentForm.nis} 
                  onChange={e => setStudentForm({ ...studentForm, nis: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-8 focus:ring-primary/5 focus:outline-none transition-all font-mono font-bold text-lg" 
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Nama Lengkap Siswa</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <User className="h-6 w-6" />
              </div>
              <input 
                type="text" 
                required 
                value={studentForm.nama} 
                onChange={e => setStudentForm({ ...studentForm, nama: e.target.value })}
                className="w-full pl-14 pr-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-8 focus:ring-primary/5 focus:outline-none transition-all font-bold text-lg" 
                placeholder="Ex: Muhammad Alfian"
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

      <SweetAlert
        type="warning"
        title={confirmConfig.title}
        message={confirmConfig.message}
        show={confirmConfig.show}
        onClose={() => setConfirmConfig({ ...confirmConfig, show: false })}
      >
        <div className="flex gap-3 mt-6">
          <Button 
            fullWidth 
            variant="danger" 
            onClick={() => {
              confirmConfig.action()
              setConfirmConfig({ ...confirmConfig, show: false })
            }}
          >
            Ya, Hapus
          </Button>
          <Button 
            fullWidth 
            variant="ghost" 
            onClick={() => setConfirmConfig({ ...confirmConfig, show: false })}
          >
            Batal
          </Button>
        </div>
      </SweetAlert>
    </div>
  )
}

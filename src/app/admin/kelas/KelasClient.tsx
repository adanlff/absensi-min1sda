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

      <Card className="mb-8 md:mb-12 shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Kelas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">Pilih kelas untuk mengelola data siswa</p>
            </div>
          </div>
          <Button onClick={() => setIsAddClassModalOpen(true)} icon={<Plus className="h-5 w-5" />} className="w-full md:w-auto h-[48px] md:h-[52px] rounded-2xl font-bold text-base px-6">
            Tambah Kelas Baru
          </Button>
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
            <Card noPadding className="mb-8 md:mb-12 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 shadow-none">
              <div className="p-4 md:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Siswa {selectedClassInfo?.nama_kelas}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">Total {students.length} Siswa Terdaftar</p>
                    </div>
                  </div>
                  <Button onClick={() => setIsAddStudentModalOpen(true)} icon={<Plus className="h-5 w-5" />} className="w-full md:w-auto h-[48px] md:h-[52px] rounded-2xl font-bold text-base px-6">
                    Tambah Siswa
                  </Button>
                </div>

                {students.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto rounded-[24px] border border-gray-100 dark:border-slate-800">
                      <table className="table-fixed w-full border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
                          <tr>
                            <th className="w-[15%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                              <div className="flex items-center justify-center">No</div>
                            </th>
                            <th className="w-[25%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                              <div className="flex items-center justify-center">NIS</div>
                            </th>
                            <th className="w-[40%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                              <div className="flex items-center justify-center">Nama</div>
                            </th>
                            <th className="w-[20%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                              <div className="flex items-center justify-center">Aksi</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                          {students.map((student, index) => (
                            <motion.tr 
                              key={student.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <td className="py-4 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/5 text-primary rounded-xl font-bold text-xs">{student.no}</span>
                              </td>
                              <td className="py-4 text-center">
                                <span className="font-mono text-gray-500 dark:text-gray-400 font-bold tracking-wider text-sm">{student.nis}</span>
                              </td>
                              <td className="py-4 text-center">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{student.nama}</p>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center justify-center">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => setConfirmConfig({
                                      show: true,
                                      title: 'Hapus Siswa',
                                      message: `Apakah Anda yakin ingin menghapus data siswa ${student.nama}?`,
                                      action: () => handleAction({ action: 'delete_student', id: student.id })
                                    })} 
                                    icon={<Trash2 className="h-4 w-4" />}
                                    className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500 hover:text-white"
                                    title="Hapus Siswa"
                                  />
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {students.map((student, index) => (
                        <motion.div 
                          key={student.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-5 shadow-none"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                                {student.no}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Nama Siswa</span>
                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{student.nama}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NIS / NISN</span>
                              <span className="font-mono text-gray-500 dark:text-gray-400 font-bold tracking-wider text-sm">{student.nis}</span>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-200/50 dark:border-slate-800/50">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setConfirmConfig({
                                  show: true,
                                  title: 'Hapus Siswa',
                                  message: `Apakah Anda yakin ingin menghapus data siswa ${student.nama}?`,
                                  action: () => handleAction({ action: 'delete_student', id: student.id })
                                })} 
                                icon={<Trash2 className="h-4 w-4" />}
                                className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500 hover:text-white"
                                title="Hapus Siswa"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-[32px]">
                    <p className="text-gray-400 dark:text-gray-500 font-bold text-sm">Belum ada data siswa di kelas {selectedClassInfo?.nama_kelas}</p>
                  </div>
                )}
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
                className="w-full pl-14 pr-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-bold text-center text-lg" 
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
                  className="w-full pl-14 pr-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-mono font-bold text-lg" 
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
                  className="w-full pl-14 pr-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-mono font-bold text-lg" 
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
                className="w-full pl-14 pr-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 focus:border-primary focus:outline-none transition-all font-bold text-lg" 
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

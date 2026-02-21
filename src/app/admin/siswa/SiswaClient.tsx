'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { 
  CloudUpload, 
  Building2, 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Check, 
  Info, 
  Hash, 
  User, 
  Loader2,
  AlertCircle,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'

export default function SiswaClient({ kelasList }: { kelasList: any[] }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [students, setStudents] = useState<any[]>([])
  
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [isDeleteStudentModalOpen, setIsDeleteStudentModalOpen] = useState(false)
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] = useState(false)

  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [classToDelete, setClassToDelete] = useState<any>(null)

  const [namaKelas, setNamaKelas] = useState('')
  const [studentForm, setStudentForm] = useState({ no: '', nis: '', nama: '' })
  
  const [uploadClassId, setUploadClassId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  const fetchStudents = async (kelasId: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/siswa?kelas_id=${kelasId}`)
      const data = await res.json()
      if (res.ok) {
        setStudents(data.students)
      } else {
        setError(data.error || 'Gagal memuat data siswa')
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan')
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
    setMessage('')
    setError('')
    try {
      const res = await fetch('/api/admin/siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (res.ok) {
        setMessage(result.message)
        setIsAddClassModalOpen(false)
        setIsAddStudentModalOpen(false)
        setIsDeleteStudentModalOpen(false)
        setIsDeleteClassModalOpen(false)
        setNamaKelas('')
        setStudentForm({ no: '', nis: '', nama: '' })
        
        router.refresh()
        
        if (payload.action === 'add_student' || payload.action === 'delete_student' || payload.action === 'upload_excel') {
           if (selectedClassId) {
             fetchStudents(selectedClassId)
           }
        }
        if (payload.action === 'delete_class' && selectedClassId === payload.id) {
           setSelectedClassId(null)
           setStudents([])
        }
      } else {
        setError(result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      setError('Terjadi kesalahan pada jaringan')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadClassId) {
      setError('Silakan pilih kelas terlebih dahulu')
      return
    }

    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setError('Silakan pilih file Excel')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        const formattedData = jsonData.slice(1).map((row: any) => ({
          no: row[0],
          nis: row[1],
          nama: row[2]
        })).filter(row => row.no && row.nis && row.nama)

        if (formattedData.length === 0) {
          setError('File Excel kosong atau format tidak sesuai')
          setLoading(false)
          return
        }

        await handleAction({
          action: 'upload_excel',
          kelas_id: uploadClassId,
          data: formattedData
        })
        
        if (fileInputRef.current) fileInputRef.current.value = ''
        setSelectedClassId(parseInt(uploadClassId))
        
      } catch (err) {
        setError('Gagal membaca file Excel')
        setLoading(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const selectedClassInfo = kelasList.find(k => k.id === selectedClassId)

  const columns = [
    { 
      header: 'No', 
      accessor: (item: any) => (
        <div className="flex items-center justify-center w-9 h-9 bg-primary/5 text-primary rounded-2xl font-black text-sm">
          {item.no}
        </div>
      ),
      width: '80px',
      className: 'text-center'
    },
    { 
      header: 'NIS', 
      accessor: (item: any) => <span className="font-mono text-gray-500 font-bold tracking-wider text-sm">{item.nis}</span>,
      width: '200px'
    },
    { 
      header: 'Nama', 
      accessor: (item: any) => <p className="font-black text-gray-900 text-base">{item.nama}</p> 
    },
    { 
      header: 'Aksi', 
      accessor: (item: any) => (
        <Button size="sm" variant="ghost-danger" onClick={() => { setSelectedStudent(item); setIsDeleteStudentModalOpen(true) }} icon={<Trash2 className="h-3.5 w-3.5" />}>
          Hapus
        </Button>
      ),
      width: '140px'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <PageHeader 
        title="Kelola Siswa"
        description="Upload dan kelola data siswa dengan sistem yang terintegrasi dan mudah digunakan"
        className="mb-8 md:mb-12"
      />

      <AnimatePresence mode="wait">
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-100 text-red-800 px-6 py-4 rounded-2xl mb-8"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="font-bold">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="mb-8 md:mb-12 relative overflow-hidden">
        <div className="mb-8 flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <CloudUpload className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Upload Data Siswa</h3>
            <p className="text-gray-500 text-sm font-medium mt-1">Gunakan file Excel untuk menambah data siswa secara massal</p>
          </div>
        </div>
        
        <form onSubmit={handleFileUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Pilih Kelas</label>
                <div className="relative h-[58px] flex items-center border border-gray-100 bg-gray-50/50 rounded-2xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <select required value={uploadClassId} onChange={e => setUploadClassId(e.target.value)}
                    className="w-full pl-12 pr-4 bg-transparent focus:outline-none transition-all text-gray-900 font-medium appearance-none">
                    <option value="">Pilih Kelas</option>
                    {kelasList.map(k => (
                      <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                    ))}
                  </select>
                </div>
              </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">File Excel</label>
              <div className="relative">
                <div className="relative h-[58px] flex items-center border border-gray-100 bg-gray-50/50 rounded-2xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <input type="file" ref={fileInputRef} accept=".xlsx,.xls" required 
                    className="w-full pl-12 pr-4 bg-transparent focus:outline-none transition-all text-gray-900 font-medium file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" loading={loading} icon={<CloudUpload className="h-5 w-5" />}>
              {loading ? 'Memproses...' : 'Upload Data'}
            </Button>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <h4 className="font-bold text-primary mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Format Excel yang Disarankan
            </h4>
            <div className="text-sm text-gray-600 space-y-3 font-medium">
              <p>Pastikan file Anda memiliki kolom: <code className="bg-white px-2 py-0.5 rounded border border-primary/10 text-primary">NO</code> | <code className="bg-white px-2 py-0.5 rounded border border-primary/10 text-primary">NIS</code> | <code className="bg-white px-2 py-0.5 rounded border border-primary/10 text-primary">NAMA</code></p>
              <div className="bg-white/80 p-4 rounded-2xl border border-primary/5 font-mono text-xs overflow-x-auto shadow-inner">
                <div className="text-gray-400 mb-1 whitespace-nowrap">NO | NIS                | NAMA (Header)</div>
                <div className="text-primary mb-1 whitespace-nowrap">1  | 111135150001250003 | ACHMAD ARVINO XAVIER WIJAYA</div>
                <div className="text-primary mb-1 whitespace-nowrap">2  | 111135150001250004 | ADERA YUMNA AZKAYRA</div>
              </div>
            </div>
          </div>
        </form>
      </Card>

      <Card className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-2xl font-black text-gray-900 mb-1 border-l-4 border-primary pl-4">Data Per Kelas</h3>
            <p className="text-gray-500 text-sm font-medium">Pilih kelas untuk mengelola data siswa</p>
          </div>
          <Button onClick={() => setIsAddClassModalOpen(true)} icon={<Plus className="h-5 w-5" />}>
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
                className={`w-full p-4 md:p-6 rounded-3xl text-center transition-all border-2 ${selectedClassId === kelas.id ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-gray-50/50 hover:bg-white text-gray-700 border-transparent hover:border-primary/20 hover:shadow-md'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedClassId === kelas.id ? 'bg-white/20' : 'bg-primary/5'}`}>
                    <Building2 className={`h-6 w-6 ${selectedClassId === kelas.id ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <div>
                    <p className="font-black text-sm md:text-base leading-tight truncate w-full">{kelas.nama_kelas}</p>
                    <p className={`text-xs mt-1 font-bold ${selectedClassId === kelas.id ? 'text-white/80' : 'text-gray-400'}`}>{kelas.jumlah_siswa} Siswa</p>
                  </div>
                </div>
              </button>
              
              {kelas.jumlah_siswa === 0 && (
                <button 
                  onClick={() => { setClassToDelete(kelas); setIsDeleteClassModalOpen(true) }} 
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
            <Card noPadding className="mb-8 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1 border-l-4 border-primary pl-4">
                      Siswa {selectedClassInfo?.nama_kelas}
                    </h3>
                    <p className="text-gray-500 text-sm font-bold">Total {students.length} Siswa Terdaftar</p>
                  </div>
                  <Button onClick={() => setIsAddStudentModalOpen(true)} icon={<Plus className="h-5 w-5" />}>
                    Tambah Siswa
                  </Button>
                </div>

                <DataTable 
                  data={students}
                  columns={columns}
                  keyExtractor={(item) => item.id}
                  emptyMessage={`Belum ada data siswa di kelas ${selectedClassInfo?.nama_kelas}`}
                  renderMobileCard={(student, index) => (
                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white transition-all shadow-sm mb-4">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl flex-shrink-0 text-primary font-black">
                            {student.no}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-base mb-1">{student.nama}</h4>
                            <div className="flex items-center text-xs font-bold text-gray-400">
                              <span className="font-mono tracking-wider">{student.nis}</span>
                            </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-5 mt-5 border-t border-gray-100">
                          <Button size="sm" variant="ghost-danger" onClick={() => { setSelectedStudent(student); setIsDeleteStudentModalOpen(true) }} icon={<Trash2 className="h-3 w-3" />}>
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

      {/* Modals with AnimatePresence */}
      <AnimatePresence>
        {isAddClassModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddClassModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black text-gray-900">Tambah Kelas</h3>
                  <p className="text-gray-500 mt-2 font-bold mb-0">Buat kelas baru</p>
                </div>
                <button onClick={() => setIsAddClassModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'add_class', nama_kelas: namaKelas }) }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Nama Kelas</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <input type="text" placeholder="Contoh: KELAS 1A" required value={namaKelas} onChange={e => setNamaKelas(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all font-bold" />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button variant="ghost" size="lg" fullWidth onClick={() => setIsAddClassModalOpen(false)} type="button" className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700">Batal</Button>
                  <Button size="lg" fullWidth loading={loading} type="submit" className="flex-1">Simpan</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isAddStudentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddStudentModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black text-gray-900">Tambah Siswa</h3>
                  <p className="text-primary mt-2 font-black uppercase tracking-widest text-xs">Kelas {selectedClassInfo?.nama_kelas}</p>
                </div>
                <button onClick={() => setIsAddStudentModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'add_student', ...studentForm, kelas_id: selectedClassId }) }} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Nomor Urut</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Hash className="h-5 w-5" />
                    </div>
                    <input type="number" required value={studentForm.no} onChange={e => setStudentForm({ ...studentForm, no: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all font-mono font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">NIS</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <input type="text" required value={studentForm.nis} onChange={e => setStudentForm({ ...studentForm, nis: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all font-mono font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input type="text" required value={studentForm.nama} onChange={e => setStudentForm({ ...studentForm, nama: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all font-bold" />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button variant="ghost" size="lg" fullWidth onClick={() => setIsAddStudentModalOpen(false)} type="button" className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700">Batal</Button>
                  <Button size="lg" fullWidth loading={loading} type="submit" className="flex-1">Simpan</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isDeleteStudentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteStudentModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[40px] p-10 max-w-md mx-auto w-full shadow-2xl relative z-10 text-center">
               <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-[30px] flex items-center justify-center text-red-500">
                  <Trash2 className="h-10 w-10" />
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-3">Hapus Data?</h3>
               <p className="text-gray-500 mb-10 font-bold leading-relaxed">Siswa <span className="text-red-500">{selectedStudent?.nama}</span> akan dihapus permanen dari sistem.</p>
               <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="ghost" size="lg" fullWidth onClick={() => setIsDeleteStudentModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700">Batal</Button>
                  <Button variant="danger" size="lg" fullWidth loading={loading} onClick={() => handleAction({ action: 'delete_student', id: selectedStudent?.id })} className="flex-1">Ya, Hapus</Button>
               </div>
            </motion.div>
          </div>
        )}

        {isDeleteClassModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteClassModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[40px] p-10 max-w-md mx-auto w-full shadow-2xl relative z-10 text-center">
               <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-[30px] flex items-center justify-center text-red-500">
                  <Trash2 className="h-10 w-10" />
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-3">Hapus Kelas?</h3>
               <p className="text-gray-500 mb-10 font-bold leading-relaxed">Kelas <span className="text-red-500">{classToDelete?.nama_kelas}</span> akan dihapus dari daftar.</p>
               <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="ghost" size="lg" fullWidth onClick={() => setIsDeleteClassModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700">Batal</Button>
                  <Button variant="danger" size="lg" fullWidth loading={loading} onClick={() => handleAction({ action: 'delete_class', id: classToDelete?.id })} className="flex-1">Ya, Hapus</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

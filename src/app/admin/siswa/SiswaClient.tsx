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
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-xl">
          <span className="text-primary font-bold text-xs md:text-sm">{item.no}</span>
        </div>
      ),
      width: '60px',
      className: 'text-center'
    },
    { 
      header: 'NIS', 
      accessor: (item: any) => <span className="font-mono text-gray-700 font-medium">{item.nis}</span>,
      width: '200px'
    },
    { 
      header: 'Nama', 
      accessor: (item: any) => <p className="font-semibold text-gray-900">{item.nama}</p> 
    },
    { 
      header: 'Aksi', 
      accessor: (item: any) => (
        <button onClick={() => { setSelectedStudent(item); setIsDeleteStudentModalOpen(true) }} 
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs md:text-sm font-semibold rounded-xl hover:shadow-lg transition duration-300">
          <Trash2 className="h-4 w-4 mr-2" />
          Hapus
        </button>
      ),
      width: '120px'
    }
  ]

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

      <Card className="mb-8 md:mb-12 border-b-primary/50 relative overflow-hidden group">
        <div className="relative z-10 mb-6 flex items-start md:items-center space-x-3 md:space-x-4">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-secondary flex-shrink-0"
          >
            <CloudUpload className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">Upload Data Siswa</h3>
            <p className="text-gray-600 text-sm md:text-base mt-1">Upload file Excel untuk menambahkan data siswa secara massal</p>
          </div>
        </div>
        
        <form onSubmit={handleFileUpload} className="relative z-10 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Pilih Kelas</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400">
                  <Building2 className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <select required value={uploadClassId} onChange={e => setUploadClassId(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg">
                  <option value="">Pilih Kelas</option>
                  {kelasList.map(k => (
                    <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">File Excel</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400">
                  <FileSpreadsheet className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <input type="file" ref={fileInputRef} accept=".xlsx,.xls" required 
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-primary hover:file:bg-gray-100" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mb-4 md:mb-6">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-semibold transition duration-300 flex items-center space-x-2 md:space-x-3 shadow-lg w-full md:w-auto justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" /> : <CloudUpload className="h-5 w-5 md:h-6 md:w-6" />}
              <span>{loading ? 'Memproses...' : 'Upload Data'}</span>
            </motion.button>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center text-sm md:text-base">
              <Info className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Format Excel
            </h4>
            <div className="text-xs md:text-sm text-blue-800 space-y-2">
              <p><strong>Kolom:</strong> NO | NIS | NAMA (Baris pertama akan dilewati jika berisi header)</p>
              <div className="bg-white p-2 md:p-3 rounded-lg border border-blue-200 font-mono text-xs overflow-x-auto">
                <div className="text-blue-600 mb-1 whitespace-nowrap">NO | NIS                | NAMA (Header)</div>
                <div className="text-blue-600 mb-1 whitespace-nowrap">1  | 111135150001250003 | ACHMAD ARVINO XAVIER WIJAYA</div>
                <div className="text-blue-600 mb-1 whitespace-nowrap">2  | 111135150001250004 | ADERA YUMNA AZKAYRA</div>
              </div>
            </div>
          </div>
        </form>
      </Card>

      <Card className="mb-8 md:mb-12 border-b-secondary/50 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 border-l-4 border-secondary pl-3">Kelola Data Siswa per Kelas</h3>
            <p className="text-gray-600 text-sm md:text-base">Pilih kelas untuk melihat dan mengelola data siswa</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddClassModalOpen(true)} 
              className="inline-flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl transition duration-300 shadow-lg"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Tambah Kelas
            </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3 md:gap-4">
          {kelasList.map((kelas, index) => (
            <motion.div 
              key={kelas.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="relative group"
            >
              <button onClick={() => handleClassClick(kelas.id)} 
                className={`w-full block px-2 md:px-4 py-4 md:py-6 rounded-xl md:rounded-2xl text-center transition duration-300 transform border ${selectedClassId === kelas.id ? 'bg-gradient-to-br from-primary to-secondary text-white border-transparent shadow-lg -translate-y-1' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:-translate-y-1'}`}>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center ${selectedClassId === kelas.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                    <Building2 className={`h-4 w-4 md:h-6 md:w-6 ${selectedClassId === kelas.id ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-xs md:text-sm leading-tight">{kelas.nama_kelas}</p>
                    <p className="text-xs opacity-75">{kelas.jumlah_siswa} siswa</p>
                  </div>
                </div>
              </button>
              
              {kelas.jumlah_siswa === 0 && (
                <button onClick={() => { setClassToDelete(kelas); setIsDeleteClassModalOpen(true) }} 
                  className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md z-10">
                  <Trash2 className="h-3 w-3" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card noPadding className="border-b-primary/50 shadow-xl mb-8">
              <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 border-l-4 border-primary pl-3">
                      Data Siswa {selectedClassInfo?.nama_kelas}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">Total {students.length} siswa terdaftar</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddStudentModalOpen(true)} 
                    className="inline-flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl shadow-lg"
                  >
                    <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Tambah Siswa
                  </motion.button>
                </div>

                <DataTable 
                  data={students}
                  columns={columns}
                  keyExtractor={(item) => item.id}
                  emptyMessage={`Belum ada data siswa di kelas ${selectedClassInfo?.nama_kelas}`}
                  renderMobileCard={(student, index) => (
                    <Card className="p-4 hover:border-primary border-l-4 border-l-transparent transition-all shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col gap-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                                <span className="text-primary font-bold text-sm">{student.no}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{student.nama}</h4>
                                <div className="flex items-center text-xs text-gray-600">
                                  <FileSpreadsheet className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                  <span className="font-mono">{student.nis}</span>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
                          <button onClick={() => { setSelectedStudent(student); setIsDeleteStudentModalOpen(true) }} 
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-lg shadow-sm">
                            <Trash2 className="h-3 w-3 mr-2" />
                            Hapus
                          </button>
                      </div>
                    </Card>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddClassModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 w-full max-w-md shadow-2xl relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Tambah Kelas</h3>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">Buat kelas baru untuk siswa</p>
                </div>
                <button onClick={() => setIsAddClassModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition duration-200">
                  <X className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'add_class', nama_kelas: namaKelas }) }} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kelas</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400">
                      <Building2 className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input type="text" placeholder="Contoh: KELAS 1A" required value={namaKelas} onChange={e => setNamaKelas(e.target.value)}
                      className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg" />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 mt-6 md:mt-8">
                  <button type="button" onClick={() => setIsAddClassModalOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200 font-semibold order-2 sm:order-1 flex-1">Batal</button>
                  <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold shadow-lg order-1 sm:order-2 disabled:opacity-50 flex items-center justify-center min-w-[100px] flex-1">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isAddStudentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddStudentModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 w-full max-w-md shadow-2xl relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Tambah Siswa</h3>
                  <p className="text-gray-600 mt-1 text-sm md:text-base">Kelas {selectedClassInfo?.nama_kelas}</p>
                </div>
                <button onClick={() => setIsAddStudentModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition duration-200">
                  <X className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'add_student', ...studentForm, kelas_id: selectedClassId }) }} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Urut</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Hash className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input type="number" required value={studentForm.no} onChange={e => setStudentForm({ ...studentForm, no: e.target.value })}
                      className="w-full pl-9 md:pl-10 pr-3 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">NIS</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FileSpreadsheet className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input type="text" required value={studentForm.nis} onChange={e => setStudentForm({ ...studentForm, nis: e.target.value })}
                      className="w-full pl-9 md:pl-10 pr-3 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <input type="text" required value={studentForm.nama} onChange={e => setStudentForm({ ...studentForm, nama: e.target.value })}
                      className="w-full pl-9 md:pl-10 pr-3 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 mt-6 md:mt-8">
                  <button type="button" onClick={() => setIsAddStudentModalOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200 font-semibold order-2 sm:order-1 flex-1">Batal</button>
                  <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold shadow-lg order-1 sm:order-2 disabled:opacity-50 flex items-center justify-center min-w-[100px] flex-1">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isDeleteStudentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteStudentModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md mx-auto w-full shadow-2xl relative z-10 text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                  <Trash2 className="h-6 w-6 md:h-8 md:w-8" />
               </div>
               <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Konfirmasi Hapus</h3>
               <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Hapus siswa <span className="font-semibold text-primary">{selectedStudent?.nama}</span>?</p>
               <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button onClick={() => setIsDeleteStudentModalOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200 font-semibold order-2 sm:order-1 flex-1">Batal</button>
                  <button type="button" onClick={() => handleAction({ action: 'delete_student', id: selectedStudent?.id })} disabled={loading} className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 font-semibold shadow-lg order-1 sm:order-2 disabled:opacity-50 flex items-center justify-center min-w-[100px] flex-1">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Hapus'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}

        {isDeleteClassModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteClassModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md mx-auto w-full shadow-2xl relative z-10 text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                  <Trash2 className="h-6 w-6 md:h-8 md:w-8" />
               </div>
               <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Konfirmasi Hapus</h3>
               <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Hapus kelas <span className="font-semibold text-primary">{classToDelete?.nama_kelas}</span>?</p>
               <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button onClick={() => setIsDeleteClassModalOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition duration-200 font-semibold order-2 sm:order-1 flex-1">Batal</button>
                  <button type="button" onClick={() => handleAction({ action: 'delete_class', id: classToDelete?.id })} disabled={loading} className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 font-semibold shadow-lg order-1 sm:order-2 disabled:opacity-50 flex items-center justify-center min-w-[100px] flex-1">
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

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, X, Calendar, Building2, Zap, Heart, FileText, AlertCircle, Save, Users, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { SearchBox } from '@/components/ui/SearchBox'

export default function AbsenClient({ 
  waliKelas, 
  students, 
  initialDate,
  initialSearch
}: { 
  waliKelas: any, 
  students: any[], 
  initialDate: string,
  initialSearch: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(initialSearch)
  const [tanggal, setTanggal] = useState(initialDate)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [attendance, setAttendance] = useState<{ [key: number]: { status: string, keterangan: string } }>({})
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  useEffect(() => {
    const initData: any = {}
    students.forEach(student => {
      const kehadiranToday = student.Kehadiran?.[0]
      initData[student.id] = {
        status: kehadiranToday?.status || 'hadir',
        keterangan: kehadiranToday?.keterangan || ''
      }
    })
    setAttendance(initData)
  }, [students])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== initialSearch || tanggal !== initialDate) {
        const params = new URLSearchParams(searchParams.toString())
        if (search) params.set('search', search)
        else params.delete('search')
        
        if (tanggal) params.set('tanggal', tanggal)
        else params.delete('tanggal')
        
        router.push(`/walikelas/absen?${params.toString()}`)
      }
    }, 500)
    
    return () => clearTimeout(handler)
  }, [search, tanggal, initialSearch, initialDate, router, searchParams])

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  const handleBulkAction = async (status: string) => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await fetch('/api/walikelas/absen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk',
          tanggal,
          bulk_status: status,
          id_kelas: waliKelas.id_kelas
        })
      })
      const result = await res.json()
      if (res.ok) {
        setMessage(result.message)
        const newData = { ...attendance }
        students.forEach(s => {
          if(newData[s.id]) {
            newData[s.id].status = status
          }
        })
        setAttendance(newData)
        router.refresh()
      } else {
        setError(result.error || 'Gagal update absen massal')
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAttendance = async () => {
    setLoading(true)
    setMessage('')
    setError('')
    setIsConfirmModalOpen(false)
    
    const payloadData = Object.keys(attendance).map(id => ({
      id_siswa: id,
      status: attendance[parseInt(id)].status,
      keterangan: attendance[parseInt(id)].keterangan
    }))

    try {
      const res = await fetch('/api/walikelas/absen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          tanggal,
          data: payloadData
        })
      })
      const result = await res.json()
      if (res.ok) {
        setMessage(result.message || 'Absen berhasil disimpan!')
        router.refresh()
      } else {
        setError(result.error || 'Gagal menyimpan absen')
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceChange = (studentId: number, field: string, value: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }))
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <PageHeader 
        title="Input Absen"
        description={`Input kehadiran siswa ${waliKelas.Kelas?.nama_kelas || 'kelas Anda'}`}
      >
        <SearchBox 
          value={search} 
          onChange={setSearch} 
          placeholder="Cari nama atau NIS siswa..." 
        />
      </PageHeader>

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

      <Card className="mb-6 md:mb-8 border-b-primary/50">
        <div className="flex items-center space-x-3 mb-4 md:mb-6">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-secondary"
          >
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Pilih Tanggal dan Kelas</h3>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Pilih tanggal untuk menginput absensi siswa</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Tanggal</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input type="date" value={tanggal} max={today} onChange={(e) => setTanggal(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm focus:outline-none text-base md:text-lg transition-all" />
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Hanya dapat menginput hingga hari ini</p>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Kelas</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                <Building2 className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input type="text" value={waliKelas.Kelas?.nama_kelas || 'Belum ada kelas'} readOnly disabled
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl shadow-sm bg-gray-50 border-2 border-gray-100 text-gray-500 text-base md:text-lg" />
            </div>
          </div>
        </div>
      </Card>

      {students.length > 0 ? (
        <>
          <Card className="mb-6 md:mb-8 border-b-secondary/50">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-secondary to-primary"
              >
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Aksi Massal</h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Tandai semua siswa dengan status yang sama</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: 'Semua Hadir', status: 'hadir', icon: Check, color: 'emerald' },
                { label: 'Semua Sakit', status: 'sakit', icon: Heart, color: 'green' },
                { label: 'Semua Izin', status: 'izin', icon: FileText, color: 'yellow' },
                { label: 'Semua Alpa', status: 'alpa', icon: AlertCircle, color: 'red' }
              ].map((btn) => (
                <motion.button 
                  key={btn.status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading} 
                  onClick={() => handleBulkAction(btn.status)} 
                  className={`w-full px-3 md:px-6 py-3 md:py-4 bg-gradient-to-r from-${btn.color}-500 to-${btn.color}-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-xs md:text-sm group flex items-center justify-center space-x-1 md:space-x-2`}
                >
                  <btn.icon className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
                  <span>{btn.label}</span>
                </motion.button>
              ))}
            </div>
          </Card>

          <Card noPadding className="border-b-primary/50">
            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-1 md:mb-2 border-l-4 border-primary pl-3">Daftar Absensi</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {waliKelas.Kelas?.nama_kelas} - {new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full w-fit">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">Input Mode</span>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full">
                      <thead>
                          <tr className="border-b border-gray-200 bg-gray-50/50">
                              <th className="px-3 py-3 md:py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider w-12 text-center">No</th>
                              <th className="px-3 py-3 md:py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider w-28">NIS</th>
                              <th className="px-3 py-3 md:py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Nama Siswa</th>
                              <th className="px-3 py-3 md:py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider w-48">Kehadiran</th>
                              <th className="px-3 py-3 md:py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider w-40">Keterangan</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {students.map((student, index) => (
                            <motion.tr 
                              key={student.id} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className="transition-all duration-300 hover:bg-gray-50 border-l-4 border-transparent hover:border-primary"
                            >
                               <td className="px-3 py-3 md:py-4 whitespace-nowrap">
                                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-xl">
                                     <span className="text-primary font-bold text-sm">{student.no}</span>
                                  </div>
                               </td>
                               <td className="px-3 py-3 md:py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-700 font-medium font-mono">{student.nis}</span>
                               </td>
                               <td className="px-3 py-3 md:py-4 whitespace-nowrap">
                                  <p className="text-sm font-semibold text-gray-900">{student.nama}</p>
                               </td>
                               <td className="px-3 py-3 md:py-4">
                                  <div className="grid grid-cols-2 gap-2">
                                     {[
                                       { id: 'hadir', color: 'emerald' },
                                       { id: 'sakit', color: 'green' },
                                       { id: 'izin', color: 'yellow' },
                                       { id: 'alpa', color: 'red' }
                                     ].map(status => (
                                        <label key={status.id} className="flex items-center space-x-2 cursor-pointer group">
                                           <input type="radio" 
                                             checked={attendance[student.id]?.status === status.id}
                                             onChange={() => handleAttendanceCHANGE(student.id, 'status', status.id)}
                                             className={`w-4 h-4 focus:ring-${status.color}-500 text-${status.color}-600 cursor-pointer`} />
                                           <span className={`text-xs font-medium text-${status.color === 'emerald' ? 'emerald-700' : status.color === 'green' ? 'green-700' : status.color === 'yellow' ? 'amber-700' : 'red-700'} capitalize group-hover:opacity-70 transition-opacity`}>{status.id}</span>
                                        </label>
                                     ))}
                                  </div>
                               </td>
                               <td className="px-3 py-3 md:py-4">
                                  <input type="text" value={attendance[student.id]?.keterangan || ''}
                                     onChange={(e) => handleAttendanceChange(student.id, 'keterangan', e.target.value)}
                                     placeholder="Keterangan"
                                     className="w-full px-3 py-2 border-2 border-gray-100 focus:border-primary text-sm rounded-lg shadow-sm focus:outline-none transition-all" />
                               </td>
                            </motion.tr>
                         ))}
                      </tbody>
                  </table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-4">
                 {students.map((student, index) => (
                    <Card key={student.id} noPadding className="hover:border-l-primary border-l-4 border-l-transparent transition-all shadow-sm">
                       <div className="p-4 flex flex-col gap-4">
                          <div className="flex items-start gap-3 flex-1">
                             <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                                 <span className="text-primary font-bold text-sm">{student.no}</span>
                             </div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">{student.nama}</h4>
                                 <div className="flex items-center text-xs text-gray-600">
                                     <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                     <span className="truncate font-mono">{student.nis}</span>
                                 </div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 mt-2">
                             <div className="grid grid-cols-2 gap-2">
                                 {[
                                   { id: 'hadir', color: 'emerald' },
                                   { id: 'sakit', color: 'green' },
                                   { id: 'izin', color: 'yellow' },
                                   { id: 'alpa', color: 'red' }
                                 ].map(status => (
                                   <label key={status.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                                      <input type="radio" 
                                        checked={attendance[student.id]?.status === status.id}
                                        onChange={() => handleAttendanceChange(student.id, 'status', status.id)}
                                        className={`w-5 h-5 focus:ring-${status.color}-500 text-${status.color}-600 cursor-pointer`} />
                                      <span className={`text-xs font-medium text-${status.color === 'emerald' ? 'emerald-700' : status.color === 'green' ? 'green-700' : status.color === 'yellow' ? 'amber-700' : 'red-700'} capitalize`}>{status.id}</span>
                                   </label>
                                 ))}
                             </div>
                             <div>
                                 <label className="block text-xs font-semibold text-gray-700 mb-1">Keterangan</label>
                                 <input type="text" value={attendance[student.id]?.keterangan || ''}
                                    onChange={(e) => handleAttendanceChange(student.id, 'keterangan', e.target.value)}
                                    placeholder="Tambahkan keterangan" 
                                    className="w-full p-2 border border-gray-200 focus:border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all bg-white" />
                             </div>
                          </div>
                       </div>
                    </Card>
                 ))}
              </div>

              <div className="flex justify-end pt-6 md:pt-8 mt-4 border-t border-gray-100">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsConfirmModalOpen(true)} 
                    disabled={loading}
                    className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-right text-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-semibold transition-all duration-500 flex items-center space-x-2 md:space-x-3 shadow-lg w-full md:w-auto justify-center disabled:opacity-50 group"
                  >
                      {loading ? <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" /> : <Save className="h-5 w-5 md:h-6 md:w-6" />}
                      <span>{loading ? 'Menyimpan...' : 'Simpan Absen'}</span>
                  </motion.button>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-8 md:p-16 text-center shadow-sm">
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
            </div>
            <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Tidak ada data siswa</h4>
            <p className="text-gray-500 text-sm md:text-base">Belum ada siswa di kelas Anda atau Anda belum ditugaskan ke kelas manapun.</p>
        </Card>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full mx-auto text-center relative z-10 shadow-2xl"
            >
               <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                   <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
               </div>
               <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Konfirmasi Simpan Data</h3>
               <p className="text-gray-600 mb-6 text-sm md:text-base">
                  Simpan data absen untuk tanggal <span className="font-semibold text-primary">{new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>?
               </p>
               <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-3 sm:space-y-0">
                   <button onClick={() => setIsConfirmModalOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors order-2 sm:order-1 flex-1">
                       Batal
                   </button>
                   <button onClick={handleSaveAttendance} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold shadow-lg transition-all hover:-translate-y-0.5 order-1 sm:order-2 flex-1 flex items-center justify-center">
                       {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />}
                       Ya, Simpan
                   </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )

  // Sub-component for attendance change
  function handleAttendanceCHANGE(studentId: number, field: string, value: string) {
    handleAttendanceChange(studentId, field, value)
  }
}

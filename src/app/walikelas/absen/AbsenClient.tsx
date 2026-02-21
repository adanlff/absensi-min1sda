'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, X, Calendar, Building2, Zap, Heart, FileText, AlertCircle, Save, Users, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { SearchBox } from '@/components/ui/SearchBox'
import { Button } from '@/components/ui/Button'

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

  const bulkActions = [
    { label: 'Semua Hadir', status: 'hadir', icon: Check, className: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
    { label: 'Semua Sakit', status: 'sakit', icon: Heart, className: 'bg-green-500 hover:bg-green-600 text-white' },
    { label: 'Semua Izin', status: 'izin', icon: FileText, className: 'bg-amber-500 hover:bg-amber-600 text-white' },
    { label: 'Semua Alpa', status: 'alpa', icon: AlertCircle, className: 'bg-red-500 hover:bg-red-600 text-white' }
  ]

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

      <Card className="mb-6 md:mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900">Pilih Tanggal dan Kelas</h3>
            <p className="text-gray-500 mt-1 text-sm font-medium">Pilih tanggal untuk menginput absensi siswa</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Tanggal</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Calendar className="h-5 w-5" />
              </div>
              <input type="date" value={tanggal} max={today} onChange={(e) => setTanggal(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium" />
            </div>
            <p className="text-xs text-gray-400 mt-2 px-1">Hanya dapat menginput hingga hari ini</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Kelas</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Building2 className="h-5 w-5" />
              </div>
              <input type="text" value={waliKelas.Kelas?.nama_kelas || 'Belum ada kelas'} readOnly disabled
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-500 font-medium" />
            </div>
          </div>
        </div>
      </Card>

      {students.length > 0 ? (
        <>
          <Card className="mb-6 md:mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900">Aksi Massal</h3>
                <p className="text-gray-500 mt-1 text-sm font-medium">Tandai semua siswa dengan status yang sama</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {bulkActions.map((btn) => (
                <button 
                  key={btn.status}
                  disabled={loading} 
                  onClick={() => handleBulkAction(btn.status)} 
                  className={`w-full px-3 md:px-6 py-3 md:py-4 rounded-2xl font-bold transition-all disabled:opacity-50 text-xs md:text-sm flex items-center justify-center space-x-2 ${btn.className}`}
                >
                  <btn.icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card noPadding>
            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1">Daftar Absensi</h3>
                  <p className="text-gray-500 text-sm font-medium">
                    {waliKelas.Kelas?.nama_kelas} - {new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full w-fit">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <span className="text-sm font-bold text-gray-700">Input Mode</span>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full">
                      <thead>
                          <tr className="border-b border-gray-100">
                              <th className="px-3 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider w-12 text-center">No</th>
                              <th className="px-3 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider w-28">NIS</th>
                              <th className="px-3 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                              <th className="px-3 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider w-48">Kehadiran</th>
                              <th className="px-3 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider w-40">Keterangan</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {students.map((student, index) => (
                            <motion.tr 
                              key={student.id} 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                               <td className="px-3 py-4 whitespace-nowrap">
                                  <div className="flex items-center justify-center w-9 h-9 bg-primary/5 rounded-2xl">
                                     <span className="text-primary font-black text-sm">{student.no}</span>
                                  </div>
                               </td>
                               <td className="px-3 py-4 whitespace-nowrap">
                                  <span className="font-mono text-gray-500 font-bold tracking-wider text-sm">{student.nis}</span>
                               </td>
                               <td className="px-3 py-4 whitespace-nowrap">
                                  <p className="font-black text-gray-900 text-base">{student.nama}</p>
                               </td>
                               <td className="px-3 py-4">
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
                                             onChange={() => handleAttendanceChange(student.id, 'status', status.id)}
                                             className={`w-4 h-4 focus:ring-${status.color}-500 text-${status.color}-600 cursor-pointer`} />
                                           <span className={`text-xs font-bold text-${status.color === 'emerald' ? 'emerald-700' : status.color === 'green' ? 'green-700' : status.color === 'yellow' ? 'amber-700' : 'red-700'} capitalize`}>{status.id}</span>
                                        </label>
                                     ))}
                                  </div>
                               </td>
                               <td className="px-3 py-4">
                                  <input type="text" value={attendance[student.id]?.keterangan || ''}
                                     onChange={(e) => handleAttendanceChange(student.id, 'keterangan', e.target.value)}
                                     placeholder="Keterangan"
                                     className="w-full px-3 py-2 border border-gray-100 focus:border-primary text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium" />
                               </td>
                            </motion.tr>
                         ))}
                      </tbody>
                  </table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-4">
                 {students.map((student, index) => (
                    <div key={student.id} className="bg-gray-50/50 rounded-2xl p-4">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-start gap-3 flex-1">
                             <div className="flex items-center justify-center w-10 h-10 bg-primary/5 rounded-xl flex-shrink-0">
                                 <span className="text-primary font-black text-sm">{student.no}</span>
                             </div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="font-black text-gray-900 text-sm leading-tight mb-1 truncate">{student.nama}</h4>
                                 <div className="flex items-center text-xs text-gray-500 font-medium">
                                     <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                     <span className="truncate font-mono">{student.nis}</span>
                                 </div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                             <div className="grid grid-cols-2 gap-2">
                                 {[
                                   { id: 'hadir', color: 'emerald' },
                                   { id: 'sakit', color: 'green' },
                                   { id: 'izin', color: 'yellow' },
                                   { id: 'alpa', color: 'red' }
                                 ].map(status => (
                                   <label key={status.id} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 cursor-pointer transition-colors">
                                      <input type="radio" 
                                        checked={attendance[student.id]?.status === status.id}
                                        onChange={() => handleAttendanceChange(student.id, 'status', status.id)}
                                        className={`w-5 h-5 focus:ring-${status.color}-500 text-${status.color}-600 cursor-pointer`} />
                                      <span className={`text-xs font-bold text-${status.color === 'emerald' ? 'emerald-700' : status.color === 'green' ? 'green-700' : status.color === 'yellow' ? 'amber-700' : 'red-700'} capitalize`}>{status.id}</span>
                                   </label>
                                 ))}
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-700 mb-1">Keterangan</label>
                                 <input type="text" value={attendance[student.id]?.keterangan || ''}
                                    onChange={(e) => handleAttendanceChange(student.id, 'keterangan', e.target.value)}
                                    placeholder="Tambahkan keterangan" 
                                    className="w-full p-3 border border-gray-100 focus:border-primary rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all bg-white font-medium" />
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="flex justify-end pt-6 md:pt-8 mt-4 border-t border-gray-100">
                  <Button size="lg" onClick={() => setIsConfirmModalOpen(true)} loading={loading} icon={<Save className="h-5 w-5" />} fullWidth className="md:w-auto">
                    {loading ? 'Menyimpan...' : 'Simpan Absen'}
                  </Button>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-8 md:p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-[30px] flex items-center justify-center">
                <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">Tidak ada data siswa</h4>
            <p className="text-gray-500 text-sm font-medium">Belum ada siswa di kelas Anda atau Anda belum ditugaskan ke kelas manapun.</p>
        </Card>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              className="bg-white rounded-[40px] p-10 max-w-md w-full mx-auto text-center relative z-10 shadow-2xl"
            >
               <div className="w-20 h-20 mx-auto mb-6 bg-amber-50 rounded-[30px] flex items-center justify-center text-amber-500">
                   <AlertCircle className="h-10 w-10" />
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-3">Konfirmasi Simpan</h3>
               <p className="text-gray-500 mb-10 font-bold leading-relaxed">
                  Simpan data absen untuk tanggal <span className="text-primary">{new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>?
               </p>
               <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                   <Button variant="ghost" size="lg" fullWidth onClick={() => setIsConfirmModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700">Batal</Button>
                   <Button size="lg" fullWidth loading={loading} onClick={handleSaveAttendance} icon={<Check className="h-5 w-5" />} className="flex-1">Ya, Simpan</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

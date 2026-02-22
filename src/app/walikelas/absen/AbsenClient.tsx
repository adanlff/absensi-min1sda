'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, X, Calendar, Building2, Zap, Heart, FileText, AlertCircle, Save, Users, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { SearchBox } from '@/components/ui/SearchBox'
import { Button } from '@/components/ui/Button'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/Table'
import SweetAlert, { AlertType } from '@/components/ui/SweetAlert'

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
  const MotionTableRow = motion(TableRow)
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(initialSearch)
  const [tanggal, setTanggal] = useState(initialDate)
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

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlert({ show: true, type, title, message })
  }

  const [attendance, setAttendance] = useState<{ [key: number]: { status: string, keterangan: string } }>({})

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



  const handleBulkAction = async (status: string) => {
    setLoading(true)
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
        showAlert('success', 'Berhasil', result.message)
        const newData = { ...attendance }
        students.forEach(s => {
          if(newData[s.id]) {
            newData[s.id].status = status
          }
        })
        setAttendance(newData)
        router.refresh()
      } else {
        showAlert('error', 'Gagal', result.error || 'Gagal update absen massal')
      }
    } catch (err) {
      showAlert('error', 'Kesalahan', 'Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAttendance = async () => {
    setLoading(true)
    
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
        showAlert('success', 'Berhasil', result.message || 'Absen berhasil disimpan!')
        router.refresh()
      } else {
        showAlert('error', 'Gagal', result.error || 'Gagal menyimpan absen')
      }
    } catch (err) {
      showAlert('error', 'Kesalahan', 'Terjadi kesalahan jaringan')
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
    <>
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

      <Card className="mb-6 md:mb-8">
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Pilih Tanggal dan Kelas</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Pilih tanggal untuk menginput absensi siswa</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Tanggal</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Calendar className="h-5 w-5" />
              </div>
              <input type="date" value={tanggal} max={today} onChange={(e) => setTanggal(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 dark:text-white font-medium" />
            </div>
            <p className="text-xs text-gray-400 mt-2 px-1">Hanya dapat menginput hingga hari ini</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Kelas</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Building2 className="h-5 w-5" />
              </div>
              <input type="text" value={waliKelas.Kelas?.nama_kelas || 'Belum ada kelas'} readOnly disabled
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-medium" />
            </div>
          </div>
        </div>
      </Card>

      {students.length > 0 ? (
        <>
          <Card className="mb-6 md:mb-8">
            <div className="flex items-center space-x-4 mb-6 md:mb-8">
              <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Aksi Massal</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Tandai semua siswa dengan status yang sama</p>
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

          <Card noPadding className="mb-6 md:mb-8 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Absensi</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                      {waliKelas.Kelas?.nama_kelas} - {new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-slate-950 rounded-full w-fit">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Input Mode</span>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                  <Table>
                      <TableHeader>
                          <TableRow className="border-b border-gray-100 dark:border-slate-800">
                              <TableHead className="px-3 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12 text-center">No</TableHead>
                              <TableHead className="px-3 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">NIS</TableHead>
                              <TableHead className="px-3 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Siswa</TableHead>
                              <TableHead className="px-3 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-48">Kehadiran</TableHead>
                              <TableHead className="px-3 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">Keterangan</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                         {students.map((student, index) => (
                            <MotionTableRow 
                              key={student.id} 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors"
                            >
                               <TableCell className="px-3 py-4 whitespace-nowrap">
                                  <div className="flex items-center justify-center w-9 h-9 bg-primary/5 rounded-2xl">
                                     <span className="text-primary font-bold text-sm">{student.no}</span>
                                  </div>
                               </TableCell>
                               <TableCell className="px-3 py-4 whitespace-nowrap">
                                  <span className="font-mono text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-sm">{student.nis}</span>
                               </TableCell>
                               <TableCell className="px-3 py-4 whitespace-nowrap">
                                  <p className="font-semibold text-gray-900 dark:text-white text-base">{student.nama}</p>
                               </TableCell>
                               <TableCell className="px-3 py-4">
                                  <div className="grid grid-cols-2 gap-2">
                                     {[
                                       { id: 'hadir', color: 'emerald' },
                                       { id: 'sakit', color: 'green' },
                                       { id: 'izin', color: 'amber' },
                                       { id: 'alpa', color: 'red' }
                                     ].map(status => (
                                        <label key={status.id} className="flex items-center space-x-2 cursor-pointer group">
                                           <input type="radio" 
                                             checked={attendance[student.id]?.status === status.id}
                                             onChange={() => handleAttendanceChange(student.id, 'status', status.id)}
                                             className={`w-4 h-4 focus:ring-${status.color}-500 text-${status.color}-600 dark:text-${status.color}-400 cursor-pointer`} />
                                           <span className={`text-xs font-bold text-${status.color === 'emerald' ? 'emerald-700 dark:text-emerald-400' : status.color === 'green' ? 'green-700 dark:text-green-400' : status.color === 'amber' ? 'amber-700 dark:text-amber-400' : 'red-700 dark:text-red-400'} capitalize`}>{status.id}</span>
                                        </label>
                                     ))}
                                  </div>
                               </TableCell>
                               <TableCell className="px-3 py-4">
                                  <input type="text" value={attendance[student.id]?.keterangan || ''}
                                     onChange={(e) => handleAttendanceChange(student.id, 'keterangan', e.target.value)}
                                     placeholder="Keterangan"
                                     className="w-full px-3 py-2 border border-gray-100 dark:border-slate-800 focus:border-primary text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all bg-transparent text-gray-900 dark:text-white font-medium" />
                               </TableCell>
                            </MotionTableRow>
                         ))}
                      </TableBody>
                  </Table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-4">
                 {students.map((student, index) => (
                    <div key={student.id} className="bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-transparent dark:border-slate-800">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-start gap-3 flex-1">
                             <div className="flex items-center justify-center w-10 h-10 bg-primary/5 rounded-xl flex-shrink-0">
                                 <span className="text-primary font-bold text-sm">{student.no}</span>
                             </div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1 truncate">{student.nama}</h4>
                                 <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                                     <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                     <span className="truncate font-mono">{student.nis}</span>
                                 </div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                             <div className="grid grid-cols-2 gap-2">
                                 {[
                                   { id: 'hadir', color: 'emerald' },
                                   { id: 'sakit', color: 'green' },
                                   { id: 'izin', color: 'amber' },
                                   { id: 'alpa', color: 'red' }
                                 ].map(status => (
                                   <label key={status.id} className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 cursor-pointer transition-colors">
                                      <input type="radio" 
                                        checked={attendance[student.id]?.status === status.id}
                                        onChange={() => handleAttendanceChange(student.id, 'status', status.id)}
                                        className={`w-5 h-5 focus:ring-${status.color}-500 text-${status.color}-600 dark:text-${status.color}-400 cursor-pointer`} />
                                      <span className={`text-xs font-bold text-${status.color === 'emerald' ? 'emerald-700 dark:text-emerald-400' : status.color === 'green' ? 'green-700 dark:text-green-400' : status.color === 'amber' ? 'amber-700 dark:text-amber-400' : 'red-700 dark:text-red-400'} capitalize`}>{status.id}</span>
                                   </label>
                                 ))}
                             </div>
                             <div>
                                 <label className="block text-xs font-semibold text-gray-700 mb-1">Keterangan</label>
                                 <input type="text" value={attendance[student.id]?.keterangan || ''}
                                    onChange={(e) => handleAttendanceChange(student.id, 'keterangan', e.target.value)}
                                    placeholder="Tambahkan keterangan" 
                                    className="w-full p-3 border border-gray-100 dark:border-slate-800 focus:border-primary rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-medium" />
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="flex justify-end pt-6 md:pt-8 mt-4 border-t border-gray-100 dark:border-slate-800">
                  <Button size="lg" onClick={handleSaveAttendance} loading={loading} icon={<Save className="h-5 w-5" />} fullWidth className="md:w-auto">
                    {loading ? 'Menyimpan...' : 'Simpan Absen'}
                  </Button>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-12 md:p-20 text-center">
            <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 w-fit mx-auto mb-6">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Tidak ada data siswa</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-md mx-auto">
              Belum ada siswa di kelas Anda atau Anda belum ditugaskan ke kelas manapun.
            </p>
        </Card>
      )}


    </div>

    <SweetAlert
      type={alert.type}
      title={alert.title}
      message={alert.message}
      show={alert.show}
      onClose={() => setAlert({ ...alert, show: false })}
    />
    </>
  )
}

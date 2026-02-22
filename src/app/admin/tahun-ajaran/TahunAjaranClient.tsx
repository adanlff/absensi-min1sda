'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Plus, Calendar, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import SweetAlert from '@/components/ui/SweetAlert'

export default function TahunAjaranClient({ data }: { data: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tahun, setTahun] = useState('')
  const [openSemesterForms, setOpenSemesterForms] = useState<Record<number, boolean>>({})

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

  const toggleSemesterForm = (id: number) => {
    setOpenSemesterForms(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAction = async (payload: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/tahun-ajaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (res.ok) {
        if (payload.action === 'create') setTahun('')
        if (payload.action === 'create_semester') {
           setOpenSemesterForms(prev => ({ ...prev, [payload.id_tahun_ajaran]: false }))
        }
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

  return (
    <>
      <SweetAlert 
        show={alertConfig.show}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))}
      />

      {/* Create Tahun Ajaran Card */}
      <Card className="mb-8 md:mb-12">
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
            <Plus className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Buat Tahun Ajaran Baru</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Tambahkan periode akademik baru dan aktifkan secara otomatis</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'create', tahun }) }} className="flex flex-col md:flex-row items-start gap-4 flex-wrap">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Tahun Ajaran</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Calendar className="h-5 w-5" />
              </div>
              <input type="text" value={tahun} onChange={(e) => setTahun(e.target.value)} placeholder="Contoh: 2024/2025"
                     className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 dark:text-white font-medium shadow-sm"
                     required pattern="[0-9]{4}/[0-9]{4}" />
            </div>
            <p className="text-xs text-gray-400 mt-2 px-1">Format: YYYY/YYYY (contoh: 2024/2025)</p>
          </div>
          <div className="w-full md:w-auto md:mt-[28px]">
            <Button type="submit" size="lg" loading={loading} icon={<Zap className="h-5 w-5" />} fullWidth className="md:w-auto">
              {loading ? 'Memproses...' : 'Buat & Aktifkan'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Daftar Tahun Ajaran */}
      <Card>
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Tahun Ajaran & Semester</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Total {data.length} tahun ajaran terdaftar</p>
          </div>
        </div>

        <div className="space-y-6">
          {data.map((ta, index) => (
            <motion.div 
              key={ta.id} 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border border-gray-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white">{ta.tahun}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{ta.semesters.length} semester</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                  {ta.status === 'aktif' ? (
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold justify-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Aktif
                    </span>
                  ) : (
                    <>
                      <span className="bg-gray-50 border border-gray-100 text-gray-500 inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold justify-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        Non-aktif
                      </span>
                      <Button size="sm" variant="success" loading={loading} onClick={() => handleAction({ action: 'activate', id: ta.id })} icon={<Zap className="h-4 w-4" />}>
                        Aktifkan
                      </Button>
                    </>
                  )}
                  
                  <Button onClick={() => toggleSemesterForm(ta.id)} icon={<Plus className="h-5 w-5" />}>
                    Tambah Semester
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {openSemesterForms[ta.id] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50/50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 mt-4 overflow-hidden"
                  >
                    <h5 className="text-lg font-black text-gray-900 dark:text-white mb-4">Tambah Semester Baru</h5>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      handleAction({
                        action: 'create_semester',
                        id_tahun_ajaran: ta.id,
                        jenis_semester: fd.get('jenis_semester'),
                        tanggal_mulai: fd.get('tanggal_mulai'),
                        tanggal_selesai: fd.get('tanggal_selesai')
                      });
                    }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Jenis Semester</label>
                        <select name="jenis_semester" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none text-sm text-gray-900 dark:text-white font-medium appearance-none" required>
                          <option value="">Pilih Semester</option>
                          <option value="ganjil">Ganjil</option>
                          <option value="genap">Genap</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Tanggal Mulai</label>
                        <input type="date" name="tanggal_mulai" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none text-sm text-gray-900 dark:text-white font-medium shadow-sm" required />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Tanggal Selesai</label>
                        <input type="date" name="tanggal_selesai" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none text-sm text-gray-900 dark:text-white font-medium shadow-sm" required />
                      </div>

                      <div className="flex items-end">
                        <Button type="submit" size="sm" fullWidth loading={loading}>
                          {loading ? 'Memproses...' : 'Buat Semester'}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {ta.semesters.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h5 className="text-base font-black text-gray-900 dark:text-white">Daftar Semester</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ta.semesters.map((semester: any, sIdx: number) => (
                       <motion.div 
                        key={semester.id} 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sIdx * 0.03 }}
                        className="bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl hover:shadow-sm transition-all"
                       >
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                           <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                               <span className="text-white font-black text-sm">
                                 {semester.jenis_semester.charAt(0).toUpperCase()}
                               </span>
                             </div>
                             <div className="min-w-0 flex-1">
                               <h6 className="font-bold text-gray-900 dark:text-white text-sm">Semester {semester.jenis_semester.charAt(0).toUpperCase() + semester.jenis_semester.slice(1)}</h6>
                               <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                                 {new Date(semester.tanggal_mulai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} - 
                                 {new Date(semester.tanggal_selesai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}
                               </p>
                             </div>
                           </div>

                           <div className="flex items-center">
                             {semester.status === 'aktif' ? (
                                <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Aktif
                                </span>
                             ) : (
                                <Button size="sm" variant="success" loading={loading} onClick={() => handleAction({ action: 'activate_semester', id: semester.id })} icon={<Zap className="h-3 w-3" />}>
                                  Aktifkan
                                </Button>
                             )}
                           </div>
                         </div>
                       </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </>
  )
}

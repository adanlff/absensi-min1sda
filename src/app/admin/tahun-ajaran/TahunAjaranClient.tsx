'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Plus, Calendar, Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TahunAjaranClient({ data }: { data: any[] }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tahun, setTahun] = useState('')
  const [openSemesterForms, setOpenSemesterForms] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  const toggleSemesterForm = (id: number) => {
    setOpenSemesterForms(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAction = async (payload: any) => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await fetch('/api/admin/tahun-ajaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (res.ok) {
        setMessage(result.message)
        if (payload.action === 'create') setTahun('')
        if (payload.action === 'create_semester') {
           setOpenSemesterForms(prev => ({ ...prev, [payload.id_tahun_ajaran]: false }))
        }
        router.refresh()
      } else {
        setError(result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      setError('Terjadi kesalahan pada jaringan')
    } finally {
      setLoading(false)
    }
  }

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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-8 md:mb-12 transition-all hover:border-primary/20 relative overflow-hidden group shadow-lg"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-secondary flex-shrink-0"
          >
            <Plus className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">Buat Tahun Ajaran Baru</h3>
            <p className="text-gray-600 text-sm md:text-base mt-1">Tambahkan periode akademik baru dan aktifkan secara otomatis</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'create', tahun }) }} className="relative z-10 flex flex-col md:flex-row items-center gap-4 flex-wrap">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Tahun Ajaran</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <input type="text" value={tahun} onChange={(e) => setTahun(e.target.value)} placeholder="Contoh: 2024/2025"
                     className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base md:text-lg"
                     required pattern="[0-9]{4}/[0-9]{4}" />
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Format: YYYY/YYYY (contoh: 2024/2025)</p>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-[30px]">
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-br from-primary to-secondary text-white w-full md:w-auto px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-lg font-semibold transition-all duration-300 shadow-lg justify-center disabled:opacity-50 relative overflow-hidden group"
             >
                 <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%] z-0" />
                 {loading ? <Loader2 className="h-4 w-4 md:h-6 md:w-6 animate-spin relative z-10" /> : <Zap className="h-4 w-4 md:h-6 md:w-6 relative z-10" />}
                 <span className="relative z-10">{loading ? 'Memproses...' : 'Buat & Aktifkan'}</span>
             </motion.button>
          </div>
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-1 shadow-xl"
      >
        <div className="overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Daftar Tahun Ajaran & Semester</h3>
                <p className="text-gray-600 text-sm md:text-base">Total {data.length} tahun ajaran terdaftar</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {data.map((ta, index) => (
                <motion.div 
                  key={ta.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 hover:border-primary/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                    <div className="flex items-center space-x-3 md:space-x-4 w-full md:w-auto">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-secondary rounded-lg md:rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm md:text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-bold text-gray-900">{ta.tahun}</h4>
                        <p className="text-xs md:text-sm text-gray-500">{ta.semesters.length} semester</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                      {ta.status === 'aktif' ? (
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 inline-flex items-center px-4 py-2 rounded-full text-xs md:text-sm font-semibold justify-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                          Aktif
                        </span>
                      ) : (
                        <>
                          <span className="bg-gray-50 border border-gray-200 text-gray-700 inline-flex items-center px-4 py-2 rounded-full text-xs md:text-sm font-semibold justify-center">
                            <XCircle className="h-4 w-4 mr-2 text-gray-400" />
                            Non-aktif
                          </span>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction({ action: 'activate', id: ta.id })} 
                            disabled={loading}
                            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs md:text-sm font-semibold rounded-xl shadow-md disabled:opacity-50"
                          >
                            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                            Aktifkan
                          </motion.button>
                        </>
                      )}
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSemesterForm(ta.id)} 
                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs md:text-sm font-semibold rounded-xl shadow-md"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Semester
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {openSemesterForms[ta.id] && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6 mt-4 overflow-hidden"
                      >
                        <h5 className="text-base md:text-lg font-bold text-gray-900 mb-4">Tambah Semester Baru</h5>
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
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Jenis Semester</label>
                            <select name="jenis_semester" className="w-full px-3 py-2 rounded-lg md:rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base bg-white" required>
                              <option value="">Pilih Semester</option>
                              <option value="ganjil">Ganjil</option>
                              <option value="genap">Genap</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai</label>
                            <input type="date" name="tanggal_mulai" className="w-full px-3 py-2 rounded-lg md:rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base bg-white" required />
                          </div>

                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Tanggal Selesai</label>
                            <input type="date" name="tanggal_selesai" className="w-full px-3 py-2 rounded-lg md:rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base bg-white" required />
                          </div>

                          <div className="flex items-end">
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit" 
                              disabled={loading} 
                              className="w-full bg-gradient-to-br from-primary to-secondary text-white px-4 py-2 rounded-lg md:rounded-xl text-sm font-semibold shadow-md disabled:opacity-50 flex items-center justify-center min-h-[40px]"
                            >
                              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Buat Semester'}
                            </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {ta.semesters.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h5 className="text-base md:text-lg font-semibold text-gray-900">Daftar Semester</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {ta.semesters.map((semester: any, sIdx: number) => (
                           <motion.div 
                            key={semester.id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (index * 0.05) + (sIdx * 0.05) }}
                            className="bg-gray-50 border border-gray-200 p-3 md:p-4 rounded-xl hover:border-primary/30 transition-colors shadow-sm"
                           >
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                               <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xs md:text-sm">
                                   {semester.jenis_semester.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="min-w-0 flex-1">
                                   <h6 className="font-semibold text-gray-900 text-sm md:text-base truncate">Semester {semester.jenis_semester.charAt(0).toUpperCase() + semester.jenis_semester.slice(1)}</h6>
                                   <p className="text-xs text-gray-600 truncate">
                                     {new Date(semester.tanggal_mulai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} - 
                                     {new Date(semester.tanggal_selesai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}
                                   </p>
                                 </div>
                               </div>

                               <div className="flex items-center">
                                 {semester.status === 'aktif' ? (
                                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Aktif
                                    </span>
                                 ) : (
                                    <motion.button 
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleAction({ action: 'activate_semester', id: semester.id })} 
                                      disabled={loading}
                                      className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-sm disabled:opacity-50 whitespace-nowrap flex items-center"
                                    >
                                        {loading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Zap className="h-3 w-3 mr-1" />}
                                        Aktifkan
                                    </motion.button>
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
          </div>
        </div>
      </motion.div>
    </>
  )
}

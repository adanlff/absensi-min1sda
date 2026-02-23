'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Calendar, CheckCircle2, XCircle, Zap, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import SweetAlert, { AlertType } from '@/components/ui/SweetAlert'
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown'

export default function TahunAjaranClient({ data }: { data: any[] }) {
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
    action: () => { }
  })

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlert({ show: true, type, title, message })
  }
  const [tahun, setTahun] = useState('')
  const [openSemesterForms, setOpenSemesterForms] = useState<Record<number, boolean>>({})



  const [semesterJenis, setSemesterJenis] = useState('')

  const toggleSemesterForm = (id: number) => {
    setOpenSemesterForms(prev => ({ ...prev, [id]: !prev[id] }))
    setSemesterJenis('') // Reset selection when form toggles
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
        showAlert('success', 'Berhasil', result.message)
        if (payload.action === 'create') setTahun('')
        if (payload.action === 'create_semester') {
           setOpenSemesterForms(prev => ({ ...prev, [payload.id_tahun_ajaran]: false }))
        }
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

  return (
    <>
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
                     className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-medium shadow-sm"
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
      <Card noPadding className="mb-8 md:mb-12 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center space-x-4 mb-6 md:mb-8">
            <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Tahun Ajaran & Semester</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Kelola semua periode akademik dan aktivasi semester</p>
            </div>
          </div>

        <div className="space-y-6">
          {data.map((ta, index) => (
            <motion.div 
              key={ta.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 md:p-6 rounded-[32px] border transition-all ${ta.status === 'aktif' ? 'bg-white dark:bg-slate-800 border-primary/20 ring-1 ring-primary/5 shadow-lg shadow-primary/5' : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md'}`}
            >
              {/* Year Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${ta.status === 'aktif' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{ta.tahun}</h4>
                    <div className="flex items-center mt-1 space-x-3">
                      {ta.status === 'aktif' ? (
                        <span className="flex items-center px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1.5" />
                          Aktif
                        </span>
                      ) : (
                        <span className="flex items-center px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-500 text-xs font-bold uppercase tracking-wider rounded-full">
                          <XCircle className="w-3 h-3 mr-1.5" />
                          Non-aktif
                        </span>
                      )}
                      <span className="text-sm text-gray-400 font-bold">{ta.semesters.length} Semester</span>
                    </div>
                  </div>
                </div>

                  <div className="flex items-center gap-3">
                    {ta.status !== 'aktif' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="success" 
                          loading={loading} 
                          onClick={() => handleAction({ action: 'activate', id: ta.id })} 
                          icon={<Zap className="h-4 w-4" />}
                          className="rounded-xl"
                        >
                          Aktifkan Tahun
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          loading={loading} 
                          onClick={() => {
                            setConfirmConfig({
                              show: true,
                              title: 'Hapus Tahun Ajaran',
                              message: `Apakah Anda yakin ingin menghapus Tahun Ajaran ${ta.tahun}? Seluruh data semester di dalamnya juga akan terhapus.`,
                              action: () => handleAction({ action: 'delete_tahun', id: ta.id })
                            })
                          }} 
                          icon={<Trash2 className="h-4 w-4 text-red-500" />}
                          className="rounded-xl hover:bg-red-50"
                        />
                      </>
                    )}
                    <Button 
                      onClick={() => toggleSemesterForm(ta.id)} 
                      icon={<Plus className="h-5 w-5" />}
                      variant={openSemesterForms[ta.id] ? 'ghost' : 'primary'}
                      className="rounded-xl"
                    >
                      {openSemesterForms[ta.id] ? 'Tutup Form' : 'Tambah Semester'}
                    </Button>
                  </div>
              </div>

              {/* Add Semester Form Container */}
              <AnimatePresence>
                {openSemesterForms[ta.id] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-6 md:p-8 bg-gray-50 dark:bg-slate-950/50 rounded-[28px] border border-gray-100 dark:border-slate-800 overflow-hidden"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <Plus className="h-4 w-4 text-primary" />
                      </div>
                      <h5 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Semester Baru</h5>
                    </div>
                    
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
                    }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Jenis Semester</label>
                        <input type="hidden" name="jenis_semester" value={semesterJenis} required />
                        <Dropdown 
                          placeholder="Pilih Semester"
                          value={semesterJenis}
                          options={[
                            { value: 'ganjil', label: 'Ganjil' },
                            { value: 'genap', label: 'Genap' }
                          ]}
                          onChange={(val) => setSemesterJenis(val)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Tanggal Mulai</label>
                        <input type="date" name="tanggal_mulai" className="w-full px-4 py-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:outline-none transition-all text-sm text-gray-900 dark:text-white font-bold" required />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Tanggal Selesai</label>
                        <input type="date" name="tanggal_selesai" className="w-full px-4 py-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:outline-none transition-all text-sm text-gray-900 dark:text-white font-bold" required />
                      </div>

                      <div className="flex items-end">
                        <Button type="submit" loading={loading} fullWidth className="h-[52px] rounded-xl">
                          {loading ? 'Memproses...' : 'Buat Semester'}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Semester Grid */}
              {ta.semesters.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Daftar Semester</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ta.semesters.map((semester: any, sIdx: number) => (
                       <motion.div 
                        key={semester.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + sIdx * 0.05 }}
                        className={`group p-4 rounded-[24px] border transition-all ${semester.status === 'aktif' ? 'bg-white dark:bg-slate-800 border-primary/20 ring-1 ring-primary/5' : 'bg-gray-50/30 dark:bg-slate-950/30 border-transparent hover:border-gray-200 dark:hover:border-slate-800'}`}
                       >
                         <div className="flex items-center justify-between gap-3">
                           <div className="flex items-center space-x-3 min-w-0">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${semester.status === 'aktif' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                               <span className="font-bold text-base">
                                 {semester.jenis_semester.charAt(0).toUpperCase()}
                               </span>
                             </div>
                             <div className="min-w-0">
                               <h6 className="font-bold text-gray-900 dark:text-white text-sm">Semester {semester.jenis_semester.charAt(0).toUpperCase() + semester.jenis_semester.slice(1)}</h6>
                               <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 font-bold space-x-2">
                                 <Calendar className="h-3 w-3" />
                                 <span className="truncate">
                                   {new Date(semester.tanggal_mulai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'})} - {new Date(semester.tanggal_selesai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}
                                 </span>
                               </div>
                             </div>
                           </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {semester.status === 'aktif' ? (
                                 <div className="flex flex-col items-end">
                                   <span className="flex items-center px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                     Aktif
                                   </span>
                                 </div>
                              ) : (
                                 <button 
                                   onClick={() => handleAction({ action: 'activate_semester', id: semester.id })}
                                   disabled={loading}
                                   className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-400 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all rounded-xl disabled:opacity-50"
                                   title="Aktifkan Semester"
                                 >
                                   <Zap className="h-5 w-5" />
                                 </button>
                              )}
                              <button 
                                onClick={() => {
                                  setConfirmConfig({
                                    show: true,
                                    title: 'Hapus Semester',
                                    message: `Apakah Anda yakin ingin menghapus Semester ${semester.jenis_semester} pada tahun ajaran ${ta.tahun}?`,
                                    action: () => handleAction({ action: 'delete_semester', id: semester.id })
                                  })
                                }}
                                disabled={loading}
                                className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-400 hover:text-red-500 hover:border-red-200 hover:shadow-md transition-all rounded-xl disabled:opacity-50"
                                title="Hapus Semester"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
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
    </Card>

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
              confirmConfig.action();
              setConfirmConfig({ ...confirmConfig, show: false });
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

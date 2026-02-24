'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Calendar, CheckCircle2, XCircle, Zap, Trash2, Pencil, Save, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StaggeredDropDown } from '@/components/ui/StaggeredDropDown'
import SweetAlert, { AlertType } from '@/components/ui/SweetAlert'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { BookOpen } from 'lucide-react'

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
  const [semesterTypes, setSemesterTypes] = useState<Record<number, string>>({})
  const [editingSemesterId, setEditingSemesterId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState({ tanggal_mulai: '', tanggal_selesai: '' })



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
      <Card className="mb-8 md:mb-12 shadow-none">
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
                     className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-medium"
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
      <Card noPadding className="mb-8 md:mb-12 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 shadow-none">
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
              className="bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-none"
            >
              {/* Year Group Header */}
              <div className={`p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${ta.status === 'aktif' ? 'bg-primary/[0.03] dark:bg-primary/[0.05]' : 'bg-gray-50/50 dark:bg-slate-950/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${ta.status === 'aktif' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{ta.tahun}</h4>
                      {ta.status === 'aktif' ? (
                        <span className="flex items-center px-4 py-1.5 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                          Tahun Aktif
                        </span>
                      ) : (
                        <span className="flex items-center px-4 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                          <XCircle className="w-3.5 h-3.5 mr-2" />
                          Selesai
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">{ta.semesters.length} Semester Terdaftar</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ta.status !== 'aktif' && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="danger" 
                        loading={loading} 
                        onClick={() => {
                          setConfirmConfig({
                            show: true,
                            title: 'Hapus Tahun Ajaran',
                            message: `Apakah Anda yakin ingin menghapus Tahun Ajaran ${ta.tahun}? Seluruh data semester di dalamnya juga akan terhapus.`,
                            action: () => handleAction({ action: 'delete_tahun', id: ta.id })
                          })
                        }} 
                        icon={<Trash2 className="h-5 w-5" />}
                        className="h-[42px] w-[42px] p-0 rounded-xl"
                      />
                      <Button 
                        size="md" 
                        variant="primary" 
                        loading={loading} 
                        onClick={() => handleAction({ action: 'activate', id: ta.id })} 
                        icon={<Zap className="h-5 w-5" />}
                        className="h-[42px] rounded-xl font-bold px-5 text-sm"
                      >
                        Aktifkan
                      </Button>
                    </div>
                  )}
                  <Button 
                    variant={openSemesterForms[ta.id] ? 'ghost' : 'primary'}
                    size="md"
                    onClick={() => toggleSemesterForm(ta.id)} 
                    icon={<Plus className="h-5 w-5" />}
                    className="h-[42px] rounded-xl font-bold px-5 text-sm"
                  >
                    {openSemesterForms[ta.id] ? 'Tutup' : 'Tambah Semester'}
                  </Button>
                </div>
              </div>

              {/* Add Semester Form */}
              <AnimatePresence>
                {openSemesterForms[ta.id] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-gray-100 dark:border-slate-800 bg-primary/[0.02] dark:bg-primary/[0.04]"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-xl">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white">Form Semester Baru</h5>
                      </div>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        handleAction({
                          action: 'create_semester',
                          id_tahun_ajaran: ta.id,
                          jenis_semester: semesterTypes[ta.id] || '',
                          tanggal_mulai: fd.get('tanggal_mulai'),
                          tanggal_selesai: fd.get('tanggal_selesai')
                        });
                      }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Jenis Semester</label>
                          <StaggeredDropDown
                            required
                            value={semesterTypes[ta.id] || ''}
                            onChange={(val) => setSemesterTypes(prev => ({ ...prev, [ta.id]: val }))}
                            placeholder="Pilih Semester"
                            options={[
                              { value: 'ganjil', label: 'Ganjil' },
                              { value: 'genap', label: 'Genap' },
                            ]}
                            triggerClassName="w-full px-4 py-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:outline-none transition-all text-sm text-gray-900 dark:text-white font-bold"
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
                          <Button type="submit" loading={loading} fullWidth className="h-[54px] rounded-xl font-bold">
                            Buat Semester
                          </Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Semester Table Implementation */}
              <div className="p-4 md:p-6">
                {ta.semesters.length > 0 ? (
                  <div className="overflow-x-auto rounded-[24px] border border-gray-100 dark:border-slate-800">
                    <Table className="table-fixed w-full">
                      <TableHeader className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
                        <TableRow>
                          <TableHead className="w-[25%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                            <div className="flex items-center justify-center">Jenis Semester</div>
                          </TableHead>
                          <TableHead className="w-[40%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                            <div className="flex items-center justify-center">Periode</div>
                          </TableHead>
                          <TableHead className="w-[15%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                            <div className="flex items-center justify-center">Status</div>
                          </TableHead>
                          <TableHead className="w-[20%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                            <div className="flex items-center justify-center">Aksi</div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ta.semesters.map((semester: any, sIdx: number) => (
                          <TableRow key={semester.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <TableCell className="py-4 text-left pl-6">
                              <span className="font-bold text-gray-900 dark:text-white capitalize text-sm">
                                Semester {semester.jenis_semester}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                              {editingSemesterId === semester.id ? (
                                <div className="flex items-center justify-center gap-2">
                                  <input 
                                    type="date" 
                                    value={editFormData.tanggal_mulai}
                                    onChange={(e) => setEditFormData({ ...editFormData, tanggal_mulai: e.target.value })}
                                    className="px-2 py-1 text-xs font-bold rounded-lg border border-primary/30 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 w-[110px]"
                                  />
                                  <span className="text-gray-300">-</span>
                                  <input 
                                    type="date" 
                                    value={editFormData.tanggal_selesai}
                                    onChange={(e) => setEditFormData({ ...editFormData, tanggal_selesai: e.target.value })}
                                    className="px-2 py-1 text-xs font-bold rounded-lg border border-primary/30 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/20 w-[110px]"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                                  {new Date(semester.tanggal_mulai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'})} - {new Date(semester.tanggal_selesai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-4 text-center">
                              {semester.status === 'aktif' ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-white text-primary border border-primary uppercase tracking-tighter">
                                  Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-400 uppercase tracking-tighter">
                                  Pending
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center justify-center gap-2">
                                {editingSemesterId === semester.id ? (
                                  <>
                                    <Button 
                                      variant="success"
                                      onClick={async () => {
                                        await handleAction({ 
                                          action: 'update_semester', 
                                          id: semester.id, 
                                          ...editFormData 
                                        });
                                        setEditingSemesterId(null);
                                      }}
                                      disabled={loading}
                                      icon={<Save className="h-4 w-4" />}
                                      className="h-9 w-9 p-0 rounded-xl"
                                      title="Simpan Perubahan"
                                    />
                                    <Button 
                                      variant="ghost"
                                      onClick={() => setEditingSemesterId(null)}
                                      disabled={loading}
                                      icon={<X className="h-4 w-4" />}
                                      className="h-9 w-9 p-0 rounded-xl text-gray-400 hover:bg-gray-100"
                                      title="Batal"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Button 
                                      variant="ghost"
                                      onClick={() => {
                                        setEditingSemesterId(semester.id);
                                        setEditFormData({
                                          tanggal_mulai: new Date(semester.tanggal_mulai).toISOString().split('T')[0],
                                          tanggal_selesai: new Date(semester.tanggal_selesai).toISOString().split('T')[0]
                                        });
                                      }}
                                      disabled={loading}
                                      icon={<Pencil className="h-4 w-4" />}
                                      className="h-9 w-9 p-0 rounded-xl text-primary hover:bg-emerald-500 hover:text-white"
                                      title="Edit Tanggal"
                                    />
                                    {semester.status !== 'aktif' && (
                                      <Button 
                                        variant="ghost"
                                        onClick={() => handleAction({ action: 'activate_semester', id: semester.id })}
                                        disabled={loading}
                                        icon={<Zap className="h-4 w-4" />}
                                        className="h-9 w-9 p-0 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                        title="Aktifkan Semester"
                                      />
                                    )}
                                    <Button 
                                      variant="ghost"
                                      onClick={() => {
                                        setConfirmConfig({
                                          show: true,
                                          title: 'Hapus Semester',
                                          message: `Apakah Anda yakin ingin menghapus Semester ${semester.jenis_semester} pada tahun ajaran ${ta.tahun}?`,
                                          action: () => handleAction({ action: 'delete_semester', id: semester.id })
                                        })
                                      }}
                                      disabled={loading}
                                      icon={<Trash2 className="h-4 w-4" />}
                                      className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500 hover:text-white"
                                      title="Hapus Semester"
                                    />
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl">
                    <p className="text-gray-400 dark:text-gray-500 font-bold text-sm italic">Belum ada semester yang dibuat.</p>
                  </div>
                )}
              </div>
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

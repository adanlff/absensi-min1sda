'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Calendar, CheckCircle2, XCircle, Zap, Trash2, Pencil, Save, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Buat Tahun Ajaran Baru</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">Tambahkan periode akademik baru dan aktifkan secara otomatis</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAction({ action: 'create', tahun }) }} className="flex flex-col md:flex-row items-end gap-4 w-full">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Tahun Ajaran</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Calendar className="h-5 w-5" />
              </div>
              <input type="text" value={tahun} onChange={(e) => setTahun(e.target.value)} placeholder="Contoh: 2024/2025"
                     className="block w-full h-[52px] pl-12 pr-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-medium shadow-none"
                     required pattern="[0-9]{4}/[0-9]{4}" />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <Button type="submit" size="lg" loading={loading} icon={<Zap className="h-5 w-5" />} fullWidth className="md:w-auto h-[52px] rounded-2xl font-bold text-base px-8">
              {loading ? 'Memproses...' : 'Buat & Aktifkan'}
            </Button>
          </div>
        </form>
        <p className="text-xs text-gray-400 mt-4 px-1">Format: YYYY/YYYY (contoh: 2024/2025)</p>
      </Card>

      {/* Daftar Tahun Ajaran */}
      <Card noPadding className="mb-8 md:mb-12 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 shadow-none">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Tahun Ajaran</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">Kelola semua periode akademik dan aktivasi semester</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {data.map((ta, index) => (
              <motion.div 
                key={ta.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-none"
              >
                {/* Year Group Header */}
                <div className={`p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 ${ta.status === 'aktif' ? 'bg-primary/[0.03] dark:bg-primary/[0.05]' : 'bg-gray-50/10 dark:bg-slate-950/50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${ta.status === 'aktif' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'}`}>
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{ta.tahun}</h4>
                        {ta.status === 'aktif' ? (
                          <span className="flex items-center px-2 py-0.5 bg-white text-primary text-[7px] md:text-[9px] font-black uppercase tracking-[0.1em] rounded-full border border-primary/30 whitespace-nowrap">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                            Tahun Aktif
                          </span>
                        ) : (
                          <span className="flex items-center px-2 py-0.5 bg-gray-200/50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 text-[7px] md:text-[9px] font-black uppercase tracking-[0.1em] rounded-full whitespace-nowrap">
                            <XCircle className="w-2.5 h-2.5 mr-1" />
                            Selesai
                          </span>
                        )}
                      </div>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">{ta.semesters.length} Semester Terdaftar</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    {ta.status !== 'aktif' && (
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button 
                          variant="danger" 
                          loading={loading} 
                          onClick={() => {
                            setConfirmConfig({
                              show: true,
                              title: 'Hapus Tahun Ajaran',
                              message: `Apakah Anda yakin ingin menghapus Tahun Ajaran ${ta.tahun}?`,
                              action: () => handleAction({ action: 'delete_tahun', id: ta.id })
                            })
                          }} 
                          icon={<Trash2 className="h-5 w-5" />}
                          className="h-[52px] w-[52px] p-0 rounded-2xl shadow-none flex-shrink-0"
                        />
                        <Button 
                          size="md" 
                          variant="primary" 
                          loading={loading} 
                          onClick={() => handleAction({ action: 'activate', id: ta.id })} 
                          icon={<Zap className="h-5 w-5" />}
                          className="h-[52px] rounded-2xl font-bold px-7 text-sm shadow-none w-full md:w-auto"
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
                      className="h-[52px] rounded-2xl font-bold px-7 text-sm shadow-none w-full md:w-auto"
                    >
                      {openSemesterForms[ta.id] ? 'Batal' : 'Tambah Semester'}
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
                      className="border-t border-gray-100 dark:border-slate-800 bg-primary/[0.02] dark:bg-primary/[0.04]"
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex items-center space-x-3 mb-8">
                          <div className="p-2.5 bg-primary/10 rounded-xl">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h5 className="text-xl font-bold text-gray-900 dark:text-white">Buat Semester</h5>
                            <p className="text-xs text-gray-500 font-medium">Tentukan periode semester untuk {ta.tahun}</p>
                          </div>
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
                              triggerClassName="w-full h-[52px] px-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:outline-none transition-all text-sm text-gray-900 dark:text-white font-bold shadow-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Tanggal Mulai</label>
                            <input type="date" name="tanggal_mulai" className="w-full h-[52px] px-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:outline-none transition-all text-sm text-gray-900 dark:text-white font-bold shadow-none" required />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Tanggal Selesai</label>
                            <input type="date" name="tanggal_selesai" className="w-full h-[52px] px-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:outline-none transition-all text-sm text-gray-900 dark:text-white font-bold shadow-none" required />
                          </div>

                          <div className="flex items-end">
                            <Button type="submit" loading={loading} fullWidth className="h-[52px] rounded-2xl font-bold shadow-none">
                              Simpan Semester
                            </Button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Semester List Implementation */}
                <div className="p-4 md:p-6 lg:p-8 border-t border-gray-100 dark:border-slate-800">
                  {ta.semesters.length > 0 ? (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto rounded-[24px] border border-gray-100 dark:border-slate-800">
                        <Table className="table-fixed w-full">
                          <TableHeader className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
                            <TableRow>
                              <TableHead className="w-[25%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                                <div className="flex items-center justify-center">Jenis Semester</div>
                              </TableHead>
                              <TableHead className="w-[40%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                                <div className="flex items-center justify-center">Periode Belajar</div>
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
                            {ta.semesters.map((semester: any) => (
                              <TableRow key={semester.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <TableCell className="py-4 text-center">
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
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                      Aktif
                                    </span>
                                  ) : (
                                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
                                      Selesai
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex items-center justify-center gap-2">
                                    {editingSemesterId === semester.id ? (
                                      <>
                                        <Button 
                                          size="sm"
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
                                          className="h-9 w-9 p-0 rounded-xl text-emerald-600 hover:bg-emerald-500 hover:text-white border-none shadow-none"
                                        />
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => setEditingSemesterId(null)}
                                          disabled={loading}
                                          icon={<X className="h-4 w-4" />}
                                          className="h-9 w-9 p-0 rounded-xl text-gray-400 hover:bg-gray-100 border-none shadow-none"
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <Button 
                                          size="sm"
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
                                          className="h-9 w-9 p-0 rounded-xl text-primary hover:bg-emerald-500 hover:text-white border-none shadow-none"
                                        />
                                        {semester.status !== 'aktif' && (
                                          <Button 
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleAction({ action: 'activate_semester', id: semester.id })}
                                            disabled={loading}
                                            icon={<Zap className="h-4 w-4" />}
                                            className="h-9 w-9 p-0 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-white border-none shadow-none"
                                          />
                                        )}
                                        <Button 
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            setConfirmConfig({
                                              show: true,
                                              title: 'Hapus Semester',
                                              message: `Hapus Semester ${semester.jenis_semester}?`,
                                              action: () => handleAction({ action: 'delete_semester', id: semester.id })
                                            })
                                          }}
                                          disabled={loading}
                                          icon={<Trash2 className="h-4 w-4" />}
                                          className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500 hover:text-white border-none shadow-none"
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

                      {/* Mobile Card View */}
                      <div className="md:hidden space-y-4">
                        {ta.semesters.map((semester: any) => (
                          <div 
                            key={semester.id} 
                            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] p-5 shadow-none"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jenis Semester</span>
                                <p className="font-bold text-gray-900 dark:text-white text-sm capitalize">Semester {semester.jenis_semester}</p>
                              </div>
                              {semester.status === 'aktif' ? (
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Aktif</span>
                              ) : (
                                <span className="text-sm font-bold text-gray-400 dark:text-gray-500">Selesai</span>
                              )}
                            </div>

                            <div className="flex flex-col gap-1 mb-4">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Periode Belajar</span>
                              {editingSemesterId === semester.id ? (
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  <input type="date" value={editFormData.tanggal_mulai} onChange={(e) => setEditFormData({ ...editFormData, tanggal_mulai: e.target.value })}
                                    className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-primary/20 bg-gray-50 dark:bg-slate-950 focus:outline-none" />
                                  <input type="date" value={editFormData.tanggal_selesai} onChange={(e) => setEditFormData({ ...editFormData, tanggal_selesai: e.target.value })}
                                    className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-primary/20 bg-gray-50 dark:bg-slate-950 focus:outline-none" />
                                </div>
                              ) : (
                                <p className="font-bold text-gray-900 dark:text-white text-sm">
                                  {new Date(semester.tanggal_mulai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'})} - {new Date(semester.tanggal_selesai).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800 gap-2">
                              {editingSemesterId === semester.id ? (
                                <>
                                  <Button size="sm" variant="success" onClick={async () => { await handleAction({ action: 'update_semester', id: semester.id, ...editFormData }); setEditingSemesterId(null); }}
                                    icon={<Save className="h-4 w-4" />} className="h-9 w-9 p-0 rounded-xl" />
                                  <Button size="sm" variant="ghost" onClick={() => setEditingSemesterId(null)}
                                    icon={<X className="h-4 w-4" />} className="h-9 w-9 p-0 rounded-xl text-gray-400" />
                                </>
                              ) : (
                                <>
                                  <Button size="sm" variant="ghost" onClick={() => { setEditingSemesterId(semester.id); setEditFormData({ tanggal_mulai: new Date(semester.tanggal_mulai).toISOString().split('T')[0], tanggal_selesai: new Date(semester.tanggal_selesai).toISOString().split('T')[0] }); }}
                                    icon={<Pencil className="h-4 w-4" />} className="h-9 w-9 p-0 rounded-xl text-primary hover:bg-emerald-500 hover:text-white" />
                                  {semester.status !== 'aktif' && (
                                    <Button size="sm" variant="ghost" onClick={() => handleAction({ action: 'activate_semester', id: semester.id })}
                                      icon={<Zap className="h-4 w-4" />} className="h-9 w-9 p-0 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-white" />
                                  )}
                                  <Button size="sm" variant="ghost" onClick={() => setConfirmConfig({ show: true, title: 'Hapus Semester', message: `Hapus Semester ${semester.jenis_semester}?`, action: () => handleAction({ action: 'delete_semester', id: semester.id }) })}
                                    icon={<Trash2 className="h-4 w-4" />} className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500 hover:text-white" />
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-[40px]">
                      <p className="text-gray-400 dark:text-gray-500 font-bold text-sm">Belum ada semester yang dibuat di periode ini.</p>
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

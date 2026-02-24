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
  Info, 
  Hash, 
  User, 
  Loader2,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StaggeredDropDown } from '@/components/ui/StaggeredDropDown'
import SweetAlert, { AlertType } from '@/components/ui/SweetAlert'

export default function SiswaClient({ kelasList }: { kelasList: any[] }) {
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
    action: () => {}
  })

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlert({ show: true, type, title, message })
  }

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [students, setStudents] = useState<any[]>([])
  
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)

  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [classToDelete, setClassToDelete] = useState<any>(null)

  const [namaKelas, setNamaKelas] = useState('')
  const [studentForm, setStudentForm] = useState({ no: '', nis: '', nama: '' })
  
  const [uploadClassId, setUploadClassId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAction = async (payload: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (res.ok) {
        showAlert('success', 'Berhasil', result.message)
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

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadClassId) {
      showAlert('warning', 'Peringatan', 'Silakan pilih kelas terlebih dahulu')
      return
    }

    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      showAlert('warning', 'Peringatan', 'Silakan pilih file Excel atau CSV')
      return
    }

    setLoading(true)

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
          showAlert('error', 'Format Salah', 'File Excel kosong atau format tidak sesuai')
          setLoading(false)
          return
        }

        await handleAction({
          action: 'upload_excel',
          kelas_id: uploadClassId,
          data: formattedData
        })
        
        if (fileInputRef.current) fileInputRef.current.value = ''
        
      } catch (err) {
        showAlert('error', 'Gagal', 'Gagal membaca file Excel atau CSV')
        setLoading(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <PageHeader 
        title="Kelola Siswa"
        description="Upload data siswa dengan sistem yang terintegrasi dan mudah digunakan"
        className="mb-8 md:mb-12"
      />

      <Card className="mb-8 md:mb-12 relative overflow-hidden shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
              <CloudUpload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Upload Data Siswa</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">Gunakan file Excel atau CSV untuk menambah data siswa secara massal</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleFileUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Pilih Kelas</label>
              <StaggeredDropDown
                required
                value={uploadClassId}
                onChange={(val) => setUploadClassId(val)}
                placeholder="Pilih Kelas"
                icon={<Building2 className="h-5 w-5" />}
                options={kelasList.map(k => ({ value: k.id.toString(), label: k.nama_kelas }))}
                triggerClassName="h-[52px] pl-12 pr-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:border-primary focus:outline-none transition-all font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">File Excel / CSV</label>
              <div className="relative">
                <div className="relative h-[52px] flex items-center border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl focus-within:border-primary transition-all">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <input type="file" ref={fileInputRef} accept=".xlsx,.xls,.csv" required 
                    className="w-full pl-12 pr-4 bg-transparent focus:outline-none transition-all text-gray-900 dark:text-white font-medium file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" loading={loading} icon={<CloudUpload className="h-5 w-5" />} className="w-full md:w-auto h-[48px] md:h-[52px] rounded-2xl font-bold text-base px-8">
              {loading ? 'Memproses...' : 'Upload Data'}
            </Button>
          </div>
          
          <div className="bg-primary/[0.03] dark:bg-primary/[0.05] p-5 md:p-8 rounded-[40px] border border-primary/10 dark:border-primary/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Format Excel / CSV</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">Pastikan urutan kolom sesuai di bawah ini</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { no: '1', nis: '111135150001250003', nama: 'ACHMAD ARVINO XAVIER WIJAYA', label: 'Baris 1' },
                { no: '2', nis: '111135150001250004', nama: 'ADERA YUMNA AZKAYRA', label: 'Baris 2' }
              ].map((example, i) => (
                <div key={i} className="bg-white/80 dark:bg-slate-900/80 p-4 md:p-5 rounded-[32px] border border-primary/5 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-primary/10 rounded-bl-[16px]">
                    <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest">{example.label}</span>
                  </div>
                  
                  <div className="space-y-4 pt-4 md:pt-2">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary font-black text-xs border border-primary/10 flex-shrink-0">
                        {example.no}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Nama (Kolom C)</span>
                        <p className="font-bold text-gray-900 dark:text-white text-xs md:text-sm break-words leading-relaxed">{example.nama}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 pl-12 md:pl-14">
                      <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">NIS (Kolom B)</span>
                      <span className="font-mono text-gray-600 dark:text-gray-400 font-bold tracking-wider text-xs md:text-sm break-all">{example.nis}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4 px-2">
              <div className="flex gap-1.5 flex-wrap">
                {['NO', 'NIS', 'NAMA'].map(col => (
                  <span key={col} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
                    {col}
                  </span>
                ))}
              </div>
              <p className="text-[10px] md:text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                * Header file opsional (Data dibaca mulai baris ke-2)
              </p>
            </div>
          </div>
        </form>
      </Card>

      <SweetAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />
    </div>
  )
}

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
      showAlert('warning', 'Peringatan', 'Silakan pilih file Excel')
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
        showAlert('error', 'Gagal', 'Gagal membaca file Excel')
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

      <Card className="mb-8 md:mb-12 relative overflow-hidden">
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
            <CloudUpload className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Upload Data Siswa</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Gunakan file Excel untuk menambah data siswa secara massal</p>
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
                triggerClassName="h-[58px] pl-12 pr-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">File Excel</label>
              <div className="relative">
                <div className="relative h-[58px] flex items-center border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <input type="file" ref={fileInputRef} accept=".xlsx,.xls" required 
                    className="w-full pl-12 pr-4 bg-transparent focus:outline-none transition-all text-gray-900 dark:text-white font-medium file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" loading={loading} icon={<CloudUpload className="h-5 w-5" />}>
              {loading ? 'Memproses...' : 'Upload Data'}
            </Button>
          </div>
          
          <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-[32px] border border-primary/10 dark:border-primary/20">
            <h4 className="font-bold text-primary mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Format Excel yang Disarankan
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 font-medium">
              <p>Pastikan file Anda memiliki kolom: <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-primary/10 text-primary">NO</code> | <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-primary/10 text-primary">NIS</code> | <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-primary/10 text-primary">NAMA</code></p>
              <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-primary/5 font-mono text-xs overflow-x-auto shadow-inner">
                <div className="text-gray-400 mb-1 whitespace-nowrap">NO | NIS                | NAMA (Header)</div>
                <div className="text-primary mb-1 whitespace-nowrap">1  | 111135150001250003 | ACHMAD ARVINO XAVIER WIJAYA</div>
                <div className="text-primary mb-1 whitespace-nowrap">2  | 111135150001250004 | ADERA YUMNA AZKAYRA</div>
              </div>
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

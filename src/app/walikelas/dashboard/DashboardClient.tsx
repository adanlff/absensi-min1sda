'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { SearchBox } from '@/components/ui/SearchBox'
import { DataTable } from '@/components/ui/DataTable'
import { Card } from '@/components/ui/Card'
import { QuickActionCard } from '@/components/ui/QuickActionCard'
import { 
  Users, 
  Heart, 
  FileText, 
  AlertCircle, 
  Zap, 
  ClipboardCheck, 
  Printer, 
  UserCog, 
  Calendar
} from 'lucide-react'

export default function DashboardClient({ 
  waliKelas, 
  stats, 
  recentAbsences,
  initialSearch,
  tahunAjaran
}: { 
  waliKelas: any, 
  stats: any, 
  recentAbsences: any[],
  initialSearch: string,
  tahunAjaran: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'sakit': return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      case 'izin': return 'bg-amber-50 text-amber-700 border border-amber-100'
      case 'alpa': return 'bg-red-50 text-red-700 border border-red-100'
      default: return 'bg-gray-50 text-gray-700 border border-gray-100'
    }
  }

  const columns = [
    { 
      header: 'No', 
      accessor: (item: any) => (
        <div className="flex items-center justify-center w-9 h-9 bg-primary/5 text-primary rounded-2xl font-bold text-sm">
          {item.Siswa?.no}
        </div>
      ),
      width: '60px',
      className: 'text-center'
    },
    { 
      header: 'NIS', 
      accessor: (item: any) => <span className="font-mono text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-sm">{item.Siswa?.nis}</span>,
      width: '120px'
    },
    { 
      header: 'Nama Siswa', 
      accessor: (item: any) => <p className="font-semibold text-gray-900 dark:text-white text-base">{item.Siswa?.nama}</p> 
    },
    { 
      header: 'Tanggal', 
      accessor: (item: any) => (
        <span className="text-gray-500 dark:text-gray-400 font-bold flex items-center text-sm">
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-slate-600" />
          {formatDate(item.tanggal)}
        </span>
      ),
      width: '140px'
    },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${getStatusStyle(item.status)}`}>
          {item.status}
        </span>
      ),
      width: '100px'
    },
    { 
      header: 'Keterangan', 
      accessor: (item: any) => <span className="text-gray-500 dark:text-gray-400 font-medium truncate max-w-[150px] inline-block text-sm">{item.keterangan || '-'}</span> 
    }
  ]

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <PageHeader 
        title={`Selamat Datang, ${waliKelas.nama}! 👋`}
        description={`Wali Kelas ${waliKelas.Kelas?.nama_kelas || '...'} — Pantau dan kelola kehadiran siswa dengan efisien pada Tahun Ajaran ${tahunAjaran}`}
        centered
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16">
        <StatCard label="Total Siswa" value={stats.totalSiswa} icon={Users} color="emerald" subValue="Seluruh Peserta Didik" delay={0.1} />
        <StatCard label="Sakit" value={stats.sakit} icon={Heart} color="emerald" subValue="Tidak masuk karena sakit" delay={0.2} />
        <StatCard label="Izin" value={stats.izin} icon={FileText} color="emerald" subValue="Tidak masuk karena izin" delay={0.3} />
        <StatCard label="Alpa" value={stats.alpa} icon={AlertCircle} color="emerald" subValue="Tidak masuk tanpa keterangan" delay={0.4} />
      </div>

      <Card noPadding className="mb-8 md:mb-16">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-10 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Data Ketidakhadiran Siswa</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">7 hari terakhir - {waliKelas.Kelas?.nama_kelas || 'Kelas Anda'}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-full w-fit border border-emerald-100 dark:border-emerald-800/50">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Live Data</span>
            </div>
          </div>

          <DataTable 
            data={recentAbsences}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="Tidak ada data ketidakhadiran dalam 7 hari terakhir"
            renderMobileCard={(absence, index) => (
              <div className="bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-transparent dark:border-slate-800">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/5 rounded-xl flex-shrink-0">
                            <span className="text-primary font-bold text-sm">{absence.Siswa?.no}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1 truncate">{absence.Siswa?.nama}</h4>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                                <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span className="font-mono">{absence.Siswa?.nis}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span>{formatDate(absence.tanggal)}</span>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusStyle(absence.status)}`}>
                                {absence.status}
                            </span>
                        </div>
                        
                        {absence.keterangan && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                            <p className="font-bold text-[10px] uppercase text-gray-400 dark:text-gray-500 mb-1">Keterangan:</p>
                            <p className="font-medium">{absence.keterangan}</p>
                        </div>
                        )}
                    </div>
                </div>
              </div>
            )}
          />
        </div>
      </Card>

      <Card noPadding className="mb-8 md:mb-16 bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center space-x-4 mb-6 md:mb-8">
            <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 flex-shrink-0">
               <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary fill-primary/10" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Aksi Cepat</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Akses platform dengan cepat</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <QuickActionCard href="/walikelas/absen" label="Input Absen" icon={ClipboardCheck} color="emerald" description="Input absensi harian" />
            <QuickActionCard href="/walikelas/cetak-absen" label="Cetak Absen" icon={Printer} color="blue" description="Laporan absensi kelas" />
            <QuickActionCard href="/walikelas/profil" label="Edit Profil" icon={UserCog} color="amber" description="Kelola akun Anda" />
          </div>
        </div>
      </Card>
    </div>
  )
}

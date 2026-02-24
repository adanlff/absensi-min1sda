'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
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
  Calendar
} from 'lucide-react'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'

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
      case 'hadir': return 'text-primary'
      case 'sakit': return 'text-[#F4B400]'
      case 'izin': return 'text-gray-500 dark:text-gray-400'
      case 'alpa': return 'text-[#D93025]'
      default: return 'text-gray-900 dark:text-white'
    }
  }

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const totalPages = Math.ceil(recentAbsences.length / itemsPerPage)
  const currentData = recentAbsences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 if data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [recentAbsences.length])


  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <PageHeader 
        title={`Selamat Datang, ${waliKelas.nama}! 👋`}
        description={`Wali Kelas ${waliKelas.Kelas?.nama_kelas?.replace(/KELAS\s?/i, '') || '...'}, Pantau kehadiran siswa dengan efisien pada Tahun Ajaran ${tahunAjaran}`}
        centered
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16">
        <StatCard label="Total Siswa" value={stats.totalSiswa} icon={Users} color="emerald" subValue="Seluruh Peserta Didik" delay={0.1} />
        <StatCard label="Sakit" value={stats.sakit} icon={Heart} color="emerald" subValue="Tidak masuk karena sakit" delay={0.2} />
        <StatCard label="Izin" value={stats.izin} icon={FileText} color="emerald" subValue="Tidak masuk karena izin" delay={0.3} />
        <StatCard label="Alpa" value={stats.alpa} icon={AlertCircle} color="emerald" subValue="Tidak masuk tanpa keterangan" delay={0.4} />
      </div>

      <Card noPadding className="mb-8 md:mb-16 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800">
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
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-[24px] border border-gray-100 dark:border-slate-800">
              <Table className="table-fixed w-full">
                  <TableHeader className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
                      <TableRow>
                          <TableHead className="w-[5%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                             <div className="flex items-center justify-center">No</div>
                          </TableHead>
                          <TableHead className="w-[18%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                             <div className="flex items-center justify-center">NIS</div>
                          </TableHead>
                          <TableHead className="w-[35%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                             <div className="flex items-center justify-center">Nama Siswa</div>
                          </TableHead>
                          <TableHead className="w-[15%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                             <div className="flex items-center justify-center">Tanggal</div>
                          </TableHead>
                          <TableHead className="w-[12%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                             <div className="flex items-center justify-center">Status</div>
                          </TableHead>
                          <TableHead className="w-[15%] font-black text-gray-400 dark:text-gray-500 text-center h-12 p-0 text-[12px] uppercase tracking-[0.2em]">
                             <div className="flex items-center justify-center">Keterangan</div>
                          </TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                     {currentData.map((absence, index) => (
                        <TableRow 
                          key={absence.id} 
                          className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                           <TableCell className="py-4 text-center">
                               <p className="font-bold text-gray-900 dark:text-white text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</p>
                           </TableCell>
                           <TableCell className="py-4 text-center">
                              <span className="text-gray-900 dark:text-white font-bold text-sm">{absence.Siswa?.nis}</span>
                           </TableCell>
                           <TableCell className="py-4 text-left px-6">
                              <p className="font-bold text-gray-900 dark:text-white text-sm">
                                {absence.Siswa?.nama.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())}
                              </p>
                           </TableCell>
                           <TableCell className="py-4 text-center">
                              <span className="text-gray-900 dark:text-white font-bold text-sm">{formatDate(absence.tanggal)}</span>
                           </TableCell>
                           <TableCell className="py-4 text-center">
                              <span className={`text-[11px] font-black uppercase tracking-wider ${getStatusStyle(absence.status)}`}>
                                {absence.status}
                              </span>
                           </TableCell>
                           <TableCell className="py-4 text-center truncate max-w-[150px]">
                              <span className="text-gray-500 dark:text-gray-400 text-xs font-bold">{absence.keterangan || '-'}</span>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
              </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
             {currentData.map((absence, index) => (
                <div key={absence.id} className="bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-transparent dark:border-slate-800">
                   <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3 flex-1">
                         <div className="flex items-center justify-center w-10 h-10 bg-primary/5 rounded-xl flex-shrink-0">
                             <span className="text-primary font-bold text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                         </div>
                         <div className="flex-1 min-w-0">
                             <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1 truncate">
                               {absence.Siswa?.nama.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())}
                             </h4>
                             <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                                 <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                 <span className="truncate font-mono">{absence.Siswa?.nis}</span>
                             </div>
                         </div>
                      </div>
                      <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-bold">
                               <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                               <span>{formatDate(absence.tanggal)}</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider ${getStatusStyle(absence.status)}`}>
                               {absence.status}
                            </span>
                         </div>
                         {absence.keterangan && (
                           <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Keterangan</label>
                              <p className="text-xs text-gray-900 dark:text-white font-bold">{absence.keterangan}</p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
             ))}
          </div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </Card>

      <Card noPadding className="mb-8 md:mb-16 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <QuickActionCard href="/walikelas/absen" label="Input Absen" icon={ClipboardCheck} color="emerald" description="Input absensi harian" />
            <QuickActionCard href="/walikelas/cetak-absen" label="Cetak Absen" icon={Printer} color="blue" description="Laporan absensi kelas" />
          </div>
        </div>
      </Card>
    </div>
  )
}

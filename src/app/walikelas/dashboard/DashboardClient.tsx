'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Users, Heart, FileText, AlertCircle, TrendingUp, CheckCircle2, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { SearchBox } from '@/components/ui/SearchBox'
import { DataTable } from '@/components/ui/DataTable'
import { Card } from '@/components/ui/Card'

export default function DashboardClient({ 
  waliKelas, 
  stats, 
  recentAbsences,
  initialSearch
}: { 
  waliKelas: any, 
  stats: any, 
  recentAbsences: any[],
  initialSearch: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== initialSearch) {
        const params = new URLSearchParams(searchParams.toString())
        if (search) {
          params.set('search', search)
        } else {
          params.delete('search')
        }
        router.push(`/walikelas/dashboard?${params.toString()}`)
      }
    }, 500)
    
    return () => clearTimeout(handler)
  }, [search, initialSearch, router, searchParams])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'sakit': return 'from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200'
      case 'izin': return 'from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200'
      case 'alpa': return 'from-red-50 to-red-100 text-red-800 border-red-200'
      default: return 'from-gray-50 to-gray-100 text-gray-800 border-gray-200'
    }
  }

  const columns = [
    { 
      header: 'No', 
      accessor: (item: any) => (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-xl">
          <span className="text-primary font-bold text-xs md:text-sm">{item.Siswa?.no}</span>
        </div>
      ),
      width: '60px',
      className: 'text-center'
    },
    { 
      header: 'NIS', 
      accessor: (item: any) => <span className="font-mono text-gray-700 font-medium">{item.Siswa?.nis}</span>,
      width: '120px'
    },
    { 
      header: 'Nama Siswa', 
      accessor: (item: any) => <p className="font-semibold text-gray-900">{item.Siswa?.nama}</p> 
    },
    { 
      header: 'Tanggal', 
      accessor: (item: any) => (
        <span className="text-gray-700 font-medium flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
          {formatDate(item.tanggal)}
        </span>
      ),
      width: '140px'
    },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] md:text-xs font-bold leading-tight bg-gradient-to-r ${getStatusColor(item.status)} border shadow-sm uppercase`}>
          {item.status}
        </span>
      ),
      width: '100px'
    },
    { 
      header: 'Keterangan', 
      accessor: (item: any) => <span className="text-gray-600 truncate max-w-[150px] inline-block">{item.keterangan || '-'}</span> 
    }
  ]

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <PageHeader 
        title="Dashboard"
        description={`Pantau kehadiran siswa ${waliKelas.Kelas?.nama_kelas || 'kelas Anda'} hari ini`}
      >
        <SearchBox 
          value={search} 
          onChange={setSearch} 
          placeholder="Cari nama atau NIS siswa..." 
        />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-16">
        <StatCard label="Total Siswa" value={stats.totalSiswa} icon={Users} color="blue" subValue="Seluruh Peserta Didik" delay={0.1} />
        <StatCard label="Sakit" value={stats.sakit} icon={Heart} color="green" subValue="Tidak masuk karena sakit" delay={0.2} />
        <StatCard label="Izin" value={stats.izin} icon={FileText} color="amber" subValue="Tidak masuk karena izin" delay={0.3} />
        <StatCard label="Alpa" value={stats.alpa} icon={AlertCircle} color="red" subValue="Tidak masuk tanpa keterangan" delay={0.4} />
      </div>

      <Card noPadding className="border-b-primary/50">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
            <div>
               <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 flex items-center">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 mr-3 text-primary" />
                  Data Ketidakhadiran Siswa
               </h3>
               <p className="text-gray-600 text-sm md:text-base flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  7 hari terakhir - {waliKelas.Kelas?.nama_kelas || 'Kelas Anda'}
               </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full w-fit">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-sm font-medium text-gray-700">Live Data</span>
            </div>
          </div>

          <DataTable 
            data={recentAbsences}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="Tidak ada data ketidakhadiran dalam 7 hari terakhir"
            renderMobileCard={(absence, index) => (
              <Card className="p-4 hover:border-primary border-l-4 border-l-transparent transition-all shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                            <span className="text-primary font-bold text-sm">{absence.Siswa?.no}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">{absence.Siswa?.nama}</h4>
                            <div className="flex items-center text-xs text-gray-600">
                                <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span className="font-mono">{absence.Siswa?.nis}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 mt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-600 font-medium">
                                <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span>{formatDate(absence.tanggal)}</span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold leading-tight ${getStatusColor(absence.status)} border uppercase`}>
                                {absence.status}
                            </span>
                        </div>
                        
                        {absence.keterangan && (
                        <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="font-semibold text-[10px] uppercase text-gray-400 mb-1">Keterangan:</p>
                            <p>{absence.keterangan}</p>
                        </div>
                        )}
                    </div>
                </div>
              </Card>
            )}
          />
        </div>
      </Card>
    </div>
  )
}

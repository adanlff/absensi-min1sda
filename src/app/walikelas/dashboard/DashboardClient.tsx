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
        <div className="flex items-center justify-center w-9 h-9 bg-primary/5 text-primary rounded-2xl font-black text-sm">
          {item.Siswa?.no}
        </div>
      ),
      width: '60px',
      className: 'text-center'
    },
    { 
      header: 'NIS', 
      accessor: (item: any) => <span className="font-mono text-gray-500 font-bold tracking-wider text-sm">{item.Siswa?.nis}</span>,
      width: '120px'
    },
    { 
      header: 'Nama Siswa', 
      accessor: (item: any) => <p className="font-black text-gray-900 text-base">{item.Siswa?.nama}</p> 
    },
    { 
      header: 'Tanggal', 
      accessor: (item: any) => (
        <span className="text-gray-500 font-bold flex items-center text-sm">
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
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
      accessor: (item: any) => <span className="text-gray-500 font-medium truncate max-w-[150px] inline-block text-sm">{item.keterangan || '-'}</span> 
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

      <Card noPadding>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
            <div>
               <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1">
                  Data Ketidakhadiran Siswa
               </h3>
               <p className="text-gray-500 text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  7 hari terakhir - {waliKelas.Kelas?.nama_kelas || 'Kelas Anda'}
               </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full w-fit">
               <div className="w-2 h-2 bg-emerald-500 rounded-full" />
               <span className="text-sm font-bold text-gray-700">Live Data</span>
            </div>
          </div>

          <DataTable 
            data={recentAbsences}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="Tidak ada data ketidakhadiran dalam 7 hari terakhir"
            renderMobileCard={(absence, index) => (
              <div className="bg-gray-50/50 rounded-2xl p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/5 rounded-xl flex-shrink-0">
                            <span className="text-primary font-black text-sm">{absence.Siswa?.no}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-sm leading-tight mb-1 truncate">{absence.Siswa?.nama}</h4>
                            <div className="flex items-center text-xs text-gray-500 font-medium">
                                <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span className="font-mono">{absence.Siswa?.nis}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500 font-bold">
                                <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span>{formatDate(absence.tanggal)}</span>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusStyle(absence.status)}`}>
                                {absence.status}
                            </span>
                        </div>
                        
                        {absence.keterangan && (
                        <div className="text-xs text-gray-500 p-3 bg-white rounded-xl border border-gray-100">
                            <p className="font-black text-[10px] uppercase text-gray-400 mb-1">Keterangan:</p>
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
    </div>
  )
}

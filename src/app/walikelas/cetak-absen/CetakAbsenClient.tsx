'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Filter, Calendar, BookOpen, Building2, Printer, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function CetakAbsenClient({ 
  waliKelas, 
  availableSemesters, 
  attendanceData,
  reportTitle,
  initialParams
}: { 
  waliKelas: any, 
  availableSemesters: any[], 
  attendanceData: any[],
  reportTitle: string,
  initialParams?: any
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [reportType, setReportType] = useState(initialParams?.report_type || 'monthly')
  const [bulan, setBulan] = useState(initialParams?.bulan || (new Date().getMonth() + 1).toString())
  const [tahun, setTahun] = useState(initialParams?.tahun || new Date().getFullYear().toString())
  const [semesterId, setSemesterId] = useState(initialParams?.semester_id || '')
  
  const [hasSubmitted, setHasSubmitted] = useState(!!searchParams.get('report_type'))

  if (!waliKelas || !waliKelas.id_kelas) {
    return (
      <div className="max-w-7xl mx-auto md:max-w-none">
        <PageHeader title="Cetak Absen" description="Cetak laporan kehadiran siswa" />
        <Card className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-[30px] flex items-center justify-center text-red-500">
            <X className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Belum Ada Kelas</h3>
          <p className="text-gray-500 font-medium">Anda belum ditugaskan ke kelas manapun. Silakan hubungi admin.</p>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)
    const params = new URLSearchParams()
    params.set('report_type', reportType)
    if (reportType === 'monthly') {
      params.set('bulan', bulan)
      params.set('tahun', tahun)
    } else {
      if (semesterId) params.set('semester_id', semesterId)
    }
    router.push(`/walikelas/cetak-absen?${params.toString()}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <div className="print:hidden">
        <PageHeader 
          title="Cetak Absen"
          description={`Cetak laporan kehadiran siswa ${waliKelas.Kelas?.nama_kelas || 'kelas Anda'}`}
        />
      </div>

      <Card className="mb-6 md:mb-8 print:hidden">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Filter className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900">Pilih Periode Laporan</h3>
            <p className="text-gray-500 mt-1 text-sm font-medium">Pilih jenis dan periode laporan yang ingin dicetak</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 px-1">Jenis Laporan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <label 
                className={`flex items-center space-x-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${reportType === 'monthly' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/20'}`}
              >
                <input type="radio" checked={reportType === 'monthly'} onChange={() => setReportType('monthly')}
                  className="w-4 h-4 text-primary focus:ring-primary cursor-pointer" />
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Laporan Bulanan</p>
                    <p className="text-xs text-gray-500 font-medium">Cetak per bulan</p>
                  </div>
                </div>
              </label>

              <label 
                className={`flex items-center space-x-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${reportType === 'semester' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/20'}`}
              >
                <input type="radio" checked={reportType === 'semester'} onChange={() => setReportType('semester')}
                  className="w-4 h-4 text-primary focus:ring-primary cursor-pointer" />
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Laporan Semester</p>
                    <p className="text-xs text-gray-500 font-medium">Cetak per semester</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {reportType === 'monthly' ? (
              <motion.div 
                key="monthly"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Bulan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <select value={bulan} onChange={e => setBulan(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium appearance-none cursor-pointer">
                      {months.map((m, i) => (
                        <option key={i} value={(i + 1).toString()}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Tahun</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <select value={tahun} onChange={e => setTahun(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium appearance-none cursor-pointer">
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="semester"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Pilih Semester</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <select value={semesterId} onChange={e => setSemesterId(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all text-gray-900 font-medium appearance-none cursor-pointer" required>
                      <option value="">Pilih Semester</option>
                      {availableSemesters.map(s => (
                        <option key={s.id} value={s.id}>
                          Semester {s.jenis_semester.charAt(0).toUpperCase() + s.jenis_semester.slice(1)} - {s.TahunAjaran.tahun}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end pt-4">
             <Button type="submit" size="lg" icon={<BarChart3 className="h-5 w-5" />} fullWidth className="md:w-auto">
               Tampilkan Laporan
             </Button>
          </div>
        </form>
      </Card>

      <AnimatePresence>
        {hasSubmitted && attendanceData.length > 0 && (
          <Card noPadding className="mb-6 md:mb-8 print:shadow-none print:rounded-none print:border-none">
             <div className="p-4 md:p-8 print:p-0">
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0 print:hidden">
                     <div>
                         <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1">{reportTitle}</h3>
                         <p className="text-gray-500 text-sm font-medium flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                            {waliKelas.Kelas?.nama_kelas}
                         </p>
                     </div>
                     <Button onClick={handlePrint} icon={<Printer className="h-5 w-5" />}>
                       Cetak Laporan
                     </Button>
                 </div>

                 <div className="print-area">
                    <div className="text-center mb-6 md:mb-8 border-b-2 border-black pb-6">
                       <h1 className="text-xl md:text-2xl font-bold mb-2 uppercase print:text-sm print:mb-1">MIN 1 SIDOARJO</h1>
                       <h2 className="text-lg md:text-xl font-semibold mb-2 print:text-xs print:mb-1">{reportTitle}</h2>
                       <p className="text-sm md:text-base print:text-[10px] print:mb-0">Kelas: {waliKelas.Kelas?.nama_kelas}</p>
                       <p className="text-xs md:text-sm print:text-[10px] print:mb-2">Wali Kelas: {waliKelas.nama}</p>
                    </div>

                    <div className="overflow-x-auto print:overflow-visible">
                       <table className="w-full text-left print:table-fixed print:text-[10px] border-collapse">
                          <thead>
                             <tr>
                                <th className="border border-black p-2 bg-gray-50 text-center font-bold print:w-[5%]">No</th>
                                <th className="border border-black p-2 bg-gray-50 text-center font-bold print:w-[15%]">NIS</th>
                                <th className="border border-black p-2 bg-gray-50 text-left font-bold print:w-[40%]">Nama Siswa</th>
                                <th className="border border-black p-2 bg-gray-50 text-center font-bold print:w-[10%]">Hadir</th>
                                <th className="border border-black p-2 bg-gray-50 text-center font-bold print:w-[10%]">Sakit</th>
                                <th className="border border-black p-2 bg-gray-50 text-center font-bold print:w-[10%]">Izin</th>
                                <th className="border border-black p-2 bg-gray-50 text-center font-bold print:w-[10%]">Alpa</th>
                             </tr>
                          </thead>
                          <tbody>
                             {attendanceData.map((student, i) => (
                                <tr key={student.id} className="transition-colors hover:bg-gray-50 print:break-inside-avoid">
                                   <td className="border border-black p-2 text-center">{student.no}</td>
                                   <td className="border border-black p-2 text-center font-mono">{student.nis}</td>
                                   <td className="border border-black p-2 font-medium">{student.nama}</td>
                                   <td className="border border-black p-2 text-center">{student.hadir}</td>
                                   <td className="border border-black p-2 text-center">{student.sakit}</td>
                                   <td className="border border-black p-2 text-center">{student.izin}</td>
                                   <td className="border border-black p-2 text-center">{student.alpa}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>

                    <div className="mt-8 print:mt-10 font-sans break-inside-avoid">
                        <div className="ml-auto w-48 text-right print:w-[200px]">
                            <p className="text-sm print:text-[10px] mb-8 print:mb-12">Sidoarjo, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}<br/>Wali Kelas,</p>
                            <div className="border-b border-black w-full mb-1" />
                            <p className="text-sm print:text-[10px] font-semibold text-center">{waliKelas.nama}</p>
                        </div>
                    </div>
                 </div>
             </div>
          </Card>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasSubmitted && attendanceData.length === 0 && (
           <Card className="p-8 md:p-16 text-center print:hidden">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-[30px] flex items-center justify-center">
                  <BarChart3 className="h-10 w-10 text-gray-400" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">Tidak ada data kehadiran</h4>
              <p className="text-gray-500 text-sm font-medium">Belum ada data kehadiran untuk periode yang dipilih.</p>
           </Card>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            .print-area, .print-area * {
                visibility: visible;
            }
            .print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            @page { margin: 10mm; size: A4 portrait; }
        }
      `}</style>
    </div>
  )
}

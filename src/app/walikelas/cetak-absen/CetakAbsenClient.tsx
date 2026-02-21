'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Filter, Calendar, BookOpen, Building2, ChevronRight, Printer, BarChart3, FileText, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 md:p-6 rounded-xl md:rounded-2xl mb-6 md:mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
              <X className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
            </div>
            <p className="font-semibold text-sm md:text-base">Anda belum ditugaskan ke kelas manapun. Silakan hubungi admin.</p>
          </div>
        </motion.div>
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
    router.push(`/walikelas/cetak-absen?\${params.toString()}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12 print:hidden"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Cetak Absen</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Cetak laporan kehadiran siswa {waliKelas.Kelas?.nama_kelas || 'kelas Anda'}
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 shadow-sm print:hidden border-b-primary/50"
      >
        <div className="flex items-center space-x-3 mb-4 md:mb-6">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-secondary"
          >
            <Filter className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-secondary pl-3">Pilih Periode Laporan</h3>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Pilih jenis dan periode laporan yang ingin dicetak</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Jenis Laporan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 \${reportType === 'monthly' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/30'}`}
              >
                <input type="radio" checked={reportType === 'monthly'} onChange={() => setReportType('monthly')}
                  className="w-4 h-4 text-primary focus:ring-primary cursor-pointer" />
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">Laporan Bulanan</p>
                    <p className="text-xs md:text-sm text-gray-500">Cetak per bulan</p>
                  </div>
                </div>
              </motion.label>

              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 \${reportType === 'semester' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/30'}`}
              >
                <input type="radio" checked={reportType === 'semester'} onChange={() => setReportType('semester')}
                  className="w-4 h-4 text-primary focus:ring-primary cursor-pointer" />
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">Laporan Semester</p>
                    <p className="text-xs md:text-sm text-gray-500">Cetak per semester</p>
                  </div>
                </div>
              </motion.label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Bulan</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <select value={bulan} onChange={e => setBulan(e.target.value)}
                      className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary shadow-sm focus:outline-none text-base md:text-lg transition-all appearance-none cursor-pointer bg-white">
                      {months.map((m, i) => (
                        <option key={i} value={(i + 1).toString()}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Tahun</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <select value={tahun} onChange={e => setTahun(e.target.value)}
                      className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary shadow-sm focus:outline-none text-base md:text-lg transition-all appearance-none cursor-pointer bg-white">
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
                className="grid grid-cols-1 gap-4 md:gap-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">Pilih Semester</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                      <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <select value={semesterId} onChange={e => setSemesterId(e.target.value)}
                      className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-primary shadow-sm focus:outline-none text-base md:text-lg transition-all appearance-none cursor-pointer bg-white" required>
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
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               type="submit" 
               className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-right text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-semibold shadow-lg transition-all duration-500 flex items-center space-x-2 md:space-x-3 w-full md:w-auto justify-center group overflow-hidden relative"
             >
                 <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-600 group-hover:left-[100%]" />
                 <BarChart3 className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110 relative z-10" />
                 <span className="relative z-10">Tampilkan Laporan</span>
             </motion.button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {hasSubmitted && attendanceData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-2xl md:rounded-3xl shadow-lg mb-6 md:mb-8 print:shadow-none print:rounded-none border border-gray-100 overflow-hidden border-b-primary/50"
          >
             <div className="p-4 md:p-8 print:p-0">
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0 print:hidden">
                     <div>
                         <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 border-l-4 border-primary pl-3">{reportTitle}</h3>
                         <p className="text-gray-600 text-sm md:text-base flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                            {waliKelas.Kelas?.nama_kelas}
                         </p>
                     </div>
                     <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                         <motion.button 
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={handlePrint} 
                           className="bg-gradient-to-r from-primary to-secondary text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold shadow-lg flex items-center space-x-2 justify-center transition-all w-full sm:w-auto"
                         >
                             <Printer className="h-4 w-4 md:h-5 md:w-5" />
                             <span>Cetak Laporan</span>
                         </motion.button>
                     </div>
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
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasSubmitted && attendanceData.length === 0 && (
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-8 md:p-16 text-center shadow-sm print:hidden"
           >
              <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
              </div>
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Tidak ada data kehadiran</h4>
              <p className="text-gray-500 text-sm md:text-base">Belum ada data kehadiran untuk periode yang dipilih.</p>
           </motion.div>
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

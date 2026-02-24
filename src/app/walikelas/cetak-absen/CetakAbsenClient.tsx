'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Filter, Calendar, BookOpen, Building2, Printer, BarChart3, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StaggeredDropDown } from '@/components/ui/StaggeredDropDown'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/Table'

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
  
  // Page Settings State
  const [pageSize, setPageSize] = useState<'A4' | 'F4'>('A4')
  const [margins, setMargins] = useState({
    top: 1,
    left: 1,
    bottom: 1,
    right: 1
  })
  
  const [fontFamily, setFontFamily] = useState('Inter')
  const [fontSize, setFontSize] = useState(12)

  if (!waliKelas || !waliKelas.id_kelas) {
    return (
      <div className="max-w-7xl mx-auto md:max-w-none">
        <PageHeader title="Cetak Absen" description="Cetak laporan kehadiran siswa" />
        <Card className="text-center p-8 shadow-none rounded-[32px]">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-[30px] flex items-center justify-center text-red-500">
            <X className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Belum Ada Kelas</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Anda belum ditugaskan ke kelas manapun. Silakan hubungi admin.</p>
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
    router.push(`/walikelas/cetak-absen?${params.toString()}`, { scroll: false })
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

      <Card className="mb-6 md:mb-8 shadow-none rounded-[32px]">
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
            <Filter className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Pilih Periode Laporan</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Pilih jenis dan periode laporan yang ingin dicetak</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 px-1">Jenis Laporan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
               <label 
                className={`flex items-center space-x-4 px-6 py-4 rounded-2xl border transition-all cursor-pointer ${
                  reportType === 'monthly' 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' 
                    : 'border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 hover:border-primary/20'
                }`}
              >
                <div className="relative">
                  <input 
                    type="radio" 
                    checked={reportType === 'monthly'} 
                    onChange={() => setReportType('monthly')}
                    className="w-5 h-5 text-primary border-gray-300 focus:ring-primary cursor-pointer transition-all" 
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl transition-colors ${reportType === 'monthly' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                   <div>
                    <p className={`font-bold transition-colors ${reportType === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      Laporan Bulanan
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Cetak per bulan</p>
                  </div>
                </div>
              </label>

               <label 
                className={`flex items-center space-x-4 px-6 py-4 rounded-2xl border transition-all cursor-pointer ${
                  reportType === 'semester' 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' 
                    : 'border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 hover:border-primary/20'
                }`}
              >
                <div className="relative">
                  <input 
                    type="radio" 
                    checked={reportType === 'semester'} 
                    onChange={() => setReportType('semester')}
                    className="w-5 h-5 text-primary border-gray-300 focus:ring-primary cursor-pointer transition-all" 
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl transition-colors ${reportType === 'semester' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                   <div>
                    <p className={`font-bold transition-colors ${reportType === 'semester' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      Laporan Semester
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Cetak per semester</p>
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
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Bulan</label>
                  <StaggeredDropDown
                    value={bulan}
                    onChange={(val) => setBulan(val)}
                    placeholder="Pilih Bulan"
                    icon={<Calendar className="h-5 w-5" />}
                    options={months.map((m, i) => ({ value: (i + 1).toString(), label: m }))}
                    triggerClassName="pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Tahun</label>
                  <StaggeredDropDown
                    value={tahun}
                    onChange={(val) => setTahun(val)}
                    placeholder="Pilih Tahun"
                    icon={<Calendar className="h-5 w-5" />}
                    options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
                    triggerClassName="pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-medium"
                  />
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
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Pilih Semester</label>
                  <StaggeredDropDown
                    required
                    value={semesterId}
                    onChange={(val) => setSemesterId(val)}
                    placeholder="Pilih Semester"
                    icon={<BookOpen className="h-5 w-5" />}
                    options={availableSemesters.map(s => ({
                      value: s.id.toString(),
                      label: `Semester ${s.jenis_semester.charAt(0).toUpperCase() + s.jenis_semester.slice(1)} - ${s.TahunAjaran.tahun}`
                    }))}
                    triggerClassName="pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-medium"
                  />
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

      <Card className="mb-6 md:mb-8 shadow-none rounded-[32px]">
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
             <Printer className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">Pengaturan Halaman</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Atur ukuran kertas dan margin cetakan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Ukuran Kertas</label>
              <div className="grid grid-cols-2 gap-3">
                {(['A4', 'F4'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPageSize(size)}
                    className={`px-6 py-4 rounded-2xl font-bold transition-all border ${
                      pageSize === size 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:border-primary/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
               <p className="text-xs text-gray-400 px-1">F4 (210mm x 330mm) / A4 (210mm x 297mm)</p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Tipografi (Font)</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <StaggeredDropDown
                    value={fontFamily}
                    onChange={(val) => setFontFamily(val)}
                    placeholder="Pilih Font"
                    options={[
                      { value: 'Inter', label: 'Inter (Modern)' },
                      { value: 'Times New Roman', label: 'Times New Roman (Laporan)' },
                      { value: 'Calibri', label: 'Calibri (Standar)' },
                      { value: 'Arial', label: 'Arial (Sans-serif)' },
                    ]}
                    triggerClassName="pl-6 pr-4 py-4 h-[58px] rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-bold"
                  />
                </div>
                <div className="col-span-1 relative group">
                  <input
                    type="number"
                    min="8"
                    max="24"
                    placeholder=" "
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                    className="peer w-full px-4 py-4 h-[58px] rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-bold"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400 tracking-wider pointer-events-none transition-all duration-200 peer-focus:opacity-0 peer-focus:-translate-x-4 peer-[:not(:placeholder-shown)]:opacity-0">
                    Ukuran
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 px-1">Margin Halaman (cm)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                  <div key={side} className="relative group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={margins[side]}
                      onChange={(e) => setMargins({ ...margins, [side]: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-bold"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-1">
                 <p className="text-xs text-gray-400">Atas, Bawah, Kiri, Kanan</p>
                 <p className="text-xs font-bold text-gray-900 dark:text-white">Satuan: CM</p>
              </div>
            </div>
            
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {hasSubmitted && attendanceData.length > 0 && (
          <Card noPadding className="mb-6 md:mb-8 overflow-hidden bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 shadow-none rounded-[32px] print:shadow-none print:rounded-none print:border-none">
             <div className="p-4 md:p-6 lg:p-8 print:p-0">
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0 print:hidden">
                     <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
                          <BarChart3 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">{reportTitle}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                            {waliKelas.Kelas?.nama_kelas}
                          </p>
                        </div>
                     </div>
                     <Button onClick={handlePrint} icon={<Printer className="h-5 w-5" />}>
                       Cetak Laporan
                     </Button>
                 </div>

                   {/* Paper Wrapper for Web UI - Hidden in Print */}
                   <div className="mx-auto transition-all duration-300 print:hidden print-hidden-paper bg-white dark:bg-slate-900 rounded-[32px] shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden"
                     style={{
                       width: '100%',
                       maxWidth: '210mm',
                     }}
                   >
                       {/* The Actual Content Area */}
                       <div className="print-area bg-white dark:bg-slate-900 print:bg-white"
                         style={{
                           fontFamily: `'${fontFamily}', serif`,
                           fontSize: `${fontSize}pt`,
                           padding: `${margins.top}cm ${margins.right}cm ${margins.bottom}cm ${margins.left}cm`,
                           minHeight: pageSize === 'A4' ? '297mm' : '330mm',
                         }}
                       >
                          <div className="text-center mb-6 md:mb-8 border-b-2 border-black dark:border-slate-700 pb-6">
                             <h1 className="text-xl md:text-2xl font-bold mb-2 uppercase dark:text-white">MIN 1 SIDOARJO</h1>
                             <h2 className="text-lg md:text-xl font-semibold mb-2 dark:text-white">{reportTitle}</h2>
                             <p className="text-sm md:text-base dark:text-gray-400 font-bold uppercase">KELAS {waliKelas.Kelas?.nama_kelas}</p>
                          </div>
     
                          <div className="overflow-x-auto print:overflow-visible">
                             <Table className="w-full text-left border-collapse border-black dark:border-slate-700">
                                <TableHeader>
                                   <TableRow className="print:border-b-0">
                                       <TableHead className="border border-black dark:border-slate-700 p-2 bg-gray-50 dark:bg-slate-900 text-center font-bold dark:text-white w-[50px]">No</TableHead>
                                      <TableHead className="border border-black dark:border-slate-700 p-2 bg-gray-50 dark:bg-slate-900 text-center font-bold dark:text-white w-[120px]">NIS</TableHead>
                                      <TableHead className="border border-black dark:border-slate-700 p-2 bg-gray-50 dark:bg-slate-900 text-center font-bold dark:text-white">Nama Siswa</TableHead>
                                      <TableHead className="border border-black dark:border-slate-700 p-2 bg-gray-50 dark:bg-slate-900 text-center font-bold dark:text-white w-[60px]">Hadir</TableHead>
                                      <TableHead className="border border-black dark:border-slate-700 p-2 bg-gray-50 dark:bg-slate-900 text-center font-bold dark:text-white w-[60px]">Sakit</TableHead>
                                      <TableHead className="border border-black dark:border-slate-700 p-2 bg-gray-50 dark:bg-slate-900 text-center font-bold dark:text-white w-[60px]">Izin</TableHead>
                                      <TableHead className="border border-black dark:border-slate-700 p-2 bg-gray-50 dark:bg-slate-900 text-center font-bold dark:text-white w-[60px]">Alpa</TableHead>
                                   </TableRow>
                                </TableHeader>
                                <TableBody>
                                   {attendanceData.map((student, i) => (
                                       <TableRow key={student.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 print:break-inside-avoid">
                                         <TableCell className="border border-black dark:border-slate-700 p-2 text-center dark:text-gray-300">{i + 1}</TableCell>
                                          <TableCell className="border border-black dark:border-slate-700 p-2 text-center dark:text-gray-300">{student.nis}</TableCell>
                                          <TableCell className="border border-black dark:border-slate-700 p-2 font-medium dark:text-gray-300">
                                            {student.nama.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                          </TableCell>
                                         <TableCell className="border border-black dark:border-slate-700 p-2 text-center dark:text-gray-300">{student.hadir}</TableCell>
                                         <TableCell className="border border-black dark:border-slate-700 p-2 text-center dark:text-gray-300">{student.sakit}</TableCell>
                                         <TableCell className="border border-black dark:border-slate-700 p-2 text-center dark:text-gray-300">{student.izin}</TableCell>
                                         <TableCell className="border border-black dark:border-slate-700 p-2 text-center dark:text-gray-300">{student.alpa}</TableCell>
                                      </TableRow>
                                   ))}
                                </TableBody>
                             </Table>
                          </div>
     
                           <div className="mt-8 print:mt-10 break-inside-avoid text-right w-full">
                                <div className="inline-block text-left">
                                   <p className="text-sm mb-20 print:mb-16 dark:text-gray-400">Sidoarjo, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                   <p className="text-sm font-semibold dark:text-white capitalize">{waliKelas.nama.toLowerCase()}</p>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Content Area for Print (Clean Container) */}
                   <div className="hidden print:block bg-white print-report-container"
                     style={{
                       fontFamily: `'${fontFamily}', serif`,
                       fontSize: `${fontSize}pt`,
                     }}
                   >
                       <div className="text-center mb-10 border-b-2 border-black pb-6">
                           <h1 className="text-2xl font-bold mb-2 uppercase">MIN 1 SIDOARJO</h1>
                           <h2 className="text-xl font-semibold mb-2">{reportTitle}</h2>
                           <p className="text-base font-bold uppercase">KELAS {waliKelas.Kelas?.nama_kelas}</p>
                       </div>

                       <Table className="w-full text-left border-collapse border-black">
                           <TableHeader>
                               <TableRow className="border-b-0">
                                   <TableHead className="border border-black p-2 bg-gray-50 text-center font-bold w-[50px]">No</TableHead>
                                   <TableHead className="border border-black p-2 bg-gray-50 text-center font-bold w-[120px]">NIS</TableHead>
                                   <TableHead className="border border-black p-2 bg-gray-50 text-left font-bold">Nama Siswa</TableHead>
                                   <TableHead className="border border-black p-2 bg-gray-50 text-center font-bold w-[60px]">Hadir</TableHead>
                                   <TableHead className="border border-black p-2 bg-gray-50 text-center font-bold w-[60px]">Sakit</TableHead>
                                   <TableHead className="border border-black p-2 bg-gray-50 text-center font-bold w-[60px]">Izin</TableHead>
                                   <TableHead className="border border-black p-2 bg-gray-50 text-center font-bold w-[60px]">Alpa</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                               {attendanceData.map((student, i) => (
                                   <TableRow key={student.id} className="break-inside-avoid">
                                       <TableCell className="border border-black p-2 text-center">{i + 1}</TableCell>
                                       <TableCell className="border border-black p-2 text-center">{student.nis}</TableCell>
                                       <TableCell className="border border-black p-2 font-medium">
                                           {student.nama.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                       </TableCell>
                                       <TableCell className="border border-black p-2 text-center">{student.hadir}</TableCell>
                                       <TableCell className="border border-black p-2 text-center">{student.sakit}</TableCell>
                                       <TableCell className="border border-black p-2 text-center">{student.izin}</TableCell>
                                       <TableCell className="border border-black p-2 text-center">{student.alpa}</TableCell>
                                   </TableRow>
                               ))}
                           </TableBody>
                       </Table>

                       <div className="mt-10 break-inside-avoid text-right w-full">
                           <div className="inline-block text-left">
                               <p className="mb-16">Sidoarjo, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                               <p className="font-semibold capitalize">{waliKelas.nama.toLowerCase()}</p>
                           </div>
                       </div>
                   </div>
               </div>
           </Card>
         )}
       </AnimatePresence>

       <AnimatePresence>
         {hasSubmitted && attendanceData.length === 0 && (
            <Card className="p-8 md:p-16 text-center shadow-none rounded-[32px] print:hidden">
             <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 dark:bg-slate-800 rounded-[30px] flex items-center justify-center">
                   <BarChart3 className="h-10 w-10 text-gray-400 dark:text-slate-600" />
               </div>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tidak ada data kehadiran</h4>
               <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Belum ada data kehadiran untuk periode yang dipilih.</p>
            </Card>
         )}
       </AnimatePresence>

        <style jsx global>{`
         @media print {
             body {
                 margin: 0 !important;
                 padding: 0 !important;
                 background: white !important;
             }
             /* Hide the web-only paper preview completely to save space */
             .print-hidden-paper {
                 display: none !important;
             }
             .print-report-container {
                 position: absolute !important;
                 top: 0 !important;
                 left: 0 !important;
                 width: 100% !important;
                 display: block !important;
                 background: white !important;
             }
             @page {
                 margin: ${margins.top}cm ${margins.right}cm ${margins.bottom}cm ${margins.left}cm;
                 size: ${pageSize === 'A4' ? 'A4' : '210mm 330mm'} portrait;
             }
             /* Ensure table borders are visible */
             .print-report-container table {
                 border-collapse: collapse !important;
             }
             .print-report-container td, .print-report-container th {
                 border-color: black !important;
             }
         }
       `}</style>
    </div>
   )
}

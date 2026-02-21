'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Building2, UserCheck, Clock, Zap, GraduationCap, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { MenuCard } from '@/components/ui/MenuCard'
import { Card } from '@/components/ui/Card'

export default function DashboardClient({ 
  nama, 
  stats, 
  recentStudents, 
  classDistribution 
}: { 
  nama: string, 
  stats: {
    totalSiswa: number,
    totalKelas: number,
    totalWalikelas: number,
    siswaHariIni: number
  },
  recentStudents: any[],
  classDistribution: any[]
}) {
  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <PageHeader 
        title={`Selamat Datang, ${nama}! 👋`}
        description="Kelola sistem informasi sekolah dengan mudah dan efisien"
        centered
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16">
        <StatCard label="Total Siswa" value={stats.totalSiswa} icon={Users} color="emerald" subValue="Aktif" delay={0.1} />
        <StatCard label="Total Kelas" value={stats.totalKelas} icon={Building2} color="emerald" subValue="Tersedia" delay={0.2} />
        <StatCard label="Total Wali Kelas" value={stats.totalWalikelas} icon={UserCheck} color="emerald" subValue="Aktif" delay={0.3} />
        <StatCard label="Siswa Hari Ini" value={stats.siswaHariIni} icon={Clock} color="emerald" subValue="Baru Ditambah" delay={0.4} />
      </div>

      <div className="mb-8 md:mb-16">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-primary">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Menu Utama</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">Akses cepat ke fitur-fitur utama sistem</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <MenuCard href="/admin/siswa" label="Kelola Siswa" icon={GraduationCap} color="emerald" description="Upload dan kelola data siswa dengan sistem yang terintegrasi dan mudah digunakan" />
          <MenuCard href="/admin/walikelas" label="Kelola Wali Kelas" icon={UserCheck} color="emerald" description="Buat dan kelola akun wali kelas serta atur hak akses sesuai kebutuhan" />
          <MenuCard href="/admin/tahun-ajaran" label="Tahun Ajaran" icon={Calendar} color="emerald" description="Kelola tahun ajaran sekolah dan atur periode akademik dengan sistematis" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {/* Recent Students */}
        <Card noPadding>
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2 border-l-4 border-primary pl-3">Siswa Terbaru</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">5 siswa yang baru ditambahkan</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              {recentStudents.length === 0 ? (
                <div className="text-center py-6 md:py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-slate-700" />
                  <p className="text-gray-500 dark:text-gray-500 text-sm md:text-base">Belum ada siswa yang ditambahkan</p>
                </div>
              ) : (
                recentStudents.map((student, index) => (
                  <motion.div 
                    key={student.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                  >
                    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">{student.nama}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm truncate font-medium">{student.Kelas?.nama_kelas || 'Belum ada kelas'}</p>
                      </div>
                      <div className="text-left md:text-right flex-shrink-0 mt-2 md:mt-0">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">{new Date(student.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Class Distribution */}
        <Card noPadding>
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2 border-l-4 border-primary pl-3">Distribusi Kelas</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">5 kelas dengan siswa terbanyak</p>
              </div>
              <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10">
                <Building2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              {classDistribution.length === 0 ? (
                <div className="text-center py-6 md:py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-slate-700" />
                  <p className="text-gray-500 dark:text-gray-500 text-sm md:text-base">Belum ada data kelas</p>
                </div>
              ) : (
                classDistribution.map((kls, index) => {
                  const totalAll = stats.totalSiswa || 1
                  const percentage = (kls.jumlah_siswa / totalAll) * 100
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-3 md:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 md:w-11 md:h-11 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                              <span className="font-bold text-xs md:text-sm">
                                {kls.nama_kelas.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                             <div className="flex-1 min-w-0">
                               <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate group-hover:text-primary transition-colors">{kls.nama_kelas}</p>
                               <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">{kls.jumlah_siswa} siswa</p>
                             </div>
                         </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white mt-2 md:mt-0">{kls.jumlah_siswa} Siswa</span>
                      </div>
                       <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                          className="bg-primary h-full rounded-full" 
                        />
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

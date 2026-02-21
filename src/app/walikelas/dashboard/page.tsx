import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import DashboardClient from '@/app/walikelas/dashboard/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function WalikelasDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getSession()
  if (!session || session.role !== 'walikelas') return null

  const search = typeof searchParams.search === 'string' ? searchParams.search : ''

  // Get Wali Kelas info with class
  const waliKelas = await prisma.waliKelas.findUnique({
    where: { id: session.user_id },
    include: { Kelas: true }
  })

  if (!waliKelas || !waliKelas.id_kelas) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 md:p-6 rounded-xl md:rounded-2xl mb-6 md:mb-8 animate-slideUp">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
              <svg className="h-4 w-4 md:h-5 md:w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="font-semibold text-sm md:text-base">Anda belum ditugaskan ke kelas manapun. Silakan hubungi admin.</p>
          </div>
        </div>
      </div>
    )
  }

  // Get statistics for today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const [totalSiswa, sakit, izin, alpa] = await Promise.all([
    prisma.siswa.count({ where: { id_kelas: waliKelas.id_kelas } }),
    prisma.kehadiran.count({
      where: {
        Siswa: { id_kelas: waliKelas.id_kelas },
        tanggal: { gte: todayStart, lte: todayEnd },
        status: 'sakit'
      }
    }),
    prisma.kehadiran.count({
      where: {
        Siswa: { id_kelas: waliKelas.id_kelas },
        tanggal: { gte: todayStart, lte: todayEnd },
        status: 'izin'
      }
    }),
    prisma.kehadiran.count({
      where: {
        Siswa: { id_kelas: waliKelas.id_kelas },
        tanggal: { gte: todayStart, lte: todayEnd },
        status: 'alpa'
      }
    }),
  ])

  // Get recent absences (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentAbsences = await prisma.kehadiran.findMany({
    where: {
      Siswa: {
        id_kelas: waliKelas.id_kelas,
        ...(search ? {
          OR: [
            { nama: { contains: search, mode: 'insensitive' } },
            { nis: { contains: search } }
          ]
        } : {})
      },
      status: { not: 'hadir' },
      tanggal: { gte: sevenDaysAgo }
    },
    include: {
      Siswa: true
    },
    orderBy: [
      { tanggal: 'desc' },
      { Siswa: { no: 'asc' } }
    ],
    take: 20
  })

  const stats = { totalSiswa, sakit, izin, alpa }

  return <DashboardClient waliKelas={waliKelas} stats={stats} recentAbsences={recentAbsences} initialSearch={search} />
}

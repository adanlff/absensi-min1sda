import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await getSession()
  const nama = session?.nama || 'Admin'

  const tahunAjaranRow = await prisma.tahunAjaran.findFirst({ where: { status: 'aktif' } })
  const tahunAjaran = tahunAjaranRow ? tahunAjaranRow.tahun : '.../'
  
  const totalSiswa = await prisma.siswa.count()
  const totalKelas = await prisma.kelas.count()
  const totalWalikelas = await prisma.waliKelas.count()
  
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const siswaHariIni = await prisma.siswa.count({
    where: { createdAt: { gte: todayStart } }
  })

  const recentStudents = await prisma.siswa.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { Kelas: true }
  })

  const classDistributionRaw = await prisma.siswa.groupBy({
    by: ['id_kelas'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5
  })

  const classIds = classDistributionRaw.map((c: any) => c.id_kelas).filter((id: any) => id !== null) as number[]
  const classes = await prisma.kelas.findMany({ where: { id: { in: classIds } } })
  const classDistribution = classDistributionRaw.map((cd: any) => {
    const kelas = classes.find((c: any) => c.id === cd.id_kelas)
    return {
      nama_kelas: kelas ? kelas.nama_kelas : 'Belum ada kelas',
      jumlah_siswa: cd._count.id
    }
  })

  return (
    <DashboardClient 
      nama={nama}
      tahunAjaran={tahunAjaran}
      stats={{
        totalSiswa,
        totalKelas,
        totalWalikelas,
        siswaHariIni
      }}
      recentStudents={recentStudents}
      classDistribution={classDistribution}
    />
  )
}

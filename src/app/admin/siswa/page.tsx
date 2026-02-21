import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import SiswaClient from './SiswaClient'

export const dynamic = 'force-dynamic'

export default async function SiswaPage() {
  const session = await getSession()
  if (!session) return null

  // Fetch classes with student count
  const kelasData = await prisma.kelas.findMany({
    include: {
      _count: {
        select: { Siswa: true }
      }
    },
    orderBy: { nama_kelas: 'asc' }
  })

  // Format array to easily match what the client expects
  const kelasList = kelasData.map((k: any) => ({
    id: k.id,
    nama_kelas: k.nama_kelas,
    jumlah_siswa: k._count.Siswa
  }))

  return (
    <SiswaClient kelasList={kelasList} />
  )
}

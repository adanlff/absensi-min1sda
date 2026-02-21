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
    <div className="max-w-7xl mx-auto md:max-w-none">
      <div className="mb-8 md:mb-12 animate-fadeIn">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Kelola Siswa</h2>
            <p className="text-gray-600 text-sm md:text-base">Upload dan kelola data siswa dengan sistem yang terintegrasi dan mudah digunakan</p>
          </div>
        </div>
      </div>

      <SiswaClient kelasList={kelasList} />
    </div>
  )
}

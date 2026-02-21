import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import WaliKelasClient from '@/app/admin/walikelas/WaliKelasClient'

export const dynamic = 'force-dynamic'

export default async function WaliKelasPage() {
  const session = await getSession()
  if (!session) return null

  // Fetch classes
  const kelasList = await prisma.kelas.findMany({
    orderBy: { nama_kelas: 'asc' }
  })

  // Fetch wali kelas with class relation
  const walikelasList = await prisma.waliKelas.findMany({
    include: {
      Kelas: true
    },
    orderBy: { nama: 'asc' }
  })

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <div className="mb-8 md:mb-12 animate-fadeIn">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Kelola Wali Kelas</h2>
            <p className="text-gray-600 text-sm md:text-base">Buat dan kelola akun wali kelas serta atur hak akses sesuai kebutuhan</p>
          </div>
        </div>
      </div>

      <WaliKelasClient walikelasList={walikelasList} kelasList={kelasList} />
    </div>
  )
}

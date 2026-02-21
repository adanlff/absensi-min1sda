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
      <WaliKelasClient walikelasList={walikelasList} kelasList={kelasList} />
    </div>
  )
}

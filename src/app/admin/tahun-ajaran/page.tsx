import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import TahunAjaranClient from '@/app/admin/tahun-ajaran/TahunAjaranClient'

export const dynamic = 'force-dynamic'

export default async function TahunAjaranPage() {
  const session = await getSession()
  if (!session) return null

  const tahunAjaranRaw = await prisma.tahunAjaran.findMany({
    orderBy: [
      { createdAt: 'desc' },
      { id: 'desc' }
    ]
  })

  const serializersTa = await Promise.all(tahunAjaranRaw.map(async (ta: any) => {
    const semesters = await prisma.semester.findMany({
      where: { id_tahun_ajaran: ta.id },
      orderBy: { tanggal_mulai: 'desc' }
    })
    return {
      ...ta,
      semesters
    }
  }))

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <div className="mb-8 md:mb-12 animate-fadeIn">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Kelola Tahun Ajaran & Semester</h2>
            <p className="text-gray-600 text-sm md:text-base">Kelola tahun ajaran sekolah dan semester dengan sistematis</p>
          </div>
        </div>
      </div>

      <TahunAjaranClient data={serializersTa} />
    </div>
  )
}

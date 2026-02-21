import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import TahunAjaranClient from '@/app/admin/tahun-ajaran/TahunAjaranClient'
import { PageHeader } from '@/components/ui/PageHeader'

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
      <PageHeader 
        title="Kelola Tahun Ajaran & Semester"
        description="Kelola tahun ajaran sekolah dan semester dengan sistematis"
      />

      <TahunAjaranClient data={serializersTa} />
    </div>
  )
}

import React from 'react'
import prisma from '@/lib/prisma'
import AdminLayoutClient from './layout-client'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tahunAjaranRow = await prisma.tahunAjaran.findFirst({
    where: { status: 'aktif' }
  })
  const tahunAjaran = tahunAjaranRow ? tahunAjaranRow.tahun : 'Belum Ada'

  return (
    <AdminLayoutClient tahunAjaran={tahunAjaran}>
      {children}
    </AdminLayoutClient>
  )
}

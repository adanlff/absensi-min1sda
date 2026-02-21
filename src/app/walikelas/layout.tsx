import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import WalikelasLayoutClient from './layout-client'

export const dynamic = 'force-dynamic'

export default async function WalikelasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const tahunAjaranRow = await prisma.tahunAjaran.findFirst({
    where: { status: 'aktif' }
  })
  const tahunAjaran = tahunAjaranRow ? tahunAjaranRow.tahun : 'Belum Ada'

  let kelasName = 'Belum Ada Kelas'
  if (session && session.id_kelas) {
    const walikelas = await prisma.waliKelas.findUnique({
      where: { id: session.user_id },
      include: { Kelas: true }
    })
    if (walikelas && walikelas.Kelas) {
      kelasName = walikelas.Kelas.nama_kelas
    }
  }

  return (
    <WalikelasLayoutClient tahunAjaran={tahunAjaran} kelasName={kelasName}>
      {children}
    </WalikelasLayoutClient>
  )
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body

    if (action === 'create') {
      const { tahun } = body
      const exist = await prisma.tahunAjaran.findFirst({ where: { tahun } })
      if (exist) return NextResponse.json({ error: `Tahun ajaran ${tahun} sudah ada!` }, { status: 400 })

      await prisma.tahunAjaran.updateMany({ data: { status: 'non-aktif' } })
      await prisma.tahunAjaran.create({ data: { tahun, status: 'aktif' } })
      return NextResponse.json({ success: true, message: 'Tahun ajaran berhasil dibuat dan diaktifkan!' })

    } else if (action === 'activate') {
      const { id } = body
      await prisma.tahunAjaran.updateMany({ data: { status: 'non-aktif' } })
      await prisma.tahunAjaran.update({ where: { id }, data: { status: 'aktif' } })
      return NextResponse.json({ success: true, message: 'Tahun ajaran berhasil diaktifkan!' })

    } else if (action === 'create_semester') {
      const { id_tahun_ajaran, jenis_semester, tanggal_mulai, tanggal_selesai } = body
      const exist = await prisma.semester.findFirst({ where: { id_tahun_ajaran, jenis_semester } })
      if (exist) return NextResponse.json({ error: `Semester ${jenis_semester} sudah ada untuk tahun ajaran ini!` }, { status: 400 })

      await prisma.semester.updateMany({
        where: { id_tahun_ajaran },
        data: { status: 'non-aktif' }
      })
      await prisma.semester.create({
        data: { 
          id_tahun_ajaran, 
          jenis_semester, 
          tanggal_mulai: new Date(tanggal_mulai), 
          tanggal_selesai: new Date(tanggal_selesai), 
          status: 'aktif' 
        }
      })
      return NextResponse.json({ success: true, message: 'Semester berhasil dibuat dan diaktifkan!' })

    } else if (action === 'activate_semester') {
      const { id } = body
      const semester = await prisma.semester.findUnique({ where: { id } })
      if (!semester) return NextResponse.json({ error: 'Semester tidak ditemukan!' }, { status: 404 })

      await prisma.semester.updateMany({
        where: { id_tahun_ajaran: semester.id_tahun_ajaran },
        data: { status: 'non-aktif' }
      })
      await prisma.semester.update({ where: { id }, data: { status: 'aktif' } })
      return NextResponse.json({ success: true, message: 'Semester berhasil diaktifkan!' })

    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Tahun ajaran API error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}

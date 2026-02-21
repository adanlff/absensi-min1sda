import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'walikelas') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, tanggal, data, bulk_status, id_kelas } = await req.json()

    // Validation
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const targetDate = new Date(tanggal)
    targetDate.setHours(0, 0, 0, 0)
    
    if (targetDate > currentDate) {
      return NextResponse.json({ error: 'Tidak dapat menginput absen untuk tanggal yang akan datang!' }, { status: 400 })
    }

    if (action === 'bulk' && bulk_status && id_kelas) {
      const students = await prisma.siswa.findMany({ where: { id_kelas: parseInt(id_kelas) } })
      
      // Use transaction
      await prisma.$transaction(
        students.map((student: any) => prisma.kehadiran.upsert({
          where: {
            id_siswa_tanggal: {
              id_siswa: student.id,
              tanggal: new Date(tanggal)
            }
          },
          update: { status: bulk_status },
          create: {
            id_siswa: student.id,
            tanggal: new Date(tanggal),
            status: bulk_status
          }
        }))
      )
      return NextResponse.json({ success: true, message: `Berhasil mengupdate absen massal menjadi \${bulk_status}` })
    }

    if (action === 'save' && data) {
      // data is an array of objects: { id_siswa, status, keterangan }
      await prisma.$transaction(
        data.map((item: any) => prisma.kehadiran.upsert({
          where: {
            id_siswa_tanggal: {
              id_siswa: parseInt(item.id_siswa),
              tanggal: new Date(tanggal)
            }
          },
          update: {
            status: item.status || 'hadir',
            keterangan: item.keterangan || null
          },
          create: {
            id_siswa: parseInt(item.id_siswa),
            tanggal: new Date(tanggal),
            status: item.status || 'hadir',
            keterangan: item.keterangan || null
          }
        }))
      )
      return NextResponse.json({ success: true, message: 'Absen berhasil disimpan!' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Absen API error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}

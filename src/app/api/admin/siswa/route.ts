import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const kelas_id = searchParams.get('kelas_id')

    if (kelas_id) {
      const students = await prisma.siswa.findMany({
        where: { id_kelas: parseInt(kelas_id) },
        orderBy: { no: 'asc' }
      })
      return NextResponse.json({ students })
    }

    return NextResponse.json({ students: [] })
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body

    if (action === 'add_student') {
      const { no, nis, nama, kelas_id } = body
      try {
        await prisma.siswa.create({
          data: {
            no: parseInt(no),
            nis,
            nama,
            id_kelas: parseInt(kelas_id)
          }
        })
        return NextResponse.json({ success: true, message: 'Siswa berhasil ditambahkan!' })
      } catch (e: any) {
        if (e.code === 'P2002') return NextResponse.json({ error: 'NIS sudah digunakan!' }, { status: 400 })
        throw e
      }
    } 
    
    else if (action === 'upload_excel') {
      const { kelas_id, data } = body
      // data is an array of objects { no, nis, nama }
      let count = 0
      for (const row of data) {
         if (row.no && row.nis && row.nama) {
            try {
               await prisma.siswa.create({
                  data: {
                     no: parseInt(row.no),
                     nis: row.nis.toString(),
                     nama: row.nama,
                     id_kelas: parseInt(kelas_id)
                  }
               })
               count++
            } catch (e) {
               // Skip duplicates
               continue
            }
         }
      }
      return NextResponse.json({ success: true, message: `Berhasil mengupload ${count} data siswa!` })
    }
    
    else if (action === 'delete_student') {
      const { id } = body
      await prisma.siswa.delete({ where: { id: parseInt(id) } })
      return NextResponse.json({ success: true, message: 'Siswa berhasil dihapus!' })
    }
    
    else if (action === 'add_class') {
      const { nama_kelas } = body
      try {
        await prisma.kelas.create({ data: { nama_kelas } })
        return NextResponse.json({ success: true, message: 'Kelas berhasil ditambahkan!' })
      } catch (e: any) {
        return NextResponse.json({ error: 'Nama kelas sudah digunakan!' }, { status: 400 })
      }
    }
    
    else if (action === 'delete_class') {
      const { id } = body
      const count = await prisma.siswa.count({ where: { id_kelas: parseInt(id) } })
      if (count > 0) {
        return NextResponse.json({ error: 'Tidak dapat menghapus kelas yang masih memiliki siswa!' }, { status: 400 })
      }
      await prisma.kelas.delete({ where: { id: parseInt(id) } })
      return NextResponse.json({ success: true, message: 'Kelas berhasil dihapus!' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Siswa API error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}

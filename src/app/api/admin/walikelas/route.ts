import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body

    if (action === 'create') {
      const { username, password, nama, id_kelas } = body
      
      const exist = await prisma.waliKelas.findUnique({ where: { username } })
      if (exist) {
        return NextResponse.json({ error: 'Username sudah digunakan!' }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      
      await prisma.waliKelas.create({
        data: {
          username,
          password: hashedPassword,
          nama,
          id_kelas: id_kelas ? parseInt(id_kelas) : null
        }
      })
      
      return NextResponse.json({ success: true, message: 'Akun wali kelas berhasil dibuat!' })

    } else if (action === 'update') {
      const { id, username, password, nama, id_kelas } = body
      
      const updateData: any = {
        username,
        nama,
        id_kelas: id_kelas ? parseInt(id_kelas) : null
      }

      if (password) {
        updateData.password = await bcrypt.hash(password, 10)
      }

      try {
        await prisma.waliKelas.update({
          where: { id },
          data: updateData
        })
        return NextResponse.json({ success: true, message: 'Data wali kelas berhasil diupdate!' })
      } catch (err: any) {
         if (err.code === 'P2002') {
             return NextResponse.json({ error: 'Username sudah digunakan!' }, { status: 400 })
         }
         throw err;
      }

    } else if (action === 'delete') {
      const { id } = body
      await prisma.waliKelas.delete({ where: { id } })
      return NextResponse.json({ success: true, message: 'Akun wali kelas berhasil dihapus!' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Wali Kelas API error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}

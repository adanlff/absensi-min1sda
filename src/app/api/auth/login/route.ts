import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { setSession } from '@/lib/session'

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json()

    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Username, password, atau role tidak boleh kosong' }, { status: 400 })
    }

    if (role === 'admin') {
      const user = await prisma.admin.findUnique({
        where: { username }
      })

      if (user && await bcrypt.compare(password, user.password)) {
        await setSession({
          user_id: user.id,
          username: user.username,
          nama: user.nama,
          role: 'admin',
        })
        return NextResponse.json({ success: true, redirect: '/admin/dashboard' })
      }
    } else if (role === 'walikelas') {
      const user = await prisma.waliKelas.findUnique({
        where: { username },
        include: { Kelas: true }
      })

      if (user && await bcrypt.compare(password, user.password)) {
        await setSession({
          user_id: user.id,
          username: user.username,
          nama: user.nama,
          role: 'walikelas',
          id_kelas: user.id_kelas,
        })
        return NextResponse.json({ success: true, redirect: '/walikelas/dashboard' })
      }
    }

    return NextResponse.json({ error: 'Username atau password salah!' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}

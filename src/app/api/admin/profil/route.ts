import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getSession, setSession } from '@/lib/session'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { nama, username, email, telepon, alamat, password } = await req.json()

    if (!nama || !username) {
      return NextResponse.json({ error: 'Nama dan Username wajib diisi' }, { status: 400 })
    }

    const updateData: any = {
      nama,
      username,
      email: email || null,
      telepon: telepon || null,
      alamat: alamat || null,
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    await prisma.admin.update({
      where: { id: session.user_id },
      data: updateData
    })

    await setSession({
      ...session,
      nama,
      username
    })

    return NextResponse.json({ success: true, message: 'Profil berhasil diupdate!' })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}

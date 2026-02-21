import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Create Admin
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nama: 'Administrator',
    },
  })
  console.log('Admin created:', admin.username)

  // 2. Create Kelas
  const kelas6A = await prisma.kelas.create({
    data: {
      nama_kelas: '6-A',
    },
  })
  console.log('Kelas created:', kelas6A.nama_kelas)

  // 3. Create Wali Kelas
  const waliKelas = await prisma.waliKelas.upsert({
    where: { username: 'walikelas1' },
    update: {
      id_kelas: kelas6A.id,
    },
    create: {
      username: 'walikelas1',
      password: hashedPassword,
      nama: 'Wali Kelas 1',
      id_kelas: kelas6A.id,
    },
  })
  console.log('Wali Kelas created:', waliKelas.username)

  // 4. Create Academic Year and Semester (Required for some features)
  const tahunAjaran = await prisma.tahunAjaran.create({
    data: {
      tahun: '2023/2024',
      status: 'aktif',
      Semester: {
        create: {
          jenis_semester: 'ganjil',
          tanggal_mulai: new Date('2023-07-17'),
          tanggal_selesai: new Date('2023-12-23'),
          status: 'aktif',
        },
      },
    },
  })
  console.log('Tahun Ajaran & Semester created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

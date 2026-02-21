export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import CetakAbsenClient from '@/app/walikelas/cetak-absen/CetakAbsenClient'

export default async function WalikelasCetakAbsenPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getSession()
  if (!session || session.role !== 'walikelas') return null

  // Get Wali Kelas info
  const waliKelas = await prisma.waliKelas.findUnique({
    where: { id: session.user_id },
    include: { Kelas: true }
  })

  // Get available semesters
  const availableSemesters = await prisma.semester.findMany({
    include: { TahunAjaran: true },
    orderBy: { tanggal_mulai: 'desc' }
  })

  if (!waliKelas || !waliKelas.id_kelas) {
    return <CetakAbsenClient waliKelas={waliKelas} availableSemesters={availableSemesters} attendanceData={[]} reportTitle="" />
  }

  const bulan = typeof searchParams.bulan === 'string' ? searchParams.bulan : new Date().getMonth() + 1 + ''
  const tahun = typeof searchParams.tahun === 'string' ? searchParams.tahun : new Date().getFullYear() + ''
  const semester_id = typeof searchParams.semester_id === 'string' ? searchParams.semester_id : ''
  const report_type = typeof searchParams.report_type === 'string' ? searchParams.report_type : 'monthly'

  let attendanceData: any[] = []
  let reportTitle = ''

  if (report_type === 'monthly' && bulan && tahun) {
    const start_date = new Date(`${tahun}-${bulan.padStart(2, '0')}-01T00:00:00Z`)
    const end_date = new Date(start_date.getFullYear(), start_date.getMonth() + 1, 0, 23, 59, 59, 999)

    // Fetch students
    const students = await prisma.siswa.findMany({
      where: { id_kelas: waliKelas.id_kelas },
      include: {
        Kehadiran: {
          where: {
            tanggal: {
              gte: start_date,
              lte: end_date
            }
          }
        }
      },
      orderBy: { no: 'asc' }
    })

    attendanceData = students.map((s: any) => {
      let hadir = 0, sakit = 0, izin = 0, alpa = 0
      s.Kehadiran.forEach((k: any) => {
        if (k.status === 'hadir') hadir++
        else if (k.status === 'sakit') sakit++
        else if (k.status === 'izin') izin++
        else if (k.status === 'alpa') alpa++
      })
      return { ...s, hadir, sakit, izin, alpa, total_hari: s.Kehadiran.length }
    })

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    reportTitle = `Laporan Bulanan - ${monthNames[parseInt(bulan) - 1]} ${tahun}`

  } else if (report_type === 'semester' && semester_id) {
    const semesterInfo = await prisma.semester.findUnique({
      where: { id: parseInt(semester_id) },
      include: { TahunAjaran: true }
    })

    if (semesterInfo) {
      const students = await prisma.siswa.findMany({
        where: { id_kelas: waliKelas.id_kelas },
        include: {
          Kehadiran: {
            where: {
              tanggal: {
                gte: semesterInfo.tanggal_mulai,
                lte: semesterInfo.tanggal_selesai
              }
            }
          }
        },
        orderBy: { no: 'asc' }
      })

      attendanceData = students.map((s: any) => {
        let hadir = 0, sakit = 0, izin = 0, alpa = 0
        s.Kehadiran.forEach((k: any) => {
          if (k.status === 'hadir') hadir++
          else if (k.status === 'sakit') sakit++
          else if (k.status === 'izin') izin++
          else if (k.status === 'alpa') alpa++
        })
        return { ...s, hadir, sakit, izin, alpa, total_hari: s.Kehadiran.length }
      })

      const semesterName = semesterInfo.jenis_semester.charAt(0).toUpperCase() + semesterInfo.jenis_semester.slice(1)
      reportTitle = `Laporan Semester ${semesterName} - ${semesterInfo.TahunAjaran.tahun}`
    }
  }

  return (
    <CetakAbsenClient 
      waliKelas={waliKelas} 
      availableSemesters={availableSemesters} 
      attendanceData={attendanceData} 
      reportTitle={reportTitle}
      initialParams={{ report_type, bulan, tahun, semester_id }}
    />
  )
}

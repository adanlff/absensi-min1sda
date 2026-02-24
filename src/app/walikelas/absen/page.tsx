import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import AbsenClient from './AbsenClient'

export const dynamic = 'force-dynamic'

export default async function WalikelasAbsenPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const session = await getSession()
  if (!session || session.role !== 'walikelas') return null

  // Get Wali Kelas info with class
  const waliKelas = await prisma.waliKelas.findUnique({
    where: { id: session.user_id },
    include: { Kelas: true }
  })

  // Get selected date or default to today
  const selectedDateStr = typeof resolvedSearchParams.tanggal === 'string' ? resolvedSearchParams.tanggal : new Date().toISOString().split('T')[0]
  
  // Get search parameter
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : ''

  if (!waliKelas || !waliKelas.id_kelas) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 md:p-6 rounded-xl md:rounded-2xl mb-6 md:mb-8 animate-slideUp">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
              <svg className="h-4 w-4 md:h-5 md:w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="font-semibold text-sm md:text-base">Anda belum ditugaskan ke kelas manapun. Silakan hubungi admin.</p>
          </div>
        </div>
      </div>
    )
  }

  const targetDate = new Date(selectedDateStr)
  
  // Get students with their attendance for selected date
  const students = await prisma.siswa.findMany({
    where: {
      id_kelas: waliKelas.id_kelas,
      ...(search ? {
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { nis: { contains: search } }
        ]
      } : {})
    },
    include: {
      Kehadiran: {
        where: {
          tanggal: targetDate
        }
      }
    },
    orderBy: { no: 'asc' }
  })

  return (
    <AbsenClient 
      waliKelas={waliKelas} 
      students={students} 
      initialDate={selectedDateStr} 
      initialSearch={search} 
    />
  )
}

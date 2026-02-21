import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import ProfilForm from '@/app/admin/profil/ProfilForm'

export const dynamic = 'force-dynamic'

export default async function AdminProfilData() {
  const session = await getSession()
  if (!session) return null

  const admin = await prisma.admin.findUnique({
    where: { id: session.user_id }
  })

  if (!admin) return null

  return (
    <div className="max-w-7xl mx-auto md:max-w-none">
      <div className="mb-8 md:mb-12 animate-fadeIn">
        <div className="flex items-center space-x-3 mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Profil</h2>
        </div>
        <p className="text-gray-600 text-sm md:text-base">Kelola informasi akun dan preferensi pribadi Anda</p>
      </div>

      <ProfilForm admin={admin} />
    </div>
  )
}

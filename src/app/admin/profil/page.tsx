import React from 'react'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import ProfilForm from '@/app/admin/profil/ProfilForm'
import { PageHeader } from '@/components/ui/PageHeader'

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
      <PageHeader 
        title="Edit Profil"
        description="Kelola informasi akun dan preferensi pribadi Anda"
      />

      <ProfilForm admin={admin} />
    </div>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon, ArrowRight } from 'lucide-react'
import { Card } from './Card'

interface MenuCardProps {
  href: string
  label: string
  description: string
  icon: LucideIcon
  color: 'blue' | 'emerald' | 'purple' | 'orange' | 'amber' | 'red'
}

export function MenuCard({ href, label, description, icon: Icon, color }: MenuCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card 
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden h-full flex flex-col"
      >
        <div className="flex items-start space-x-4 md:space-x-5 flex-1">
          <div className="p-3 md:p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <Icon size={24} className="transition-transform group-hover:scale-110" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {label}
            </h4>
            <p className="text-gray-500 mb-6 text-sm md:text-base font-medium leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex items-center text-primary font-bold text-sm mt-4 pt-4 border-t border-gray-50">
          <span>Kelola Sekarang</span>
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </Card>
    </Link>
  )
}

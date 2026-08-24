"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  onClick?: () => void
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  activeItem?: string
  isInline?: boolean
}

export function NavBar({ items, className, activeItem, isInline = false }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(activeItem || items[0].name)

  useEffect(() => {
    if (activeItem) {
      setActiveTab(activeItem)
    }
  }, [activeItem])

  return (
    <div
      className={cn(
        isInline ? "relative z-10 flex items-center justify-center" : "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        className,
      )}
    >
      <div className="flex items-center gap-1 sm:gap-2 bg-gray-100/90 dark:bg-[#0E291D]/90 border border-gray-200 dark:border-emerald-500/25 backdrop-blur-xl py-1 px-1.5 rounded-full shadow-inner">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => {
                setActiveTab(item.name)
                if (item.onClick) {
                  e.preventDefault()
                  item.onClick()
                }
              }}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full transition-colors flex items-center gap-2 select-none",
                "text-gray-600 dark:text-emerald-100/80 hover:text-[#006837] dark:hover:text-emerald-300",
                isActive && "bg-white dark:bg-[#006837] text-[#006837] dark:text-white shadow-xs",
              )}
            >
              <Icon size={15} strokeWidth={2.2} className={isActive ? "text-[#006837] dark:text-white" : "text-gray-400 dark:text-emerald-400/70"} />
              <span className="hidden sm:inline">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-[#006837]/10 dark:bg-white/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#006837] dark:bg-[#7EC9A0] rounded-t-full">
                    <div className="absolute w-12 h-6 bg-[#006837]/30 dark:bg-[#7EC9A0]/40 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-[#006837]/30 dark:bg-[#7EC9A0]/40 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-[#006837]/30 dark:bg-[#7EC9A0]/40 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}

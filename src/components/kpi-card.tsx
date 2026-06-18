import { type ReactNode } from 'react'

const colorMap = {
  blue: 'bg-blue-light text-blue',
  green: 'bg-green-light text-green',
  orange: 'bg-orange-light text-orange',
  purple: 'bg-purple-light text-purple',
} as const

interface KpiCardProps {
  icon: ReactNode
  label: string
  value: string
  change: string
  color: keyof typeof colorMap
  valueSmall?: boolean
}

export function KpiCard({ icon, label, value, change, color, valueSmall }: KpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-[22px_24px] flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-muted font-medium mb-1.5">{label}</div>
        <div className={`font-playfair font-extrabold tracking-tight leading-none mb-1.5 ${valueSmall ? 'text-2xl' : 'text-[28px]'}`}>
          {value}
        </div>
        <div className="text-xs font-medium text-green">{change}</div>
      </div>
    </div>
  )
}

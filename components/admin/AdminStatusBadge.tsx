import { SocioStatus } from '@/types'

const statusConfig: Record<SocioStatus, { label: string; bg: string; color: string }> = {
  pendente:     { label: 'Pendente',     bg: 'rgba(234, 179, 8, 0.15)',  color: '#fbbf24' },
  em_conversa:  { label: 'Em conversa',  bg: 'rgba(26, 58, 92, 0.4)',    color: '#60a5fa' },
  aprovado:     { label: 'Aprovado',     bg: 'rgba(34, 197, 94, 0.15)',  color: '#4ade80' },
  recusado:     { label: 'Recusado',     bg: 'rgba(212, 0, 0, 0.2)',     color: '#f87171' },
}

export default function AdminStatusBadge({ status }: { status: SocioStatus }) {
  const config = statusConfig[status]
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: config.bg, color: config.color, fontFamily: 'DM Sans, sans-serif', border: `1px solid ${config.color}30` }}>
      {config.label}
    </span>
  )
}

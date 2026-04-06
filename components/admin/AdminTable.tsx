'use client'

import { ReactNode } from 'react'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
  width?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  loading?: boolean
}

export default function AdminTable<T extends { id: string }>({ columns, data, onRowClick, emptyMessage = 'Nenhum item encontrado.', loading = false }: Props<T>) {
  if (loading) {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(237,28,36,0.2)' }}>
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(237,28,36,0.2)', borderTopColor: '#ED1C24' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(237,28,36,0.2)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#1a0000' }}>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', width: col.width, borderBottom: '1px solid rgba(237,28,36,0.2)' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>{emptyMessage}</td></tr>
            ) : (
              data.map((item, i) => (
                <tr key={item.id} onClick={() => onRowClick?.(item)} className="transition-colors" style={{ background: i % 2 === 0 ? 'rgba(58,0,0,0.3)' : 'rgba(42,0,0,0.3)', cursor: onRowClick ? 'pointer' : 'default', borderBottom: '1px solid rgba(237,28,36,0.1)' }}
                  onMouseEnter={e => { if (onRowClick) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(237,28,36,0.08)' }}
                  onMouseLeave={e => { if (onRowClick) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? 'rgba(58,0,0,0.3)' : 'rgba(42,0,0,0.3)' }}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import NoticiaGrid from './NoticiaGrid'
import { Noticia } from '@/types'

interface Props {
  noticiasIniciais: Noticia[]
  publicado?: boolean
}

export default function NoticiaGridClient({ noticiasIniciais, publicado = true }: Props) {
  const [noticias, setNoticias] = useState<Noticia[]>(noticiasIniciais)

  const fetchNoticias = useCallback(async () => {
    const supabase = getSupabaseClient()
    const { data } = await supabase
      .from('noticias')
      .select('*')
      .eq('publicado', publicado)
      .order('publicado_em', { ascending: false })
      .limit(6)
    if (data) setNoticias(data)
  }, [publicado])

  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase.channel('noticias_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'noticias' }, () => {
        fetchNoticias()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchNoticias])

  return <NoticiaGrid noticias={noticias} />
}
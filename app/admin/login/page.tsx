'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { useAdminPath } from '@/hooks/useAdminPath'
import { motion } from 'framer-motion'
import { LogIn, Shield, Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const router                          = useRouter()
  const searchParams                    = useSearchParams()
  const supabase                        = getSupabaseClient()
  const adminBase                       = useAdminPath()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Credenciais inválidas. Verifique e-mail e senha.')
      setLoading(false)
      return
    }

    // Open-redirect guard: only follow redirect param if within admin
    const raw      = searchParams.get('redirect') ?? adminBase
    const redirect = raw.startsWith(adminBase) ? raw : adminBase

    router.push(redirect)
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #2a0000 0%, #1a0000 50%, #0d0000 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: '#ED1C24' }}
          >
            <Shield size={32} color="#fff" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#fff' }}>
            Área Restrita
          </h1>
          <p className="mt-2 text-sm tracking-wider uppercase opacity-60" style={{ fontFamily: 'DM Sans, sans-serif', color: '#fff' }}>
            Os Centenários dos Aflitos
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: 'rgba(58, 0, 0, 0.6)', border: '1px solid rgba(212, 0, 0, 0.2)', backdropFilter: 'blur(12px)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                E-mail
              </label>
              <input
                id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212, 0, 0, 0.3)', fontFamily: 'DM Sans, sans-serif' }}
                placeholder="admin@centenarios.com.br"
                onFocus={e => (e.currentTarget.style.border = '1px solid #ED1C24')}
                onBlur={e => (e.currentTarget.style.border = '1px solid rgba(212, 0, 0, 0.3)')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                Senha
              </label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-lg text-white placeholder-white/30 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212, 0, 0, 0.3)', fontFamily: 'DM Sans, sans-serif' }}
                  placeholder="••••••••"
                  onFocus={e => (e.currentTarget.style.border = '1px solid #ED1C24')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(212, 0, 0, 0.3)')}
                />
                <button
                  type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={18} color="#fff" /> : <Eye size={18} color="#fff" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-center py-2 px-4 rounded-lg"
                style={{ color: '#ff6b6b', background: 'rgba(212, 0, 0, 0.15)', border: '1px solid rgba(212, 0, 0, 0.3)', fontFamily: 'DM Sans, sans-serif' }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: loading ? '#8B0000' : '#ED1C24', color: '#fff', fontFamily: 'Oswald, sans-serif', fontSize: '0.95rem', letterSpacing: '0.15em' }}
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><LogIn size={18} />Entrar</>
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
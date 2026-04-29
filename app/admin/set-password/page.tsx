'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getSupabaseClient } from '@/lib/supabase'
import Image from 'next/image'
import { ChevronRight, Eye, EyeOff } from 'lucide-react'

const RED = '#ED1C24'

export default function SetPasswordPage() {
  const router   = useRouter()
  const supabase = getSupabaseClient()

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [success,   setSuccess]   = useState(false)

  function validate() {
    if (password.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
    if (password !== confirm)  return 'As senhas não coincidem.'
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('Erro ao definir senha. Tente novamente.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/admin'), 2000)
  }

  const inputStyle = (hasError: boolean) => ({
    background: '#FFFFFF',
    border: `1px solid ${hasError ? RED : 'rgba(237,28,36,0.25)'}`,
    color: RED,
    fontFamily: 'DM Sans, sans-serif',
    boxShadow: hasError ? '0 0 0 2px rgba(237,28,36,0.1)' : 'none',
    width: '100%',
    padding: '14px 16px',
    outline: 'none',
    fontSize: 14,
  })

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Image src="/EscudoOficial.png" alt="Escudo" width={64} height={64} className="mx-auto mb-6 opacity-20" />
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
            Painel Admin
          </p>
          <h1 className="text-4xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: RED }}>
            Defina sua senha
          </h1>
          <div className="w-10 h-[3px] mx-auto mt-4" style={{ background: RED }} />
          <p className="text-sm mt-4" style={{ color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>
            Crie uma senha segura para acessar o painel.
          </p>
        </div>

        {/* Form */}
        {!success ? (
          <div style={{ border: '1px solid rgba(237,28,36,0.15)', padding: '32px', boxShadow: '0 4px 24px rgba(237,28,36,0.06)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nova senha */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(null) }}
                    placeholder="Mínimo 8 caracteres"
                    style={{ ...inputStyle(!!error), paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(237,28,36,0.4)' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirmar senha */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                  Confirmar senha
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(null) }}
                  placeholder="Repita a senha"
                  style={inputStyle(!!error && confirm !== password)}
                />
              </div>

              {/* Erro */}
              {error && (
                <p className="text-sm text-center py-3"
                  style={{ color: RED, background: 'rgba(237,28,36,0.06)', border: '1px solid rgba(237,28,36,0.2)', fontFamily: 'DM Sans, sans-serif' }}>
                  {error}
                </p>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 font-bold uppercase tracking-widest text-lg flex items-center justify-center gap-3 text-white disabled:opacity-60"
                style={{ background: loading ? '#C41219' : RED, fontFamily: 'Oswald, sans-serif', boxShadow: '0 8px 32px rgba(237,28,36,0.3)', marginTop: 8 }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#C41219' }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = RED }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><span>Salvar senha</span><ChevronRight size={20} /></>
                )}
              </motion.button>
            </form>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
            style={{ border: '1px solid rgba(237,28,36,0.15)', boxShadow: '0 4px 24px rgba(237,28,36,0.06)' }}
          >
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(237,28,36,0.08)', border: '2px solid rgba(237,28,36,0.3)' }}>
              <span style={{ fontSize: 28 }}>✓</span>
            </div>
            <h2 className="text-2xl font-bold uppercase mb-2" style={{ fontFamily: 'Oswald, sans-serif', color: RED }}>
              Senha definida!
            </h2>
            <p className="text-sm" style={{ color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>
              Redirecionando para o painel...
            </p>
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}
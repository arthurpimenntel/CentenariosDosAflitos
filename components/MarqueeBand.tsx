'use client'

export default function MarqueeBand() {
  const text = 'APOIO INCONDICIONAL \u2022 DESDE 2012 \u2022 N\u00c1UTICO CAPIBARIBE \u2022 OS CENTEN\u00c1RIOS DOS AFLITOS \u2022 O 12\u00ba JOGADOR \u2022 '
  const repeated = text.repeat(8)

  return (
    <div
      className="w-full overflow-hidden py-3 relative"
      style={{
        background: '#FFFFFF',
        borderTop: '2px solid rgba(237,28,36,0.12)',
        borderBottom: '2px solid rgba(237,28,36,0.12)',
      }}
      aria-label="Faixa de orgulho"
    >
      <div className="marquee-track">
        <span className="font-display font-bold text-sm md:text-base tracking-widest whitespace-nowrap px-4" style={{ color: '#ED1C24' }}>
          {repeated}
        </span>
        <span className="font-display font-bold text-sm md:text-base tracking-widest whitespace-nowrap px-4" style={{ color: '#ED1C24' }} aria-hidden="true">
          {repeated}
        </span>
      </div>
    </div>
  )
}

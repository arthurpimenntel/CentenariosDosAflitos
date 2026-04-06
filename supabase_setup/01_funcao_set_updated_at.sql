-- ══════════════════════════════════════════════════════════════════
--  PASSO 1 — Função set_updated_at (se ainda não existir)
--  Cole no SQL Editor do Supabase e clique Run
--  Esta função é usada pelos triggers de socios, produtos e noticias
-- ══════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

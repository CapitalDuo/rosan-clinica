ALTER TABLE clinica
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS plano_slug text NOT NULL DEFAULT 'gratuito'
    CHECK (plano_slug IN ('gratuito', 'basico', 'completo')),
  ADD COLUMN IF NOT EXISTS plano_status text NOT NULL DEFAULT 'ativo'
    CHECK (plano_status IN ('ativo', 'cancelado', 'trial', 'past_due')),
  ADD COLUMN IF NOT EXISTS plano_periodo_fim timestamptz;

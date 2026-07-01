-- Descrição completa da clínica (texto livre, preenchido no onboarding
-- ou depois em Configurações), diferente do "subtitulo" curto já existente.
ALTER TABLE public.clinica
  ADD COLUMN IF NOT EXISTS descricao text;

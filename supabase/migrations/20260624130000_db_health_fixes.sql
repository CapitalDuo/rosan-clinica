-- Correções de saúde do banco detectadas pelo Supabase Advisor

-- ============================================================
-- 1. SEGURANÇA: fix search_path na função create_sem_cadastro_patient
-- ============================================================
CREATE OR REPLACE FUNCTION private.create_sem_cadastro_patient()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.onboarding_completo = true AND (OLD.onboarding_completo IS DISTINCT FROM true) THEN
    INSERT INTO public.pacientes (clinica_id, nome, iniciais, cor, status, protegido)
    VALUES (NEW.id, 'Sem cadastro', 'SC', '#b0aaa3', 'ativo', true)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 2. PERFORMANCE: RLS InitPlan — (select auth.uid()) avalia
--    a função uma vez por query, não uma vez por linha
-- ============================================================
DROP POLICY IF EXISTS "planos_select_auth" ON planos;
CREATE POLICY "planos_select_auth" ON planos FOR SELECT
  USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "plat_admins_select_self_or_admin" ON plataforma_admins;
CREATE POLICY "plat_admins_select_self_or_admin" ON plataforma_admins FOR SELECT
  USING (private.is_platform_admin() OR (user_id = (select auth.uid())));

DROP POLICY IF EXISTS "profissionais_all" ON profissionais;
CREATE POLICY "profissionais_all" ON profissionais FOR ALL
  USING (private.is_platform_admin() OR (clinica_id = private.auth_clinica_id()) OR (user_id = (select auth.uid())))
  WITH CHECK (private.is_platform_admin() OR (clinica_id = private.auth_clinica_id()));

DROP POLICY IF EXISTS "suporte_mensagens_insert" ON suporte_mensagens;
CREATE POLICY "suporte_mensagens_insert" ON suporte_mensagens FOR INSERT
  WITH CHECK (
    (autor_id = (select auth.uid())) AND (
      ((autor_tipo = 'admin') AND private.is_platform_admin())
      OR
      ((autor_tipo = 'cliente') AND (EXISTS (
        SELECT 1 FROM suporte_tickets t
        WHERE t.id = suporte_mensagens.ticket_id
          AND t.clinica_id = private.auth_clinica_id()
      )))
    )
  );

DROP POLICY IF EXISTS "suporte_tickets_insert" ON suporte_tickets;
CREATE POLICY "suporte_tickets_insert" ON suporte_tickets FOR INSERT
  WITH CHECK (
    private.is_platform_admin()
    OR (clinica_id = private.auth_clinica_id() AND criado_por = (select auth.uid()))
  );

DROP POLICY IF EXISTS "tags_select_auth" ON tags;
CREATE POLICY "tags_select_auth" ON tags FOR SELECT
  USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "tipos_consulta_select_auth" ON tipos_consulta;
CREATE POLICY "tipos_consulta_select_auth" ON tipos_consulta FOR SELECT
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- 3. PERFORMANCE: índices em foreign keys sem cobertura
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_agendamentos_tipo_consulta  ON agendamentos(tipo_consulta_id);
CREATE INDEX IF NOT EXISTS idx_conversas_instancia          ON conversas(instancia_id);
CREATE INDEX IF NOT EXISTS idx_paciente_tags_tag            ON paciente_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_plano              ON pacientes(plano_id);
CREATE INDEX IF NOT EXISTS idx_profissionais_clinica        ON profissionais(clinica_id);
CREATE INDEX IF NOT EXISTS idx_prontuarios_agendamento      ON prontuarios(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_prontuarios_profissional     ON prontuarios(profissional_id);
CREATE INDEX IF NOT EXISTS idx_suporte_mensagens_autor      ON suporte_mensagens(autor_id);
CREATE INDEX IF NOT EXISTS idx_suporte_tickets_criado_por   ON suporte_tickets(criado_por);
CREATE INDEX IF NOT EXISTS idx_transacoes_paciente          ON transacoes(paciente_id);

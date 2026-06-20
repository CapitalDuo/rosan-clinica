-- Ativar RLS em TODAS as tabelas
alter table clinica enable row level security;
alter table horarios_funcionamento enable row level security;
alter table notificacao_config enable row level security;
alter table whatsapp_instancias enable row level security;
alter table whatsapp_eventos enable row level security;
alter table profissionais enable row level security;
alter table planos enable row level security;
alter table pacientes enable row level security;
alter table tags enable row level security;
alter table paciente_tags enable row level security;
alter table tipos_consulta enable row level security;
alter table agendamentos enable row level security;
alter table prontuarios enable row level security;
alter table conversas enable row level security;
alter table mensagens enable row level security;
alter table transacoes enable row level security;
alter table plataforma_admins enable row level security;
alter table suporte_tickets enable row level security;
alter table suporte_mensagens enable row level security;

-- ============================================================
-- CLÍNICA
-- ============================================================
create policy "clinica_select" on clinica for select
  using (is_platform_admin() or id = auth_clinica_id());

create policy "clinica_update" on clinica for update
  using (is_platform_admin() or id = auth_clinica_id())
  with check (is_platform_admin() or id = auth_clinica_id());

-- Apenas admin pode INSERT/DELETE clínicas
create policy "clinica_insert_admin" on clinica for insert
  with check (is_platform_admin());

create policy "clinica_delete_admin" on clinica for delete
  using (is_platform_admin());

-- ============================================================
-- TABELAS CLÍNICA-SCOPED (padrão: clinica_id direto)
-- ============================================================
create policy "horarios_all" on horarios_funcionamento for all
  using (is_platform_admin() or clinica_id = auth_clinica_id())
  with check (is_platform_admin() or clinica_id = auth_clinica_id());

create policy "notificacao_all" on notificacao_config for all
  using (is_platform_admin() or clinica_id = auth_clinica_id())
  with check (is_platform_admin() or clinica_id = auth_clinica_id());

create policy "whatsapp_inst_all" on whatsapp_instancias for all
  using (is_platform_admin() or clinica_id = auth_clinica_id())
  with check (is_platform_admin() or clinica_id = auth_clinica_id());

create policy "profissionais_all" on profissionais for all
  using (is_platform_admin() or clinica_id = auth_clinica_id() or user_id = auth.uid())
  with check (is_platform_admin() or clinica_id = auth_clinica_id());

create policy "pacientes_all" on pacientes for all
  using (is_platform_admin() or clinica_id = auth_clinica_id())
  with check (is_platform_admin() or clinica_id = auth_clinica_id());

-- ============================================================
-- TABELAS INDIRETAS (via FK)
-- ============================================================
create policy "whatsapp_eventos_all" on whatsapp_eventos for all
  using (
    is_platform_admin() or exists (
      select 1 from whatsapp_instancias w
      where w.id = whatsapp_eventos.instancia_id and w.clinica_id = auth_clinica_id()
    )
  )
  with check (
    is_platform_admin() or exists (
      select 1 from whatsapp_instancias w
      where w.id = whatsapp_eventos.instancia_id and w.clinica_id = auth_clinica_id()
    )
  );

create policy "paciente_tags_all" on paciente_tags for all
  using (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = paciente_tags.paciente_id and p.clinica_id = auth_clinica_id()
    )
  )
  with check (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = paciente_tags.paciente_id and p.clinica_id = auth_clinica_id()
    )
  );

create policy "agendamentos_all" on agendamentos for all
  using (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = agendamentos.paciente_id and p.clinica_id = auth_clinica_id()
    )
  )
  with check (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = agendamentos.paciente_id and p.clinica_id = auth_clinica_id()
    )
  );

create policy "prontuarios_all" on prontuarios for all
  using (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = prontuarios.paciente_id and p.clinica_id = auth_clinica_id()
    )
  )
  with check (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = prontuarios.paciente_id and p.clinica_id = auth_clinica_id()
    )
  );

create policy "conversas_all" on conversas for all
  using (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = conversas.paciente_id and p.clinica_id = auth_clinica_id()
    )
  )
  with check (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = conversas.paciente_id and p.clinica_id = auth_clinica_id()
    )
  );

create policy "mensagens_all" on mensagens for all
  using (
    is_platform_admin() or exists (
      select 1 from conversas c
      join pacientes p on p.id = c.paciente_id
      where c.id = mensagens.conversa_id and p.clinica_id = auth_clinica_id()
    )
  )
  with check (
    is_platform_admin() or exists (
      select 1 from conversas c
      join pacientes p on p.id = c.paciente_id
      where c.id = mensagens.conversa_id and p.clinica_id = auth_clinica_id()
    )
  );

create policy "transacoes_all" on transacoes for all
  using (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = transacoes.paciente_id and p.clinica_id = auth_clinica_id()
    )
  )
  with check (
    is_platform_admin() or exists (
      select 1 from pacientes p
      where p.id = transacoes.paciente_id and p.clinica_id = auth_clinica_id()
    )
  );

-- ============================================================
-- TABELAS DE REFERÊNCIA (planos, tags, tipos_consulta)
-- Qualquer autenticado lê; só admin escreve
-- ============================================================
create policy "planos_select_auth" on planos for select using (auth.uid() is not null);
create policy "planos_write_admin" on planos for all
  using (is_platform_admin()) with check (is_platform_admin());

create policy "tags_select_auth" on tags for select using (auth.uid() is not null);
create policy "tags_write_admin" on tags for all
  using (is_platform_admin()) with check (is_platform_admin());

create policy "tipos_consulta_select_auth" on tipos_consulta for select using (auth.uid() is not null);
create policy "tipos_consulta_write_admin" on tipos_consulta for all
  using (is_platform_admin()) with check (is_platform_admin());

-- ============================================================
-- PLATAFORMA ADMINS — só admins enxergam a tabela
-- ============================================================
create policy "plat_admins_select_self_or_admin" on plataforma_admins for select
  using (is_platform_admin() or user_id = auth.uid());

create policy "plat_admins_write_admin" on plataforma_admins for all
  using (is_platform_admin()) with check (is_platform_admin());

-- ============================================================
-- SUPORTE TICKETS
-- ============================================================
create policy "suporte_tickets_select" on suporte_tickets for select
  using (is_platform_admin() or clinica_id = auth_clinica_id());

create policy "suporte_tickets_insert" on suporte_tickets for insert
  with check (
    is_platform_admin() or
    (clinica_id = auth_clinica_id() and criado_por = auth.uid())
  );

create policy "suporte_tickets_update" on suporte_tickets for update
  using (is_platform_admin() or clinica_id = auth_clinica_id())
  with check (is_platform_admin() or clinica_id = auth_clinica_id());

create policy "suporte_tickets_delete_admin" on suporte_tickets for delete
  using (is_platform_admin());

-- ============================================================
-- SUPORTE MENSAGENS
-- ============================================================
create policy "suporte_mensagens_select" on suporte_mensagens for select
  using (
    is_platform_admin() or exists (
      select 1 from suporte_tickets t
      where t.id = suporte_mensagens.ticket_id and t.clinica_id = auth_clinica_id()
    )
  );

create policy "suporte_mensagens_insert" on suporte_mensagens for insert
  with check (
    autor_id = auth.uid() and (
      (autor_tipo = 'admin' and is_platform_admin()) or
      (autor_tipo = 'cliente' and exists (
        select 1 from suporte_tickets t
        where t.id = suporte_mensagens.ticket_id and t.clinica_id = auth_clinica_id()
      ))
    )
  );

create policy "suporte_mensagens_delete_admin" on suporte_mensagens for delete
  using (is_platform_admin());

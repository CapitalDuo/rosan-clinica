-- Fix search_path em triggers existentes
create or replace function fn_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function fn_mensagem_inserida()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  update conversas
  set
    ultima_mensagem_at = new.created_at,
    mensagens_nao_lidas = case
      when new.remetente_tipo = 'paciente' then mensagens_nao_lidas + 1
      else mensagens_nao_lidas
    end
  where id = new.conversa_id;
  return new;
end;
$$;

-- Revogar acesso REST aos helpers de RLS (não devem ser chamáveis via /rpc)
-- As policies que os usam continuam funcionando porque rodam em contexto SQL interno
revoke execute on function auth_clinica_id() from anon, authenticated, public;
revoke execute on function is_platform_admin() from anon, authenticated, public;

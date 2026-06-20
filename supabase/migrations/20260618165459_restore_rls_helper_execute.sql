-- Restaurar EXECUTE pra authenticated: as políticas RLS dependem dessas funções
-- Mantém revoke de anon (não queremos chamada via REST RPC sem login)
grant execute on function auth_clinica_id() to authenticated;
grant execute on function is_platform_admin() to authenticated;

-- Garantir que anon não pode chamar diretamente via /rpc
revoke execute on function auth_clinica_id() from anon, public;
revoke execute on function is_platform_admin() from anon, public;

-- Move auth_clinica_id() e is_platform_admin() pra schema 'private'
-- Policies e views referenciam por OID, então não precisamos reescrever nada.
-- PostgREST não expõe schemas não-públicos via REST, fechando o lint do advisor
-- "Signed-In Users Can Execute SECURITY DEFINER Function".

create schema if not exists private;

-- authenticated precisa enxergar o schema pra que as referências OID continuem funcionais
grant usage on schema private to authenticated;

alter function public.auth_clinica_id() set schema private;
alter function public.is_platform_admin() set schema private;

-- Garantir EXECUTE pro authenticated (políticas RLS dependem)
grant execute on function private.auth_clinica_id() to authenticated;
grant execute on function private.is_platform_admin() to authenticated;

-- Garantir revoke de anon (não devem ser RPC-callable nem logged-out)
revoke execute on function private.auth_clinica_id() from anon, public;
revoke execute on function private.is_platform_admin() from anon, public;

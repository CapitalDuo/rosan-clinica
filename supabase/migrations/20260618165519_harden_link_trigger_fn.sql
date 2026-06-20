-- Trigger function não deve ser chamável via REST RPC
revoke execute on function public.link_user_to_profissional() from anon, authenticated, public;

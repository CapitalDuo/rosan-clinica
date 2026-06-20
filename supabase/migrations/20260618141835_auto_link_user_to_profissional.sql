-- Quando um auth.user é criado, linkamos automaticamente ao profissional
-- já existente que tenha o mesmo email (pré-cadastrado pelo admin)
create or replace function public.link_user_to_profissional()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  update public.profissionais
  set user_id = new.id
  where email = new.email and user_id is null;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.link_user_to_profissional();

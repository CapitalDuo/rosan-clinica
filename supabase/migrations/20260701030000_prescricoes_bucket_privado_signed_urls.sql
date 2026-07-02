-- Fecha o vazamento de PDFs de prescrição (dado de saúde, LGPD): o bucket era
-- público e tinha SELECT amplo pra anon (listagem + download de todas as
-- clínicas sem login). Passa a ser privado com leitura escopada por clínica;
-- o app exibe via URL assinada.

-- 1) Bucket privado: objetos deixam de ser servidos em /object/public/...
update storage.buckets set public = false where id = 'prescricoes';

-- 2) Leitura exige login e pertencer à clínica dona da pasta (espelha o INSERT).
drop policy if exists "prescricoes_storage_read" on storage.objects;
create policy "prescricoes_storage_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'prescricoes'
    and (storage.foldername(name))[1] in (
      select p.clinica_id::text from public.profissionais p
      where p.user_id = (select auth.uid())
    )
  );

-- 3) Não havia policy de DELETE — o remove() do app falhava em silêncio e
-- deixava PDF órfão no bucket. Mesmo escopo do INSERT/SELECT.
create policy "prescricoes_storage_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'prescricoes'
    and (storage.foldername(name))[1] in (
      select p.clinica_id::text from public.profissionais p
      where p.user_id = (select auth.uid())
    )
  );

-- 4) prescricoes.pdf_url passa a guardar o PATH do objeto (a URL assinada é
-- gerada na exibição). Converte as URLs públicas antigas.
update public.prescricoes
set pdf_url = regexp_replace(pdf_url, '^.*/storage/v1/object/public/prescricoes/', '')
where pdf_url like '%/storage/v1/object/public/prescricoes/%';

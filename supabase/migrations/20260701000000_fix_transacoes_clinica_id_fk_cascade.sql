-- transacoes_clinica_id_fkey foi criada sem ON DELETE CASCADE (única FK
-- para clinica(id) em todo o banco nessa condição), bloqueando exclusão
-- de clínica quando há lançamentos avulsos (sem paciente_id).
ALTER TABLE public.transacoes
  DROP CONSTRAINT transacoes_clinica_id_fkey;

ALTER TABLE public.transacoes
  ADD CONSTRAINT transacoes_clinica_id_fkey
    FOREIGN KEY (clinica_id)
    REFERENCES public.clinica(id)
    ON DELETE CASCADE;

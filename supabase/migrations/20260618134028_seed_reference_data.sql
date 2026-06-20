insert into planos (nome, tipo) values
  ('Unimed', 'convenio'),
  ('Bradesco', 'convenio'),
  ('SulAmérica', 'convenio'),
  ('Amil', 'convenio'),
  ('Particular', 'particular');

insert into tags (nome) values
  ('Retorno'),
  ('Crônico'),
  ('Gestante'),
  ('Idoso'),
  ('Pediátrico'),
  ('Urgência');

insert into tipos_consulta (nome, cor, duracao_padrao) values
  ('Consulta', '#b8a88a', '30 minutes'),
  ('Retorno', '#8ab89b', '20 minutes'),
  ('Limpeza', '#a88ab8', '45 minutes'),
  ('Avaliação', '#8a8ab8', '40 minutes'),
  ('Exame', '#b88a8a', '30 minutes');

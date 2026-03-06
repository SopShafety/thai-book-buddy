alter table profiles
  add column if not exists age integer,
  add column if not exists gender text;

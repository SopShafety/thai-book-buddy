-- Publishers: one row per publisher
create table publishers (
  id          uuid primary key default gen_random_uuid(),
  name_th     text not null,
  name_en     text,
  category    text[] default '{}',
  logo_url    text,
  created_at  timestamptz default now()
);

-- Booths: one row per booth, publisher can have many
create table booths (
  id             uuid primary key default gen_random_uuid(),
  publisher_id   uuid not null references publishers(id) on delete cascade,
  zone           text,
  booth_number   text,
  x              float,
  y              float
);

-- User selections: publishers a user wants to visit
create table user_selections (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(id) on delete cascade,
  publisher_id   uuid not null references publishers(id) on delete cascade,
  created_at     timestamptz default now(),
  unique(user_id, publisher_id)
);

-- User books: books to buy at a publisher
create table user_books (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(id) on delete cascade,
  publisher_id   uuid not null references publishers(id) on delete cascade,
  title          text not null,
  price          integer,
  is_purchased   boolean default false,
  created_at     timestamptz default now()
);

-- Publishers and booths are public (read-only for all)
alter table publishers enable row level security;
alter table booths enable row level security;
alter table user_selections enable row level security;
alter table user_books enable row level security;

create policy "Anyone can read publishers"
  on publishers for select using (true);

create policy "Anyone can read booths"
  on booths for select using (true);

create policy "Users manage their own selections"
  on user_selections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own books"
  on user_books for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

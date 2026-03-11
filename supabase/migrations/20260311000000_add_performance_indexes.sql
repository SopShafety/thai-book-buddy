-- Indexes for user_selections: filter/delete by user_id and publisher_id
create index if not exists idx_user_selections_user_id
  on user_selections(user_id);

create index if not exists idx_user_selections_publisher_id
  on user_selections(publisher_id);

-- Indexes for user_books: filter by user_id and publisher_id
create index if not exists idx_user_books_user_id
  on user_books(user_id);

create index if not exists idx_user_books_publisher_id
  on user_books(publisher_id);

-- Index for booths: join from publishers
create index if not exists idx_booths_publisher_id
  on booths(publisher_id);

-- Index for publishers: full-text-style search on name_th
create index if not exists idx_publishers_name_th
  on publishers(name_th);

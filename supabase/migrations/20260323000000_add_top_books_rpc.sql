create or replace function admin_get_top_books(n integer default 10)
returns table(title text, count bigint)
language sql
security invoker
as $$
  select
    regexp_replace(trim(ub.title), '\s+', ' ', 'g') as title,
    count(*) as count
  from user_books ub
  where ub.title is not null
    and trim(ub.title) != ''
  group by regexp_replace(trim(ub.title), '\s+', ' ', 'g')
  order by count desc
  limit n;
$$;

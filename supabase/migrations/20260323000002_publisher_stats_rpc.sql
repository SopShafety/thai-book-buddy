create or replace function admin_get_publisher_stats()
returns table(
  id uuid,
  name_th text,
  name_en text,
  saves bigint,
  books_added bigint
)
language sql
security invoker
as $$
  select
    p.id,
    p.name_th,
    p.name_en,
    count(distinct us.user_id) as saves,
    count(ub.id)               as books_added
  from publishers p
  left join user_selections us on us.publisher_id = p.id
  left join user_books      ub on ub.publisher_id = p.id
  group by p.id, p.name_th, p.name_en
  order by saves desc;
$$;

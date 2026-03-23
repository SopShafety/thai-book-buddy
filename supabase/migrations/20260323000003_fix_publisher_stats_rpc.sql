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
    coalesce(us.saves, 0)       as saves,
    coalesce(ub.books_added, 0) as books_added
  from publishers p
  left join (
    select publisher_id, count(distinct user_id) as saves
    from user_selections
    group by publisher_id
  ) us on us.publisher_id = p.id
  left join (
    select publisher_id, count(*) as books_added
    from user_books
    group by publisher_id
  ) ub on ub.publisher_id = p.id
  order by saves desc;
$$;

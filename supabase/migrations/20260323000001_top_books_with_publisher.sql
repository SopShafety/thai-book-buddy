drop function if exists admin_get_top_books(integer);

create or replace function admin_get_top_books(n integer default 10)
returns table(title text, count bigint, publisher_name text)
language sql
security invoker
as $$
  with book_publisher_counts as (
    select
      regexp_replace(trim(ub.title), '\s+', ' ', 'g') as norm_title,
      ub.publisher_id,
      count(*) as cnt
    from user_books ub
    where ub.title is not null and trim(ub.title) != ''
    group by norm_title, ub.publisher_id
  ),
  book_totals as (
    select norm_title, sum(cnt) as total_count
    from book_publisher_counts
    group by norm_title
  ),
  top_publisher_per_book as (
    select distinct on (bpc.norm_title)
      bpc.norm_title,
      p.name_th as publisher_name
    from book_publisher_counts bpc
    join publishers p on p.id = bpc.publisher_id
    order by bpc.norm_title, bpc.cnt desc
  )
  select
    bt.norm_title as title,
    bt.total_count as count,
    tppb.publisher_name
  from book_totals bt
  join top_publisher_per_book tppb on tppb.norm_title = bt.norm_title
  order by bt.total_count desc
  limit n;
$$;

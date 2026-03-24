create or replace function admin_get_dau()
returns table(date text, count bigint)
language sql
security invoker
as $$
  select
    to_char(created_at at time zone 'Asia/Bangkok', 'YYYY-MM-DD') as date,
    count(distinct user_id) as count
  from sessions
  group by 1
  order by 1;
$$;

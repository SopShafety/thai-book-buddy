drop function if exists admin_get_publisher_demographics(uuid);

create or replace function admin_get_publisher_demographics(p_publisher_id uuid)
returns table(age text, gender text, count bigint)
language sql
security invoker
as $$
  select
    p.age,
    p.gender,
    count(*) as count
  from user_selections us
  join profiles p on p.id = us.user_id
  where us.publisher_id = p_publisher_id
    and p.age is not null
    and p.gender is not null
  group by p.age, p.gender
  order by count desc;
$$;

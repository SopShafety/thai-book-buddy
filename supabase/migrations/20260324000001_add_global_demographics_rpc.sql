create or replace function admin_get_global_demographics()
returns table(dimension text, value text, count bigint)
language sql
security invoker
as $$
  select 'age'::text as dimension, age as value, count(*) as count
  from profiles
  where age is not null and gender is not null
  group by age
  union all
  select 'gender'::text, gender, count(*)
  from profiles
  where age is not null and gender is not null
  group by gender;
$$;

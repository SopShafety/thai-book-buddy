-- Backfill sessions for 2026-03-27 (Bangkok time).
-- Session tracking was accidentally removed on that date, so we reconstruct
-- active users from their earliest activity in user_selections, user_books,
-- and profiles (new signups). One row per user, skipping any who already
-- have a session recorded for that day.

insert into sessions (user_id, created_at)
select user_id, min(created_at)
from (
  select user_id, created_at from user_selections
  where to_char(created_at at time zone 'Asia/Bangkok', 'YYYY-MM-DD') = '2026-03-27'
  union all
  select user_id, created_at from user_books
  where to_char(created_at at time zone 'Asia/Bangkok', 'YYYY-MM-DD') = '2026-03-27'
  union all
  select id as user_id, created_at from profiles
  where to_char(created_at at time zone 'Asia/Bangkok', 'YYYY-MM-DD') = '2026-03-27'
) activity
where not exists (
  select 1 from sessions s
  where s.user_id = activity.user_id
    and to_char(s.created_at at time zone 'Asia/Bangkok', 'YYYY-MM-DD') = '2026-03-27'
)
group by user_id;

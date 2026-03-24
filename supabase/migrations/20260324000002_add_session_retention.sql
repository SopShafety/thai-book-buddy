create extension if not exists pg_cron;

-- Remove existing job if present (idempotent)
select cron.unschedule(jobid)
from cron.job
where jobname = 'cleanup-old-sessions';

-- Delete sessions older than 60 days, runs daily at 2am UTC
select cron.schedule(
  'cleanup-old-sessions',
  '0 2 * * *',
  'delete from public.sessions where created_at < now() - interval ''60 days'''
);

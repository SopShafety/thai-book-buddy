-- Change age from integer to text to store age range values
-- e.g. "under_18", "18_24", "25_34", "35_44", "45_54", "55_plus"
alter table profiles
  alter column age type text using
    case age
      when 15 then 'under_18'
      when 21 then '18_24'
      when 29 then '25_34'
      when 39 then '35_44'
      when 49 then '45_54'
      when 60 then '55_plus'
      else age::text
    end;

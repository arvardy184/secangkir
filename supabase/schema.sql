create table if not exists warung (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  nama text not null,
  deskripsi text,
  vibe_tags text[],
  price_range text,
  lat double precision,
  lng double precision,
  alamat text,
  ai_bio text,
  ai_captions text[],
  ai_tagline text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_warung_owner_id on warung(owner_id);
create index if not exists idx_warung_created_at on warung(created_at desc);
create index if not exists idx_warung_vibe_tags on warung using gin(vibe_tags);

alter table warung enable row level security;

drop policy if exists "Owner can manage their warung" on warung;
create policy "Owner can manage their warung"
  on warung for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Public can read warung" on warung;
create policy "Public can read warung"
  on warung for select
  using (true);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists warung_updated_at on warung;
create trigger warung_updated_at
  before update on warung
  for each row execute function update_updated_at();

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
  ai_image_prompt text,
  ai_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table warung add column if not exists ai_image_prompt text;
alter table warung add column if not exists ai_image_url text;

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

-- Optional Supabase Storage policies for a public bucket named "warung-assets".
-- Run these if uploads from /api/v1/generate-image fail with a storage RLS error.
insert into storage.buckets (id, name, public)
values ('warung-assets', 'warung-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read warung assets" on storage.objects;
create policy "Public can read warung assets"
  on storage.objects for select
  using (bucket_id = 'warung-assets');

drop policy if exists "Authenticated users can upload warung assets" on storage.objects;
create policy "Authenticated users can upload warung assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'warung-assets');

drop policy if exists "Authenticated users can update warung assets" on storage.objects;
create policy "Authenticated users can update warung assets"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'warung-assets')
  with check (bucket_id = 'warung-assets');

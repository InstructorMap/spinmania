-- El Oráculo: backend opcional, separado de YUNA.
-- Aplicar únicamente en un proyecto Supabase dedicado a El Oráculo.
create table if not exists public.oraculo_player_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null default '{}'::jsonb,
  save_version integer not null default 1,
  updated_at timestamptz not null default now(),
  constraint oraculo_save_object check (jsonb_typeof(save_data) = 'object'),
  constraint oraculo_save_size check (octet_length(save_data::text) <= 262144)
);
alter table public.oraculo_player_saves enable row level security;
revoke all on public.oraculo_player_saves from anon;
grant select, insert, update on public.oraculo_player_saves to authenticated;
create policy "oraculo_read_own_save" on public.oraculo_player_saves for select to authenticated using ((select auth.uid()) = user_id);
create policy "oraculo_insert_own_save" on public.oraculo_player_saves for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "oraculo_update_own_save" on public.oraculo_player_saves for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Nunca publicar service_role en Android/WebView. Usar clave publishable y Auth.

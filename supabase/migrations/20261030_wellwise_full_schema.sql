-- ==============================================================================
-- WellWise AI — Complete Full-Stack Database Schema with Row Level Security (RLS)
-- Version: 2.0.0
-- Description: Supports all 12 healthcare platform features:
--   1. Profiles (user metadata, language, phone, DOB)
--   2. Health Records Vault (categories, vitals metadata, secure file storage)
--   3. Medicine Reminders (dosage, schedule, taken/skipped logs)
--   4. Vaccinations (UIP schedules + personal vaccination records)
--   5. Doctor Appointments (clinic, date, notes, status)
--   6. Doctor Passports (Voice-to-Doctor structured summaries)
--   7. Health Conversations (AI chat sessions)
--   8. Health Messages (Chat history)
--   9. Emergency Contacts (112 rapid access + personal contacts)
--  10. User Preferences (language, notifications, accessibility)
--  11. Saved Articles (Bookmarks for health education)
--  12. Notifications (real-time alerts, reminders, updates)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  preferred_language text default 'en' check (preferred_language in ('en', 'mr', 'hi', 'kn')),
  phone_number text,
  date_of_birth date,
  birth_year integer,
  blood_group text,
  emergency_notes text,
  region text default 'India',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure newly added profile columns exist if upgrading
alter table public.profiles add column if not exists phone_number text;
alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists blood_group text;
alter table public.profiles add column if not exists emergency_notes text;

-- ------------------------------------------------------------------------------
-- 2. USER PREFERENCES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.user_preferences (
  user_id uuid references auth.users(id) on delete cascade primary key,
  language text default 'en' check (language in ('en', 'mr', 'hi', 'kn')),
  compact_cards boolean default false not null,
  notifications_enabled boolean default true not null,
  medicine_alerts boolean default true not null,
  accessibility_mode boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_preferences add column if not exists language text default 'en';
alter table public.user_preferences add column if not exists medicine_alerts boolean default true;
alter table public.user_preferences add column if not exists accessibility_mode boolean default false;

-- ------------------------------------------------------------------------------
-- 3. HEALTH RECORDS TABLE (Vault)
-- ------------------------------------------------------------------------------
create table if not exists public.health_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  record_title text not null,
  record_type text not null check (record_type in ('Vitals', 'Lab Report', 'Prescription', 'Imaging', 'Vaccination', 'Allergies', 'Other')),
  description text,
  record_date date default current_date not null,
  file_path text,
  file_name text,
  file_size integer,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. MEDICINE REMINDERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.medicine_reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  medicine_name text not null,
  dosage text not null,
  instructions text,
  schedule text not null,
  time_of_day text default '20:00',
  start_date date default current_date not null,
  end_date date,
  is_active boolean default true not null,
  taken_today boolean default false not null,
  last_taken_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 5. VACCINATIONS TABLE (Personal & Family)
-- ------------------------------------------------------------------------------
create table if not exists public.vaccinations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  recipient_name text default 'Self' not null,
  vaccine_name text not null,
  dose text default 'Dose 1' not null,
  vaccination_date date,
  next_due_date date,
  status text default 'upcoming' check (status in ('completed', 'upcoming', 'overdue', 'scheduled')),
  notes text,
  administered_by text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 6. DOCTOR APPOINTMENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  doctor_name text not null,
  specialty text,
  clinic_name text,
  appointment_date timestamp with time zone not null,
  location text,
  notes text,
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 7. DOCTOR PASSPORTS TABLE (Voice-to-Doctor Summaries)
-- ------------------------------------------------------------------------------
create table if not exists public.doctor_passports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  patient_name text not null,
  age integer,
  visit_date date default current_date not null,
  chief_symptoms text not null,
  duration text not null,
  severity text default 'Moderate',
  existing_conditions text,
  current_medicines text,
  allergies text,
  questions_for_doctor text,
  generated_summary text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 8. HEALTH CONVERSATIONS & MESSAGES (AI Assistant History)
-- ------------------------------------------------------------------------------
create table if not exists public.health_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Health Inquiry',
  language text default 'en' check (language in ('en', 'mr', 'hi', 'kn')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.health_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.health_conversations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Also support existing chat_conversations / chat_messages
create table if not exists public.chat_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Health Inquiry',
  language text default 'en' check (language in ('en', 'mr', 'hi', 'kn')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.chat_conversations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 9. EMERGENCY CONTACTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.emergency_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  phone text not null,
  relationship text,
  is_primary boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 10. HEALTH ARTICLES (Public Educational Library)
-- ------------------------------------------------------------------------------
create table if not exists public.health_articles (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  category text not null check (category in ('Conditions', 'Wellness', 'Nutrition', 'Prevention', 'Mental Wellness', 'First Aid')),
  summary text not null,
  content text not null,
  image_url text,
  language text default 'en' not null,
  source_name text not null,
  source_url text,
  reviewed_date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 11. SAVED ARTICLES (Bookmarks)
-- ------------------------------------------------------------------------------
create table if not exists public.saved_articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  article_id uuid references public.health_articles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, article_id)
);

-- ------------------------------------------------------------------------------
-- 12. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  notification_type text not null,
  title text not null,
  message text not null,
  link text,
  read_status boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
create index if not exists idx_health_records_user on public.health_records(user_id);
create index if not exists idx_health_records_type on public.health_records(record_type);
create index if not exists idx_medicine_reminders_user on public.medicine_reminders(user_id);
create index if not exists idx_vaccinations_user on public.vaccinations(user_id);
create index if not exists idx_appointments_user on public.appointments(user_id);
create index if not exists idx_doctor_passports_user on public.doctor_passports(user_id);
create index if not exists idx_health_conv_user on public.health_conversations(user_id);
create index if not exists idx_health_msg_conv on public.health_messages(conversation_id);
create index if not exists idx_chat_conv_user on public.chat_conversations(user_id);
create index if not exists idx_chat_msg_conv on public.chat_messages(conversation_id);
create index if not exists idx_emergency_contacts_user on public.emergency_contacts(user_id);
create index if not exists idx_saved_articles_user on public.saved_articles(user_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_unread on public.notifications(user_id, read_status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can ONLY access their own healthcare data
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.health_records enable row level security;
alter table public.medicine_reminders enable row level security;
alter table public.vaccinations enable row level security;
alter table public.appointments enable row level security;
alter table public.doctor_passports enable row level security;
alter table public.health_conversations enable row level security;
alter table public.health_messages enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.health_articles enable row level security;
alter table public.saved_articles enable row level security;
alter table public.notifications enable row level security;

-- PROFILES
drop policy if exists "Users view own profile" on public.profiles;
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- USER PREFERENCES
drop policy if exists "Users view own prefs" on public.user_preferences;
create policy "Users view own prefs" on public.user_preferences for select using (auth.uid() = user_id);
drop policy if exists "Users insert own prefs" on public.user_preferences;
create policy "Users insert own prefs" on public.user_preferences for insert with check (auth.uid() = user_id);
drop policy if exists "Users update own prefs" on public.user_preferences;
create policy "Users update own prefs" on public.user_preferences for update using (auth.uid() = user_id);

-- HEALTH RECORDS
drop policy if exists "Users manage own health records" on public.health_records;
create policy "Users manage own health records" on public.health_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- MEDICINE REMINDERS
drop policy if exists "Users manage own medicine reminders" on public.medicine_reminders;
create policy "Users manage own medicine reminders" on public.medicine_reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- VACCINATIONS
drop policy if exists "Users manage own vaccinations" on public.vaccinations;
create policy "Users manage own vaccinations" on public.vaccinations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- APPOINTMENTS
drop policy if exists "Users manage own appointments" on public.appointments;
create policy "Users manage own appointments" on public.appointments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- DOCTOR PASSPORTS
drop policy if exists "Users manage own doctor passports" on public.doctor_passports;
create policy "Users manage own doctor passports" on public.doctor_passports
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- HEALTH CONVERSATIONS & MESSAGES
drop policy if exists "Users manage own health conversations" on public.health_conversations;
create policy "Users manage own health conversations" on public.health_conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own health messages" on public.health_messages;
create policy "Users manage own health messages" on public.health_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own chat conversations" on public.chat_conversations;
create policy "Users manage own chat conversations" on public.chat_conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own chat messages" on public.chat_messages;
create policy "Users manage own chat messages" on public.chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- EMERGENCY CONTACTS
drop policy if exists "Users manage own emergency contacts" on public.emergency_contacts;
create policy "Users manage own emergency contacts" on public.emergency_contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- HEALTH ARTICLES (Public Read)
drop policy if exists "Health articles are publicly readable" on public.health_articles;
create policy "Health articles are publicly readable" on public.health_articles
  for select using (true);

-- SAVED ARTICLES
drop policy if exists "Users manage own saved articles" on public.saved_articles;
create policy "Users manage own saved articles" on public.saved_articles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- NOTIFICATIONS
drop policy if exists "Users manage own notifications" on public.notifications;
create policy "Users manage own notifications" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE & WELCOME NOTIFICATION TRIGGER
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, preferred_language)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'en')
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id, compact_cards, notifications_enabled)
  values (new.id, false, true)
  on conflict (user_id) do nothing;

  insert into public.notifications (user_id, notification_type, title, message, link)
  values (
    new.id,
    'system',
    'Welcome to WellWise AI! 🌿',
    'Your personalized health dashboard is ready. Explore your Health Record Vault, AI Assistant, and Reminders.',
    '/dashboard'
  );

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

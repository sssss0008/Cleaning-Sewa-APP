# Cleaning Sewa - Supabase Backend & Database Setup Guide

This guide provides instructions to connect and set up the Supabase database backend for **Cleaning Sewa**.

---

## Supabase Project Details
* **Project Dashboard**: [https://supabase.com/dashboard/project/idzvconrzundcqkiibmh](https://supabase.com/dashboard/project/idzvconrzundcqkiibmh)
* **Project ID**: `idzvconrzundcqkiibmh`
* **API Base URL**: `https://idzvconrzundcqkiibmh.supabase.co`

---

## Step 1: Run SQL Schema Migration

1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/idzvconrzundcqkiibmh](https://supabase.com/dashboard/project/idzvconrzundcqkiibmh)
2. In the left navigation sidebar, click on **SQL Editor**.
3. Click **"New Query"**.
4. Copy and paste the complete content of [supabase/schema.sql](supabase/schema.sql).
5. Click **"Run"** (or press `Ctrl` + `Enter`).

---

## Step 2: Verification

After running the SQL script, navigate to **Table Editor** in your Supabase Dashboard to confirm the creation of the following 8 tables:

| Table Name | Purpose | RLS Policy |
| :--- | :--- | :--- |
| `public.users` | Customer & Professional user profile identity records | Enabled |
| `public.services` | Cleaning service catalog (Pre-seeded with 33+ services) | Enabled (Public Read) |
| `public.bookings` | Customer cleaning appointment requests & status tracking | Enabled (Public Select/Insert/Update) |
| `public.payments` | Financial transactions ledger (eSewa gateway payments) | Enabled (Public Select/Insert) |
| `public.careers` | "Join as Professional" job application submissions | Enabled (Public Select/Insert) |
| `public.partnerships` | Corporate partnership application submissions | Enabled (Public Select/Insert) |
| `public.feedback` | Customer contact form inquiries & support messages | Enabled (Public Select/Insert) |
| `public.favourites` | Bookmarked favorite cleaning services per user | Enabled |

---

## Step 3: Application Environment Linking

The application is configured to connect directly to `https://idzvconrzundcqkiibmh.supabase.co`.

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Retrieve your **anon public API key** from your Supabase Dashboard (**Settings > API > Project API keys > anon public**).
3. Set the key in your `.env` file:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://idzvconrzundcqkiibmh.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

---

## Step 4: Live Data Synchronization

The mobile and web applications use `src/services/supabaseClient.ts` to sync data bi-directionally:
- **Offline / Local Backup**: Saves immediately to local `AsyncStorage` for instant UI feedback.
- **Cloud Database Sync**: Asynchronously posts and fetches records from Supabase PostgREST endpoints (`/rest/v1/bookings`, `/rest/v1/payments`, `/rest/v1/careers`, etc.).

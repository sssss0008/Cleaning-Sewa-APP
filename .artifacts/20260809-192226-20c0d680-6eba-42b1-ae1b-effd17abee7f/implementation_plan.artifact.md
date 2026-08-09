# Supabase Backend Integration Plan

This plan outlines the steps to integrate Supabase as the backend for the Cleaning Sewa application, enabling persistent storage for service bookings, career applications, and partnership requests.

## User Review Required

> [!IMPORTANT]
> - You will need to provide your **Supabase URL** and **Anon Key** to make the integration functional.
> - The plan includes a migration script for Supabase. You will need to run this in the Supabase SQL Editor.

## Proposed Changes

### Configuration and Setup

#### [NEW] [supabase.ts](file:///C:/Users/HP/Cleaning%20Sewa/src/lib/supabase.ts)

- Initialize the Supabase client using environment variables.

#### [NEW] [database.sql](file:///C:/Users/HP/Cleaning%20Sewa/supabase/migrations/database.sql)

- SQL script to create tables: `bookings`, `career_applications`, `partnership_applications`.
- Set up Row Level Security (RLS) policies for security.

---

### Data Services

#### [NEW] [bookingService.ts](file:///C:/Users/HP/Cleaning%20Sewa/src/services/bookingService.ts)

- Functions to submit booking requests and handle file uploads (optional/storage).

#### [NEW] [careerService.ts](file:///C:/Users/HP/Cleaning%20Sewa/src/services/careerService.ts)

- Functions to submit career applications.

#### [NEW] [partnershipService.ts](file:///C:/Users/HP/Cleaning%20Sewa/src/services/partnershipService.ts)

- Functions to submit partnership applications.

---

### UI Integration

#### [Book.tsx](file:///C:/Users/HP/Cleaning%20Sewa/app/(drawer)/(tabs)/Book.tsx)

- Update `handleSubmit` to call `bookingService.submitBooking`.

#### [Career.tsx](file:///C:/Users/HP/Cleaning%20Sewa/app/(drawer)/Career.tsx)

- Update `handleSubmit` to call `careerService.submitApplication`.

#### [Partnership.tsx](file:///C:/Users/HP/Cleaning%20Sewa/app/(drawer)/Partnership.tsx)

- Update `handleSubmit` to call `partnershipService.submitApplication`.

---

## Verification Plan

### Automated Tests
- I will perform static analysis using `analyze_file` on all modified files to ensure no syntax or type errors.

### Manual Verification
- **Form Submission**: Verify that forms show the loading state and then a success message.
- **Database Logs**: (User action) Check the Supabase dashboard to ensure data is appearing in the tables.
- **Error Handling**: Verify that if the Supabase call fails, an appropriate alert is shown to the user.

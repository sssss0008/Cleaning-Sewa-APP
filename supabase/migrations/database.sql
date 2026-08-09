-- Supabase Database Schema for CleaningSewa

-- 1. SERVICE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    landmark TEXT,
    budget TEXT NOT NULL,
    service TEXT NOT NULL,
    property_type TEXT,
    timing TEXT NOT NULL,
    lead_source TEXT NOT NULL,
    message TEXT,
    image_url TEXT, -- URL to the photo stored in Supabase Storage
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled'))
);

-- 2. CAREER APPLICATIONS TABLE (Professionals)
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    position_applied TEXT NOT NULL,
    experience_years INTEGER NOT NULL,
    preferred_area TEXT[] NOT NULL,
    emergency_contact TEXT NOT NULL,
    cover_letter TEXT NOT NULL,
    short_bio TEXT NOT NULL,
    id_proof_urls TEXT[], -- Array of URLs for ID images
    certificate_urls TEXT[], -- Array of URLs for certificate images
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Accepted', 'Rejected'))
);

-- 3. PARTNERSHIP APPLICATIONS TABLE (Agencies/Partners)
CREATE TABLE IF NOT EXISTS public.partnership_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    business_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    business_type TEXT[] NOT NULL,
    years_in_operation INTEGER NOT NULL,
    registration_number TEXT,
    coverage_area TEXT[] NOT NULL,
    interest_duration TEXT NOT NULL,
    proposal TEXT NOT NULL,
    document_urls TEXT[], -- Array of URLs for business docs
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Accepted', 'Rejected'))
);

-- 4. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    message TEXT NOT NULL,
    user_email TEXT -- Optional, link to a user if needed
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Insert Access)
CREATE POLICY "Enable insert for everyone" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for everyone" ON public.career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for everyone" ON public.partnership_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for everyone" ON public.feedback FOR INSERT WITH CHECK (true);

-- Admin View Policy (Restrict to Admin roles later or keep simple for now)
-- For now, let's assume we read them via Service Role in the future or simple public read for demo
CREATE POLICY "Enable read for everyone" ON public.bookings FOR SELECT USING (true);

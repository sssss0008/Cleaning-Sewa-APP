-- =====================================================================
-- Cleaning Sewa Database Schema & Initial Seed
-- Supabase Project ID: idzvconrzundcqkiibmh
-- Supabase URL: https://idzvconrzundcqkiibmh.supabase.co
-- =====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users / Profiles Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL DEFAULT 'cleaningsewa@sriyog.com',
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'professional', 'admin')),
    language_preference VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Services Catalog Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    base_price NUMERIC(10,2) NOT NULL DEFAULT 1500.00,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    booking_date VARCHAR(50) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 2500.00,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Confirmed & Paid', 'In-Progress', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Payments Ledger Table
CREATE TABLE IF NOT EXISTS public.payments (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id VARCHAR(100),
    gateway_name VARCHAR(30) DEFAULT 'eSewa',
    transaction_reference VARCHAR(255) UNIQUE NOT NULL,
    amount_paid NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Paid',
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Professional Careers Table
CREATE TABLE IF NOT EXISTS public.careers (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) DEFAULT 'cleaningsewa@sriyog.com',
    gender VARCHAR(20) DEFAULT 'Male',
    expertise VARCHAR(255) NOT NULL,
    experience_years INT DEFAULT 1,
    city VARCHAR(100) NOT NULL,
    working_area VARCHAR(255) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    verification VARCHAR(30) DEFAULT 'Verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Corporate Partnerships Table
CREATE TABLE IF NOT EXISTS public.partnerships (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name VARCHAR(150) NOT NULL,
    organization_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) DEFAULT 'cleaningsewa@sriyog.com',
    area VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Customer Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    message TEXT NOT NULL,
    email VARCHAR(255) DEFAULT 'cleaningsewa@sriyog.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Favourites Table
CREATE TABLE IF NOT EXISTS public.favourites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

-- Allow Public Read & Insert Access for Web / Mobile App Clients
CREATE POLICY "Allow public read access to services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public insert to bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public update to bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert to careers" ON public.careers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to careers" ON public.careers FOR SELECT USING (true);
CREATE POLICY "Allow public insert to partnerships" ON public.partnerships FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to partnerships" ON public.partnerships FOR SELECT USING (true);
CREATE POLICY "Allow public insert to feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to feedback" ON public.feedback FOR SELECT USING (true);

-- =====================================================================
-- INITIAL SEED DATA FOR SERVICES
-- =====================================================================
INSERT INTO public.services (title, category_name, base_price, description) VALUES
('Bathroom Cleaning', 'Home Services', 1500.00, 'Deep sanitization and scale removal for bathrooms'),
('Kitchen Cleaning', 'Home Services', 2000.00, 'Degreasing, appliance sanitization, and deep kitchen cleaning'),
('Full Home Cleaning', 'Home Services', 5000.00, 'Complete deep home cleaning for apartments and houses'),
('Carpet Cleaning', 'Upholstery', 1800.00, 'High-pressure vacuuming and stain removal for carpets'),
('Sofa Upholstery Cleaning', 'Upholstery', 2200.00, 'Fabric and leather sofa deep washing and sanitization'),
('Move-In/Move-Out Cleaning', 'Home Services', 4500.00, 'Pre-occupancy and post-tenancy thorough cleaning'),
('Disinfection & Sanitization', 'Health & Safety', 2500.00, 'Medical-grade fogging and surface sanitization'),
('A/C Cleaning & Servicing', 'Appliance', 1200.00, 'Air filter deep cleaning and coil washing'),
('Laptop Cleaning', 'Tech', 500.00, 'Internal dust cleaning and thermal paste re-application'),
('Desktop Cleaning', 'Tech', 800.00, 'Hardware dust blowing and cable management'),
('Aeroplane Cleaning', 'Specialized', 25000.00, 'Commercial aircraft interior and exterior detailing'),
('Helicopter Cleaning', 'Specialized', 15000.00, 'Helicopter cabin and glass polishing'),
('Reserve Tank Cleaning', 'Water Services', 3500.00, 'Underground and overhead water tank scrubbing'),
('Marble & Tile Polishing', 'Flooring', 4000.00, 'Diamond floor grinding and high-gloss marble polishing'),
('Post-Construction Cleaning', 'Heavy Duty', 6000.00, 'Debris removal, paint scraping, and post-build cleanup'),
('Garden & Yard Cleaning', 'Outdoor', 3000.00, 'Lawn trimming, weed removal, and yard maintenance'),
('Garage Cleaning', 'Outdoor', 2500.00, 'Oil stain scrubbing and garage organization'),
('Air Duct & Vent Cleaning', 'HVAC', 3500.00, 'HVAC duct sanitization and dust extraction'),
('Post-Event Cleanup', 'Commercial', 5000.00, 'Party hall, wedding venue, and event cleanup'),
('Car Interior Detailing', 'Automotive', 2000.00, 'Car seat shampooing and interior steam cleaning'),
('Facade & Glass Cleaning', 'Heavy Duty', 8000.00, 'High-rise glass exterior washing and rope access cleaning'),
('Parquet Floor Cleaning', 'Flooring', 3500.00, 'Wooden parquet floor waxing and polishing'),
('Chair Cleaning', 'Upholstery', 1000.00, 'Office and dining chair upholstery washing'),
('Drainage Cleaning', 'Plumbing', 2500.00, 'Blockage clearing and pipe flushing'),
('Septic Tank Cleaning', 'Plumbing', 5000.00, 'Vacuum suction septic tank emptying'),
('Lift & Elevator Cleaning', 'Commercial', 3000.00, 'Elevator shaft and stainless steel polishing'),
('Corporate Office Cleaning', 'Commercial', 7000.00, 'Daily and monthly commercial office maintenance'),
('Medical Facility Cleaning', 'Health & Safety', 8000.00, 'Hospital and clinic biohazard sanitization'),
('Monthly Package Cleaning', 'Subscription', 12000.00, 'Recurring weekly home and office cleaning service'),
('Dead Animal Removal', 'Emergency', 2000.00, 'Safe carcass disposal and area deodorization'),
('Swimming Pool Cleaning', 'Outdoor', 6000.00, 'Pool tile scrubbing and chemical water treatment'),
('School & Campus Cleaning', 'Commercial', 10000.00, 'Classroom, playground, and facility sanitization'),
('Pet Grooming & Wash', 'Pet Care', 1500.00, 'Dog and cat shampoo wash and grooming')
ON CONFLICT DO NOTHING;

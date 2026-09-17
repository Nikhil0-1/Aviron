-- =====================================================================
-- AVIRON — SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- 1. ENUMS & ROLES
CREATE TYPE app_role AS ENUM ('ADMIN', 'OPERATOR', 'MEDICAL_OPERATOR', 'VIEWER');
CREATE TYPE unit_status_type AS ENUM ('ACTIVE', 'STANDBY', 'CHARGING', 'OFFLINE');
CREATE TYPE mission_type_enum AS ENUM ('FLOOD_RESCUE', 'SEARCH_AND_RESCUE', 'MEDICAL_EMERGENCY', 'DISASTER_RECON', 'SURVIVOR_DETECTION', 'MEDICAL_SUPPLY_DELIVERY', 'ENVIRONMENTAL_MONITORING');
CREATE TYPE mission_priority_enum AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
CREATE TYPE mission_status_enum AS ENUM ('PLANNED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ABORTED', 'RETURNING');
CREATE TYPE detection_type_enum AS ENUM ('HUMAN', 'SURVIVOR', 'THERMAL', 'OBSTACLE', 'FIRE', 'HOTSPOT');
CREATE TYPE survivor_status_enum AS ENUM ('DETECTED', 'ASSISTANCE_REQUESTED', 'PAYLOAD_SENT', 'ASSISTED', 'RESOLVED');
CREATE TYPE payload_status_enum AS ENUM ('READY', 'LOADED', 'DEPLOYING', 'DELIVERED', 'FAILED');
CREATE TYPE alert_severity_enum AS ENUM ('INFO', 'WARNING', 'HIGH', 'CRITICAL');
CREATE TYPE sender_type_enum AS ENUM ('OPERATOR', 'AVIRON', 'SYSTEM');

-- 2. PROFILES TABLE (Linked via Firebase UID)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role app_role NOT NULL DEFAULT 'OPERATOR',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AVIRON UNITS TABLE
CREATE TABLE IF NOT EXISTS public.aviron_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status unit_status_type NOT NULL DEFAULT 'STANDBY',
    battery_level NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    latitude NUMERIC(10, 7) NOT NULL DEFAULT 28.6139000,
    longitude NUMERIC(10, 7) NOT NULL DEFAULT 77.2090000,
    altitude NUMERIC(8, 2) NOT NULL DEFAULT 15.00,
    speed NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    heading NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    connection_status VARCHAR(50) NOT NULL DEFAULT 'CONNECTED',
    raspberry_pi_status VARCHAR(50) NOT NULL DEFAULT 'ONLINE',
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type mission_type_enum NOT NULL DEFAULT 'FLOOD_RESCUE',
    priority mission_priority_enum NOT NULL DEFAULT 'HIGH',
    status mission_status_enum NOT NULL DEFAULT 'PLANNED',
    aviron_unit_id UUID REFERENCES public.aviron_units(id) ON DELETE SET NULL,
    target_latitude NUMERIC(10, 7) NOT NULL,
    target_longitude NUMERIC(10, 7) NOT NULL,
    operator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration INTEGER DEFAULT 0,
    distance NUMERIC(8, 2) DEFAULT 0.00,
    survivor_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MISSION WAYPOINTS TABLE
CREATE TABLE IF NOT EXISTS public.mission_waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    seq INTEGER NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    altitude NUMERIC(8, 2) DEFAULT 15.00,
    action VARCHAR(50) DEFAULT 'NAVIGATE',
    is_reached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TELEMETRY TABLE (Selective Historical Persistence)
CREATE TABLE IF NOT EXISTS public.telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aviron_unit_id UUID NOT NULL REFERENCES public.aviron_units(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    gps_accuracy NUMERIC(5, 2) DEFAULT 0.03,
    speed NUMERIC(5, 2) DEFAULT 0.00,
    altitude NUMERIC(8, 2) DEFAULT 0.00,
    heading NUMERIC(5, 2) DEFAULT 0.00,
    battery_percentage NUMERIC(5, 2) NOT NULL,
    battery_voltage NUMERIC(5, 2) DEFAULT 22.8,
    current NUMERIC(5, 2) DEFAULT 14.5,
    temperature NUMERIC(5, 2) DEFAULT 28.4,
    humidity NUMERIC(5, 2) DEFAULT 78.0,
    air_quality NUMERIC(5, 2) DEFAULT 92.0,
    gas_level NUMERIC(5, 4) DEFAULT 0.02,
    signal_strength INTEGER DEFAULT 95,
    latency INTEGER DEFAULT 16,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DETECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aviron_unit_id UUID NOT NULL REFERENCES public.aviron_units(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    type detection_type_enum NOT NULL DEFAULT 'HUMAN',
    confidence NUMERIC(5, 2) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    source VARCHAR(100) DEFAULT 'DUAL_VISION_AI',
    image_url TEXT,
    thermal_data_url TEXT,
    is_simulated BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SURVIVORS TABLE
CREATE TABLE IF NOT EXISTS public.survivors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    detection_id UUID REFERENCES public.detections(id) ON DELETE SET NULL,
    survivor_code VARCHAR(50) UNIQUE NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    status survivor_status_enum NOT NULL DEFAULT 'DETECTED',
    assistance_required VARCHAR(255) DEFAULT 'Medical kit drop requested',
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MEDICAL ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.medical_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survivor_id UUID NOT NULL REFERENCES public.survivors(id) ON DELETE CASCADE,
    temperature NUMERIC(4, 1) DEFAULT 36.8,
    heart_rate INTEGER DEFAULT 88,
    spo2 INTEGER DEFAULT 96,
    status VARCHAR(50) DEFAULT 'STABLE',
    notes TEXT,
    is_simulated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PAYLOADS TABLE
CREATE TABLE IF NOT EXISTS public.payloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aviron_unit_id UUID REFERENCES public.aviron_units(id) ON DELETE SET NULL,
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    type VARCHAR(100) NOT NULL,
    status payload_status_enum NOT NULL DEFAULT 'READY',
    quantity INTEGER DEFAULT 1,
    deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aviron_unit_id UUID REFERENCES public.aviron_units(id) ON DELETE SET NULL,
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    type VARCHAR(100) DEFAULT 'SYSTEM',
    severity alert_severity_enum NOT NULL DEFAULT 'INFO',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. COMMUNICATION MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.communication_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    aviron_unit_id UUID REFERENCES public.aviron_units(id) ON DELETE SET NULL,
    sender_type sender_type_enum NOT NULL DEFAULT 'OPERATOR',
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. MISSION EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.mission_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. MISSION REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.mission_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    operator_name VARCHAR(255) NOT NULL,
    file_path TEXT,
    file_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    distance_km NUMERIC(8, 2) DEFAULT 0.00,
    survivors_found INTEGER DEFAULT 0,
    battery_used NUMERIC(5, 2) DEFAULT 0.00,
    summary TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. SYSTEM COMPONENTS TABLE
CREATE TABLE IF NOT EXISTS public.system_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'ONLINE',
    details TEXT,
    last_check TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CONNECTION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.connection_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aviron_unit_id UUID REFERENCES public.aviron_units(id) ON DELETE SET NULL,
    event VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aviron_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survivors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_components ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view profiles
CREATE POLICY "Authenticated users can read profiles" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admins to insert/update profiles
CREATE POLICY "Admins can manage profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.firebase_uid = auth.uid()::text AND p.role = 'ADMIN'
        )
    );

-- Read access for all operational data to authenticated users
CREATE POLICY "Read operational data" ON public.aviron_units FOR SELECT USING (true);
CREATE POLICY "Read missions" ON public.missions FOR SELECT USING (true);
CREATE POLICY "Read waypoints" ON public.mission_waypoints FOR SELECT USING (true);
CREATE POLICY "Read telemetry" ON public.telemetry FOR SELECT USING (true);
CREATE POLICY "Read detections" ON public.detections FOR SELECT USING (true);
CREATE POLICY "Read survivors" ON public.survivors FOR SELECT USING (true);
CREATE POLICY "Read medical assessments" ON public.medical_assessments FOR SELECT USING (true);
CREATE POLICY "Read payloads" ON public.payloads FOR SELECT USING (true);
CREATE POLICY "Read alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Read comms" ON public.communication_messages FOR SELECT USING (true);
CREATE POLICY "Read events" ON public.mission_events FOR SELECT USING (true);
CREATE POLICY "Read reports" ON public.mission_reports FOR SELECT USING (true);
CREATE POLICY "Read components" ON public.system_components FOR SELECT USING (true);

-- Operator & Admin write policies
CREATE POLICY "Operators and Admins insert missions" ON public.missions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.firebase_uid = auth.uid()::text AND p.role IN ('ADMIN', 'OPERATOR')
        )
    );

CREATE POLICY "Operators and Admins update missions" ON public.missions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.firebase_uid = auth.uid()::text AND p.role IN ('ADMIN', 'OPERATOR')
        )
    );

-- Medical Operator policies
CREATE POLICY "Medical Operators update survivors & assessments" ON public.survivors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.firebase_uid = auth.uid()::text AND p.role IN ('ADMIN', 'OPERATOR', 'MEDICAL_OPERATOR')
        )
    );

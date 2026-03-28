-- ============================================
-- RAAHSAATHI DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    disability_type TEXT[] DEFAULT '{}',
    accessibility_preferences JSONB DEFAULT '{
        "avoid_stairs": true,
        "max_slope_percent": 8,
        "prefer_tactile_paths": true,
        "notify_fixed_barriers": true
    }',
    total_points INTEGER DEFAULT 0,
    reports_count INTEGER DEFAULT 0,
    validations_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BARRIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.barriers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location GEOMETRY(POINT, 4326),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    category TEXT NOT NULL,
    severity INTEGER CHECK (severity IN (1, 2, 3)) NOT NULL,
    description TEXT,
    photo_url TEXT,
    ai_tags JSONB DEFAULT '{}',
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fixed', 'disputed', 'archived')),
    reported_by UUID REFERENCES public.profiles(id),
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barrier_id UUID REFERENCES public.barriers(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(barrier_id, user_id)
);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barrier_id UUID REFERENCES public.barriers(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS (ROW LEVEL SECURITY)
-- ============================================
-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for barriers
CREATE POLICY "Barriers are viewable by everyone." ON public.barriers FOR SELECT USING (true);
CREATE POLICY "Users can insert barriers." ON public.barriers FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Users can update their own barriers." ON public.barriers FOR UPDATE USING (auth.uid() = reported_by);

-- Policies for votes
CREATE POLICY "Votes are viewable by everyone." ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can insert votes." ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes." ON public.votes FOR UPDATE USING (auth.uid() = user_id);

-- Policies for comments
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments." ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments." ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments." ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to find nearby barriers using PostGIS
CREATE OR REPLACE FUNCTION get_barriers_nearby(lat float, lng float, radius int)
RETURNS TABLE (
    id UUID,
    location GEOMETRY,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    category TEXT,
    severity TEXT,
    description TEXT,
    image_url TEXT,
    upvotes INT,
    downvotes INT,
    comment_count INT,
    status TEXT,
    created_at TIMESTAMPTZ,
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        b.location,
        b.latitude,
        b.longitude,
        b.category,
        b.severity,
        b.description,
        b.image_url,
        b.upvotes,
        b.downvotes,
        (SELECT COUNT(*) FROM public.comments c WHERE c.barrier_id = b.id) as comment_count,
        b.status,
        b.created_at,
        p.username
    FROM
        public.barriers b
    LEFT JOIN
        public.profiles p ON b.user_id = p.id
    WHERE
        ST_DWithin(
            b.location,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
            radius
        )
    ORDER BY
        b.created_at DESC;
END;
$$ LANGUAGE plpgsql;


-- Function to cast a vote (upvote/downvote)
CREATE OR REPLACE FUNCTION cast_vote(p_barrier_id UUID, p_user_id UUID, p_direction INT)
RETURNS SETOF public.barriers AS $$
DECLARE
    v_existing_vote INT;
BEGIN
    -- Check for an existing vote
    SELECT direction INTO v_existing_vote FROM public.votes
    WHERE barrier_id = p_barrier_id AND user_id = p_user_id;

    IF v_existing_vote IS NULL THEN
        -- No existing vote, insert a new one
        INSERT INTO public.votes (barrier_id, user_id, direction)
        VALUES (p_barrier_id, p_user_id, p_direction);
    ELSIF v_existing_vote = p_direction THEN
        -- User is casting the same vote again, so remove it (toggle off)
        DELETE FROM public.votes
        WHERE barrier_id = p_barrier_id AND user_id = p_user_id;
    ELSE
        -- User is changing their vote
        UPDATE public.votes SET direction = p_direction
        WHERE barrier_id = p_barrier_id AND user_id = p_user_id;
    END IF;

    -- Return the updated barrier record
    RETURN QUERY SELECT * FROM public.barriers WHERE id = p_barrier_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Trigger to update vote counts on the barriers table
CREATE OR REPLACE FUNCTION update_barrier_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.barriers
    SET
        upvotes = (SELECT COUNT(*) FROM public.votes WHERE barrier_id = NEW.barrier_id AND direction = 1),
        downvotes = (SELECT COUNT(*) FROM public.votes WHERE barrier_id = NEW.barrier_id AND direction = -1)
    WHERE id = NEW.barrier_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_change
AFTER INSERT OR UPDATE OR DELETE ON public.votes
FOR EACH ROW EXECUTE FUNCTION update_barrier_vote_counts();


-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS barriers_location_idx ON public.barriers USING GIST (location);
CREATE INDEX IF NOT EXISTS barriers_category_idx ON public.barriers (category);
CREATE INDEX IF NOT EXISTS barriers_status_idx ON public.barriers (status);
CREATE INDEX IF NOT EXISTS barriers_reported_by_idx ON public.barriers (reported_by);
CREATE INDEX IF NOT EXISTS barriers_created_at_idx ON public.barriers (created_at DESC);

-- ============================================
-- BARRIER VOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.barrier_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barrier_id UUID REFERENCES public.barriers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(barrier_id, user_id)
);

CREATE INDEX IF NOT EXISTS barrier_votes_barrier_id_idx ON public.barrier_votes (barrier_id);
CREATE INDEX IF NOT EXISTS barrier_votes_user_id_idx ON public.barrier_votes (user_id);

-- ============================================
-- ACHIEVEMENTS TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    points_reward INTEGER DEFAULT 0,
    criteria JSONB NOT NULL,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- ROUTES TABLE (optional: save calculated routes)
-- ============================================
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    start_location GEOMETRY(POINT, 4326),
    end_location GEOMETRY(POINT, 4326),
    start_lat DOUBLE PRECISION,
    start_lng DOUBLE PRECISION,
    end_lat DOUBLE PRECISION,
    end_lng DOUBLE PRECISION,
    route_geometry JSONB,
    distance_meters INTEGER,
    duration_seconds INTEGER,
    barriers_avoided INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSERT DEFAULT ACHIEVEMENTS
-- ============================================
INSERT INTO public.achievements (name, description, points_reward, criteria) VALUES
    ('Pioneer', 'Report your first barrier', 50, '{"type": "first_report", "count": 1}'),
    ('Validator', 'Verify 10 barriers reported by others', 100, '{"type": "validations", "count": 10}'),
    ('Area Guardian', 'Report 5 barriers in your neighborhood', 500, '{"type": "reports_in_area", "count": 5}'),
    ('Pathfinder', 'Save 10 routes using barrier-aware navigation', 200, '{"type": "routes_saved", "count": 10}'),
    ('Community Hero', 'Get 20 of your reports validated by others', 1000, '{"type": "validated_reports", "count": 20}')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- RPC FUNCTION: Get barriers nearby (PostGIS)
-- ============================================
CREATE OR REPLACE FUNCTION get_barriers_nearby(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius INTEGER,
    barrier_status TEXT DEFAULT 'active'
)
RETURNS TABLE(
    id UUID,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    category TEXT,
    severity INTEGER,
    description TEXT,
    photo_url TEXT,
    upvotes INTEGER,
    downvotes INTEGER,
    status TEXT,
    distance DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.latitude,
        b.longitude,
        b.category,
        b.severity,
        b.description,
        b.photo_url,
        b.upvotes,
        b.downvotes,
        b.status,
        ST_Distance(
            b.location::geography,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
        ) as distance
    FROM barriers b
    WHERE b.status = barrier_status
        AND ST_DWithin(
            b.location::geography,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
            radius
        )
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Update vote counts
-- ============================================
CREATE OR REPLACE FUNCTION update_barrier_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.barriers
    SET
        upvotes = (SELECT COUNT(*) FROM public.votes WHERE barrier_id = NEW.barrier_id AND direction = 1),
        downvotes = (SELECT COUNT(*) FROM public.votes WHERE barrier_id = NEW.barrier_id AND direction = -1)
    WHERE id = NEW.barrier_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER barrier_votes_trigger
    AFTER INSERT OR DELETE ON barrier_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_barrier_vote_counts();

-- ============================================
-- TRIGGER: Update user stats when reporting barrier
-- ============================================
CREATE OR REPLACE FUNCTION update_user_stats_on_report()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET reports_count = reports_count + 1
    WHERE id = NEW.reported_by;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_trigger
    AFTER INSERT ON barriers
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_on_report();

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_barriers_updated_at
    BEFORE UPDATE ON barriers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barrier_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- BARRIERS POLICIES
CREATE POLICY "Barriers are viewable by everyone" ON public.barriers
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert barriers" ON public.barriers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own barriers" ON public.barriers
    FOR UPDATE USING (auth.uid() = reported_by);

-- BARRIER VOTES POLICIES
CREATE POLICY "Votes are viewable by everyone" ON public.barrier_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own votes" ON public.barrier_votes
    FOR ALL USING (auth.uid() = user_id);

-- ACHIEVEMENTS POLICIES
CREATE POLICY "Achievements are viewable by everyone" ON public.user_achievements
    FOR SELECT USING (true);

-- ROUTES POLICIES
CREATE POLICY "Users can view own routes" ON public.routes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routes" ON public.routes
    FOR INSERT WITH CHECK (auth.uid() = user_id);
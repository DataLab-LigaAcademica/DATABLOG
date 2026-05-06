-- 1. Create Schema for Site Content
CREATE SCHEMA IF NOT EXISTS site;

-- 2. Authors Table (Links Auth Users to Profile info)
CREATE TABLE site.authors (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Posts Table
CREATE TABLE site.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Members (Public Submission Form)
CREATE TABLE site.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    area_interesse TEXT NOT NULL,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tags Table
CREATE TABLE site.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- 6. Post Tags Relation
CREATE TABLE site.post_tags (
    post_id UUID REFERENCES site.posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES site.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 7. ENABLE RLS (Row Level Security)
ALTER TABLE site.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.tags ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES

-- Public reading for published posts
CREATE POLICY "Public can read published posts" ON site.posts
    FOR SELECT USING (published = true);

-- Member form is insert-only for public
CREATE POLICY "Public can submit member form" ON site.members
    FOR INSERT WITH CHECK (true);

-- Admins (authenticated users) can manage posts
CREATE POLICY "Admins can manage any post" ON site.posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Admins can read member submissions
CREATE POLICY "Admins can read members" ON site.members
    FOR SELECT USING (auth.role() = 'authenticated');

-- 9. Storage Bucket setup
-- INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);
-- Policy for authenticated users to upload images up to 20MB
-- This logic usually goes into storage.objects policies

-- 10. DAILY POST LIMIT FUNCTION (RN3)
CREATE OR REPLACE FUNCTION site.check_post_limit() 
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM site.posts 
        WHERE author_id = auth.uid() 
        AND created_at::DATE = CURRENT_DATE) >= 2 THEN
        RAISE EXCEPTION 'Limite de 2 postagens por dia atingido.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_check_post_limit
BEFORE INSERT ON site.posts
FOR EACH ROW EXECUTE FUNCTION site.check_post_limit();

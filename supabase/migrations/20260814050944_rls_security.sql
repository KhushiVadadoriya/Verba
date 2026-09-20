-- ============================================================
-- VERBA — MIGRATION 009
-- RLS + SECURITY
-- ============================================================


-- ============================================================
-- 1. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_preferences ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflection_emotion_ratings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_genres ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_conflicts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_sources ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genre_emotions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_field_policies ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. SHARED CATALOG — READ ONLY FOR AUTHENTICATED USERS
-- ============================================================

CREATE POLICY "authenticated users can read books"
ON public.books
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read authors"
ON public.authors
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read book identifiers"
ON public.book_identifiers
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read book authors"
ON public.book_authors
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read book genres"
ON public.book_genres
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read book sources"
ON public.book_sources
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read genres"
ON public.genres
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read reading purposes"
ON public.reading_purposes
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read emotions"
ON public.emotions
FOR SELECT
TO authenticated
USING (true);


CREATE POLICY "authenticated users can read genre emotions"
ON public.genre_emotions
FOR SELECT
TO authenticated
USING (true);

-- ============================================================
-- 3. DIRECT USER-OWNED TABLES
-- Users can only access their own rows.
-- ============================================================


-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------

CREATE POLICY "users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


-- ------------------------------------------------------------
-- ONBOARDING
-- ------------------------------------------------------------

CREATE POLICY "users can read own onboarding"
ON public.onboarding
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own onboarding"
ON public.onboarding
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own onboarding"
ON public.onboarding
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


-- ------------------------------------------------------------
-- USER READING PURPOSES
-- ------------------------------------------------------------

CREATE POLICY "users can read own reading purposes"
ON public.user_reading_purposes
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own reading purposes"
ON public.user_reading_purposes
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own reading purposes"
ON public.user_reading_purposes
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- USER GENRES
-- ------------------------------------------------------------

CREATE POLICY "users can read own genres"
ON public.user_genres
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own genres"
ON public.user_genres
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own genres"
ON public.user_genres
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- USER READING PREFERENCES
-- ------------------------------------------------------------

CREATE POLICY "users can read own reading preferences"
ON public.user_reading_preferences
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own reading preferences"
ON public.user_reading_preferences
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own reading preferences"
ON public.user_reading_preferences
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


-- ------------------------------------------------------------
-- USER BOOKS
-- ------------------------------------------------------------

CREATE POLICY "users can read own books"
ON public.user_books
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own books"
ON public.user_books
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own books"
ON public.user_books
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own books"
ON public.user_books
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- READING SESSIONS
-- ------------------------------------------------------------

CREATE POLICY "users can read own sessions"
ON public.reading_sessions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own sessions"
ON public.reading_sessions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own sessions"
ON public.reading_sessions
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own sessions"
ON public.reading_sessions
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- REFLECTIONS
-- ------------------------------------------------------------

CREATE POLICY "users can read own reflections"
ON public.reflections
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own reflections"
ON public.reflections
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own reflections"
ON public.reflections
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own reflections"
ON public.reflections
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- GOALS
-- ------------------------------------------------------------

CREATE POLICY "users can read own goals"
ON public.goals
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own goals"
ON public.goals
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own goals"
ON public.goals
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own goals"
ON public.goals
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- IMPORTS
-- ------------------------------------------------------------

CREATE POLICY "users can read own imports"
ON public.imports
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own imports"
ON public.imports
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own imports"
ON public.imports
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


-- ------------------------------------------------------------
-- CONNECTED ACCOUNTS
-- ------------------------------------------------------------

CREATE POLICY "users can read own connected accounts"
ON public.connected_accounts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users can insert own connected accounts"
ON public.connected_accounts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own connected accounts"
ON public.connected_accounts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own connected accounts"
ON public.connected_accounts
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- DATA CONFLICTS
-- ------------------------------------------------------------

CREATE POLICY "users can read own conflicts"
ON public.data_conflicts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ============================================================
-- 4. RELATIONSHIP-BASED USER OWNERSHIP
-- ============================================================


-- ------------------------------------------------------------
-- USER BOOK SOURCES
-- user_book_sources
--     ↓
-- user_books
--     ↓
-- user_id
-- ------------------------------------------------------------

CREATE POLICY "users can read own book sources"
ON public.user_book_sources
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.user_books ub
        WHERE ub.id = user_book_sources.user_book_id
          AND ub.user_id = auth.uid()
    )
);

CREATE POLICY "users can insert own book sources"
ON public.user_book_sources
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.user_books ub
        WHERE ub.id = user_book_sources.user_book_id
          AND ub.user_id = auth.uid()
    )
);

CREATE POLICY "users can update own book sources"
ON public.user_book_sources
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.user_books ub
        WHERE ub.id = user_book_sources.user_book_id
          AND ub.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.user_books ub
        WHERE ub.id = user_book_sources.user_book_id
          AND ub.user_id = auth.uid()
    )
);

CREATE POLICY "users can delete own book sources"
ON public.user_book_sources
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.user_books ub
        WHERE ub.id = user_book_sources.user_book_id
          AND ub.user_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- REFLECTION EMOTION RATINGS
-- reflection_emotion_ratings
--     ↓
-- reflections
--     ↓
-- user_id
-- ------------------------------------------------------------

CREATE POLICY "users can read own emotion ratings"
ON public.reflection_emotion_ratings
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.reflections r
        WHERE r.id = reflection_emotion_ratings.reflection_id
          AND r.user_id = auth.uid()
    )
);

CREATE POLICY "users can insert own emotion ratings"
ON public.reflection_emotion_ratings
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.reflections r
        WHERE r.id = reflection_emotion_ratings.reflection_id
          AND r.user_id = auth.uid()
    )
);

CREATE POLICY "users can update own emotion ratings"
ON public.reflection_emotion_ratings
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.reflections r
        WHERE r.id = reflection_emotion_ratings.reflection_id
          AND r.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.reflections r
        WHERE r.id = reflection_emotion_ratings.reflection_id
          AND r.user_id = auth.uid()
    )
);

CREATE POLICY "users can delete own emotion ratings"
ON public.reflection_emotion_ratings
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.reflections r
        WHERE r.id = reflection_emotion_ratings.reflection_id
          AND r.user_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- GOAL GENRES
-- goal_genres
--     ↓
-- goals
--     ↓
-- user_id
-- ------------------------------------------------------------

CREATE POLICY "users can read own goal genres"
ON public.goal_genres
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.goals g
        WHERE g.id = goal_genres.goal_id
          AND g.user_id = auth.uid()
    )
);

CREATE POLICY "users can insert own goal genres"
ON public.goal_genres
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.goals g
        WHERE g.id = goal_genres.goal_id
          AND g.user_id = auth.uid()
    )
);

CREATE POLICY "users can delete own goal genres"
ON public.goal_genres
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.goals g
        WHERE g.id = goal_genres.goal_id
          AND g.user_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- IMPORT ITEMS
-- import_items
--     ↓
-- imports
--     ↓
-- user_id
-- ------------------------------------------------------------

CREATE POLICY "users can read own import items"
ON public.import_items
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.imports i
        WHERE i.id = import_items.import_id
          AND i.user_id = auth.uid()
    )
);

CREATE POLICY "users can insert own import items"
ON public.import_items
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.imports i
        WHERE i.id = import_items.import_id
          AND i.user_id = auth.uid()
    )
);

CREATE POLICY "users can update own import items"
ON public.import_items
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.imports i
        WHERE i.id = import_items.import_id
          AND i.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.imports i
        WHERE i.id = import_items.import_id
          AND i.user_id = auth.uid()
    )
);

-- ============================================================
-- 5. INTEGRATION + SYSTEM TABLES
-- ============================================================


-- ------------------------------------------------------------
-- SYNC JOBS
-- sync_jobs
--     ↓
-- connected_accounts
--     ↓
-- user_id
-- ------------------------------------------------------------

CREATE POLICY "users can read own sync jobs"
ON public.sync_jobs
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.connected_accounts ca
        WHERE ca.id = sync_jobs.connected_account_id
          AND ca.user_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- SYNC HISTORY
-- sync_history
--     ↓
-- sync_jobs
--     ↓
-- connected_accounts
--     ↓
-- user_id
-- ------------------------------------------------------------

CREATE POLICY "users can read own sync history"
ON public.sync_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.sync_jobs sj
        JOIN public.connected_accounts ca
            ON ca.id = sj.connected_account_id
        WHERE sj.id = sync_history.sync_job_id
          AND ca.user_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- SOURCE FIELD POLICIES
--
-- This is application/system configuration.
-- Normal authenticated users have NO direct access.
-- ------------------------------------------------------------

-- ============================================================
-- 6. DEFAULT SECURITY BEHAVIOR
-- ============================================================
--
-- RLS is enabled on all application tables.
--
-- No policy means access is denied.
--
-- Anonymous users therefore have no access to protected
-- application data.
--
-- Backend/service-role operations bypass RLS and are handled
-- exclusively by trusted server-side services.
-- ============================================================
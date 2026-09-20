-- ============================================================
-- VERBA — MIGRATION 010
-- DATABASE PRIVILEGES
-- ============================================================


-- ============================================================
-- SCHEMA ACCESS
-- ============================================================

GRANT USAGE ON SCHEMA public TO authenticated;


-- ============================================================
-- SHARED CATALOG
-- Authenticated users can READ.
-- RLS controls which rows are visible.
-- ============================================================

GRANT SELECT ON
    public.books,
    public.authors,
    public.book_identifiers,
    public.book_authors,
    public.book_genres,
    public.book_sources,
    public.genres,
    public.reading_purposes,
    public.emotions,
    public.genre_emotions
TO authenticated;


-- ============================================================
-- DIRECT USER-OWNED TABLES
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON
    public.profiles,
    public.onboarding,
    public.user_reading_purposes,
    public.user_genres,
    public.user_reading_preferences,
    public.user_books,
    public.reading_sessions,
    public.reflections,
    public.goals,
    public.connected_accounts
TO authenticated;


-- ============================================================
-- USER-OWNED TABLES WITH RESTRICTED OPERATIONS
-- ============================================================

GRANT SELECT, INSERT, UPDATE
ON public.imports
TO authenticated;


GRANT SELECT, INSERT, UPDATE
ON public.import_items
TO authenticated;


GRANT SELECT
ON public.data_conflicts
TO authenticated;


-- ============================================================
-- RELATIONSHIP-OWNED TABLES
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.user_book_sources
TO authenticated;


GRANT SELECT, INSERT, UPDATE, DELETE
ON public.reflection_emotion_ratings
TO authenticated;


GRANT SELECT, INSERT, DELETE
ON public.goal_genres
TO authenticated;


-- ============================================================
-- SYNC / SYSTEM TABLES
-- Users can only READ their own sync information.
-- Backend/service role handles writes.
-- ============================================================

GRANT SELECT
ON public.sync_jobs
TO authenticated;


GRANT SELECT
ON public.sync_history
TO authenticated;
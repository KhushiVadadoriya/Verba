-- ============================================================
-- VERBA — MIGRATION 008
-- DATA INTEGRITY + TRIGGERS
-- ============================================================


-- ============================================================
-- 1. AUTOMATIC updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_reading_purposes_updated_at
BEFORE UPDATE ON public.reading_purposes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_genres_updated_at
BEFORE UPDATE ON public.genres
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_emotions_updated_at
BEFORE UPDATE ON public.emotions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_onboarding_updated_at
BEFORE UPDATE ON public.onboarding
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_user_reading_preferences_updated_at
BEFORE UPDATE ON public.user_reading_preferences
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_authors_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_book_sources_updated_at
BEFORE UPDATE ON public.book_sources
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_user_books_updated_at
BEFORE UPDATE ON public.user_books
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_reading_sessions_updated_at
BEFORE UPDATE ON public.reading_sessions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_reflections_updated_at
BEFORE UPDATE ON public.reflections
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_reflection_emotion_ratings_updated_at
BEFORE UPDATE ON public.reflection_emotion_ratings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_imports_updated_at
BEFORE UPDATE ON public.imports
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_import_items_updated_at
BEFORE UPDATE ON public.import_items
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_connected_accounts_updated_at
BEFORE UPDATE ON public.connected_accounts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_sync_jobs_updated_at
BEFORE UPDATE ON public.sync_jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_source_field_policies_updated_at
BEFORE UPDATE ON public.source_field_policies
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. READING SESSION OWNERSHIP INTEGRITY
-- ============================================================

ALTER TABLE public.user_books
ADD CONSTRAINT user_books_id_user_unique
UNIQUE (id, user_id);

ALTER TABLE public.reading_sessions
DROP CONSTRAINT reading_sessions_user_book_id_fkey;

ALTER TABLE public.reading_sessions
ADD CONSTRAINT reading_sessions_user_book_owner_fkey
FOREIGN KEY (user_book_id, user_id)
REFERENCES public.user_books(id, user_id)
ON DELETE CASCADE;

-- ============================================================
-- 4. REFLECTION OWNERSHIP INTEGRITY
-- ============================================================

ALTER TABLE public.reflections
DROP CONSTRAINT reflections_user_book_id_fkey;

ALTER TABLE public.reflections
ADD CONSTRAINT reflections_user_book_owner_fkey
FOREIGN KEY (user_book_id, user_id)
REFERENCES public.user_books(id, user_id)
ON DELETE CASCADE;

-- ============================================================
-- 5. SYNC HISTORY — APPEND ONLY
-- ============================================================

CREATE OR REPLACE FUNCTION public.prevent_sync_history_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'sync_history is append-only';
END;
$$;

CREATE TRIGGER prevent_sync_history_update
BEFORE UPDATE ON public.sync_history
FOR EACH ROW
EXECUTE FUNCTION public.prevent_sync_history_modification();

CREATE TRIGGER prevent_sync_history_delete
BEFORE DELETE ON public.sync_history
FOR EACH ROW
EXECUTE FUNCTION public.prevent_sync_history_modification();